"use server";

// Server Actions for the Gallery CMS (Togetherness Gallery / F06).
//
// Runs on the cookie-bound SSR client so uploads + writes execute AS the
// logged-in admin: Storage RLS lets `authenticated` write to the
// `togetherness-gallery` bucket and DB RLS lets them CRUD the `gallery` table,
// while the public anon key stays read-only.
//
// We persist BOTH the public `url` (for <img>/next/image) and the storage `key`
// (as `storage_path`) so a later delete can remove the file from the bucket in
// the same breath as the row — no orphaned objects burning quota.

import { revalidatePath } from "next/cache";
import { createInsForgeServerClient } from "@/lib/insforge-server";

const BUCKET = "togetherness-gallery";
const MAX_BYTES = 8 * 1024 * 1024; // 8 MB ceiling for a gallery photo

export type GalleryFormState = { error: string | null; success: boolean };

export async function addGalleryPhotoAction(
  _prev: GalleryFormState,
  formData: FormData,
): Promise<GalleryFormState> {
  const file = formData.get("image");
  const caption = String(formData.get("caption") ?? "").trim();

  // FormData gives us a File only when the input actually carried bytes.
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Pilih sebuah file gambar dulu.", success: false };
  }
  if (!file.type.startsWith("image/")) {
    return { error: "File harus berupa gambar (jpg, png, webp…).", success: false };
  }
  if (file.size > MAX_BYTES) {
    return { error: "Gambar terlalu besar (maks 8 MB).", success: false };
  }
  if (caption.length > 300) {
    return { error: "Caption terlalu panjang (maks 300 karakter).", success: false };
  }

  const client = await createInsForgeServerClient();

  // Unique object key so two uploads of "foto.jpg" never collide.
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const objectKey = `gallery/${crypto.randomUUID()}.${ext}`;

  const { data: uploaded, error: uploadError } = await client.storage
    .from(BUCKET)
    .upload(objectKey, file);

  if (uploadError || !uploaded) {
    console.error("[gallery] upload failed:", uploadError);
    return {
      error: "Gagal mengunggah file. Pastikan sesi login masih aktif.",
      success: false,
    };
  }

  // Append to the end of the masonry: highest display_order + 1.
  const { data: last } = await client.database
    .from("gallery")
    .select("display_order")
    .order("display_order", { ascending: false })
    .limit(1);

  const nextOrder =
    ((last?.[0]?.display_order as number | undefined) ?? 0) + 1;

  const { error: insertError } = await client.database.from("gallery").insert([
    {
      image_url: uploaded.url,
      storage_path: uploaded.key,
      caption: caption || null,
      display_order: nextOrder,
    },
  ]);

  if (insertError) {
    console.error("[gallery] insert failed:", insertError);
    // Roll back the orphaned upload so a failed insert doesn't leave a file
    // sitting in the bucket with no row pointing at it.
    await client.storage.from(BUCKET).remove(uploaded.key);
    return {
      error: "Gagal menyimpan data foto. Coba lagi.",
      success: false,
    };
  }

  revalidatePath("/admin/gallery");
  revalidatePath("/");
  return { error: null, success: true };
}

export async function deleteGalleryPhotoAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const storagePath = String(formData.get("storage_path") ?? "");
  if (!id) return;

  const client = await createInsForgeServerClient();

  // Remove the file FIRST. If it fails we still delete the row below so the UI
  // doesn't keep showing a broken photo — a logged storage error is preferable
  // to a zombie record, and the bucket can be swept later if needed.
  if (storagePath) {
    const { error: removeError } = await client.storage
      .from(BUCKET)
      .remove(storagePath);
    if (removeError) {
      console.error("[gallery] storage remove failed:", removeError);
    }
  }

  const { error } = await client.database.from("gallery").delete().eq("id", id);
  if (error) {
    console.error("[gallery] delete failed:", error);
    return;
  }

  revalidatePath("/admin/gallery");
  revalidatePath("/");
}
