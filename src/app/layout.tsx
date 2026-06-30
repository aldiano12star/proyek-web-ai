import type { Metadata } from "next";
import { Outfit, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Geometric heavy display font for comic/action-movie headings
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

// Body copy
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Terminal / code mono
const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

// Absolute base for OG/Twitter image URLs. Set NEXT_PUBLIC_SITE_URL to the
// production domain on the host (Vercel/Netlify) so WhatsApp/social can fetch
// the share card; falls back to localhost in dev.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const title = "Saba Exploit — Open Recruitment";
const description =
  "Sapa Exploit (Saba Cyber Community), UKK SMA Negeri 1 Bantul. Open Recruitment kelas X — programming, design, dan audio-visual.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s — Saba Exploit",
  },
  description,
  applicationName: "Saba Exploit OPREC",
  keywords: [
    "Saba Exploit",
    "Sapa Exploit",
    "Saba Cyber Community",
    "SMA Negeri 1 Bantul",
    "Open Recruitment",
    "OPREC",
    "programming",
    "design",
    "cinematography",
  ],
  authors: [{ name: "Saba Exploit" }],
  icons: { icon: "/favicon.ico" },
  // og:image / twitter:image are auto-injected from app/opengraph-image.tsx.
  openGraph: {
    type: "website",
    siteName: "Saba Exploit",
    title,
    description,
    url: siteUrl,
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${outfit.variable} ${inter.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-canvas-black text-deadpool-white">
        {children}
      </body>
    </html>
  );
}
