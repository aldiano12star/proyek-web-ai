"use client";

// Sticky top navigation for the public landing page.
// Client component: it tracks scroll (to fade in a backdrop) and toggles a
// mobile menu, both of which need browser state. Links are plain in-page
// anchors — smooth scrolling comes from `scroll-behavior` in globals.css, and
// each target section sets `scroll-mt-*` to clear this fixed bar.

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const LINKS = [
  { href: "#tentang", label: "Tentang" },
  { href: "#divisi", label: "Divisi" },
  { href: "#proker", label: "Proker" },
  { href: "#prestasi", label: "Prestasi" },
  { href: "#galeri", label: "Galeri" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled || open
          ? "border-slate-border bg-canvas-black/85 backdrop-blur"
          : "border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
        <a
          href="#top"
          onClick={() => setOpen(false)}
          className="font-display text-lg font-black tracking-tight text-deadpool-white"
        >
          SABA<span className="text-deadpool-red">{"//"}</span>EXPLOIT
        </a>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          <ul className="flex items-center gap-7">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="font-mono text-xs uppercase tracking-widest text-deadpool-white/60 transition-colors hover:text-deadpool-white"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#proker"
            className="shadow-comic rounded-lg border border-deadpool-red bg-deadpool-red px-4 py-2 font-display text-sm font-bold text-canvas-black transition-transform hover:-translate-y-0.5"
          >
            OPREC
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label={open ? "Tutup menu" : "Buka menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-border text-deadpool-white transition-colors hover:border-deadpool-red md:hidden"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div
          id="mobile-menu"
          className="border-t border-slate-border bg-canvas-black/95 px-5 py-4 md:hidden"
        >
          <ul className="flex flex-col gap-1">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2.5 font-mono text-sm uppercase tracking-widest text-deadpool-white/70 transition-colors hover:bg-card-dark hover:text-deadpool-white"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li className="pt-2">
              <a
                href="#proker"
                onClick={() => setOpen(false)}
                className="shadow-comic block rounded-lg border border-deadpool-red bg-deadpool-red px-3 py-2.5 text-center font-display font-bold text-canvas-black"
              >
                OPREC
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
