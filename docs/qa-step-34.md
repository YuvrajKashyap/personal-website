# Step 34 QA Report

## 1. Purpose

Step 34 verifies performance, accessibility, responsive behavior, theme behavior, media loading, SEO boundaries, submissions behavior, admin boundaries, and security posture before the next implementation phase.

This pass does not add new features. It records evidence, documents known caveats, and keeps the current production app stable.

## 2. Scope

Checked areas:

- Public route loading.
- Admin route boundary.
- Desktop and mobile responsive behavior.
- Keyboard and focus affordances.
- Mobile navigation semantics.
- Dark and light theme behavior.
- Reduced-motion hero behavior.
- Dark-only media loading boundary.
- SEO, metadata, Open Graph, robots, and sitemap boundaries.
- Submissions API no-env and validation behavior.
- Admin setup-required state.
- Secret and tracking scans.
- npm audit advisory status.

Not changed:

- No redesign.
- No new routes.
- No new packages.
- No DNS, Vercel, or environment changes.
- No Supabase CRUD.
- No analytics events or providers.
- No package audit fixes.

## 3. Local Verification Commands

Baseline and final gates:

```bash
npm run lint
npm run typecheck
npm run build
git diff --check
```

Additional QA commands used:

```bash
npm start
npm audit --audit-level=moderate
rg -i "localhost|vercel.app" src/app src/components src/config src/lib docs README.md AGENTS.md
rg -i "google-analytics|gtag|G-|UA-|facebook|meta pixel|hotjar|fullstory|posthog|segment|mixpanel|clarity|amplitude" src package.json docs README.md AGENTS.md
rg -i "review|rating|award|customers|users|revenue|mrr|client logos|testimonial|founder of|CEO of|company founder" src/app src/components src/config src/features src/lib docs README.md AGENTS.md
rg -i "SUPABASE_SERVICE_ROLE|SUPABASE_SECRET|service_role|sb_secret|postgres://|postgresql://|eyJ" src .env.example docs README.md AGENTS.md supabase --glob "!node_modules" --glob "!package-lock.json"
git ls-files .env.local
```

Headless Chrome DevTools Protocol was used for browser checks because the `agent-browser` CLI was unavailable in this environment.

## 4. Route Coverage

Local built server route checks returned expected statuses:

- `/`: 200
- `/about`: 200
- `/experience`: 200
- `/tracker`: 200
- `/services`: 200
- `/collaborate`: 200
- `/contact`: 200
- `/projects`: 200
- `/projects/aletheia`: 200
- `/projects/atlas`: 200
- `/projects/personal-website`: 200
- `/projects/not-real-slug`: 200 safe content boundary
- `/admin`: 200
- `/admin/login`: 200
- `/admin/auth/callback`: 307 safe redirect without a code
- `/api/submissions`: 405 for GET
- `/robots.txt`: 200
- `/sitemap.xml`: 200
- `/opengraph-image`: 200
- `/twitter-image`: 200

## 5. Responsive QA

Headless Chrome checks covered key routes at 320, 390, 768, 1280, and 1920 pixel widths.

Checked routes:

- `/`
- `/projects`
- `/projects/aletheia`
- `/contact`
- `/admin/login`

Observed results:

- No horizontal overflow detected on checked routes and widths.
- Each checked route rendered one `h1`.
- Public routes rendered the public header and footer.
- Admin login rendered the admin shell and did not render the public site shell.
- No unnamed active buttons or links were found on checked routes.

## 6. Keyboard And Accessibility QA

Observed results:

- Skip link exists and targets `#main-content`.
- Skip link can receive focus in the browser check.
- Header navigation uses real links.
- Mobile menu uses a real button with `aria-expanded` and `aria-controls`.
- Mobile menu opens, exposes the locked nav links, and closes after link click.
- Submission fields use labels.
- Honeypot fields stay hidden and are not keyboard targets.
- Theme toggle is a real button with an accessible label.
- Orbital navigation uses real links and includes a mobile fallback list.

Manual screen-reader testing was not performed in this environment.

## 7. Theme QA

Theme browser checks confirmed:

- No cookie defaults to `data-theme="dark"`.
- Clicking the theme toggle switches to light.
- `yk-theme=light` is written.
- Refresh preserves light mode.
- Clicking again switches to dark.
- `yk-theme=dark` is written.
- Refresh preserves dark mode.

## 8. Media And Performance QA

Dark mode media checks with `prefers-reduced-motion: no-preference` confirmed:

- One decorative hero video mounts.
- WebM sources are before MP4 fallbacks.
- Mobile WebM and MP4 sources are present.
- Poster sources are present.

Observed dark video sources:

