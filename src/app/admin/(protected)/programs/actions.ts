"use server";

// Server Action for the Programs CMS (Proker / F04).
//
// The 10 programs are FIXED rows (seeded once) — admins can't add or delete
// them, only edit each program's `description`. So this file exposes a single
// update action. It runs on the cookie-bound SSR client, executing AS the
// logged-in admin so RLS grants `authenticated` UPDATE on `programs` while the
// public anon key stays read-only.
//
// After a save we revalidate both the admin list AND the public home page
// ("/"), so the Proker grid on the landing page reflects the new copy at once.

import { revalidatePath } from "next/cache";
import { createInsForgeServerClient } from "@/lib/insforge-server";

export type ProgramFormState = {
  // Which program this result belongs to, so the UI can scope the banner to the
  // right card when several edit forms share the page.
  id: string | null;
  error: string | null;
  success: boolean;
};

export async function updateProgramAction(
  _prev: ProgramFormState,
  formData: FormData,
): Promise<ProgramFormState> {
  const id = String(formData.get("id") ?? "");
  const description = String(formData.get("description") ?? "").trim();

  if (!id) {
    return { id: null, error: "Program tidak dikenali.", success: false };
  }
  if (!description) {
    return { id, error: "Deskripsi tidak boleh kosong.", success: false };
  }
  if (description.length > 2000) {
    return {
      id,
      error: "Deskripsi terlalu panjang (maks 2000 karakter).",
      success: false,
    };
  }

  const client = await createInsForgeServerClient();
  const { error } = await client.database
    .from("programs")
    .update({ description })
    .eq("id", id);

  if (error) {
    console.error("[programs] update failed:", error);
    return {
      id,
      error: "Gagal menyimpan. Pastikan sesi login masih aktif.",
      success: false,
    };
  }

  revalidatePath("/admin/programs");
  revalidatePath("/");
  return { id, error: null, success: true };
}
