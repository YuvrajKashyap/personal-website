# Supabase Schema

## 1. Purpose

Step 29 creates the Supabase schema foundation for the personal website without connecting the frontend to Supabase yet.

The schema prepares for:

- Public reads of approved published content.
- Future admin editing.
- Future Contact, Services, and Collaborate submissions.
- Future audit/history tracking.
- Migration from local typed content into database-backed content.

## 2. What Step 29 Created

- A local Supabase migration file.
- A Supabase runbook in `supabase/README.md`.
- Environment variable placeholders in `.env.example`.
- Documentation for table groups, RLS, public/admin boundaries, and future setup.

The app still reads local content from `src/data` and `src/features`.

## 3. Local Migration Location

Migration:

```text
supabase/migrations/20260620165000_initial_schema.sql
```

The migration is intended to be applied to a real Supabase project later through the SQL Editor or a linked Supabase CLI.

## 4. Table Groups

The schema includes:

- Admin, settings, and social link tables.
- Project tables.
- Page content tables.
- Tracker tables.
- Future submissions table.
- Audit/history table.

## 5. Projects Tables

Project content is split across:

- `projects`
- `project_links`
- `project_media`
- `project_detail_sections`
- `project_randomizer_settings`
- `project_randomizer_items`

This mirrors the local project model while keeping links, media, detail sections, and randomizer behavior separate enough for future admin editing.

Public reads are limited to published projects and verified/ready related records.

## 6. Page Content Tables

Page content uses:

- `content_pages`
- `content_blocks`

These tables can support About, Experience, Tracker, Services, Collaborate, Contact, and future flexible content blocks without creating a separate table for every visual component.

Public reads require published pages, published blocks, and `is_public = true`.

## 7. Tracker Tables

Tracker-specific public signal tables include:

- `tracker_status_cards`
- `tracker_focus_areas`
- `tracker_operating_pillars`
- `tracker_roadmap_items`

Every public tracker-style value should keep a source label when it could be mistaken for live or connected data.

## 8. Submissions Table

`submissions` exists for future Contact, Services, Collaborate, and general submissions.

Public inserts are intentionally disabled in Step 29.

Step 32 or another assigned form/backend step can add validated insert behavior, spam controls, and server-side handling.

## 9. Admin Users Table

`admin_users` maps future admin access to Supabase Auth:

- `user_id` references `auth.users(id)`.
- `role` supports `owner`, `admin`, and `editor`.
- `status` supports `active`, `invited`, and `disabled`.

The migration does not seed an admin user. The first admin should be inserted manually only after the correct Auth user id is known.

## 10. Site Settings And Social Links

`site_settings` stores global settings with an `is_public` boundary.

`social_links` stores verified public links and future contact channels with:

- `verified`
- `needs_review`
- `unavailable`

Only verified public social links are publicly readable.

## 11. Audit Log

`content_audit_log` prepares for future admin history.

It has no public read policy. Admins can read and insert audit rows. Update and delete behavior should stay conservative.

## 12. RLS Strategy

Every table has RLS enabled.

The migration defines:

- `public.is_site_admin()`
- `public.is_site_owner_or_admin()`
- Public read policies for safe published/public records.
- Admin management policies for authenticated active admin users.
- No public write policies.

The helper functions use locked `search_path` and restricted execute grants.

## 13. Public Read Boundaries

Public users can read:

- `site_settings` where `is_public = true`
- `social_links` where `is_public = true` and `status = verified`
- `projects` where `visibility = published` and `published_at` is set
- verified project links for published projects
- ready project media for published projects
- public project detail sections for published projects
- active randomizer settings and enabled randomizer items tied to published eligible projects
- published public content pages and blocks
- public tracker rows

Public users cannot read:

- `admin_users`
- `submissions`
- `content_audit_log`

## 14. Admin Write Boundaries

Authenticated active site admins can manage:

- site settings
- social links
- projects
- project links
- project media
- project detail sections
- randomizer settings and items
- content pages and blocks
- tracker rows
- submissions

Admin user management is limited to active owners/admins or manual service-role SQL.

## 15. Submissions Locked Until Step 32

`submissions` exists now, but it is locked down:

- no anon `insert` grant
- no public insert policy
- no frontend form
- no API route
- no server action
- no email or CRM integration

## 16. Environment Variables

`.env.example` includes placeholders only:

```text
SITE_DATA_SOURCE=local
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SECRET_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_PROJECT_REF=
```

Real values belong in `.env.local` and Vercel environment variables later. `.env.local` must stay untracked.

The service role key is server-only and must never be exposed to browser code.

## 16.1 Step 30 App Data Layer

Step 30 connects the public app to a data-source abstraction for project reads.

- `src/lib/supabase/config.ts` reads safe public env values and `SITE_DATA_SOURCE`.
- `src/lib/supabase/public-client.ts` creates a public read client only when configured.
- `src/lib/supabase/database.types.ts` contains minimal project-table types until generated types are available.
- `src/lib/projects/project-data-source.ts` reads project data through local fallback or Supabase.
- `/projects` and `/projects/[slug]` now consume the data-source helpers.
- Public Supabase reads target `projects`, `project_links`, `project_media`, and `project_detail_sections`.
- Public reads rely on RLS and select published project records only.
- No public writes, submissions inserts, admin auth, or service-role client were added.

Schema application is still pending unless a real Supabase project is manually created and migrated later.

## 17. Manual Setup Instructions

If project access is not available to Codex:

1. Create a Supabase project named `personal-website` or `yuvraj-personal-website`.
2. Open SQL Editor.
3. Paste and run `supabase/migrations/20260620165000_initial_schema.sql`.
4. Confirm all required tables exist.
5. Confirm RLS is enabled on every table.
6. Confirm `submissions` has no public insert policy.
7. Put real env values in `.env.local` and Vercel only when the assigned connection step begins.
8. Keep the service role key server-only.
9. Create the first admin manually only after the correct Supabase Auth user id is known.

## 18. Deferred Work

Step 30 can connect the app data layer and decide local fallback behavior.

Step 31 can build admin auth and protected server boundaries if assigned.

Step 32 can add real form submission behavior if assigned.

This step does not add frontend Supabase clients, admin dashboards, storage upload UI, analytics, cron jobs, or integrations.

## 19. Anti-patterns

- Committing Supabase secrets.
- Exposing service role keys to browser code.
- Disabling RLS to make reads easier.
- Adding public write policies before a real form/backend step.
- Marking `needs_review` links or media as verified.
- Moving public pages from local content to Supabase without an assigned data-layer step.
- Creating fake submissions or fake admin behavior.
- Building admin UI before auth and server boundaries exist.
