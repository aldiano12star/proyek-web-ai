"use client";

// Edit form for a single fixed program (proker). Client Component for the
// useActionState lifecycle: pending spinner on the Save button + a scoped
// success/error banner. The program name is fixed (read-only label); only the
// description textarea is editable. The id rides along in a hidden input.

import { useActionState, useState } from "react";
import { Save, ShieldAlert, CheckCircle2 } from "lucide-react";
import { updateProgramAction, type ProgramFormState } from "./actions";
import type { Program } from "@/lib/types";

const INITIAL: ProgramFormState = { id: null, error: null, success: false };

export default function EditProgramForm({
  program,
  index,
}: {
  program: Program;
  index: number;
}) {
  const [state, formAction, pending] = useActionState(
    updateProgramAction,
    INITIAL,
  );

  // Track edits so Save only lights up when the text actually changed — avoids
  // pointless writes and gives the admin a clear "unsaved changes" signal.
  const [value, setValue] = useState(program.description);
  const dirty = value.trim() !== program.description.trim();

  // The banner belongs to THIS card only when the action's returned id matches.
  const showError = state.error && state.id === program.id;
  const showSuccess = state.success && state.id === program.id && !dirty;

  return (
    <form
      action={formAction}
      className="rounded-xl border border-slate-border bg-card-dark p-6 shadow-comic"
    >
      <input type="hidden" name="id" value={program.id} />

      <div className="mb-3 flex items-center gap-3">
        <span className="font-display text-lg font-black text-deadpool-red/60 tabular-nums">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="font-display text-lg font-black uppercase tracking-wide text-deadpool-white">
          {program.name}
        </h3>
      </div>

      <label htmlFor={`desc-${program.id}`} className="sr-only">
        Deskripsi untuk {program.name}
      </label>
      <textarea
        id={`desc-${program.id}`}
        name="description"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        required
        maxLength={2000}
        rows={4}
        placeholder="Tuliskan deskripsi program kerja ini…"
        className="w-full resize-y rounded-lg border border-slate-border bg-canvas-black px-4 py-3 text-deadpool-white outline-none transition placeholder:text-deadpool-white/25 focus:border-deadpool-red"
      />

      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          {showError && (
            <p
              role="alert"
              className="flex items-center gap-2 text-sm text-deadpool-white"
            >
              <ShieldAlert size={16} className="shrink-0 text-deadpool-red" />
              {state.error}
            </p>
          )}
          {showSuccess && (
            <p className="flex items-center gap-2 text-sm text-emerald-300">
              <CheckCircle2 size={16} className="shrink-0" />
              Tersimpan!
            </p>
          )}
          {dirty && !pending && (
            <p className="font-mono text-xs text-deadpool-white/40">
              {"// ada perubahan belum disimpan"}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={pending || !dirty}
          className="flex shrink-0 items-center justify-center gap-2 rounded-lg border border-deadpool-red bg-deadpool-red px-5 py-2.5 font-display font-black uppercase tracking-wide text-canvas-black transition hover:-translate-y-0.5 hover:shadow-comic disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
        >
          <Save size={18} strokeWidth={2.5} />
          {pending ? "Menyimpan…" : "Simpan"}
        </button>
      </div>
    </form>
  );
}
