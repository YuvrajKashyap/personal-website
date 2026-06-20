# SEO And Analytics

## 1. Step 33 Purpose

Step 33 adds the production discoverability and observability foundation for the public site.

It covers:

- site-wide metadata
- page-level metadata
- canonical URLs
- Open Graph and Twitter metadata
- generated share images
- sitemap
- robots rules
- verified JSON-LD structured data
- Vercel Analytics
- Vercel Speed Insights

It does not add custom event tracking, ad pixels, Search Console verification, marketing automation, or form-value tracking.

## 2. Metadata Strategy

Metadata starts from `src/config/seo.ts` and route helpers in `src/lib/seo/metadata.ts`.

The root layout defines the global defaults:

- canonical base: `https://yuvrajkashyap.com`
- title template: `%s | Yuvraj Kashyap`
- default title: `Yuvraj Kashyap`
- default description
- restrained keywords
- Open Graph defaults
- Twitter card defaults
- indexable public default

Public route pages should use `createPageMetadata()` unless a route has a clear reason for custom metadata.

## 3. Canonical URL Strategy

The canonical domain is:

```text
https://yuvrajkashyap.com
```

Do not use:

- `www` as canonical
- localhost URLs
- Vercel preview URLs
- unverified external profile URLs

Every public route metadata object should resolve to an apex canonical URL.

## 4. Open Graph Strategy

The root Open Graph image is generated in:

```text
src/app/opengraph-image.tsx
```

The image is coded with `next/og` and does not depend on external assets, external font files, or dark hero video media.

Project detail routes can use:

```text
src/app/(site)/projects/[slug]/opengraph-image.tsx
```

Project share previews must use the typed project model and must not invent results, screenshots, links, users, revenue, awards, client claims, or maturity claims.

## 5. Sitemap Strategy

The sitemap route lives at:

```text
src/app/sitemap.ts
```

It includes:

- public route metadata from `src/config/seo.ts`
- published project detail slugs from local typed project data

It excludes:

- `/admin`
- `/admin/login`
- `/admin/auth/callback`
- `/admin/logout`
- `/api/*`
- preview or debug routes

The sitemap must not require Supabase environment variables.

## 6. Robots Strategy

The robots route lives at:

```text
src/app/robots.ts
```

It allows public routes and disallows:

- `/admin`
- `/admin/`
- `/api`
- `/api/`

The sitemap URL points to:

```text
https://yuvrajkashyap.com/sitemap.xml
```

## 7. Structured Data Strategy

Structured data lives in:

```text
src/lib/seo/jsonld.ts
src/components/seo/JsonLd.tsx
src/components/seo/SiteStructuredData.tsx
```

Step 33 emits only verified Person and WebSite schema:

- name: Yuvraj Kashyap
- url: `https://yuvrajkashyap.com`
- sameAs: verified public links from `src/config/site.ts`

Do not add reviews, ratings, employer claims, alumni claims, organization claims, product offers, fake social profiles, email addresses, or founder/company claims without verified source content and explicit assignment.

## 8. Vercel Analytics Integration

The Vercel Analytics package is installed and rendered through:

```text
src/components/analytics/VercelAnalytics.tsx
```

It is mounted from the root layout after the app providers.

The wrapper avoids rendering on admin routes and drops telemetry for admin and API paths when the event URL is available.

## 9. Vercel Speed Insights Integration

The Vercel Speed Insights package is installed and rendered through the same wrapper:

```text
src/components/analytics/VercelAnalytics.tsx
```

Speed Insights is for performance signal only. It is not a custom user behavior tracking system.

## 10. Privacy Boundaries

Step 33 does not add:

- custom analytics events
- form submission events
- form field tracking
- session replay
- heatmaps
- ad pixels
- user identification
- tracking cookies added by site code
- tracking secrets

Do not track contact, services, or collaborate form field values.

## 11. Admin And API Noindex Boundaries

Admin pages use noindex metadata through `createNoindexMetadata()`.

Robots disallow admin and API paths.

The sitemap excludes admin and API paths.

Do not expose admin content, submissions data, auth state, audit data, or private operations through SEO surfaces.

## 12. Verification Commands

Run:

```bash
npm run lint
npm run typecheck
npm run build
git diff --check
npm ls @vercel/analytics --depth=0
npm ls @vercel/speed-insights --depth=0
```

Useful route checks:

```bash
curl -I http://localhost:3000/robots.txt
curl -I http://localhost:3000/sitemap.xml
curl -I http://localhost:3000/opengraph-image
curl -I http://localhost:3000/twitter-image
```

Useful scans:

```bash
rg -i "google-analytics|gtag|G-|UA-|facebook|meta pixel|hotjar|fullstory|posthog|segment|mixpanel|clarity|amplitude" src package.json docs README.md AGENTS.md
rg -i "localhost|vercel.app" src/app src/components src/config src/lib
```

Interpret documentation guardrails carefully. Runtime code should not include disallowed trackers or preview URLs.

## 13. Deferred

Deferred work:

- Search Console verification until a real token is provided
- favicon and app icon polish if approved assets are created
- project-specific visual OG art beyond the code-generated route
- analytics dashboard review after real production traffic
- custom analytics events, if a later step explicitly approves them

## 14. Step 34 QA Notes

Step 34 verified the SEO and analytics foundation through local route checks, SSR content checks, and static scans.

- `/robots.txt`, `/sitemap.xml`, `/opengraph-image`, and `/twitter-image` returned successfully in local production mode.
- Home metadata included canonical apex, Open Graph, Twitter, and verified JSON-LD output.
- Robots disallowed admin and API paths.
- Sitemap used canonical apex URLs and excluded admin and API routes.
- Admin routes retained noindex metadata.
- Static scans found localhost and preview deployment URLs only in documentation guardrails or local testing examples.
- Static scans did not find disallowed runtime analytics providers beyond Vercel Analytics and Speed Insights.

## 15. Anti-patterns

- Adding fake schema claims.
- Adding fake social profiles.
- Adding review, rating, client, award, employer, revenue, or user claims.
- Indexing admin or API routes.
- Using preview deployment URLs as canonical URLs.
- Making sitemap generation depend on Supabase env values.
- Tracking form values.
- Adding ad pixels, session replay, or marketing automation.
- Adding Search Console verification without a verified token.
- Turning metadata into public hype that the site content does not support.
