# Internal Page Component System

## 1. Purpose

The internal page component system gives every non-home public page a shared premium foundation. Full About, Experience, Projects, Tracker, Services, Collaborate, and Contact pages now use it.

It keeps pages visually aligned with Singularity OS and Ivory Observatory while preventing random one-off layouts.

## 2. Component list

- `src/components/layout/PageBackdrop.tsx`
- `src/components/layout/PageHero.tsx`
- `src/components/layout/SectionShell.tsx`
- `src/components/layout/DetailLayout.tsx`
- `src/components/ui/OrbitalSectionHeader.tsx`
- `src/components/ui/CosmicCard.tsx`
- `src/components/ui/TelemetryCard.tsx`
- `src/components/ui/StatusBadge.tsx`
- `src/components/ui/LinkButton.tsx`
- `src/components/ui/EmptyState.tsx`
- `src/components/ui/FormShell.tsx`

## 3. Component responsibilities

`PageBackdrop` owns decorative CSS and SVG-only internal page atmosphere.

`PageHero` owns the top internal page introduction.

`SectionShell` owns repeatable section rhythm, containers, and optional section headings.

`DetailLayout` owns future article, case study, and project detail layouts.

UI primitives own reusable cards, badges, buttons, telemetry, empty states, and form wrappers.

## 4. PageHero usage

Use `PageHero` once near the top of each internal public page.

It accepts an eyebrow, title, description, optional actions, optional meta chips, optional status, and optional side content. It uses `Reveal` lightly and includes `PageBackdrop`.

Do not use it to recreate the Home hero or load media.

## 5. SectionShell usage

Use `SectionShell` for major internal page sections. It creates a semantic `section`, optional `aria-labelledby` wiring, spacing rhythm, and a token-aware container.

Use `variant="wide"` for large grids or detail layouts. Use `variant="compact"` for short boundary notes or empty states.

## 6. Card usage

Use `CosmicCard` for future page previews, content blocks, and link cards. It can render as an article or a real Next.js link when `href` exists.

Cards should not invent facts. If the content is not real yet, write it as future structure or leave it empty.

## 7. Telemetry usage and source-label rule

Use `TelemetryCard` for Tracker-like signals and technical metadata.

Every telemetry-style value should have an honest source label when there is any chance it could be mistaken for live data. Examples: `Manual`, `Placeholder`, `No backend`, or `Published`.

Do not fake numbers, streaks, progress, live status, or metrics.

## 8. LinkButton usage

Use `LinkButton` for internal and external actions. Internal links use Next.js `Link`. External links use normal anchor behavior with `target="_blank"` and `rel="noreferrer"`.

Use only real links.

## 9. FormShell usage

`FormShell` is a layout wrapper for form-like surfaces.

Step 32 uses it with `SubmissionForm` for Contact, Services, and Collaborate. Do not add fake success messages. Success copy must only appear after the assigned server route succeeds.

## 10. EmptyState usage

Use `EmptyState` when a future section or data-backed surface is intentionally not populated yet.

It should feel premium and honest, not generic or apologetic.

## 11. DetailLayout usage

Use `DetailLayout` for future project case studies and deeper content routes. It supports main content, optional header, and optional aside.

Do not build fake project detail content just because the route exists.

## 12. Dark and light behavior

Components are styled through semantic tokens in `src/app/globals.css`.

Dark mode should feel like a lower-intensity Singularity OS internal surface: cinematic, structured, readable, and technical.

Light mode should feel like Ivory Observatory: editorial, warm, precise, and readable with laal red accents.

Do not make light mode a simple inversion of dark mode.

## 13. Motion behavior

The internal page system uses `Reveal` for restrained entrance motion.

Do not add GSAP, scroll timelines, constant loops, or page-wide animation chains. Reduced motion must remain respected through the existing motion foundation.

## 14. Accessibility rules

- Use real semantic headings.
- Keep one clear `h1` per internal page.
- Use real links and buttons.
- Preserve visible focus states.
- Keep color contrast readable in both themes.
- Ensure mobile tap targets are usable.
- Avoid hover-only interactions.
- Do not hide important copy inside images or decorative SVG.

