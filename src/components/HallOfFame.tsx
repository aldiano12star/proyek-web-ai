// HallOfFame — the Dynamic Hall of Fame section (F05, Task 3).
//
// Server Component (like About/Divisions): it awaits the achievements list from
// InsForge, renders the heading, then hands the list to <HallOfFameTrack/> — the
// client component that owns the sticky horizontal-scroll effect (Framer Motion
// needs "use client"). This keeps the data fetch on the server and isolates the
// browser-only motion code, matching our "server fetches, client animates" split.

import { getAchievements } from "@/lib/data";
import HallOfFameTrack from "@/components/HallOfFameTrack";

export default async function HallOfFame() {
  const achievements = await getAchievements();

  return (
    <section id="prestasi" className="scroll-mt-20 pt-20 sm:pt-24">
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
        <div className="mx-auto max-w-6xl px-5 pb-20">
          <p className="font-mono text-sm text-deadpool-white/40">
            {"Data prestasi gagal dimuat — coba muat ulang halaman."}
          </p>
        </div>
      ) : (
        <HallOfFameTrack achievements={achievements} />
      )}
    </section>
  );
}
