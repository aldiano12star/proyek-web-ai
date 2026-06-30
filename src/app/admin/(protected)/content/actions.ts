"use server";

// Server Action for the General Content CMS (Hero + About copy).
//
// Edits the `site_content` key/value table so landing-page copy can change
// without a deploy. Runs on the cookie-bound SSR client, executing AS the
// logged-in admin — RLS grants `authenticated` UPDATE while the public anon key
// stays read-only.
//
// Only the keys in CONTENT_KEYS may be written: the form posts a `key`, and we
// reject anything outside the allowlist so a tampered request can't create or
// overwrite arbitrary rows. All six keys are seeded (db/03_seed.sql), so a plain
// UPDATE-by-key is enough.
//
// After a save we revalidate both the admin editor AND the public home page
// ("/"), so the Hero/About sections reflect the new copy immediately.

import { revalidatePath } from "next/cache";
import { createInsForgeServerClient } from "@/lib/insforge-server";

export const CONTENT_KEYS = [
  "hero_eyebrow",
  "hero_title",
  "hero_tagline",
  "hero_cta_label",
  "about_heading",
  "about_body",
] as const;

export type ContentKey = (typeof CONTENT_KEYS)[number];

const KEY_SET = new Set<string>(CONTENT_KEYS);

export type ContentFormState = {
  // Which key this result belongs to, so the UI scopes the banner to the right
  // field when several editors share the page.
  key: string | null;
  error: string | null;
  success: boolean;
};

export async function updateContentAction(
  _prev: ContentFormState,
  formData: FormData,
): Promise<ContentFormState> {
  const key = String(formData.get("key") ?? "");
  const value = String(formData.get("value") ?? "").trim();

  if (!KEY_SET.has(key)) {
    return { key: null, error: "Field tidak dikenali.", success: false };
  }
  if (!value) {
    return { key, error: "Isi tidak boleh kosong.", success: false };
  }
  if (value.length > 2000) {
    return {
      key,
      error: "Teks terlalu panjang (maks 2000 karakter).",
      success: false,
    };
  }

  const client = await createInsForgeServerClient();
  const { error } = await client.database
    .from("site_content")
    .update({ value })
    .eq("key", key);

  if (error) {
    console.error("[content] update failed:", error);
    return {
      key,
      error: "Gagal menyimpan. Pastikan sesi login masih aktif.",
      success: false,
    };
  }

  revalidatePath("/admin/content");
  revalidatePath("/");
  return { key, error: null, success: true };
}
