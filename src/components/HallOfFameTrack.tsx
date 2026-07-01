"use client";

// HallOfFameTrack — the sticky horizontal "scrollytelling" track for the Hall
// of Fame (Task 3). This is the CLIENT half of the section: HallOfFame.tsx (a
// Server Component) still fetches the achievements and renders the heading, then
// hands the list here as a prop — the same "server fetches, client animates"
// split we already use for ProkerGrid and Gallery.
//
// How the sticky scroll works:
//   • The outer <section> is TALLER than the screen (height = 100vh + the exact
//     horizontal overflow). That extra height is the vertical scroll runway.
//   • Its child is `sticky top-0 h-screen`, so while you scroll down through the
//     runway the child stays PINNED, filling the viewport.
//   • useScroll reports how far you are through the runway (0 → 1) and useTransform
//     maps that vertical progress onto a horizontal translate of the pill row:
//     0 → -travel px. So scrolling DOWN slides the trophies SIDEWAYS.
//   • `travel` = trackWidth − viewportWidth, i.e. exactly how far the row must
//     slide for its last pill to sit flush against the right edge. Because x hits
//     -travel precisely at progress 1 — and progress 1 is the bottom of the runway
//     where the sticky child unpins — the "lock releases once the horizontal
//     scroll reaches the end" requirement falls out for free.
//
// Why a MotionValue for `travel` (not useState): this repo's lint forbids
// setState-inside-effect (react-hooks/set-state-in-effect, the same rule that
// shaped Gallery's DOM-driven preview). Writing a MotionValue never re-renders
// React and never trips that rule, so the ResizeObserver can update the distance
// freely. Binding the section height to `calc(100vh + Npx)` also keeps SSR happy
// (no window reads) and collapses the runway to a plain screen when nothing
// overflows — so a short award list never leaves a wall of dead scroll.
//
// Reduced motion: scroll-hijacking is the single effect motion-sensitive users
// most dislike, so with `prefers-reduced-motion` we drop the whole rig and render
// a plain, manually swipeable row instead.

import { useEffect, useRef, useSyncExternalStore } from "react";
import { motion, useMotionValue, useScroll, useTransform } from "framer-motion";
import { Trophy } from "lucide-react";
import type { Achievement } from "@/lib/types";

// Read `prefers-reduced-motion` via useSyncExternalStore — SSR-safe (server
// snapshot = false, so hydration matches), always reflects the *current* media
// state on the client (framer's useReducedMotion missed a preference that was
// already set at page load), and needs no setState-in-effect (which this repo's
// lint forbids).
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
function subscribeReducedMotion(onChange: () => void) {
  const mql = window.matchMedia(REDUCED_MOTION_QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}
function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false,
  );
}

export default function HallOfFameTrack({
  achievements,
}: {
  achievements: Achievement[];
}) {
  const reduceMotion = usePrefersReducedMotion();

  if (reduceMotion) {
    // Calm fallback: no pin, no hijack — just a row you can swipe/drag yourself.
    return (
      <div className="flex gap-4 overflow-x-auto px-5 pb-6 sm:px-8">
        {achievements.map((a) => (
          <AchievementPill key={a.id} title={a.title} />
        ))}
      </div>
    );
  }

  return <StickyTrack achievements={achievements} />;
}

// Split out so the motion hooks below are never called conditionally (Rules of
// Hooks): the reduced-motion branch above returns before this ever mounts.
function StickyTrack({ achievements }: { achievements: Achievement[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // 0 when the runway's top meets the viewport top (child pins) → 1 when its
  // bottom meets the viewport bottom (child unpins). That window is exactly the
  // span during which the child is stuck to the screen.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Horizontal overflow in px, kept in a MotionValue so resize updates cause no
  // React re-render (and no set-state-in-effect lint error).
  const travel = useMotionValue(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const measure = () => {
      // How much wider the pill row is than the screen = how far it must slide.
      travel.set(Math.max(0, track.scrollWidth - window.innerWidth));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [travel]);

  // Vertical progress (0→1) → horizontal offset (0 → -travel px). Reading both
  // MotionValues inside the function keeps x live to scroll AND to resize.
  const x = useTransform(() => -travel.get() * scrollYProgress.get());

  // Runway height = one screen (the pinned frame) + the exact slide distance, so
  // vertical scroll maps 1:1 to horizontal travel and a non-overflowing list adds
  // zero dead space.
  const height = useTransform(travel, (t) => `calc(100vh + ${t}px)`);

  return (
    <motion.section ref={sectionRef} style={{ height }} className="relative">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div
          ref={trackRef}
          style={{ x }}
          className="flex w-max gap-4 px-5 sm:px-8"
        >
          {achievements.map((a) => (
            <AchievementPill key={a.id} title={a.title} />
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}

// A single trophy badge — same card language (slate border, rounded-xl, red
// accent) as the Proker and Divisions cards, carried over from the old marquee.
function AchievementPill({ title }: { title: string }) {
  return (
    <div className="flex shrink-0 items-center gap-3 rounded-xl border border-slate-border bg-card-dark px-6 py-4">
      <Trophy size={18} aria-hidden className="shrink-0 text-deadpool-red" />
      <span className="whitespace-nowrap font-display text-base font-black text-deadpool-white">
        {title}
      </span>
    </div>
  );
}
