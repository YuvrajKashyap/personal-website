# Project Data Model

## 1. Purpose

The project data model is the typed source of truth for the Projects system until a backend is assigned. It gives Home, Projects, and future project detail surfaces one shared content shape without inventing links, media, outcomes, or live metrics.

## 2. Data source for now

Project records currently live in `src/data/projects.ts`.

Randomizer settings live in `src/data/project-randomizer.ts`.

Pure read helpers live in `src/lib/projects`.

Route components and feature components should consume helper functions instead of filtering raw arrays in place.

## 3. Future Supabase migration direction

Supabase comes later. The local model should stay close to the future database shape so public pages can migrate without a route rewrite.

Expected migration direction:

- Keep project fields typed.
- Keep link and media records separate enough to become related tables later.
- Keep visibility, status, and priority explicit.
- Keep public reads limited to approved published content.
- Keep admin editing behind server-side and authenticated boundaries later.

Do not add Supabase client code in this step.

## 4. Project type model

The canonical project type lives in `src/types/project.ts` as `Project`.

Key fields:

- `id`
- `slug`
- `title`
- `shortTitle`
- `eyebrow`
- `summary`
- `description`
- `category`
- `type`
- `status`
- `priority`
- `visibility`
- `featured`
- `featuredRank`
- `order`
- `randomizerEligible`
- `randomizerBucket`
- `randomizerWeight`
- `tags`
- `stack`
- `highlights`
- `problem`
- `solution`
- `whatItProves`
- `timelineLabel`
- `links`
- `media`

Keep new fields deliberate. If a field only belongs to one visual treatment, prefer display logic over expanding the shared model.

## 5. Link model and verification statuses

Project links use `ProjectLink`.

Supported link statuses:

- `verified`: safe to show publicly.
- `needs_review`: stored for future review, not shown as verified.
- `unavailable`: known missing or intentionally withheld.

The default public helper `getProjectLinks(project)` returns verified links only.

Use `includeNeedsReview` only in internal tooling, admin surfaces, or explicitly assigned review steps.

Do not invent repo links, live URLs, demos, case studies, docs, social links, or emails.

## 6. Media model and missing media handling

Project media uses `ProjectMedia`.

Supported media statuses:

- `ready`: production asset exists and can be shown.
- `missing`: media is expected later but not available.
- `needs_review`: media exists or is suspected but has not been approved.

For now, project media arrays are empty. This is intentional. Do not point to screenshots, covers, videos, or diagrams that do not exist.

If media is added later:

- The asset path must exist.
- The media status must match reality.
- Decorative media can use empty alt only when the rendering context is decorative.
- Semantic media needs meaningful alt text.

## 7. Status model

Project status describes current project state, not marketing intensity.

Current supported values:

- `active_build`
- `live`
- `portfolio_ready`
- `private`
- `draft`
- `archived`
- `practice`
- `needs_review`

Do not upgrade a project to `live` or `portfolio_ready` unless the claim is verified.

## 8. Priority model

Priority describes portfolio emphasis.

Current supported values:

- `flagship`
- `strong`
- `supporting`
- `archive`

Do not promote draft, practice, archive, or needs-review projects into flagship placement without architect approval.

## 9. Visibility model

Visibility controls whether a record is safe for public surfaces.

Current supported values:

- `published`
- `draft`
- `hidden`

Public pages should default to published records. Draft records can exist in local data for future planning but should not be presented as public case studies.

## 10. Featured project logic

Featured projects are published projects where `featured` is `true`.

`featuredRank` controls featured ordering. `order` is the secondary sort field. Title is the final stable tie-breaker.

Home may consume a small featured preview through `getFeaturedProjects()`, but Home should remain curated and low-density.

## 11. Randomizer model

Randomizer settings live in `src/data/project-randomizer.ts`.

The future randomizer should use:

- `mode`
- `curatedBucketSlugs`
- `buttonBehavior`
- `defaultEligibleVisibility`
- `allowNeedsReviewLinks`

The current helper `getRandomizerPool()` returns eligible published projects only. It does not build a random UI yet.

## 12. Safe content rules

- Use only known project names and conservative descriptions.
- Use verified links only in public UI.
- Keep needs-review links out of public verified link surfaces.
- Keep draft projects behind a content boundary.
- Keep media omitted until assets exist.
- Keep current-state and tracker claims explicitly sourced.
- Keep Arcade attribution boundaries clear.

## 13. What not to fake

Do not fake:

- GitHub repositories.
- Live product links.
- Customer counts.
- Revenue.
- Users.
- Metrics.
- Screenshots.
- Videos.
- Diagrams.
- Launch dates.
- Employer or client claims.
- Automated live data.
- Case study evidence.

## 14. How Home preview may consume projects

Home can use `getFeaturedProjects().slice(0, 4)` for a small preview. Cards should link to `/projects` until the full project archive and detail UI are assigned.

Home should not become a full project archive.

## 15. How Projects page will consume projects later

The future Projects page can use:

- `getPublishedProjects()` for the archive.
- `getFeaturedProjects()` for featured rows.
- `getProjectsByCategory(category)` for grouping.
- `getProjectsByPriority(priority)` for emphasis.
- `getRandomizerPool()` for discovery interactions.
- `getProjectBySlug(slug)` for detail routes.

Full grid, filter, randomizer, media, and case study UI are future assigned steps.

## 16. Anti-patterns

- Filtering raw project arrays in many components.
- Showing needs-review links as verified public links.
- Pointing media records at missing files.
- Using fake screenshots or mock evidence.
- Duplicating project preview content in Home.
- Turning draft records into public case studies.
- Adding Supabase before the backend step.
- Creating theme-specific data models.
- Creating separate dark and light project routes.
- Overclaiming Arcade or any project with third-party, embedded, or open-source exceptions.
