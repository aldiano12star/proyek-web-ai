"use server";

// Server Actions for the Achievements CMS (Hall of Fame / F05).
//
// These run on the server using the cookie-bound SSR client, so every query
// executes AS the logged-in admin — RLS grants `authenticated` full CRUD on the
// `achievements` table while the public anon key stays read-only. Never expose
// these mutations to the anon client.
//
// After each write we revalidate both the admin list AND the public home page
// ("/"), so the marquee on the landing page reflects the change immediately.

import { revalidatePath } from "next/cache";
import { createInsForgeServerClient } from "@/lib/insforge-server";

export type AchievementFormState = { error: string | null; success: boolean };

export async function addAchievementAction(
  _prev: AchievementFormState,
  formData: FormData,
): Promise<AchievementFormState> {
  const title = String(formData.get("title") ?? "").trim();

  if (!title) {
    return { error: "Judul prestasi tidak boleh kosong.", success: false };
  }
  if (title.length > 300) {
    return { error: "Judul terlalu panjang (maks 300 karakter).", success: false };
  }

  const client = await createInsForgeServerClient();

  // Append to the end of the marquee: find the current highest display_order
  // and add one. Keeps the public ticker order stable instead of all-zeros.
  const { data: last } = await client.database
    .from("achievements")
    .select("display_order")
    .order("display_order", { ascending: false })
    .limit(1);

  const nextOrder = ((last?.[0]?.display_order as number | undefined) ?? 0) + 1;

  const { error } = await client.database
    .from("achievements")
    .insert([{ title, display_order: nextOrder }]);

  if (error) {
    console.error("[achievements] insert failed:", error);
    return {
      error: "Gagal menyimpan. Pastikan sesi login masih aktif.",
      success: false,
    };
  }

  revalidatePath("/admin/achievements");
  revalidatePath("/");
  return { error: null, success: true };
}

export async function deleteAchievementAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const client = await createInsForgeServerClient();
  const { error } = await client.database
    .from("achievements")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("[achievements] delete failed:", error);
    return;
  }

  revalidatePath("/admin/achievements");
  revalidatePath("/");
}
