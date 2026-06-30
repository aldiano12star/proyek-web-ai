"use client";

// ProkerGrid — the Dynamic Proker Explorer (F04).
//
// Client component: each card is a button that opens ProkerModal, which needs
// React state. Data is fetched on the server (page.tsx -> getPrograms) and
// passed in as a prop, so the anon DB read still happens server-side and only
// the small interactive shell ships to the browser. Cards reuse the Divisions
// card language (slate border, rounded-xl, comic shadow on hover) for cohesion.

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { Program } from "@/lib/types";
import ProkerModal from "./ProkerModal";

export default function ProkerGrid({ programs }: { programs: Program[] }) {
  const [selected, setSelected] = useState<Program | null>(null);

  return (
    <section id="proker" className="scroll-mt-20 px-5 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 flex flex-col gap-3">
          <p className="font-mono text-xs uppercase tracking-widest text-deadpool-red">
            {`// ${programs.length} Proker`}
          </p>
          <h2 className="font-display text-4xl font-black tracking-tight sm:text-5xl">
            AGENDA SATU MUSIM
          </h2>
          <p className="max-w-xl text-deadpool-white/60">
            Sepuluh program kerja yang bikin markas nggak pernah sepi. Klik
            kartunya buat lihat detail tiap misi.
          </p>
        </header>

        {programs.length === 0 ? (
          <p className="font-mono text-sm text-deadpool-white/40">
            {"// data proker gagal dimuat — coba muat ulang halaman."}
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {programs.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelected(p)}
                aria-haspopup="dialog"
                className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-border bg-card-dark p-6 text-left transition duration-300 hover:-translate-y-1 hover:border-deadpool-red hover:shadow-comic focus:outline-none focus-visible:-translate-y-1 focus-visible:border-deadpool-red focus-visible:shadow-comic"
              >
                <span
                  aria-hidden
                  className="absolute inset-x-6 top-0 h-0.5 rounded-full bg-deadpool-red opacity-0 transition-opacity duration-300 group-hover:opacity-70 group-focus-visible:opacity-70"
                />
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-xl font-black text-deadpool-white">
                    {p.name}
                  </h3>
                  <ArrowUpRight
                    size={18}
                    className="mt-1 shrink-0 text-deadpool-white/30 transition-colors group-hover:text-deadpool-red group-focus-visible:text-deadpool-red"
                  />
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-deadpool-white/60">
                  {p.description}
                </p>
                <span className="mt-4 font-mono text-xs uppercase tracking-widest text-deadpool-white/40">
                  {"// lihat detail"}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <ProkerModal program={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
