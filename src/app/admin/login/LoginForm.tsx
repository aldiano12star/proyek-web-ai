"use client";

// The Deadpool-themed login card. Client Component because it drives the form
// with useActionState (pending + error states). The actual auth happens in the
// signInAction Server Action — this component never touches tokens or cookies.

import { useActionState } from "react";
import { Lock, ShieldAlert } from "lucide-react";
import { signInAction, type LoginState } from "./actions";

const INITIAL: LoginState = { error: null };

export default function LoginForm({ redirectTo }: { redirectTo: string }) {
  const [state, formAction, pending] = useActionState(signInAction, INITIAL);

  return (
    <main className="flex min-h-dvh items-center justify-center bg-canvas-black px-5 py-16">
      <div className="w-full max-w-md">
        {/* Eyebrow — fourth-wall, on-brand */}
        <p className="mb-3 text-center font-mono text-xs uppercase tracking-widest text-deadpool-red">
          {"// restricted area — markas only"}
        </p>

        <form
          action={formAction}
          className="relative overflow-hidden rounded-xl border border-slate-border bg-card-dark p-7 shadow-comic sm:p-9"
        >
          <span
            aria-hidden
            className="absolute inset-x-0 top-0 h-1 bg-deadpool-red"
          />

          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-deadpool-red bg-deadpool-red/10 text-deadpool-red">
              <Lock size={20} strokeWidth={2.5} />
            </span>
            <div>
              <h1 className="font-display text-2xl font-black tracking-tight text-deadpool-white">
                ADMIN LOGIN
              </h1>
              <p className="font-mono text-xs text-deadpool-white/40">
                Sapa Exploit CMS
              </p>
            </div>
          </div>

          {/* Carry the post-login destination through the form. */}
          <input type="hidden" name="redirect" value={redirectTo} />

          <div className="mt-7 flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="font-mono text-xs uppercase tracking-widest text-deadpool-white/50">
                Email
              </span>
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="pengurus@sabaexploit.id"
                className="rounded-lg border border-slate-border bg-canvas-black px-4 py-3 text-deadpool-white outline-none transition placeholder:text-deadpool-white/25 focus:border-deadpool-red"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="font-mono text-xs uppercase tracking-widest text-deadpool-white/50">
                Password
              </span>
              <input
                type="password"
                name="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="rounded-lg border border-slate-border bg-canvas-black px-4 py-3 text-deadpool-white outline-none transition placeholder:text-deadpool-white/25 focus:border-deadpool-red"
              />
            </label>
          </div>

          {/* Error banner — only when the action returns one. */}
          {state.error && (
            <p
              role="alert"
              className="mt-4 flex items-center gap-2 rounded-lg border border-deadpool-red/40 bg-deadpool-red/10 px-3 py-2.5 text-sm text-deadpool-white"
            >
              <ShieldAlert size={16} className="shrink-0 text-deadpool-red" />
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="mt-6 w-full rounded-lg border border-deadpool-red bg-deadpool-red px-4 py-3 font-display text-base font-black uppercase tracking-wide text-canvas-black transition hover:-translate-y-0.5 hover:shadow-comic disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none"
          >
            {pending ? "Memverifikasi…" : "Masuk Markas"}
          </button>
        </form>

        <p className="mt-5 text-center font-mono text-xs text-deadpool-white/30">
          {"// akses hanya untuk pengurus terdaftar"}
        </p>
      </div>
    </main>
  );
}
