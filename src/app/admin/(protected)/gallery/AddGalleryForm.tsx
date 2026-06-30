"use client";

// "Upload photo" form for the Togetherness Gallery. Client Component for the
// useActionState lifecycle (pending spinner + error/success banner + reset) and
// a small live preview of the chosen file before it's sent. The actual upload +
// insert happens server-side in addGalleryPhotoAction.
//
// The preview is driven through refs (DOM), not React state, on purpose: the
// only place we need to clear it is the success effect, and effects may touch
// the DOM but must not call setState (react-hooks/set-state-in-effect). Keeping
// the preview out of state lets the reset stay a pure DOM operation.

import { useActionState, useEffect, useRef } from "react";
import { UploadCloud, ShieldAlert, CheckCircle2, ImageIcon } from "lucide-react";
import { addGalleryPhotoAction, type GalleryFormState } from "./actions";

const INITIAL: GalleryFormState = { error: null, success: false };

export default function AddGalleryForm() {
  const [state, formAction, pending] = useActionState(
    addGalleryPhotoAction,
    INITIAL,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const placeholderRef = useRef<HTMLSpanElement>(null);
  const objectUrlRef = useRef<string | null>(null);

  function clearPreview() {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    if (imgRef.current) {
      imgRef.current.removeAttribute("src");
      imgRef.current.classList.add("hidden");
    }
    placeholderRef.current?.classList.remove("hidden");
  }

  // After a successful upload: reset the inputs and drop the preview. DOM-only
  // work (no setState), which is the allowed shape for an effect.
  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      clearPreview();
    }
  }, [state.success]);

  // Revoke any lingering blob URL when the component unmounts.
  useEffect(() => () => clearPreview(), []);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);

    if (!file) {
      clearPreview();
      return;
    }

    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;
    if (imgRef.current) {
      imgRef.current.src = url;
      imgRef.current.classList.remove("hidden");
    }
    placeholderRef.current?.classList.add("hidden");
  }

  return (
    <form
      ref={formRef}
      action={formAction}
      className="rounded-xl border border-slate-border bg-card-dark p-6 shadow-comic"
    >
      <label className="font-mono text-xs uppercase tracking-widest text-deadpool-white/50">
        Unggah Foto Baru
      </label>

      <div className="mt-3 flex flex-col gap-4 sm:flex-row">
        {/* Preview tile (img toggled via refs) */}
        <div className="flex h-32 w-full shrink-0 items-center justify-center overflow-hidden rounded-lg border border-dashed border-slate-border bg-canvas-black sm:w-44">
          {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview, not a remote asset */}
          <img
            ref={imgRef}
            alt="Pratinjau"
            className="hidden h-full w-full object-cover"
          />
          <span ref={placeholderRef}>
            <ImageIcon size={28} className="text-deadpool-white/20" />
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-3">
          <input
            type="file"
            name="image"
            accept="image/*"
            required
            onChange={onFileChange}
            className="block w-full cursor-pointer rounded-lg border border-slate-border bg-canvas-black text-sm text-deadpool-white/70 outline-none transition file:mr-4 file:cursor-pointer file:border-0 file:bg-deadpool-red file:px-4 file:py-3 file:font-display file:font-black file:uppercase file:tracking-wide file:text-canvas-black hover:file:bg-deadpool-red/90 focus:border-deadpool-red"
          />
          <input
            type="text"
            name="caption"
            maxLength={300}
            placeholder="Caption (opsional) — mis. Buka bersama 2024"
            className="w-full rounded-lg border border-slate-border bg-canvas-black px-4 py-3 text-deadpool-white outline-none transition placeholder:text-deadpool-white/25 focus:border-deadpool-red"
          />
          <button
            type="submit"
            disabled={pending}
            className="flex items-center justify-center gap-2 rounded-lg border border-deadpool-red bg-deadpool-red px-5 py-3 font-display font-black uppercase tracking-wide text-canvas-black transition hover:-translate-y-0.5 hover:shadow-comic disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none"
          >
            <UploadCloud size={18} strokeWidth={2.5} />
            {pending ? "Mengunggah…" : "Unggah Foto"}
          </button>
        </div>
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
          Foto berhasil diunggah!
        </p>
      )}
    </form>
  );
}
