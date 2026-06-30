"use client";

// Delete control for a single achievement row. Client Component so it can
// confirm before destroying data and show a pending state via useFormStatus.
// The id rides along in a hidden input; the deleteAchievementAction reads it.

import { useFormStatus } from "react-dom";
import { Trash2, Loader2 } from "lucide-react";
import { deleteAchievementAction } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-label="Hapus prestasi"
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-border text-deadpool-white/50 transition hover:border-deadpool-red hover:bg-deadpool-red/10 hover:text-deadpool-red disabled:opacity-50"
    >
      {pending ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <Trash2 size={16} />
      )}
    </button>
  );
}

export default function DeleteAchievementButton({ id }: { id: string }) {
  return (
    <form
      action={deleteAchievementAction}
      onSubmit={(e) => {
        if (!confirm("Hapus prestasi ini? Tindakan ini permanen.")) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <SubmitButton />
    </form>
  );
}
