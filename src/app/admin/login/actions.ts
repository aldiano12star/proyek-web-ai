"use server";

// Sign-in Server Action. Auth mutations must run on the server so the httpOnly
// refresh cookie can be written — never call signInWithPassword from a Client
// Component. `createAuthActions` wraps the SSR server client and writes both the
// access + refresh cookies on success.

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createAuthActions } from "@insforge/sdk/ssr";

export type LoginState = { error: string | null };

// Only ever bounce back to an internal admin path — never an attacker-supplied
// absolute URL smuggled through ?redirect=.
function safeRedirect(target: FormDataEntryValue | null): string {
  const path = typeof target === "string" ? target : "";
  return path.startsWith("/admin") && !path.startsWith("//")
    ? path
    : "/admin/dashboard";
}

export async function signInAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  const auth = createAuthActions({ cookies: await cookies() });
  const { data, error } = await auth.signInWithPassword({ email, password });

  if (error || !data?.user) {
    // 403 from InsForge means the account exists but isn't email-verified.
    const message =
      error?.statusCode === 403
        ? "Akun belum terverifikasi. Cek email verifikasimu dulu."
        : (error?.message ?? "Login gagal. Periksa email dan password.");
    return { error: message };
  }

  // Success: cookies are set. redirect() throws NEXT_REDIRECT (by design) so it
  // must live outside any try/catch — the function never returns past here.
  redirect(safeRedirect(formData.get("redirect")));
}
