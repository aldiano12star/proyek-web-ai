// Divisi section — dynamic, reads the 5 divisions from InsForge.
//
// Server Component: it awaits the DB read directly. Cards are static markup;
// the "showcase" interaction is pure CSS (hover/focus) so no client JS ships.
// Theme: every card keeps the Deadpool-red comic shadow + slate border; each
// division's own palette colour appears only as the icon tint and a thin accent
// bar, so the section stays on-brand while still differentiating the divisions.

import { getDivisions } from "@/lib/data";
import { divisionIcon } from "@/lib/icons";

function accentOf(palette: string): string {
  return palette.split(",")[0]?.trim() || "#E23636";
}

export default async function Divisions() {
  const divisions = await getDivisions();

  return (
    <section id="divisi" className="scroll-mt-20 px-5 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 flex flex-col gap-3">
          <h2 className="font-display text-4xl font-black tracking-tight sm:text-5xl">
            PILIH MEDAN TEMPURMU
          </h2>
          <p className="max-w-xl text-deadpool-white/60">
            Lima divisi, satu markas. Geser kursor ke kartu untuk mengintip apa
            yang kami kerjakan di balik layar.
          </p>
        </header>

        {divisions.length === 0 ? (
          <p className="font-mono text-sm text-deadpool-white/40">
            {"Data divisi gagal dimuat — coba muat ulang halaman."}
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {divisions.map((d) => {
              const Icon = divisionIcon(d.icon_name);
              const accent = accentOf(d.color_palette);
              return (
                <article
                  key={d.id}
                  tabIndex={0}
                  className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-border bg-card-dark p-6 transition duration-300 hover:-translate-y-1 hover:border-deadpool-red hover:shadow-comic focus:outline-none focus-visible:-translate-y-1 focus-visible:border-deadpool-red focus-visible:shadow-comic"
                >
                  {/* per-division accent bar */}
                  <span
                    aria-hidden
                    className="absolute inset-x-6 top-0 h-0.5 rounded-full opacity-70"
                    style={{ background: accent }}
                  />

                  <div
                    className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg border border-slate-border"
                    style={{ color: accent }}
                  >
                    <Icon size={22} strokeWidth={2.2} />
                  </div>

                  <h3 className="font-display text-xl font-black text-deadpool-white">
                    {d.name}
                  </h3>
                  <p className="mt-2 text-sm text-deadpool-white/65">
                    {d.description}
                  </p>

                  {/* sub_description: always shown on mobile, revealed on
                      hover/focus on desktop (the "stretch" showcase) */}
                  <div className="grid grid-rows-[1fr] transition-all duration-300 md:grid-rows-[0fr] md:group-hover:grid-rows-[1fr] md:group-focus-within:grid-rows-[1fr]">
                    <div className="min-h-0 overflow-hidden">
                      <p className="mt-3 border-t border-slate-border/70 pt-3 text-sm text-deadpool-white/45">
                        {d.sub_description}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}

            {/* 6th cell: turn the trailing gap into a recruiting CTA */}
            <a
              href="#proker"
              className="group flex flex-col items-start justify-center gap-2 rounded-xl border border-dashed border-slate-border p-6 transition duration-300 hover:-translate-y-1 hover:border-deadpool-red hover:shadow-comic focus:outline-none focus-visible:-translate-y-1 focus-visible:border-deadpool-red focus-visible:shadow-comic"
            >
              <span className="font-display text-2xl font-black text-deadpool-white">
                ITU KAMU?
              </span>
              <span className="text-sm text-deadpool-white/55">
                Belum nemu divisimu? Daftar OPREC, biar kami bantu cari. →
              </span>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
