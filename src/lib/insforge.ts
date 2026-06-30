import { createClient } from "@insforge/sdk";

// Public, read-only client (anon key). Safe to use in Server Components and the
// browser — RLS restricts the anon role to SELECT only.
//
// Admin writes do NOT use this client; they go through server-side helpers that
// run with the logged-in admin's session (see Phase 4). Never perform mutations
// with the anon client.
const baseUrl = process.env.NEXT_PUBLIC_INSFORGE_URL ?? "";
const anonKey = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY ?? "";

export const insforge = createClient({ baseUrl, anonKey });