- `/media/hero/singularity-loop-mobile.webm`
- `/media/hero/singularity-loop-mobile.mp4`
- `/media/hero/singularity-loop.webm`
- `/media/hero/singularity-loop.mp4`

Reduced-motion checks confirmed:

- `prefers-reduced-motion: reduce` removes the video element.
- Static poster sources remain available.

Light mode checks confirmed:

- `data-theme="light"` renders the light home experience.
- The light DOM does not contain `singularity-loop` or `singularity-poster`.
- No dark hero video or picture element is rendered in light mode.

## 9. SEO And Metadata QA

Verified by SSR and route checks:

- Home metadata uses the canonical apex domain.
- Open Graph metadata is present.
- Twitter metadata is present.
- Site JSON-LD is present.
- `/robots.txt` is available.
- `/sitemap.xml` is available.
- Robots disallow admin and API paths.
- Sitemap uses canonical apex URLs.
- Sitemap excludes admin and API routes.
- Admin pages use noindex metadata.

Scans did not find runtime canonical URLs pointing to localhost or Vercel preview URLs. Documentation mentions localhost and preview URLs only as guardrails or local test examples.

## 10. Analytics QA

Vercel Analytics and Speed Insights remain mounted through the privacy-aware wrapper.

Observed boundaries:

- No Google Analytics, Meta Pixel, session replay, heatmap, PostHog, Segment, Mixpanel, Clarity, or Amplitude runtime integration was found.
- Search results for `clarity` were documentation and content words, not Microsoft Clarity.
- Analytics wrapper excludes admin rendering and drops admin or API telemetry when URL data is available.
- No custom form field tracking was added.

## 11. Submissions QA

Local API checks confirmed:

- `GET /api/submissions` returns 405.
- Valid submission payload with missing server-side Supabase values returns 503.
- Invalid payload returns 400.
- Honeypot payload returns 400.

Public form checks confirmed:

- Contact, Services, and Collaborate render no-env setup copy when backend values are missing.
- Forms do not show fake success states.
- Browser code does not write directly to Supabase.
- Supabase browser client usage is limited to admin login Auth.

## 12. Admin Boundary QA

Observed results:

- `/admin/login` renders the admin shell.
- `/admin/login` does not render `.site-header`.
- `/admin/login` does not render the public footer.
- `/admin/login` does not render public primary or mobile navigation.
- `/admin` returns setup-required or guarded admin state, not a fake public page.
- Admin routes stay outside the public site route group.

## 13. Security And Secrets QA

Observed results:

- `.env.local` is not tracked.
- No local `.env.local` file was present during this pass.
- Secret scans found only safe placeholders, documentation references, SQL role names, and server-only code paths.
- `SUPABASE_SECRET_KEY` and `SUPABASE_SERVICE_ROLE_KEY` remain server-only placeholders.
- No JWT-like `eyJ` token was found in scanned source and docs paths.

## 14. npm Audit Notes

`npm audit --audit-level=moderate` reported 5 vulnerabilities:

- 1 low
- 3 moderate
- 1 high

Packages/advisory groups reported:

- `@babel/core`
- `brace-expansion`
- `js-yaml`
- `next`
- `postcss`

The Next.js and PostCSS advisory remediation suggests `npm audit fix --force`, which would install `next@16.2.9` outside the current stated dependency range. Step 34 explicitly does not force-fix audit output, downgrade packages, or change dependency strategy.

## 15. Issues Found

No required runtime code fixes were found.

Documented caveats:

- `agent-browser` CLI was not installed in the environment.
- Full normal-browser manual assistive technology testing was not performed.
- npm audit advisories remain pending for a later dependency/security decision.

## 16. Deferred To Step 35 Or Later

Recommended deferred items:

- Decide dependency security response for the npm audit advisories.
- Run manual browser QA with a real browser session for keyboard order, screen reader behavior, and tactile mobile menu feel.
- Review production Vercel observability dashboard after real traffic exists.
- Run Lighthouse or equivalent lab testing if Step 35 assigns performance measurement.
- Review bundle and route performance after any future homepage or media changes.

## 17. Final Local QA Status

Local QA status is passing with documented caveats.

The current implementation preserves:

- one app and one route structure
- cookie-backed theme persistence
- dark-only hero media boundary
- light mode media isolation
- reduced-motion video fallback
- public route shell
- admin boundary
- submissions server route boundary
- SEO and analytics boundaries
- no-secret policy

## Step 35 Follow-up

Step 35 extends this QA with the final taste, recruiter, founder/builder, content honesty, route, responsive, keyboard, theme/media, SEO, submissions, admin, performance, security, and npm audit pass.

Follow-up evidence lives in `docs/final-launch-audit.md`.

Step 35 also fixed a 1024px public-header overflow by moving the desktop navigation breakpoint from `lg` to `xl`.
