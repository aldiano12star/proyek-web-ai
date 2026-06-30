"use server";

// Server Action for the Divisions CMS (F03).
//
// The 5 divisions are FIXED rows (seeded once) — admins can't add or delete
// them, only edit each division's `description`, `sub_description`, and
// `color_palette`. Runs on the cookie-bound SSR client so the UPDATE executes AS
// the logged-in admin and passes RLS (`authenticated` = CRUD, anon = read-only).
//
// `color_palette` is a comma-separated list of hex colours; the public Divisions
// section uses the FIRST one as the card's accent. We validate every token is a
// hex code so a typo can't inject arbitrary CSS into the inline style attribute.
//
// After a save we revalidate the admin list AND the public home page ("/").

import { revalidatePath } from "next/cache";
import { createInsForgeServerClient } from "@/lib/insforge-server";

export type DivisionFormState = {
  // Scopes the result banner to the right card when several editors share a page.
  id: string | null;
  error: string | null;
  success: boolean;
};

const HEX = /^#[0-9a-fA-F]{3,8}$/;

export async function updateDivisionAction(
  _prev: DivisionFormState,
  formData: FormData,
): Promise<DivisionFormState> {
  const id = String(formData.get("id") ?? "");
  const description = String(formData.get("description") ?? "").trim();
  const subDescription = String(formData.get("sub_description") ?? "").trim();
  const colorPaletteRaw = String(formData.get("color_palette") ?? "").trim();

  if (!id) {
    return { id: null, error: "Divisi tidak dikenali.", success: false };
  }
  if (!description) {
    return { id, error: "Deskripsi tidak boleh kosong.", success: false };
  }
  if (!subDescription) {
    return { id, error: "Sub-deskripsi tidak boleh kosong.", success: false };
  }
  if (description.length > 2000 || subDescription.length > 2000) {
    return { id, error: "Teks terlalu panjang (maks 2000 karakter).", success: false };
  }

  // Normalise the palette: split on commas, trim, drop empties, validate hex.
  const colors = colorPaletteRaw
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);

  if (colors.length === 0) {
    return { id, error: "Minimal satu warna hex (mis. #E23636).", success: false };
  }
  const bad = colors.find((c) => !HEX.test(c));
  if (bad) {
    return {
      id,
      error: `Format warna tidak valid: "${bad}". Gunakan hex seperti #E23636.`,
      success: false,
    };
  }
  const color_palette = colors.join(",");

  const client = await createInsForgeServerClient();
  const { error } = await client.database
    .from("divisions")
    .update({ description, sub_description: subDescription, color_palette })
    .eq("id", id);

  if (error) {
    console.error("[divisions] update failed:", error);
    return {
      id,
      error: "Gagal menyimpan. Pastikan sesi login masih aktif.",
      success: false,
    };
  }

  revalidatePath("/admin/divisions");
  revalidatePath("/");
  return { id, error: null, success: true };
}
