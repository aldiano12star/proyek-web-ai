"use client";

// Delete control for a single gallery photo. Client Component so it can confirm
// before destroying data and show a pending state via useFormStatus. Both the
// row id AND the storage_path ride along in hidden inputs so the Server Action
// can remove the Storage object alongside the DB row — no orphaned files.

import { useFormStatus } from "react-dom";
import { Trash2, Loader2 } from "lucide-react";
import { deleteGalleryPhotoAction } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-label="Hapus foto"
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-border bg-canvas-black/70 text-deadpool-white/70 backdrop-blur transition hover:border-deadpool-red hover:bg-deadpool-red hover:text-canvas-black disabled:opacity-50"
    >
      {pending ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <Trash2 size={16} />
      )}
    </button>
  );
}

export default function DeleteGalleryButton({
  id,
  storagePath,
}: {
  id: string;
  storagePath: string;
}) {
  return (
    <form
      action={deleteGalleryPhotoAction}
      onSubmit={(e) => {
        if (!confirm("Hapus foto ini? File juga akan dihapus permanen.")) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="storage_path" value={storagePath} />
      <SubmitButton />
    </form>
  );
}
