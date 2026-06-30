// Gallery CMS (Togetherness Gallery / F06) — upload + delete photos.
//
// Server Component. Reads through the cookie-bound admin client so the page
// renders the live, authenticated view of the `gallery` table. Uploads + deletes
// are delegated to the Server Actions in ./actions.ts. force-dynamic because the
// list changes as the admin manages photos. next/image is safe here — the
// InsForge Storage CDN hosts are whitelisted in next.config.ts.

import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { createInsForgeServerClient } from "@/lib/insforge-server";
import type { GalleryPhoto } from "@/lib/types";
import AddGalleryForm from "./AddGalleryForm";
import DeleteGalleryButton from "./DeleteGalleryButton";

export const dynamic = "force-dynamic";

async function getGalleryAdmin(): Promise<GalleryPhoto[]> {
  const client = await createInsForgeServerClient();
  const { data, error } = await client.database
    .from("gallery")
    .select()
    .order("display_order", { ascending: true });

  if (error) {
    console.error("[gallery] list failed:", error);
    return [];
  }
  return (data ?? []) as GalleryPhoto[];
}

export default async function GalleryPage() {
  const photos = await getGalleryAdmin();

  return (
    <div>
      {/* Page header */}
      <div className="mb-8 flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-deadpool-red text-canvas-black">
          <ImageIcon size={24} strokeWidth={2.5} />
        </span>
        <div>
          <h1 className="font-display text-3xl font-black tracking-tight text-deadpool-white">
            Galeri Kebersamaan
          </h1>
          <p className="mt-1 font-mono text-sm text-deadpool-white/60">
            Unggah & kelola foto yang tampil di galeri halaman depan
          </p>
        </div>
      </div>

      {/* Upload form */}
      <div className="mb-8">
        <AddGalleryForm />
      </div>

      {/* Grid */}
      <div className="rounded-xl border border-slate-border bg-card-dark shadow-comic">
        <div className="flex items-center justify-between border-b border-slate-border px-6 py-4">
          <h2 className="font-display text-lg font-black uppercase tracking-wide text-deadpool-white">
            Daftar Foto
          </h2>
          <span className="rounded-full border border-deadpool-red/40 bg-deadpool-red/10 px-3 py-1 font-mono text-xs text-deadpool-red">
            {photos.length} foto
          </span>
        </div>

        {photos.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="font-mono text-sm text-deadpool-white/40">
              {"// belum ada foto — unggah yang pertama di atas"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 p-6 sm:grid-cols-3 lg:grid-cols-4">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="group relative overflow-hidden rounded-lg border border-slate-border bg-canvas-black"
              >
                <div className="relative aspect-square">
                  <Image
                    src={photo.image_url}
                    alt={photo.caption ?? "Foto galeri"}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                    className="object-cover transition group-hover:scale-105"
                  />
                </div>

                {/* Delete sits top-right, always reachable */}
                <div className="absolute right-2 top-2">
                  <DeleteGalleryButton
                    id={photo.id}
                    storagePath={photo.storage_path}
                  />
                </div>

                {photo.caption && (
                  <p className="truncate px-3 py-2 font-mono text-xs text-deadpool-white/70">
                    {photo.caption}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