## 15. Anti-patterns

- Building full pages during template steps.
- Creating one-off page-specific layouts without reason.
- Faking project details, tracker data, forms, or live status.
- Rendering hidden dark media in light mode.
- Wrapping admin routes with the public template system.
- Adding new packages for basic layout primitives.
- Using hardcoded colors where semantic tokens already exist.

## Step 20 project data note

Projects now have a typed local model in `src/data/projects.ts` and pure helpers in `src/lib/projects`.

Internal page primitives may display safe project metadata, counts, and content boundaries, but they should not become the full Projects archive or case study UI until assigned.

When rendering project links, use helpers that return verified links by default. Do not show `needs_review` links as public verified actions.

## Step 21 Projects archive note

The Projects archive is now an assigned full page, not a placeholder.

- `/projects` uses `PageHero`, `SectionShell`, `StatusBadge`, `LinkButton`, `TelemetryCard`, and `Reveal`.
- Feature-specific components live in `src/features/projects`.
- `ProjectCard` owns project archive card presentation and should stay honest about missing media, links, and evidence.
- `ProjectFilters` owns filter buttons with `aria-pressed` state.
- `RandomProjectButton` owns client-side random routing from the approved randomizer pool.
- The archive may use page-specific CSS utilities when shared primitives are not enough, but it should stay token-driven and responsive.
- Do not use Project archive components to fake full case studies, screenshots, repository links, metrics, or live product status.

## Step 22 project detail note

Project detail pages now have a reusable component layer.

- `ProjectDetailPage` owns the main detail composition.
- `ProjectDetailSection` owns repeated problem, solution, architecture, highlights, and proof sections.
- `ProjectStackList` owns stack chip rendering.
- `ProjectLinksPanel` owns verified public actions and hides needs-review links from public actions.
- `RelatedProjects` owns small related project navigation from published records.
- Detail pages use `PageHero`, `DetailLayout`, `SectionShell`, `TelemetryCard`, `StatusBadge`, `LinkButton`, `EmptyState`, and `Reveal`.
- Missing media should use coded placeholders until real project media is approved.
- Do not add fake case-study claims, diagrams, screenshots, metrics, or external links inside detail components.

## Step 23 About page note

The About page now uses the internal page component system for a full public narrative route.

- `/about` renders `src/features/about/AboutPage.tsx`.
- `PageHero` owns the single page `h1`, status chips, and primary actions.
- `SectionShell` separates story intro, phase timeline, discipline transfer, operating layer, and closing CTA.
- `CosmicCard`, `TelemetryCard`, `StatusBadge`, `LinkButton`, and `Reveal` provide the reusable visual language.
- `AboutTimeline` and `AboutPhaseCard` are feature-specific components for the structured phase model.
- Do not reuse About components to fake Experience content, achievements, awards, or jobs.

## Step 24 Experience page note

The Experience page now uses the internal page component system for a full public trajectory route.

- `/experience` renders `src/features/experience/ExperiencePage.tsx`.
- `PageHero` owns the single page `h1`, status chips, and primary actions.
- `SectionShell` separates pillars, timeline, proof surfaces, direction, and closing CTA.
- `CosmicCard`, `TelemetryCard`, `StatusBadge`, `LinkButton`, and `Reveal` provide the reusable visual language.
- `ExperiencePillars`, `ExperienceTimeline`, and `ExperienceEntryCard` are feature-specific components for the structured content model.
- Do not use Experience components to invent roles, internships, dates, metrics, awards, GPA claims, or research outcomes.

## Step 25 Tracker page note

The Tracker page now uses the internal page component system for a full public current-state route.

- `/tracker` renders `src/features/tracker/TrackerPage.tsx`.
- `PageHero` owns the single page `h1`, status chips, and primary actions.
- `SectionShell` separates current state, focus areas, operating pillars, active surfaces, roadmap, source note, and closing CTA.
- `TelemetryCard`, `CosmicCard`, `StatusBadge`, `LinkButton`, and `Reveal` provide the reusable visual language.
- `TrackerStatusBoard`, `TrackerSurfaceLinks`, and `TrackerRoadmap` are feature-specific components for the structured content model.
- Status-like cards must keep source labels visible.
- Do not use Tracker components to fake connected data, metrics, timestamps, streaks, external activity, private routine data, revenue, customers, or users.

