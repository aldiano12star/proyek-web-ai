// Server-side data access for the public landing page.
//
// Reads run through the public anon client (`insforge`) — RLS allows anon to
// SELECT every public table, so this is safe to call from Server Components.
// Each helper swallows errors into an empty result and logs them, so a backend
// hiccup degrades to an empty section instead of crashing the whole page.

import { insforge } from "@/lib/insforge";
import type {
  Achievement,
  Division,
  GalleryPhoto,
  Program,
  SiteContent,
  SiteContentMap,
} from "@/lib/types";

export async function getDivisions(): Promise<Division[]> {
  const { data, error } = await insforge.database
    .from("divisions")
    .select()
    .order("display_order", { ascending: true });

  if (error) {
    console.error("[data] getDivisions failed:", error);
    return [];
  }
  return (data ?? []) as Division[];
}

export async function getPrograms(): Promise<Program[]> {
  const { data, error } = await insforge.database
    .from("programs")
    .select()
    .order("display_order", { ascending: true });

  if (error) {
    console.error("[data] getPrograms failed:", error);
    return [];
  }
  return (data ?? []) as Program[];
}

// Hall of Fame (F05) — the competition history that scrolls in the marquee.
// Ordered by `display_order` so the CMS can curate which wins lead the ticker.
export async function getAchievements(): Promise<Achievement[]> {
  const { data, error } = await insforge.database
    .from("achievements")
    .select()
    .order("display_order", { ascending: true });

  if (error) {
    console.error("[data] getAchievements failed:", error);
    return [];
  }
  return (data ?? []) as Achievement[];
}

// Togetherness Gallery (F06) — masonry photos read from the `gallery` table.
//
// `select()` pulls every column, including `storage_path`. The public grid only
// renders `image_url` + `caption`, but carrying the bucket object path through
// the row means the Phase-4 admin "delete" can remove the Storage object in the
// same breath as the DB row — no orphaned files left burning quota (the fix
// agreed in our security audit). Ordered by `display_order` so the CMS controls
// the layout sequence.
export async function getGalleryPhotos(): Promise<GalleryPhoto[]> {
  const { data, error } = await insforge.database
    .from("gallery")
    .select()
    .order("display_order", { ascending: true });

  if (error) {
    console.error("[data] getGalleryPhotos failed:", error);
    return [];
  }
  return (data ?? []) as GalleryPhoto[];
}

// Editable copy (hero/About) lives in the `site_content` key/value table so the
// CMS can change it without a deploy. Returned as a plain map for easy lookup:
// `content.about_heading`, `content.about_body`, etc. On failure we return an
// empty map and let each component fall back to sensible defaults.
export async function getSiteContent(): Promise<SiteContentMap> {
  const { data, error } = await insforge.database
    .from("site_content")
    .select();

  if (error) {
    console.error("[data] getSiteContent failed:", error);
    return {};
  }

  const map: SiteContentMap = {};
  for (const row of (data ?? []) as SiteContent[]) {
    map[row.key] = row.value;
  }
  return map;
}
