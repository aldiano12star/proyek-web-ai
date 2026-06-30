import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow Next/Image to optimize photos served from InsForge Storage CDN.
    remotePatterns: [
      { protocol: "https", hostname: "**.insforge.app" },
      { protocol: "https", hostname: "**.insforge.dev" },
    ],
  },
  experimental: {
    serverActions: {
      // GitHub Codespaces serves the app through a forwarded *.app.github.dev
      // host while the internal origin stays localhost. Next.js' Server Action
      // CSRF guard rejects that host/origin mismatch ("Invalid Server Actions
      // request") unless the forwarded domain is explicitly trusted here.
      // Harmless in production (real deploys are same-origin); only matters for
      // the proxied dev URL.
      allowedOrigins: [
        "solid-winner-v6v94qg6v45726w9-3000.app.github.dev",
        "*.app.github.dev",
      ],
    },
  },
};

export default nextConfig;
