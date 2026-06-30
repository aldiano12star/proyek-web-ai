// Server-side InsForge client for the admin face (SSR auth).
//
// Distinct from `src/lib/insforge.ts`: that one is the public anon client for
// reading landing-page data. This one is the cookie-bound SSR client from
// `@insforge/sdk/ssr` — it reads the `insforge_access_token` cookie and sends it
// as the per-request bearer token, so calls run AS the logged-in admin and RLS
// grants them write access. Use it in Server Components, Route Handlers, and
// Server Actions only (it imports next/headers, which throws on the client).

import { cookies } from "next/headers";
import { createServerClient } from "@insforge/sdk/ssr";

export async function createInsForgeServerClient() {
  return createServerClient({ cookies: await cookies() });
}

// The real JWT check (the proxy's cookie-presence gate is only a first pass).
// Returns the signed-in admin user, or null if there's no valid session — the
// admin layout and Server Actions call this before trusting a request.
export async function getSessionUser() {
  const client = await createInsForgeServerClient();
  const { data, error } = await client.auth.getCurrentUser();
  if (error) return null;
  return data?.user ?? null;
}
