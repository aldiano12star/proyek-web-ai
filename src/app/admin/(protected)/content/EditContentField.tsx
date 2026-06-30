"use client";

// Editor for one site_content field. Client Component for the useActionState
// lifecycle: pending spinner on Save + a scoped success/error banner. Renders a
// large textarea for body copy (multiline) or a single-line input otherwise.
// The key rides along in a hidden input; updateContentAction validates it
// against the allowlist server-side.

import { useActionState, useState } from "react";
import { Save, ShieldAlert, CheckCircle2 } from "lucide-react";
import {
  updateContentAction,
  type ContentFormState,
  type ContentKey,
} from "./actions";

const INITIAL: ContentFormState = { key: null, error: null, success: false };

export default function EditContentField({
  contentKey,
  label,
  hint,
  initialValue,
  multiline = false,
}: {
  contentKey: ContentKey;
  label: string;
  hint?: string;
  initialValue: string;
  multiline?: boolean;
}) {
  const [state, formAction, pending] = useActionState(
    updateContentAction,
    INITIAL,
  );

  // Save only lights up when the text actually changed — avoids pointless
  // writes and signals "unsaved changes" to the admin.
  const [value, setValue] = useState(initialValue);
  const dirty = value.trim() !== initialValue.trim();

  // Banner belongs to THIS field only when the action's returned key matches.
  const showError = state.error && state.key === contentKey;
  const showSuccess = state.success && state.key === contentKey && !dirty;

  return (
    <form
      action={formAction}
      className="rounded-xl border border-slate-border bg-card-dark p-6 shadow-comic"
    >
      <input type="hidden" name="key" value={contentKey} />

      <label
        htmlFor={`field-${contentKey}`}
        className="font-mono text-xs uppercase tracking-widest text-deadpool-white/50"
      >
        {label}
      </label>
      {hint && (
        <p className="mt-1 font-mono text-xs text-deadpool-white/30">{hint}</p>
      )}

      {multiline ? (
        <textarea
          id={`field-${contentKey}`}
          name="value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required
          maxLength={2000}
          rows={5}
          className="mt-3 w-full resize-y rounded-lg border border-slate-border bg-canvas-black px-4 py-3 text-deadpool-white outline-none transition placeholder:text-deadpool-white/25 focus:border-deadpool-red"
        />
      ) : (
        <input
          id={`field-${contentKey}`}
          name="value"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required
          maxLength={2000}
          className="mt-3 w-full rounded-lg border border-slate-border bg-canvas-black px-4 py-3 text-deadpool-white outline-none transition placeholder:text-deadpool-white/25 focus:border-deadpool-red"
        />
      )}

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
