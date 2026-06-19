# Internal Page Component System

## 1. Purpose

The internal page component system gives every non-home public page a shared premium foundation before full About, Experience, Projects, Tracker, Services, Collaborate, and Contact builds begin.

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

`FormShell` is a layout wrapper for future Services, Collaborate, and Contact forms.

It does not submit anything. Do not add fake inputs, fake submit states, or fake success messages. Use clear placeholder language until a real form step exists.

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
