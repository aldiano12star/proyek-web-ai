// General Content CMS (Hero + About copy).
//
// Server Component. Reads the `site_content` key/value rows through the
// cookie-bound admin client, then renders an EditContentField per editable key,
// grouped into a Hero section and an About section. Saves are delegated to
// updateContentAction in ./actions.ts. force-dynamic because the copy changes as
// the admin edits.

import { FileText, Megaphone, Info } from "lucide-react";
import { createInsForgeServerClient } from "@/lib/insforge-server";
import type { SiteContent, SiteContentMap } from "@/lib/types";
import EditContentField from "./EditContentField";
import type { ContentKey } from "./actions";

export const dynamic = "force-dynamic";

// Sensible fallbacks so the editor always shows a starting value even if a row
// is somehow missing (the keys are seeded, but defensive copy never hurts).
const FALLBACKS: Record<ContentKey, string> = {
  hero_eyebrow: "UKK SMA NEGERI 1 BANTUL",
  hero_title: "WE ARE EXPLOIT",
  hero_tagline:
    "Saba Cyber Community — tempat pemula jadi pro di programming, design, dan audio-visual.",
  hero_cta_label: "Explore SABA",
  about_heading: "Tentang Sapa Exploit",
  about_body:
    "Saba Cyber Community — rumah kreatif semi-profesional di SMA Negeri 1 Bantul.",
};

type FieldDef = {
  key: ContentKey;
  label: string;
  hint?: string;
  multiline?: boolean;
};

const HERO_FIELDS: FieldDef[] = [
  { key: "hero_eyebrow", label: "Eyebrow / Label Institusi", hint: "Teks kecil di atas judul utama" },
  { key: "hero_title", label: "Judul Utama", hint: "Kata terakhir otomatis diberi warna merah" },
  { key: "hero_tagline", label: "Tagline", multiline: true },
  { key: "hero_cta_label", label: "Label Tombol Utama (CTA)" },
];

const ABOUT_FIELDS: FieldDef[] = [
  { key: "about_heading", label: "Judul Bagian Tentang" },
  { key: "about_body", label: "Isi / Narasi Tentang", multiline: true },
];

async function getContentMap(): Promise<SiteContentMap> {
  const client = await createInsForgeServerClient();
  const { data, error } = await client.database.from("site_content").select();

  if (error) {
    console.error("[content] list failed:", error);
    return {};
  }

  const map: SiteContentMap = {};
  for (const row of (data ?? []) as SiteContent[]) {
    map[row.key] = row.value;
  }
  return map;
}

export default async function ContentPage() {
  const content = await getContentMap();

  return (
    <div>
      {/* Page header */}
      <div className="mb-8 flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-deadpool-red text-canvas-black">
          <FileText size={24} strokeWidth={2.5} />
        </span>
        <div>
          <h1 className="font-display text-3xl font-black tracking-tight text-deadpool-white">
            Konten Umum
          </h1>
          <p className="mt-1 font-mono text-sm text-deadpool-white/60">
            Edit teks Hero & Tentang yang tampil di halaman depan
          </p>
        </div>
      </div>

      {/* Hero group */}
      <section className="mb-10">
        <div className="mb-4 flex items-center gap-2">
          <Megaphone size={18} className="text-deadpool-red" />
          <h2 className="font-display text-lg font-black uppercase tracking-wide text-deadpool-white">
            Hero
          </h2>
        </div>
        <div className="space-y-4">
          {HERO_FIELDS.map((f) => (
            <EditContentField
              key={f.key}
              contentKey={f.key}
              label={f.label}
              hint={f.hint}
              multiline={f.multiline}
              initialValue={content[f.key] ?? FALLBACKS[f.key]}
            />
          ))}
        </div>
      </section>

      {/* About group */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <Info size={18} className="text-deadpool-red" />
          <h2 className="font-display text-lg font-black uppercase tracking-wide text-deadpool-white">
            Tentang
          </h2>
        </div>
        <div className="space-y-4">
          {ABOUT_FIELDS.map((f) => (
            <EditContentField
              key={f.key}
              contentKey={f.key}
              label={f.label}
              hint={f.hint}
              multiline={f.multiline}
              initialValue={content[f.key] ?? FALLBACKS[f.key]}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
