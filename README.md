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

## Current Step Status

Step 8 adds the typography and spacing foundation while the final cinematic website is built. The home page remains a premium temporary public landing page, and the non-home pages remain route stubs. The cinematic hero, animations, admin functionality, database integration, and live content systems are not implemented yet.

## Documentation

- `docs/architecture.md` defines the durable technical architecture, including the one-app/two-visual-experience model, route structure, content/data boundaries, asset rules, performance guardrails, accessibility expectations, and future Supabase/admin boundaries.
- `docs/design-tokens.md` defines the semantic token groups, theme palette direction, utility classes, usage rules, and anti-patterns for future UI work.
- `docs/typography-spacing.md` defines the two-font rule, type scale, spacing rhythm, containers, layout utilities, mobile rules, and anti-patterns for future page work.

## Local Commands

```bash
npm run dev
npm run lint
npm run typecheck
npm run build
npm run start
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
- Project case study system
- Tracker and operating metrics interface
- Services and collaboration flows
- Admin area and content management
- Supabase or another backend if assigned in a later step
- Open Graph and social media assets

## Design System Notes

Dark and light design systems come later. This scaffold uses a minimal dark neutral baseline only so routes are usable and readable.

## Admin And Data Notes

Supabase, authentication, admin editing flows, and private operations are intentionally deferred. No secrets should be committed. Use `.env.example` for safe public environment examples only.

## Content Integrity

Do not add fake claims, fake stats, fake links, fake metrics, or fake live data. Placeholder pages should stay honest until real content is provided.
