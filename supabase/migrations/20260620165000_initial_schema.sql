-- Personal website Supabase schema foundation.
-- Step 29 creates the backend schema only. The frontend data layer is not connected yet.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade unique not null,
  email text,
  display_name text,
  role text not null default 'editor' check (role in ('owner', 'admin', 'editor')),
  status text not null default 'invited' check (status in ('active', 'invited', 'disabled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.admin_users is 'Supabase Auth users allowed to manage personal website content in future admin steps.';

create or replace function public.is_site_admin()
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select exists (
    select 1
    from public.admin_users admin_user
    where admin_user.user_id = auth.uid()
      and admin_user.status = 'active'
      and admin_user.role in ('owner', 'admin', 'editor')
  );
$$;

create or replace function public.is_site_owner_or_admin()
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select exists (
    select 1
    from public.admin_users admin_user
    where admin_user.user_id = auth.uid()
      and admin_user.status = 'active'
      and admin_user.role in ('owner', 'admin')
  );
$$;

revoke all on function public.is_site_admin() from public;
revoke all on function public.is_site_owner_or_admin() from public;
grant execute on function public.is_site_admin() to authenticated, service_role;
grant execute on function public.is_site_owner_or_admin() to authenticated, service_role;

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value jsonb not null default '{}'::jsonb,
  is_public boolean not null default false,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.social_links (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  href text not null,
  type text,
  status text not null default 'needs_review' check (status in ('verified', 'needs_review', 'unavailable')),
  is_public boolean not null default true,
  is_primary boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  short_title text,
  eyebrow text,
  summary text not null,
  description text,
  category text,
  type text,
  status text not null default 'draft',
  priority text,
  visibility text not null default 'draft' check (visibility in ('published', 'draft', 'hidden')),
  featured boolean not null default false,
  featured_rank integer,
  order_index integer not null default 0,
  randomizer_eligible boolean not null default false,
  randomizer_bucket text,
  randomizer_weight integer not null default 1 check (randomizer_weight >= 0),
  tags text[] not null default '{}'::text[],
  stack text[] not null default '{}'::text[],
  highlights text[] not null default '{}'::text[],
  problem text,
  solution text,
  what_it_proves text,
  timeline_label text,
  started_at date,
  shipped_at date,
  updated_label text,
  notes text,
  attribution_notes text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

create table if not exists public.project_links (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  label text not null,
  href text not null,
  type text,
  status text not null default 'needs_review' check (status in ('verified', 'needs_review', 'unavailable')),
  is_primary boolean not null default false,
  external boolean not null default true,
  note text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_media (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  type text,
  src text,
  alt text,
  theme text not null default 'both' check (theme in ('dark', 'light', 'both')),
  status text not null default 'missing' check (status in ('ready', 'missing', 'needs_review')),
  note text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint project_media_ready_requires_src check (status <> 'ready' or src is not null)
);

create table if not exists public.project_detail_sections (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  section_key text not null,
  title text not null,
  body text,
  items jsonb not null default '[]'::jsonb,
  sort_order integer not null default 0,
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_randomizer_settings (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  mode text,
  button_behavior text,
  settings jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_randomizer_items (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  bucket text,
  weight integer not null default 1 check (weight >= 0),
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, bucket)
);

create table if not exists public.content_pages (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  page_type text,
  status text not null default 'draft' check (status in ('published', 'draft', 'hidden')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

create table if not exists public.content_blocks (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.content_pages(id) on delete cascade,
  block_key text not null,
  block_type text not null,
  eyebrow text,
  title text,
  body text,
  data jsonb not null default '{}'::jsonb,
  source_label text,
  status text not null default 'draft' check (status in ('published', 'draft', 'hidden', 'needs_review')),
  sort_order integer not null default 0,
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (page_id, block_key)
);

create table if not exists public.tracker_status_cards (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  value text,
  description text,
  source_label text not null,
  status text,
  tone text,
  sort_order integer not null default 0,
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tracker_focus_areas (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  status text,
  source_label text,
  tags text[] not null default '{}'::text[],
  sort_order integer not null default 0,
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tracker_operating_pillars (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  status text,
  sort_order integer not null default 0,
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tracker_roadmap_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  status text,
  source_label text,
  sort_order integer not null default 0,
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  submission_type text not null default 'general' check (submission_type in ('contact', 'services', 'collaborate', 'general')),
  status text not null default 'new' check (status in ('new', 'reviewed', 'archived', 'spam')),
  name text,
  email text,
  subject text,
  message text,
  company text,
  website text,
  source_path text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.content_audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references auth.users(id) on delete set null,
  action text not null,
  table_name text not null,
  record_id uuid,
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz not null default now()
);

create index if not exists admin_users_user_id_idx on public.admin_users(user_id);
create index if not exists admin_users_status_role_idx on public.admin_users(status, role);
create index if not exists site_settings_public_idx on public.site_settings(is_public, key);
create index if not exists social_links_public_status_idx on public.social_links(is_public, status, sort_order);
create index if not exists projects_visibility_slug_idx on public.projects(visibility, slug);
create index if not exists projects_featured_idx on public.projects(visibility, featured, featured_rank);
create index if not exists projects_randomizer_idx on public.projects(visibility, randomizer_eligible, randomizer_bucket);
create index if not exists project_links_project_id_idx on public.project_links(project_id);
create index if not exists project_links_status_idx on public.project_links(status, sort_order);
create index if not exists project_media_project_id_idx on public.project_media(project_id);
create index if not exists project_detail_sections_project_id_idx on public.project_detail_sections(project_id, sort_order);
create index if not exists project_randomizer_items_project_id_idx on public.project_randomizer_items(project_id);
create index if not exists content_pages_status_slug_idx on public.content_pages(status, slug);
create index if not exists content_blocks_page_status_idx on public.content_blocks(page_id, status, is_public, sort_order);
create index if not exists tracker_status_cards_public_idx on public.tracker_status_cards(is_public, sort_order);
create index if not exists tracker_focus_areas_public_idx on public.tracker_focus_areas(is_public, sort_order);
create index if not exists tracker_operating_pillars_public_idx on public.tracker_operating_pillars(is_public, sort_order);
create index if not exists tracker_roadmap_items_public_idx on public.tracker_roadmap_items(is_public, sort_order);
create index if not exists submissions_status_type_idx on public.submissions(status, submission_type, created_at);
create index if not exists content_audit_log_table_record_idx on public.content_audit_log(table_name, record_id, created_at);
create index if not exists content_audit_log_actor_idx on public.content_audit_log(actor_user_id, created_at);

drop trigger if exists set_admin_users_updated_at on public.admin_users;
create trigger set_admin_users_updated_at before update on public.admin_users for each row execute function public.set_updated_at();

drop trigger if exists set_site_settings_updated_at on public.site_settings;
create trigger set_site_settings_updated_at before update on public.site_settings for each row execute function public.set_updated_at();

drop trigger if exists set_social_links_updated_at on public.social_links;
create trigger set_social_links_updated_at before update on public.social_links for each row execute function public.set_updated_at();

drop trigger if exists set_projects_updated_at on public.projects;
create trigger set_projects_updated_at before update on public.projects for each row execute function public.set_updated_at();

drop trigger if exists set_project_links_updated_at on public.project_links;
create trigger set_project_links_updated_at before update on public.project_links for each row execute function public.set_updated_at();

drop trigger if exists set_project_media_updated_at on public.project_media;
create trigger set_project_media_updated_at before update on public.project_media for each row execute function public.set_updated_at();

drop trigger if exists set_project_detail_sections_updated_at on public.project_detail_sections;
create trigger set_project_detail_sections_updated_at before update on public.project_detail_sections for each row execute function public.set_updated_at();

drop trigger if exists set_project_randomizer_settings_updated_at on public.project_randomizer_settings;
create trigger set_project_randomizer_settings_updated_at before update on public.project_randomizer_settings for each row execute function public.set_updated_at();

drop trigger if exists set_project_randomizer_items_updated_at on public.project_randomizer_items;
create trigger set_project_randomizer_items_updated_at before update on public.project_randomizer_items for each row execute function public.set_updated_at();

drop trigger if exists set_content_pages_updated_at on public.content_pages;
create trigger set_content_pages_updated_at before update on public.content_pages for each row execute function public.set_updated_at();

drop trigger if exists set_content_blocks_updated_at on public.content_blocks;
create trigger set_content_blocks_updated_at before update on public.content_blocks for each row execute function public.set_updated_at();

drop trigger if exists set_tracker_status_cards_updated_at on public.tracker_status_cards;
create trigger set_tracker_status_cards_updated_at before update on public.tracker_status_cards for each row execute function public.set_updated_at();

drop trigger if exists set_tracker_focus_areas_updated_at on public.tracker_focus_areas;
create trigger set_tracker_focus_areas_updated_at before update on public.tracker_focus_areas for each row execute function public.set_updated_at();

drop trigger if exists set_tracker_operating_pillars_updated_at on public.tracker_operating_pillars;
create trigger set_tracker_operating_pillars_updated_at before update on public.tracker_operating_pillars for each row execute function public.set_updated_at();

drop trigger if exists set_tracker_roadmap_items_updated_at on public.tracker_roadmap_items;
create trigger set_tracker_roadmap_items_updated_at before update on public.tracker_roadmap_items for each row execute function public.set_updated_at();

drop trigger if exists set_submissions_updated_at on public.submissions;
create trigger set_submissions_updated_at before update on public.submissions for each row execute function public.set_updated_at();

alter table public.admin_users enable row level security;
alter table public.site_settings enable row level security;
alter table public.social_links enable row level security;
alter table public.projects enable row level security;
alter table public.project_links enable row level security;
alter table public.project_media enable row level security;
alter table public.project_detail_sections enable row level security;
alter table public.project_randomizer_settings enable row level security;
alter table public.project_randomizer_items enable row level security;
alter table public.content_pages enable row level security;
alter table public.content_blocks enable row level security;
alter table public.tracker_status_cards enable row level security;
alter table public.tracker_focus_areas enable row level security;
alter table public.tracker_operating_pillars enable row level security;
alter table public.tracker_roadmap_items enable row level security;
alter table public.submissions enable row level security;
alter table public.content_audit_log enable row level security;

grant usage on schema public to anon, authenticated;

revoke all privileges on table public.admin_users from anon, authenticated;
revoke all privileges on table public.site_settings from anon, authenticated;
revoke all privileges on table public.social_links from anon, authenticated;
revoke all privileges on table public.projects from anon, authenticated;
revoke all privileges on table public.project_links from anon, authenticated;
revoke all privileges on table public.project_media from anon, authenticated;
revoke all privileges on table public.project_detail_sections from anon, authenticated;
revoke all privileges on table public.project_randomizer_settings from anon, authenticated;
revoke all privileges on table public.project_randomizer_items from anon, authenticated;
revoke all privileges on table public.content_pages from anon, authenticated;
revoke all privileges on table public.content_blocks from anon, authenticated;
revoke all privileges on table public.tracker_status_cards from anon, authenticated;
revoke all privileges on table public.tracker_focus_areas from anon, authenticated;
revoke all privileges on table public.tracker_operating_pillars from anon, authenticated;
revoke all privileges on table public.tracker_roadmap_items from anon, authenticated;
revoke all privileges on table public.submissions from anon, authenticated;
revoke all privileges on table public.content_audit_log from anon, authenticated;

grant select on public.site_settings to anon, authenticated;
grant select on public.social_links to anon, authenticated;
grant select on public.projects to anon, authenticated;
grant select on public.project_links to anon, authenticated;
grant select on public.project_media to anon, authenticated;
grant select on public.project_detail_sections to anon, authenticated;
grant select on public.project_randomizer_settings to anon, authenticated;
grant select on public.project_randomizer_items to anon, authenticated;
grant select on public.content_pages to anon, authenticated;
grant select on public.content_blocks to anon, authenticated;
grant select on public.tracker_status_cards to anon, authenticated;
grant select on public.tracker_focus_areas to anon, authenticated;
grant select on public.tracker_operating_pillars to anon, authenticated;
grant select on public.tracker_roadmap_items to anon, authenticated;

grant select, insert, update, delete on public.admin_users to authenticated;
grant select, insert, update, delete on public.site_settings to authenticated;
grant select, insert, update, delete on public.social_links to authenticated;
grant select, insert, update, delete on public.projects to authenticated;
grant select, insert, update, delete on public.project_links to authenticated;
grant select, insert, update, delete on public.project_media to authenticated;
grant select, insert, update, delete on public.project_detail_sections to authenticated;
grant select, insert, update, delete on public.project_randomizer_settings to authenticated;
grant select, insert, update, delete on public.project_randomizer_items to authenticated;
grant select, insert, update, delete on public.content_pages to authenticated;
grant select, insert, update, delete on public.content_blocks to authenticated;
grant select, insert, update, delete on public.tracker_status_cards to authenticated;
grant select, insert, update, delete on public.tracker_focus_areas to authenticated;
grant select, insert, update, delete on public.tracker_operating_pillars to authenticated;
grant select, insert, update, delete on public.tracker_roadmap_items to authenticated;
grant select, insert, update, delete on public.submissions to authenticated;
grant select, insert on public.content_audit_log to authenticated;

grant all privileges on all tables in schema public to service_role;

drop policy if exists "Admins can read admin users" on public.admin_users;
create policy "Admins can read admin users"
on public.admin_users
for select
to authenticated
using (public.is_site_admin() or user_id = auth.uid());

drop policy if exists "Owners and admins can insert admin users" on public.admin_users;
create policy "Owners and admins can insert admin users"
on public.admin_users
for insert
to authenticated
with check (public.is_site_owner_or_admin());

drop policy if exists "Owners and admins can update admin users" on public.admin_users;
create policy "Owners and admins can update admin users"
on public.admin_users
for update
to authenticated
using (public.is_site_owner_or_admin())
with check (public.is_site_owner_or_admin());

drop policy if exists "Owners and admins can delete admin users" on public.admin_users;
create policy "Owners and admins can delete admin users"
on public.admin_users
for delete
to authenticated
using (public.is_site_owner_or_admin());

drop policy if exists "Public can read public site settings" on public.site_settings;
create policy "Public can read public site settings"
on public.site_settings
for select
to anon, authenticated
using (is_public = true);

drop policy if exists "Admins can manage site settings" on public.site_settings;
create policy "Admins can manage site settings"
on public.site_settings
for all
to authenticated
using (public.is_site_admin())
with check (public.is_site_admin());

drop policy if exists "Public can read verified social links" on public.social_links;
create policy "Public can read verified social links"
on public.social_links
for select
to anon, authenticated
using (is_public = true and status = 'verified');

drop policy if exists "Admins can manage social links" on public.social_links;
create policy "Admins can manage social links"
on public.social_links
for all
to authenticated
using (public.is_site_admin())
with check (public.is_site_admin());

drop policy if exists "Public can read published projects" on public.projects;
create policy "Public can read published projects"
on public.projects
for select
to anon, authenticated
using (visibility = 'published' and published_at is not null);

drop policy if exists "Admins can manage projects" on public.projects;
create policy "Admins can manage projects"
on public.projects
for all
to authenticated
using (public.is_site_admin())
with check (public.is_site_admin());

drop policy if exists "Public can read verified project links" on public.project_links;
create policy "Public can read verified project links"
on public.project_links
for select
to anon, authenticated
using (
  status = 'verified'
  and exists (
    select 1
    from public.projects project
    where project.id = project_links.project_id
      and project.visibility = 'published'
      and project.published_at is not null
  )
);

drop policy if exists "Admins can manage project links" on public.project_links;
create policy "Admins can manage project links"
on public.project_links
for all
to authenticated
using (public.is_site_admin())
with check (public.is_site_admin());

drop policy if exists "Public can read ready project media" on public.project_media;
create policy "Public can read ready project media"
on public.project_media
for select
to anon, authenticated
using (
  status = 'ready'
  and src is not null
  and exists (
    select 1
    from public.projects project
    where project.id = project_media.project_id
      and project.visibility = 'published'
      and project.published_at is not null
  )
);

drop policy if exists "Admins can manage project media" on public.project_media;
create policy "Admins can manage project media"
on public.project_media
for all
to authenticated
using (public.is_site_admin())
with check (public.is_site_admin());

drop policy if exists "Public can read public project detail sections" on public.project_detail_sections;
create policy "Public can read public project detail sections"
on public.project_detail_sections
for select
to anon, authenticated
using (
  is_public = true
  and exists (
    select 1
    from public.projects project
    where project.id = project_detail_sections.project_id
      and project.visibility = 'published'
      and project.published_at is not null
  )
);

drop policy if exists "Admins can manage project detail sections" on public.project_detail_sections;
create policy "Admins can manage project detail sections"
on public.project_detail_sections
for all
to authenticated
using (public.is_site_admin())
with check (public.is_site_admin());

drop policy if exists "Public can read active randomizer settings" on public.project_randomizer_settings;
create policy "Public can read active randomizer settings"
on public.project_randomizer_settings
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "Admins can manage randomizer settings" on public.project_randomizer_settings;
create policy "Admins can manage randomizer settings"
on public.project_randomizer_settings
for all
to authenticated
using (public.is_site_admin())
with check (public.is_site_admin());

drop policy if exists "Public can read enabled randomizer items" on public.project_randomizer_items;
create policy "Public can read enabled randomizer items"
on public.project_randomizer_items
for select
to anon, authenticated
using (
  enabled = true
  and exists (
    select 1
    from public.projects project
    where project.id = project_randomizer_items.project_id
      and project.visibility = 'published'
      and project.published_at is not null
      and project.randomizer_eligible = true
  )
);

drop policy if exists "Admins can manage randomizer items" on public.project_randomizer_items;
create policy "Admins can manage randomizer items"
on public.project_randomizer_items
for all
to authenticated
using (public.is_site_admin())
with check (public.is_site_admin());

drop policy if exists "Public can read published content pages" on public.content_pages;
create policy "Public can read published content pages"
on public.content_pages
for select
to anon, authenticated
using (status = 'published' and published_at is not null);

drop policy if exists "Admins can manage content pages" on public.content_pages;
create policy "Admins can manage content pages"
on public.content_pages
for all
to authenticated
using (public.is_site_admin())
with check (public.is_site_admin());

drop policy if exists "Public can read published content blocks" on public.content_blocks;
create policy "Public can read published content blocks"
on public.content_blocks
for select
to anon, authenticated
using (
  is_public = true
  and status = 'published'
  and exists (
    select 1
    from public.content_pages page
    where page.id = content_blocks.page_id
      and page.status = 'published'
      and page.published_at is not null
  )
);

drop policy if exists "Admins can manage content blocks" on public.content_blocks;
create policy "Admins can manage content blocks"
on public.content_blocks
for all
to authenticated
using (public.is_site_admin())
with check (public.is_site_admin());

drop policy if exists "Public can read tracker status cards" on public.tracker_status_cards;
create policy "Public can read tracker status cards"
on public.tracker_status_cards
for select
to anon, authenticated
using (is_public = true);

drop policy if exists "Admins can manage tracker status cards" on public.tracker_status_cards;
create policy "Admins can manage tracker status cards"
on public.tracker_status_cards
for all
to authenticated
using (public.is_site_admin())
with check (public.is_site_admin());

drop policy if exists "Public can read tracker focus areas" on public.tracker_focus_areas;
create policy "Public can read tracker focus areas"
on public.tracker_focus_areas
for select
to anon, authenticated
using (is_public = true);

drop policy if exists "Admins can manage tracker focus areas" on public.tracker_focus_areas;
create policy "Admins can manage tracker focus areas"
on public.tracker_focus_areas
for all
to authenticated
using (public.is_site_admin())
with check (public.is_site_admin());

drop policy if exists "Public can read tracker operating pillars" on public.tracker_operating_pillars;
create policy "Public can read tracker operating pillars"
on public.tracker_operating_pillars
for select
to anon, authenticated
using (is_public = true);

drop policy if exists "Admins can manage tracker operating pillars" on public.tracker_operating_pillars;
create policy "Admins can manage tracker operating pillars"
on public.tracker_operating_pillars
for all
to authenticated
using (public.is_site_admin())
with check (public.is_site_admin());

drop policy if exists "Public can read tracker roadmap items" on public.tracker_roadmap_items;
create policy "Public can read tracker roadmap items"
on public.tracker_roadmap_items
for select
to anon, authenticated
using (is_public = true);

drop policy if exists "Admins can manage tracker roadmap items" on public.tracker_roadmap_items;
create policy "Admins can manage tracker roadmap items"
on public.tracker_roadmap_items
for all
to authenticated
using (public.is_site_admin())
with check (public.is_site_admin());

drop policy if exists "Admins can manage submissions" on public.submissions;
create policy "Admins can manage submissions"
on public.submissions
for all
to authenticated
using (public.is_site_admin())
with check (public.is_site_admin());

drop policy if exists "Admins can read audit log" on public.content_audit_log;
create policy "Admins can read audit log"
on public.content_audit_log
for select
to authenticated
using (public.is_site_admin());

drop policy if exists "Admins can insert audit log" on public.content_audit_log;
create policy "Admins can insert audit log"
on public.content_audit_log
for insert
to authenticated
with check (public.is_site_admin());

comment on table public.submissions is 'Future Contact, Services, and Collaborate submissions. Public inserts remain disabled until the assigned form/backend step.';
comment on table public.content_audit_log is 'Future admin edit history. No public read policy.';
