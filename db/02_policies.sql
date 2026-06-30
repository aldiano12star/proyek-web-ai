-- Saba Exploit OPREC — Row-Level Security (RLS)
-- Run this SECOND, after 01_schema.sql.
--
-- WHY: InsForge ships with RLS OFF, so the public anon key can read AND
-- write/delete every table by default. These policies lock that down:
--   * anon (public visitors)      -> SELECT only
--   * authenticated (admin login) -> full CRUD
--
-- This relies on "fixed admin accounts, public signup OFF" (set in the
-- InsForge Auth settings). With signup disabled, the ONLY authenticated
-- users are the admins you create by hand, so authenticated = admin.

-- Enable RLS on every table
alter table divisions    enable row level security;
alter table programs     enable row level security;
alter table achievements enable row level security;
alter table gallery      enable row level security;
alter table site_content enable row level security;

-- ---- Public read (anon + authenticated can SELECT) ----
create policy "public read divisions"    on divisions    for select to anon, authenticated using (true);
create policy "public read programs"      on programs     for select to anon, authenticated using (true);
create policy "public read achievements"  on achievements for select to anon, authenticated using (true);
create policy "public read gallery"       on gallery      for select to anon, authenticated using (true);
create policy "public read site_content"  on site_content for select to anon, authenticated using (true);

-- ---- Admin write (authenticated only: insert/update/delete) ----
create policy "admin write divisions"     on divisions    for all to authenticated using (true) with check (true);
create policy "admin write programs"       on programs     for all to authenticated using (true) with check (true);
create policy "admin write achievements"   on achievements for all to authenticated using (true) with check (true);
create policy "admin write gallery"        on gallery      for all to authenticated using (true) with check (true);
create policy "admin write site_content"   on site_content for all to authenticated using (true) with check (true);

-- After running, VERIFY with the anon key (not the console owner, which bypasses RLS):
--   SELECT should succeed; INSERT/DELETE should be rejected.
