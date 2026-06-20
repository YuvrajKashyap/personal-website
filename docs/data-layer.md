# Data Layer

## 1. Purpose

Step 30 connects the public app to a runtime-safe data layer. The app can keep reading local typed content when Supabase is not configured, and it can read public project data from Supabase later without rewriting Projects page components again.

The data layer is an app boundary, not an admin system.

## 2. Step 30 Scope

This step covers Projects and Project Detail pages first because they already have a typed local model and matching project tables from Step 29.

Implemented:

- `@supabase/supabase-js` runtime dependency.
- Safe Supabase public config.
- Public read client creation.
- Minimal database types for project-related tables.
- Supabase-to-Project mappers.
- Async project data-source helpers.
- `/projects` integration.
- `/projects/[slug]` integration.
- Randomizer pool integration through the same effective data source.

Not implemented:

- Admin auth.
- Admin dashboard.
- Public writes.
- Forms or submissions backend.
- API routes or server actions.
- Supabase seeding.
- About, Experience, Tracker, Services, Collaborate, or Contact Supabase loading.

## 3. Package Installed

The only package added in Step 30 is:

```text
@supabase/supabase-js
```

`@supabase/ssr` is not installed because this step does not implement auth, sessions, or cookie-aware Supabase clients.

## 4. Environment Variables

`.env.example` documents safe placeholders only:

```text
SITE_DATA_SOURCE=local
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SECRET_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_PROJECT_REF=
```

Rules:

- Real values belong in `.env.local` and Vercel environment variables only.
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` is preferred for public reads.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` is a legacy fallback.
- `SUPABASE_SECRET_KEY` and `SUPABASE_SERVICE_ROLE_KEY` are server-only and are not imported by the public read layer.
- `.env.local` must remain ignored.

## 5. Data Source Modes

`SITE_DATA_SOURCE` supports:

- `local`: always use local typed content.
- `auto`: use Supabase only when public env values are configured, otherwise use local fallback.
- `supabase`: require Supabase public config and read from Supabase. This mode may throw controlled server errors if config or reads fail.

If `SITE_DATA_SOURCE` is unset or invalid, the app defaults to `local`.

## 6. Local Fallback Behavior

Local fallback remains mandatory.

When Supabase is not configured:

- The app builds normally.
- `/projects` loads from `src/data/projects.ts`.
- `/projects/[slug]` loads from local project data.
- Random project routing uses the local randomizer settings.
- Home preview remains local for now.

Missing env vars must not break build or public runtime in the default mode.

## 7. Supabase Public Read Behavior

When enabled later, Supabase reads use:

- Public project tables only.
- Publishable key or anon key.
- RLS-safe select queries.
- `visibility = published`.
- `published_at is not null`.
- Related public project links, ready media, and public detail sections.

The app does not query admin users, submissions, audit logs, or private tables.

## 8. Project Data Source Helpers

Async helpers live in `src/lib/projects/project-data-source.ts`:

- `getAllProjectsData()`
- `getPublishedProjectsData()`
- `getFeaturedProjectsData()`
- `getProjectBySlugData(slug)`
- `getRandomizerPoolData()`
- `getRelatedProjectsData(project)`
- `getProjectsDataSourceStatus()`

Existing synchronous local helpers remain in `src/lib/projects/projects.ts` and continue to power fallback behavior.

## 9. Mapper Strategy

Mappers live in `src/lib/projects/project-mappers.ts`.

They convert Supabase snake_case rows into the existing `Project` model:

- `short_title` to `shortTitle`
- `featured_rank` to `featuredRank`
- `order_index` to `order`
- `randomizer_eligible` to `randomizerEligible`
- `randomizer_bucket` to `randomizerBucket`
- `randomizer_weight` to `randomizerWeight`
- `what_it_proves` to `whatItProves`
- `timeline_label` to `timelineLabel`
- `attribution_notes` to `attributionNotes`
- `project_links` to `links`
- `project_media` to `media`
- `project_detail_sections` to `detailSections`

