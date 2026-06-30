-- Saba Exploit OPREC — Database schema
-- Run this FIRST in the InsForge SQL editor.
-- Notes vs. the original blueprint:
--   * TIMESTAMPTZ (timezone-aware) instead of TIMESTAMP
--   * display_order columns so admins can control ordering
--   * gallery.storage_path so deletes can remove the file too (no orphans)
--   * site_content table so hero/About copy is editable from the CMS

create extension if not exists pgcrypto;  -- provides gen_random_uuid()

-- 5 functional divisions (Photography, Design, Programming, Technopreneurship, Cinematography)
create table if not exists divisions (
  id              uuid primary key default gen_random_uuid(),
  name            varchar(100) not null,
  description     text not null,
  sub_description text not null,
  icon_name       varchar(50) not null,            -- lucide-react icon name, e.g. "Camera"
  color_palette   varchar(255) not null,           -- comma-separated hex colors
  display_order   int not null default 0
);

-- 10 work programs (proker)
create table if not exists programs (
  id            uuid primary key default gen_random_uuid(),
  name          varchar(100) not null unique,
  description   text not null,
  display_order int not null default 0,
  updated_at    timestamptz not null default now()
);

-- Hall of Fame entries (marquee)
create table if not exists achievements (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  display_order int not null default 0,
  created_at    timestamptz not null default now()
);

-- Togetherness gallery photos
create table if not exists gallery (
  id            uuid primary key default gen_random_uuid(),
  image_url     text not null,            -- public CDN URL from InsForge Storage
  storage_path  text not null,            -- object path inside the bucket (for deletion)
  caption       text,
  display_order int not null default 0,
  created_at    timestamptz not null default now()
);

-- Editable site copy (hero + about), keyed by a stable string
create table if not exists site_content (
  key        text primary key,
  value      text not null,
  updated_at timestamptz not null default now()
);

-- Keep updated_at fresh on row updates
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists programs_set_updated_at on programs;
create trigger programs_set_updated_at
  before update on programs
  for each row execute function set_updated_at();

drop trigger if exists site_content_set_updated_at on site_content;
create trigger site_content_set_updated_at
  before update on site_content
  for each row execute function set_updated_at();
