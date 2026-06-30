"use server";

// Shared admin Server Actions. Sign-out clears the InsForge auth cookies and
// redirects to the login page.

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createAuthActions } from "@insforge/sdk/ssr";

export async function signOutAction() {
  const auth = createAuthActions({ cookies: await cookies() });
  await auth.signOut();
  redirect("/admin/login");
}
