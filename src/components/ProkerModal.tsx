"use client";

// ProkerModal — the detail dialog for a single program (F04).
//
// Client component: it animates with framer-motion's AnimatePresence so the
// overlay can fade out *before* unmounting, and it owns keyboard/scroll side
// effects. Rendered once by ProkerGrid; `program` is null when closed. The
// comic-style red "X" sits on the panel's corner per DESIGN.md.

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";
import type { Program } from "@/lib/types";

export default function ProkerModal({
  program,
  onClose,
}: {
  program: Program | null;
  onClose: () => void;
}) {
  const open = program !== null;

  // While open: close on Escape and lock background scroll.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {program && (
        <motion.div
          key="proker-modal"
          className="fixed inset-0 z-[60] flex items-center justify-center p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop — blurred, click to dismiss */}
          <motion.button
            type="button"
            aria-label="Tutup detail proker"
            onClick={onClose}
            className="absolute inset-0 cursor-default bg-canvas-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Panel — scales + lifts in */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="proker-modal-title"
            className="relative z-10 w-full max-w-lg rounded-xl border border-slate-border bg-card-dark p-7 shadow-comic sm:p-9"
            initial={{ opacity: 0, scale: 0.92, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 14 }}
            transition={{ type: "spring", duration: 0.35, bounce: 0.2 }}
          >
            {/* Comic red close button on the corner */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup"
              className="absolute -right-3 -top-3 flex h-10 w-10 items-center justify-center rounded-lg border border-deadpool-red bg-deadpool-red text-canvas-black shadow-comic transition-transform hover:-translate-y-0.5 focus:outline-none focus-visible:-translate-y-0.5"
            >
              <X size={20} strokeWidth={3} />
            </button>

            <h3
              id="proker-modal-title"
              className="mt-2 font-display text-3xl font-black tracking-tight text-deadpool-white"
            >
              {program.name}
            </h3>
            <p className="mt-4 leading-relaxed text-deadpool-white/70">
              {program.description}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