## Step 26 Services page note

The Services page now uses the internal page component system for a full scoped-request route.

- `/services` renders `src/features/services/ServicesPage.tsx`.
- `PageHero` owns the single page `h1`, status chips, and primary actions.
- `SectionShell` separates definition, service lanes, fit matrix, request process, proof surfaces, Services vs Collaborate, boundary note, and closing CTA.
- `CosmicCard`, `TelemetryCard`, `StatusBadge`, `LinkButton`, and `Reveal` provide the reusable visual language.
- `src/features/services/services-content.ts` owns the structured local content model.
- Do not add a fake form, fake submission, pricing table, package tiers, testimonials, client claims, guarantees, availability claims, or external booking behavior to Services.
- Keep Services distinct from Collaborate. Services is scoped execution. Collaborate is broader aligned opportunity.

## Step 27 Collaborate page note

The Collaborate page now uses the internal page component system for a full broader-alignment route.

- `/collaborate` renders `src/features/collaborate/CollaboratePage.tsx`.
- `PageHero` owns the single page `h1`, status chips, primary action, secondary action, and alignment console.
- `SectionShell` separates definition, collaboration lanes, fit matrix, alignment principles, reach-out process, proof surfaces, Services vs Collaborate, boundary note, and closing CTA.
- `CosmicCard`, `TelemetryCard`, `StatusBadge`, `LinkButton`, and `Reveal` provide the reusable visual language.
- `src/features/collaborate/collaborate-content.ts` owns the structured local content model.
- Do not add a fake form, fake submission, scheduling tool, payment flow, outcome claim, demand signal, or external booking behavior to Collaborate.
- Keep Collaborate distinct from Services. Collaborate is broader aligned opportunity. Services is scoped execution.

## Step 28 Contact page note

The Contact page now uses the internal page component system for a full manual verified-channel route.

- `/contact` renders `src/features/contact/ContactPage.tsx`.
- `PageHero` owns the single page `h1`, status chips, primary action, secondary action, and channel console.
- `SectionShell` separates verified channels, route guidance, message brief, manual boundary, proof surfaces, and closing CTA.
- `CosmicCard`, `TelemetryCard`, `StatusBadge`, `LinkButton`, and `Reveal` provide the reusable visual language.
- `src/features/contact/contact-content.ts` owns the structured local content model.
- Contact intentionally avoids a `form` element, submit button, fake success state, or backend behavior.
- Future form work should preserve the verified-channel rule and should not invent contact methods.

## Step 29 Supabase schema note

Step 29 adds backend schema files only. No UI component behavior changes are required.

- Components should continue to consume local typed content until an assigned data-layer step connects Supabase.
- Do not add Supabase client imports inside UI primitives.
- Do not make `FormShell` submit data unless a real form/backend step is assigned.

## Step 31 admin component note

Admin auth components live in `src/features/admin` and are outside the public internal page template system.

- `AdminShell` is an admin-only shell and does not render `SiteHeader` or `SiteFooter`.
- `AdminLoginPage` and `AdminLoginForm` own the magic-link entry.
- `AdminSetupNotice` owns the no-env setup state.
- `AdminAccessDenied` owns authenticated but unauthorized states.
- `AdminDashboard` owns the read-only dashboard foundation.

Do not use public page components to imply admin editing exists. Do not use admin components on public routes.
- Future admin or form components should respect the RLS and submissions boundaries documented in `docs/supabase-schema.md`.

## Step 32 submissions component note

The shared public submission form lives in `src/features/submissions/SubmissionForm.tsx`.

- It posts only to `/api/submissions`.
- It does not import Supabase clients.
- It supports disabled no-env behavior.
- It uses required name, email, subject, and message fields.
- It allows optional company and website fields.
- It includes honeypot fields.
- It shows success copy only after API success.

Keep form styling token-driven through the scoped `.submission-form` classes in `src/app/globals.css`.
