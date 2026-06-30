// Dynamically generated social-share card (Open Graph + Twitter).
//
// Using Next's file convention so the image is wired into <head> automatically
// for both og:image and twitter:image — no static asset to maintain. Rendered
// at build/request time by the Edge runtime via next/og's ImageResponse.
// On-brand "Tactical Deadpool" look: jet-black canvas, crimson accent, big
// geometric title — what people see when the link is pasted into WhatsApp/IG.

import { ImageResponse } from "next/og";

// No edge runtime: lets Next prerender this card statically at build time and
// serve it as a cached PNG (better for a marketing page than per-request gen).

// Standard OG card dimensions.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt =
  "Saba Exploit — Open Recruitment. UKK SMA Negeri 1 Bantul.";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#060608",
          // Faint tactical grid, matching the hero background.
          backgroundImage:
            "linear-gradient(to right, #212126 1px, transparent 1px), linear-gradient(to bottom, #212126 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            color: "#E23636",
            fontSize: 30,
            fontWeight: 700,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
          }}
        >
          UKK SMA Negeri 1 Bantul
        </div>

        <div
          style={{
            display: "flex",
            color: "#F3F3F5",
            fontSize: 130,
            fontWeight: 900,
            lineHeight: 1.0,
            marginTop: 20,
            letterSpacing: "-0.03em",
          }}
        >
          SABA EXPLOIT
        </div>

        <div
          style={{
            display: "flex",
            color: "#F3F3F5",
            opacity: 0.7,
            fontSize: 40,
            fontWeight: 400,
            marginTop: 28,
          }}
        >
          Open Recruitment Kelas X — programming, design, audio-visual.
        </div>

        {/* Crimson accent bar — the comic underline. */}
        <div
          style={{
            display: "flex",
            width: 220,
            height: 14,
            marginTop: 48,
            backgroundColor: "#E23636",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
