// HallOfFame — the Dynamic Hall of Fame marquee (F05).
//
// Server Component (like About/Divisions): it awaits the achievements list from
// InsForge and renders an endless horizontal ticker. The motion is 100% CSS —
// no Framer Motion, no React re-renders, no JS loop — which is exactly what a
// projector running this all day needs. The `animate-marquee` utility and its
// keyframes live in globals.css.
//
// Seamless-loop trick: the track holds the SAME list twice. The CSS animation
// translates the track by exactly -50%, so the moment the first copy scrolls
// off, the second copy is sitting precisely where the first began — the wrap is
// invisible. Each pill carries its own trailing margin (mr-4) instead of a flex
// `gap`, so both halves are byte-for-byte identical and -50% lands perfectly.
// The duplicate copy is aria-hidden so screen readers announce each award once.

import { Trophy } from "lucide-react";
import { getAchievements } from "@/lib/data";

export default async function HallOfFame() {
  const achievements = await getAchievements();

  return (
    <section id="prestasi" className="scroll-mt-20 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <header className="mb-10 flex flex-col gap-3">
          <p className="font-mono text-xs uppercase tracking-widest text-deadpool-red">
            {`// ${achievements.length} Prestasi`}
          </p>
          <h2 className="font-display text-4xl font-black tracking-tight sm:text-5xl">
            HALL OF FAME
          </h2>
          <p className="max-w-xl text-deadpool-white/60">
            Lemari piala yang nggak pernah berhenti jalan. Bukti kalau markas ini
            serius — dari panggung kabupaten sampai nasional.
          </p>
        </header>
      </div>

      {achievements.length === 0 ? (
        <div className="mx-auto max-w-6xl px-5">
          <p className="font-mono text-sm text-deadpool-white/40">
            {"// data prestasi gagal dimuat — coba muat ulang halaman."}
          </p>
        </div>
      ) : (
        // Full-bleed viewport: the ticker runs edge-to-edge. Hovering pauses the
        // scroll so a curious freshman can read a specific award. With reduced
        // motion the animation is off (globals.css) and the row becomes manually
        // scrollable, with the duplicate copy hidden so nothing repeats.
        <div className="group relative overflow-hidden motion-reduce:overflow-x-auto">
          <div
            className="flex w-max animate-marquee group-hover:[animation-play-state:paused]"
            style={{ ["--marquee-duration" as string]: "42s" }}
          >
            {/* Copy 1 — the real, announced content */}
            {achievements.map((a) => (
              <AchievementPill key={a.id} title={a.title} />
            ))}
            {/* Copy 2 — visual duplicate for the seamless loop, hidden from AT
                and dropped entirely when motion is reduced. */}
            {achievements.map((a) => (
              <AchievementPill
                key={`dup-${a.id}`}
                title={a.title}
                ariaHidden
                className="motion-reduce:hidden"
              />
            ))}
          </div>

          {/* Edge fades — pointer-events-none so they never block interaction */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-canvas-black to-transparent sm:w-28"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-canvas-black to-transparent sm:w-28"
          />
        </div>
      )}
    </section>
  );
}

// A single trophy badge in the ticker. Reuses the card design language
// (slate border, rounded-xl, red accent) so it sits in the same world as the
// Proker and Divisions cards.
function AchievementPill({
  title,
  ariaHidden = false,
  className = "",
}: {
  title: string;
  ariaHidden?: boolean;
  className?: string;
}) {
  return (
    <div
      aria-hidden={ariaHidden || undefined}
      className={`mr-4 flex shrink-0 items-center gap-3 rounded-xl border border-slate-border bg-card-dark px-6 py-4 ${className}`}
    >
      <Trophy
        size={18}
        aria-hidden
        className="shrink-0 text-deadpool-red"
      />
      <span className="whitespace-nowrap font-display text-base font-black text-deadpool-white">
        {title}
      </span>
    </div>
  );
}
