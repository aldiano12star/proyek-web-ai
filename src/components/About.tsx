// About / Visi-Misi (F02) — asymmetric Deadpool Bento.
//
// Server Component: awaits the editable copy from InsForge `site_content`
// (keys `about_heading` + `about_body`) so the CMS can change it without a
// deploy. If the read fails or a key is missing, sensible defaults keep the
// section honest and rendering. No client JS — hover/focus accents are pure CSS.

import { getSiteContent } from "@/lib/data";

const FALLBACK_HEADING = "Tentang Sapa Exploit";
const FALLBACK_BODY =
  "Saba Cyber Community — rumah kreatif semi-profesional di SMA Negeri 1 " +
  "Bantul yang menggarap teknologi dan seni audio-visual sejak 2006.";

export default async function About() {
  const content = await getSiteContent();
  const heading = content.about_heading ?? FALLBACK_HEADING;
  const body = content.about_body ?? FALLBACK_BODY;

  return (
    <section id="tentang" className="scroll-mt-20 px-5 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 flex flex-col gap-3">
          <h2 className="font-display text-4xl font-black tracking-tight sm:text-5xl">
            SIAPA DI BALIK LAYAR?
          </h2>
        </header>

        {/* Asymmetric bento: wide narrative panel (7) + tall mission rail (5) */}
        <div className="grid gap-4 lg:grid-cols-12">
          {/* Primary panel — live About copy from the database */}
          <article className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-border bg-card-dark p-7 transition duration-300 hover:-translate-y-1 hover:border-deadpool-red hover:shadow-comic sm:p-9 lg:col-span-7">
            <span
              aria-hidden
              className="absolute inset-x-7 top-0 h-0.5 rounded-full bg-deadpool-red opacity-70 sm:inset-x-9"
            />
            <h3 className="font-display text-2xl font-black text-deadpool-white sm:text-3xl">
              {heading}
            </h3>
            <p className="mt-4 max-w-prose text-base leading-relaxed text-deadpool-white/70">
              {body}
            </p>
          </article>

          {/* Mission rail — two stacked accent cells */}
          <div className="grid gap-4 lg:col-span-5">
            {/* Visi: terminal-style fourth-wall manifesto */}
            <article className="group relative flex flex-col justify-center overflow-hidden rounded-xl border border-slate-border bg-card-dark p-7 transition duration-300 hover:-translate-y-1 hover:border-deadpool-red hover:shadow-comic">
              <p className="font-display text-xl font-black leading-snug text-deadpool-white">
                Bikin pemula jadi{" "}
                <span className="text-deadpool-red">pro</span> — tanpa drama,
                tanpa gatekeeping.
              </p>
            </article>

            {/* Misi: recruiting CTA back into the page */}
            <a
              href="#divisi"
              className="group relative flex flex-col justify-center gap-2 overflow-hidden rounded-xl border border-dashed border-slate-border p-7 transition duration-300 hover:-translate-y-1 hover:border-deadpool-red hover:shadow-comic focus:outline-none focus-visible:-translate-y-1 focus-visible:border-deadpool-red focus-visible:shadow-comic"
            >
              <span className="font-display text-lg font-black text-deadpool-white">
                Lima divisi nunggu kamu. →
              </span>
              <span className="text-sm text-deadpool-white/55">
                Programming, design, audio-visual — pilih medanmu.
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
