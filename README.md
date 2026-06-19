# Personal Website

Personal website foundation for Yuvraj Kashyap. The current public domain is `https://yuvrajkashyap.com`.

## Mission

Build a production-grade personal website and operating interface that can grow into Yuvraj's public home for work, projects, services, writing, and collaboration.

## North Star

The future site should feel cinematic, orbital, and astrophysics-inspired while staying smooth, minimal, premium, responsive, accessible, and production-grade. This foundation intentionally avoids the final visual system so later steps can design it deliberately.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- ESLint
- npm
- `src` directory
- `@/*` import alias
- Motion for React

## Current Step Status

Step 21 builds the public Projects archive page on top of the typed local project model. Home is complete as a gateway, while full About, Experience, Tracker, Services, Collaborate, Contact, admin functionality, database integration, live tracker automation, and full project case studies are not implemented yet.

## Documentation

- `docs/architecture.md` defines the durable technical architecture, including the one-app/two-visual-experience model, route structure, content/data boundaries, asset rules, performance guardrails, accessibility expectations, and future Supabase/admin boundaries.
- `docs/design-tokens.md` defines the semantic token groups, theme palette direction, utility classes, usage rules, and anti-patterns for future UI work.
- `docs/typography-spacing.md` defines the theme-specific font pairings, type scale, spacing rhythm, containers, layout utilities, mobile rules, and anti-patterns for future page work.
- `docs/hero-assets.md` defines the selected dark hero source, poster variants, crop strategy, loading rules, and regeneration workflow.
- `docs/motion-system.md` defines the Motion for React provider, presets, reveal components, reduced-motion strategy, performance rules, and animation guardrails.
- `docs/component-system.md` defines the internal page primitives, usage rules, accessibility expectations, and anti-patterns for future non-home pages.
- `docs/project-data-model.md` defines the local project content model, safe link and media rules, visibility boundaries, randomizer settings, and future Supabase migration direction.

## Local Commands

```bash
npm run dev
npm run lint
npm run typecheck
npm run build
npm run start
npm run prepare:hero
npm run optimize:hero-video
```

## Route Map

- `/`
- `/about`
- `/experience`
- `/projects`
- `/projects/[slug]`
- `/tracker`
- `/services`
- `/collaborate`
- `/contact`
- `/admin`
- `/admin/login`

## Future Major Systems

- Singularity OS dark mode direction
- Ivory Observatory light mode direction
- Cinematic hero and orbital interface language
- Dark hero poster asset preparation
- Dark hero video asset optimization
- Static dark home hero
- Dark hero video integration
- Final-direction light home hero
- Orbital home navigation
- Motion system foundation
- Full Home gateway sections
- Internal page template system
- Typed project data model
- Projects archive page
- Project case study system
- Tracker and operating metrics interface
- Services and collaboration flows
- Admin area and content management
- Supabase or another backend if assigned in a later step
- Open Graph and social media assets

## Design System Notes

Semantic design tokens, theme-specific typography, spacing utilities, the public shell, and internal page template components now exist. Full final lower-page compositions, new cinematic assets, and page-specific visual systems remain deferred.

## Admin And Data Notes

Supabase, authentication, admin editing flows, and private operations are intentionally deferred. No secrets should be committed. Use `.env.example` for safe public environment examples only.

## Content Integrity

Do not add fake claims, fake stats, fake links, fake metrics, or fake live data. Placeholder pages should stay honest until real content is provided.
