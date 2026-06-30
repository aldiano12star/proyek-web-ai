// Hero — the public landing page's thesis.
//
// Now CMS-driven: the eyebrow, title, tagline, and primary CTA label come from
// the editable `site_content` table (keys hero_eyebrow / hero_title /
// hero_tagline / hero_cta_label), with hardcoded fallbacks so the section stays
// honest if a read fails or a key is missing. The terminal "exploit" prompt, the
// fourth-wall aside, and the secondary "Lihat Prestasi" link remain static
// design chrome — they're signature devices, not editable copy.
//
// Server Component: awaits the copy, no client JS. Smooth-scroll on the anchor
// links is handled by the Navbar.

import { getSiteContent } from "@/lib/data";

const FALLBACK = {
  eyebrow: "UKK SMA NEGERI 1 BANTUL",
  title: "WE ARE EXPLOIT",
  tagline:
    "Saba Cyber Community — tempat pemula jadi pro di programming, design, dan audio-visual.",
  cta: "Explore SABA",
};

// Render the title with its final word in Deadpool red, preserving the signature
// "WE ARE / EXPLOIT" look while keeping the whole string editable from the CMS.
function renderTitle(title: string) {
  const words = title.trim().split(/\s+/);
  if (words.length <= 1) {
    return <span className="text-deadpool-red">{title}</span>;
  }
  const last = words[words.length - 1];
  const lead = words.slice(0, -1).join(" ");
  return (
    <>
      {lead} <span className="text-deadpool-red">{last}</span>
    </>
  );
}

export default async function Hero() {
  const content = await getSiteContent();
  const eyebrow = content.hero_eyebrow ?? FALLBACK.eyebrow;
  const title = content.hero_title ?? FALLBACK.title;
  const tagline = content.hero_tagline ?? FALLBACK.tagline;
  const ctaLabel = content.hero_cta_label ?? FALLBACK.cta;

  return (
    <section id="top" className="relative overflow-hidden">
      {/* Atmosphere — faint tactical grid + a single red glow behind the wordmark */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-grid opacity-[0.06]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 h-[420px] w-[680px] max-w-full -translate-x-1/2 rounded-full bg-deadpool-red/20 blur-[120px]"
      />

      <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-6 px-5 pb-24 pt-20 sm:pt-28">
        {/* Terminal eyebrow — the signature exploit prompt (static) */}
        <p className="font-mono text-xs tracking-widest sm:text-sm">
          <span className="text-deadpool-white/40">root@sman1bantul</span>
          <span className="text-deadpool-white/70">:~$</span>{" "}
          <span className="text-deadpool-red">./join --saba</span>
          <span className="caret ml-1 inline-block text-deadpool-red">▌</span>
        </p>

        {/* Institutional eyebrow — editable */}
        <p className="font-mono text-xs uppercase tracking-widest text-deadpool-white/50">
          {eyebrow}
        </p>

        <h1 className="font-display text-6xl font-black leading-[0.9] tracking-tight sm:text-7xl lg:text-8xl">
          {renderTitle(title)}
        </h1>

        <p className="max-w-xl text-base text-deadpool-white/70 sm:text-lg">
          {tagline}
        </p>

        {/* Fourth-wall aside — on-brand, the literal recruitment promise (static) */}
        <p className="max-w-md border-l-2 border-deadpool-red pl-4 text-sm italic text-deadpool-white/60">
          “Psst — belum bisa ngoding sama sekali? Justru kamu yang kami cari.”
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <a
            href="#proker"
            className="shadow-comic rounded-xl border border-deadpool-red bg-deadpool-red px-6 py-3 font-display font-bold text-canvas-black transition-transform hover:-translate-y-0.5"
          >
            {ctaLabel}
          </a>
          <a
            href="#prestasi"
            className="rounded-xl border border-slate-border px-6 py-3 font-display font-bold text-deadpool-white transition-colors hover:border-deadpool-red"
          >
            Lihat Prestasi →
          </a>
        </div>
      </div>
    </section>
  );
}
