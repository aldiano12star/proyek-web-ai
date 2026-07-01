"use client";

// Gallery — the Togetherness Gallery (F06).
//
// Client component: it owns the lightbox open/close state, so (like ProkerGrid)
// the anon DB read happens on the server in page.tsx and the rows arrive as a
// prop. The masonry itself is pure CSS `columns-*` — no JS layout pass, no
// ResizeObserver — so the grid is cheap and reflows naturally on resize while
// keeping each photo's real aspect ratio (true Pinterest feel).
//
// Images use next/image with the "unknown dimensions" pattern (width/height 0 +
// sizes + h-auto/w-auto): Next still generates a responsive srcset and lazy-
// loads below the fold, but the browser renders each photo at its intrinsic
// ratio — exactly what masonry needs. Remote hosts are whitelisted in
// next.config.ts (**.insforge.app / **.insforge.dev).

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { GalleryPhoto } from "@/lib/types";

export default function Gallery({ photos }: { photos: GalleryPhoto[] }) {
  const [active, setActive] = useState<GalleryPhoto | null>(null);
  const open = active !== null;

  // While the lightbox is open: close on Escape and lock background scroll.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <section id="galeri" className="scroll-mt-20 px-5 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 flex flex-col gap-3">
          <h2 className="font-display text-4xl font-black tracking-tight sm:text-5xl">
            DI BALIK KAMERA
          </h2>
          <p className="max-w-xl text-deadpool-white/60">
            Bukan cuma kerja keras — markas ini juga soal kebersamaan. Klik foto
            buat lihat versi gedenya.
          </p>
        </header>

        {photos.length === 0 ? (
          <p className="font-mono text-sm text-deadpool-white/40">
            {"Belum ada foto — dokumentasi lagi disiapkan, pantengin terus."}
          </p>
        ) : (
          // CSS-columns masonry: items flow top-to-bottom then wrap to the next
          // column. `break-inside-avoid` keeps a photo from splitting across
          // columns; `mb-4` is the vertical gutter (column gap is set on the
          // container).
          <div className="gap-4 [column-fill:_balance] sm:columns-2 lg:columns-3">
            {photos.map((photo) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => setActive(photo)}
                aria-haspopup="dialog"
                className="group relative mb-4 block w-full break-inside-avoid overflow-hidden rounded-xl border border-slate-border bg-card-dark transition duration-300 hover:border-deadpool-red hover:shadow-comic focus:outline-none focus-visible:border-deadpool-red focus-visible:shadow-comic"
              >
                <Image
                  src={photo.image_url}
                  alt={photo.caption ?? "Dokumentasi kegiatan Sapa Exploit"}
                  width={0}
                  height={0}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="h-auto w-full transition-transform duration-500 group-hover:scale-105"
                />

                {/* Caption ribbon — only when a caption exists. Fades up on hover. */}
                {photo.caption && (
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-canvas-black/90 to-transparent p-4 text-left font-mono text-xs text-deadpool-white/80 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                    {photo.caption}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox — fades the backdrop and springs the photo in/out. */}
      <AnimatePresence>
        {active && (
          <motion.div
            key="gallery-lightbox"
            className="fixed inset-0 z-[60] flex items-center justify-center p-5 sm:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop — blurred, click to dismiss */}
            <motion.button
              type="button"
              aria-label="Tutup galeri"
              onClick={() => setActive(null)}
              className="absolute inset-0 cursor-default bg-canvas-black/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Photo panel */}
            <motion.figure
              role="dialog"
              aria-modal="true"
              aria-label={active.caption ?? "Foto kegiatan Sapa Exploit"}
              className="relative z-10 flex max-h-full max-w-3xl flex-col"
              initial={{ opacity: 0, scale: 0.92, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 14 }}
              transition={{ type: "spring", duration: 0.35, bounce: 0.2 }}
            >
              {/* Comic red close button on the corner */}
              <button
                type="button"
                onClick={() => setActive(null)}
                aria-label="Tutup"
                className="absolute -right-3 -top-3 z-10 flex h-10 w-10 items-center justify-center rounded-lg border border-deadpool-red bg-deadpool-red text-canvas-black shadow-comic transition-transform hover:-translate-y-0.5 focus:outline-none focus-visible:-translate-y-0.5"
              >
                <X size={20} strokeWidth={3} />
              </button>

              <Image
                src={active.image_url}
                alt={active.caption ?? "Foto kegiatan Sapa Exploit"}
                width={0}
                height={0}
                sizes="(max-width: 768px) 90vw, 768px"
                priority
                className="h-auto max-h-[80vh] w-auto rounded-xl border border-slate-border object-contain"
              />

              {active.caption && (
                <figcaption className="mt-3 text-center font-mono text-xs text-deadpool-white/60">
                  {active.caption}
                </figcaption>
              )}
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
