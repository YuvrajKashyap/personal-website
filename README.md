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

Step 31 adds the private admin auth and dashboard foundation. Home, About, Experience, Tracker, Services, Collaborate, Contact, Projects archive, and project details now exist. Projects and project detail routes read through a local-first data-source abstraction that can use Supabase later when the real project, schema, and environment values are ready. Admin login, callback, logout, server guard, setup-required state, and a read-only dashboard shell now exist. Content CRUD, submissions backend behavior, connected tracker sources, and media-rich project case studies are not implemented yet.

## Documentation

- `docs/architecture.md` defines the durable technical architecture, including the one-app/two-visual-experience model, route structure, content/data boundaries, asset rules, performance guardrails, accessibility expectations, and future Supabase/admin boundaries.
- `docs/design-tokens.md` defines the semantic token groups, theme palette direction, utility classes, usage rules, and anti-patterns for future UI work.
- `docs/typography-spacing.md` defines the theme-specific font pairings, type scale, spacing rhythm, containers, layout utilities, mobile rules, and anti-patterns for future page work.
- `docs/hero-assets.md` defines the selected dark hero source, poster variants, crop strategy, loading rules, and regeneration workflow.
- `docs/motion-system.md` defines the Motion for React provider, presets, reveal components, reduced-motion strategy, performance rules, and animation guardrails.
- `docs/component-system.md` defines the internal page primitives, usage rules, accessibility expectations, and anti-patterns for future non-home pages.
- `docs/data-layer.md` defines the local-first project data-source layer, Supabase public read boundary, env modes, mappers, fallback behavior, and deferred backend work.
- `docs/admin-auth.md` defines the Supabase Auth admin foundation, magic-link flow, server guard, setup-required state, service-role boundary, and deferred CRUD/form work.
- `docs/project-data-model.md` defines the local project content model, safe link and media rules, visibility boundaries, randomizer settings, and future Supabase migration direction.
- `docs/about-content.md` defines the About page story arc, phase model, tone rules, tennis boundary, and future admin editability notes.
- `docs/experience-content.md` defines the Experience page trajectory model, proof rules, leadership and research boundaries, tennis handling, and future admin editability notes.
- `docs/tracker-content.md` defines the Tracker page manual signal model, source-label rules, future integration boundary, and anti-patterns.
- `docs/services-content.md` defines the Services page scoped-build model, Services vs Collaborate boundary, manual contact path, no-pricing rules, and future intake boundaries.
- `docs/collaborate-content.md` defines the Collaborate page broader-alignment model, fit rules, manual contact path, Services boundary, and future intake boundaries.
- `docs/contact-content.md` defines the Contact page verified-channel model, manual boundary, message brief, routing rules, and future intake boundaries.
- `docs/supabase-schema.md` defines the Supabase schema foundation, RLS strategy, setup runbook, table groups, environment placeholders, and future data/admin/form boundaries.

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
- `/admin/auth/callback`
- `/admin/logout`

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
- Project detail pages
- About page
- Experience page
- Tracker page
- Services page
- Collaborate page
- Contact page
- Project case study system
- Supabase-aware project data-source layer
- Admin auth and read-only dashboard foundation
- Connected tracker sources
- Admin content management
- Open Graph and social media assets

## Design System Notes

Semantic design tokens, theme-specific typography, spacing utilities, the public shell, and internal page template components now exist. Full final lower-page compositions, new cinematic assets, and page-specific visual systems remain deferred.

## Admin And Data Notes

The Supabase schema foundation now exists in `supabase/migrations`, Projects use a local-first data-source layer, and admin auth/dashboard foundation exists through Supabase SSR utilities. Supabase is still not required for build or public deployment. Live admin auth requires a real Supabase project, applied schema, public auth env values, a manually created Auth user, and a manually inserted active `admin_users` row. Admin editing flows, submissions backend behavior, and private write operations are intentionally deferred. No secrets should be committed. Use `.env.example` for safe placeholder examples only.

## Content Integrity

Do not add fake claims, fake stats, fake links, fake metrics, or fake live data. Placeholder pages should stay honest until real content is provided.
