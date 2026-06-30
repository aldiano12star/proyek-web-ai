"use client";

// "Add achievement" form. Client Component for the useActionState lifecycle
// (pending spinner + error banner + success reset). The actual insert happens
// in the addAchievementAction Server Action.

import { useActionState, useEffect, useRef } from "react";
import { Plus, ShieldAlert, CheckCircle2 } from "lucide-react";
import { addAchievementAction, type AchievementFormState } from "./actions";

const INITIAL: AchievementFormState = { error: null, success: false };

export default function AddAchievementForm() {
  const [state, formAction, pending] = useActionState(
    addAchievementAction,
    INITIAL,
  );
  const formRef = useRef<HTMLFormElement>(null);

  // Clear the input after a successful insert so the admin can keep adding.
  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state.success]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="rounded-xl border border-slate-border bg-card-dark p-6 shadow-comic"
    >
      <label
        htmlFor="title"
        className="font-mono text-xs uppercase tracking-widest text-deadpool-white/50"
      >
        Tambah Prestasi Baru
      </label>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
        <input
          id="title"
          name="title"
          type="text"
          required
          maxLength={300}
          placeholder="Juara I FLSSN Fotografi Nasional 2024"
          className="flex-1 rounded-lg border border-slate-border bg-canvas-black px-4 py-3 text-deadpool-white outline-none transition placeholder:text-deadpool-white/25 focus:border-deadpool-red"
        />
        <button
          type="submit"
          disabled={pending}
          className="flex items-center justify-center gap-2 rounded-lg border border-deadpool-red bg-deadpool-red px-5 py-3 font-display font-black uppercase tracking-wide text-canvas-black transition hover:-translate-y-0.5 hover:shadow-comic disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none"
        >
          <Plus size={18} strokeWidth={3} />
          {pending ? "Menyimpan…" : "Tambah"}
        </button>
      </div>

      {state.error && (
        <p
          role="alert"
          className="mt-3 flex items-center gap-2 rounded-lg border border-deadpool-red/40 bg-deadpool-red/10 px-3 py-2.5 text-sm text-deadpool-white"
        >
          <ShieldAlert size={16} className="shrink-0 text-deadpool-red" />
          {state.error}
        </p>
      )}

      {state.success && (
        <p className="mt-3 flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2.5 text-sm text-emerald-300">
          <CheckCircle2 size={16} className="shrink-0" />
          Prestasi berhasil ditambahkan!
        </p>
      )}
    </form>
  );
}