Enums are normalized safely, but mapper fallbacks do not turn unreviewed records into verified public content.

## 10. Project Page Integration

`src/features/projects/ProjectsPage.tsx` now reads through the async data-source helpers.

The archive still preserves:

- Featured project rendering.
- Archive filters.
- Result counts.
- Coded media placeholders.
- Verified-link-only public actions.
- Random project routing.

Public debug source labels are not shown.

## 11. Randomizer Integration

`RandomProjectButton` remains a client component. It receives a serialized project pool from the server.

The server-side pool comes from `getRandomizerPoolData()`.

Rules:

- Hidden records are not eligible.
- Draft records are not eligible.
- Empty pools disable the button safely.
- The client component does not import Supabase code.

## 12. Home Preview Status

Home preview remains local in Step 30.

Reason:

- Home is already visually complex and theme-sensitive.
- The prompt only requires Projects and Project Detail integration.
- Leaving Home local avoids widening this step into the final Home data architecture.

Future work can move the Home featured preview to the same data-source helpers once the page-level data flow is assigned.

## 13. Security Rules

- Do not expose service-role or secret keys.
- Do not import secret env vars into client components.
- Do not write to Supabase from public pages.
- Do not bypass RLS.
- Do not add API routes or server actions in this step.
- Do not expose data-source errors in public UI.
- Do not commit `.env.local`.

## 14. Service-Role Boundary

The Step 30 runtime reads only:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SITE_DATA_SOURCE`

`SUPABASE_SECRET_KEY` and `SUPABASE_SERVICE_ROLE_KEY` remain placeholders for future server-only/admin work and are not used by public read utilities.

## 15. What Remains Local

These pages remain local:

- Home preview content.
- About.
- Experience.
- Tracker.
- Services.
- Collaborate.
- Contact.

Local content fallback also remains for Projects when Supabase is missing, unset, or unavailable in `auto` mode.

## 16. Deferred To Later Steps

Step 31 may build protected admin auth if assigned.

Step 32 may build contact/submission backend behavior if assigned.

Later assigned work can:

- Apply the Supabase migration to a real project.
- Seed approved public project records.
- Generate canonical Supabase types.
- Move additional content pages behind the data layer.
- Add admin editing boundaries.

## 17. How To Enable Supabase Later

After the real Supabase project and schema are ready:

1. Apply `supabase/migrations/20260620165000_initial_schema.sql`.
2. Confirm RLS is enabled.
3. Confirm public read grants and policies work.
4. Seed approved published project records only.
5. Put real public env values in `.env.local` and Vercel.
6. Set `SITE_DATA_SOURCE=auto` for fallback or `SITE_DATA_SOURCE=supabase` for strict reads.
7. Keep service-role and secret keys out of public clients.

Do not seed production data unless the real project is safely available and explicitly approved.

## 18. Anti-patterns

- Requiring Supabase env vars for local build.
- Replacing local fallback before the architect removes it.
- Using service role for public reads.
- Querying submissions, admin users, or audit logs from public pages.
- Adding public writes from page components.
- Marking `needs_review` links as verified.
- Rendering missing media as ready.
- Displaying data-source errors to public users.
- Duplicating the project model for Supabase only.
- Moving unrelated pages to Supabase during this step.

## 19. Step 31 Admin Auth Boundary

Step 31 adds Supabase SSR auth utilities for private admin routes.

The public data layer remains separate:

- `src/lib/supabase/public-client.ts` is still for public project reads only.
- `src/lib/supabase/client.ts` is for browser Auth flows.
- `src/lib/supabase/server.ts` is for cookie-aware server Auth flows.
- `src/lib/supabase/auth.ts` owns admin authorization helpers.

The public project data layer still defaults to local fallback when Supabase env values are missing. Admin auth does not enable public writes, submissions inserts, content editing, or service-role reads.
