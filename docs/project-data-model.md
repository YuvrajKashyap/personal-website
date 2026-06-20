# Project Data Model

## 1. Purpose

The project data model is the typed source of truth for the Projects system until a backend is assigned. It gives Home, Projects, and future project detail surfaces one shared content shape without inventing links, media, outcomes, or live metrics.

## 2. Data source for now

Project records currently live in `src/data/projects.ts`.

Randomizer settings live in `src/data/project-randomizer.ts`.

Pure read helpers live in `src/lib/projects`.

Route components and feature components should consume helper functions instead of filtering raw arrays in place.

## 3. Supabase migration direction

The Supabase schema foundation now exists locally, but the app still reads from local content. The local model should stay close to the database shape so public pages can migrate without a route rewrite.

Expected migration direction:

- Keep project fields typed.
- Keep link and media records separate enough to become related tables later.
- Keep visibility, status, and priority explicit.
- Keep public reads limited to approved published content.
- Keep admin editing behind server-side and authenticated boundaries later.

Do not add Supabase client code until the assigned data-layer step.

## 3.1 Supabase table mapping

Step 29 maps the project model to:

- `projects`
- `project_links`
- `project_media`
- `project_detail_sections`
- `project_randomizer_settings`
- `project_randomizer_items`

Current local data remains the source of truth until Step 30 or another assigned integration step changes the data-loading boundary.

The same honesty rules apply in the database:

- `needs_review` links must not render as verified public links.
- Missing or needs-review media must not be presented as approved public media.
- Draft and hidden visibility must not leak into public archive surfaces.
- Randomizer eligibility must stay explicit.

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

The Projects page randomizer uses:

- `mode`
- `curatedBucketSlugs`
- `buttonBehavior`
- `defaultEligibleVisibility`
- `allowNeedsReviewLinks`

The helper `getRandomizerPool()` returns eligible published projects only. The `/projects` page uses that pool for its random project button and routes to `/projects/[slug]`.

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

## 15. How Projects page consumes projects

The `/projects` archive uses:

- `getPublishedProjects()` for the archive.
- `getFeaturedProjects()` for featured rows.
- local filter logic for category, priority, featured, and active/live views.
- `getRandomizerPool()` for discovery interactions.
- `getProjectBySlug(slug)` for detail routes.

The archive grid, filters, randomizer, and coded media placeholders are implemented. Full case studies, project-specific screenshots, videos, live metrics, and media-rich detail pages remain future assigned work.

Public project cards must continue to:

- Use published records only.
- Show verified public links only.
- Treat `needs_review` links as internal review state, not public actions.
- Render coded placeholders when media is missing.
- Avoid fake screenshots, fake metrics, fake repos, and fake live URLs.

## 16. How project detail pages consume projects

Project detail pages now use the same local project records.

- The route `/projects/[slug]` reads projects through `getProjectBySlug(slug)`.
- Known non-hidden records render detail pages from `ProjectDetailPage`.
- Unknown or hidden slugs render a safe content-boundary page.
- `generateStaticParams()` is based on known non-hidden slugs.
- `generateMetadata()` uses the project title and summary only.

Detail pages consume:

- `description` for overview.
- `problem` for the problem section.
- `solution` for the approach section.
- `detailSections` for architecture and system notes.
- `stack` for technology chips.
- `highlights` for technical signal.
- `whatItProves` for the builder-signal section.
- `attributionNotes` and `notes` for visible boundaries when present.
- `links` only after filtering for verified status.

Related project navigation uses published records, excludes the current project, and stays small. It is not a recommendation engine.

Future Supabase migration should preserve these content shapes before moving records into a database-backed source.

## 17. Anti-patterns

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
