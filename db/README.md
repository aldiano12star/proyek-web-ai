# Database setup (InsForge)

Run these once, in order, in the **InsForge SQL editor** (dashboard → SQL):

1. `01_schema.sql` — creates the 5 tables + triggers
2. `02_policies.sql` — turns ON Row-Level Security (public = read-only, admin = full CRUD)
3. `03_seed.sql` — fills starter content so the page isn't empty

## Other one-time console steps

- **Storage:** create a bucket named **`togetherness-gallery`** for photo uploads.
- **Auth:** in Auth settings, **disable public sign-up**, then create your admin
  account(s) by hand (e.g. the core officers). With signup off, the only
  logged-in users are admins — which is what the RLS policies assume.
- **Keys:** copy your project URL, anon key, admin key, and the OpenRouter key
  into `.env.local` (see `.env.example`).

## Verify RLS actually works

Test with the **anon key** (the console owner bypasses RLS, so testing there is misleading):

- A `SELECT` should succeed.
- An `INSERT` or `DELETE` should be **rejected**.

If a write succeeds with the anon key, RLS isn't enforced yet — re-check `02_policies.sql`.
