"use client";

// Edit form for a single fixed division (F03). Client Component for the
// useActionState lifecycle (pending + scoped banner) and a live preview of the
// colour palette swatches. Name + icon are read-only (fixed); description,
// sub_description, and color_palette are editable. The id rides in a hidden
// input; updateDivisionAction validates everything server-side.

import { useActionState, useState } from "react";
import { Save, ShieldAlert, CheckCircle2 } from "lucide-react";
import { updateDivisionAction, type DivisionFormState } from "./actions";
import { divisionIcon } from "@/lib/icons";
import type { Division } from "@/lib/types";

const INITIAL: DivisionFormState = { id: null, error: null, success: false };
const HEX = /^#[0-9a-fA-F]{3,8}$/;

function swatches(palette: string) {
  return palette
    .split(",")
    .map((c) => c.trim())
    .filter((c) => HEX.test(c));
}

export default function EditDivisionForm({
  division,
  index,
}: {
  division: Division;
  index: number;
}) {
  const [state, formAction, pending] = useActionState(
    updateDivisionAction,
    INITIAL,
  );

  const [description, setDescription] = useState(division.description);
  const [subDescription, setSubDescription] = useState(division.sub_description);
  const [colorPalette, setColorPalette] = useState(division.color_palette);

  const dirty =
    description.trim() !== division.description.trim() ||
    subDescription.trim() !== division.sub_description.trim() ||
    colorPalette.trim() !== division.color_palette.trim();

  const showError = state.error && state.id === division.id;
  const showSuccess = state.success && state.id === division.id && !dirty;

  const Icon = divisionIcon(division.icon_name);
  const accent = swatches(colorPalette)[0] ?? "#E23636";

  return (
    <form
      action={formAction}
      className="rounded-xl border border-slate-border bg-card-dark p-6 shadow-comic"
    >
      <input type="hidden" name="id" value={division.id} />

      {/* Header: index + icon (accent-tinted) + fixed name */}
      <div className="mb-4 flex items-center gap-3">
        <span className="font-display text-lg font-black text-deadpool-red/60 tabular-nums">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-border"
          style={{ color: accent }}
        >
          <Icon size={18} strokeWidth={2.2} />
        </span>
        <h3 className="font-display text-lg font-black uppercase tracking-wide text-deadpool-white">
          {division.name}
        </h3>
      </div>

      <div className="space-y-4">
        {/* Description */}
        <div>
          <label
            htmlFor={`desc-${division.id}`}
            className="font-mono text-xs uppercase tracking-widest text-deadpool-white/50"
          >
            Deskripsi
          </label>
          <textarea
            id={`desc-${division.id}`}
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            maxLength={2000}
            rows={2}
            className="mt-2 w-full resize-y rounded-lg border border-slate-border bg-canvas-black px-4 py-3 text-deadpool-white outline-none transition placeholder:text-deadpool-white/25 focus:border-deadpool-red"
          />
        </div>

        {/* Sub-description (revealed on hover on the public card) */}
        <div>
          <label
            htmlFor={`sub-${division.id}`}
            className="font-mono text-xs uppercase tracking-widest text-deadpool-white/50"
          >
            Sub-deskripsi
          </label>
          <textarea
            id={`sub-${division.id}`}
            name="sub_description"
            value={subDescription}
            onChange={(e) => setSubDescription(e.target.value)}
            required
            maxLength={2000}
            rows={2}
            className="mt-2 w-full resize-y rounded-lg border border-slate-border bg-canvas-black px-4 py-3 text-deadpool-white outline-none transition placeholder:text-deadpool-white/25 focus:border-deadpool-red"
          />
        </div>

        {/* Color palette */}
        <div>
          <label
            htmlFor={`palette-${division.id}`}
            className="font-mono text-xs uppercase tracking-widest text-deadpool-white/50"
          >
            Palet Warna (hex, pisahkan dengan koma)
          </label>
          <p className="mt-1 font-mono text-xs text-deadpool-white/30">
            {"// warna pertama dipakai sebagai aksen kartu"}
          </p>
          <div className="mt-2 flex items-center gap-3">
            <input
              id={`palette-${division.id}`}
              name="color_palette"
              type="text"
              value={colorPalette}
              onChange={(e) => setColorPalette(e.target.value)}
              required
              maxLength={255}
              placeholder="#E23636,#1C1C1E,#FAFAFA"
              className="flex-1 rounded-lg border border-slate-border bg-canvas-black px-4 py-3 font-mono text-sm text-deadpool-white outline-none transition placeholder:text-deadpool-white/25 focus:border-deadpool-red"
            />
            <div className="flex shrink-0 gap-1.5">
              {swatches(colorPalette).map((c, i) => (
                <span
                  key={`${c}-${i}`}
                  title={c}
                  className="h-8 w-8 rounded-md border border-slate-border"
                  style={{ background: c }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
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
