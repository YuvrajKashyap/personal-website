# Technical Architecture

## 1. Project north star

This website should feel like entering Yuvraj Kashyap's universe and operating system. It should signal elite builder, future founder, and systems-thinker energy while staying smooth, minimal, premium, responsive, accessible, and production-grade.

The current public home page is a premium temporary landing page. It protects the live brand while the final cinematic site is built, but it is not the final homepage and should not be treated as final design direction.

## 2. High-level app architecture

The project is one Next.js App Router application with one route structure, one future backend, one content/data model, and two premium visual experiences.

- Dark mode is the default experience.
- Light mode is the alternate experience.
- Visual composition may diverge between modes.
- Routes, data models, content sources, and business logic must stay unified.
- Shared logic should not be duplicated just because the dark and light presentations differ.
- The final site may use separate visual view components per theme when that gives cleaner implementation.

## 3. Route architecture

Current and planned public routes:

- `/`
- `/about`
- `/experience`
- `/projects`
- `/projects/[slug]`
- `/tracker`
- `/services`
- `/collaborate`
- `/contact`

Current admin routes:

- `/admin`
- `/admin/login`

Future admin routes:

- `/admin/projects`
- `/admin/about`
- `/admin/experience`
- `/admin/tracker`
- `/admin/submissions`
- `/admin/social-links`
- `/admin/site-settings`

Route groups may be used for organization. Public URLs should stay clean, and the `(site)` route group must never appear in URLs. Admin routes are private future management surfaces and should not be treated as public pages.

Do not create duplicate URLs for dark and light modes. Theme selection belongs inside the same route structure.

## 4. Theme architecture

The non-negotiable theme architecture is one app, one URL structure, one content/data model, and two premium visual experiences.

- Dark mode is default.
- Light mode is alternate.
- Dark and light views can diverge in layout and composition.
- Shared data and logic must not be duplicated.
- Shared primitives should live in shared folders.
- Theme-specific components should live in theme-specific or feature-specific files.
- Heavy dark-only assets must not load in light mode.
- Theme state should eventually be cookie-aware, not only `localStorage`, to avoid initial theme flash.
- Reduced motion should be supported from the foundation.
- The final theme provider and design token system come in a later step.

Future home pattern:

```text
src/features/home/HomePage.tsx
src/features/home/HomeDark.tsx
src/features/home/HomeLight.tsx
src/features/home/home-content.ts
```

`HomePage` should own theme-aware view selection. `HomeDark` should own the dark cinematic composition. `HomeLight` should own the light editorial composition. Both should consume the same content/data shape from `home-content.ts` or a shared typed source.

Step 6 implementation details:

- Theme cookie name is `yk-theme`.
- Cookie-backed theme resolution lives in `src/lib/theme/server.ts`.
- Shared theme constants, default mode, and validation live in `src/lib/theme/theme.ts`.
- Dark mode is the default when the cookie is missing or invalid.
- The root layout reads the server theme and sets `html[data-theme]` before paint.
- `ThemeProvider` lives in `src/components/theme/ThemeProvider.tsx`.
- `ThemeToggle` lives in `src/components/theme/ThemeToggle.tsx`.
- Cookie-backed persistence is the source of truth for refresh behavior.
- Do not replace this with client-only `localStorage` logic.
- Do not create separate routes or apps for dark and light mode.
- Heavy dark assets must remain conditionally loaded later so light mode does not download them.
- A reduced-motion CSS baseline exists in `src/app/globals.css`.

Step 7 design-token implementation details:

- Semantic tokens in `src/app/globals.css` are the source of truth for theme-aware UI.
- Components should consume semantic tokens through Tailwind v4 token utilities or direct CSS variables.
- Dark and light token values can diverge visually while preserving shared structure and content.
- Avoid hardcoded theme-specific colors in components.
- Utility classes are available for page shells, containers, glass panels, cards, orbital lines, focus rings, vignette overlays, and grain overlays.
- Full page-specific visual divergence still comes later.
- This token work is not final homepage, final navigation, final footer, or cinematic hero work.

Step 8 typography and spacing implementation details:

- Typography can be theme-specific while the app, routes, data, and content stay shared.
- Dark mode uses Space Grotesk for main/interface typography and Space Mono for accent/telemetry typography.
- Light mode uses Geist Sans for main/interface typography and Geist Mono for accent/metadata typography.
- Typography tokens and utilities live in `src/app/globals.css`.
- Spacing, container, section, card, stack, cluster, and grid utilities live in `src/app/globals.css`.
- Future components should use the shared typography and spacing utilities before creating one-off sizes or gaps.
- Preserve readable line lengths, visible focus states, and mobile-safe spacing.
- Do not overuse mono, convert body text to mono, or add additional fonts without an assigned step.

Step 9 global layout implementation details:

- Public routes are wrapped by `src/app/(site)/layout.tsx`.
- The public route group renders `SiteHeader` before page content and `SiteFooter` after page content.
- Admin routes under `src/app/admin` are not wrapped by the public site shell.
- The locked public nav order is Home, About, Experience, Projects, Tracker, Services, Collaborate, Get in Touch.
- Navigation items should stay centralized in `src/config/site.ts`.
- Get in Touch maps to `/contact` and remains a distinct CTA.
- Active route state is owned by the client navigation component because it uses `usePathname`.
- `/projects` and `/projects/[slug]` both mark Projects active.
- `/contact` marks the Get in Touch CTA active.
- The theme toggle lives in the header so it is available across public routes.
- The footer includes a quiet admin entry to `/admin/login`, not a public CTA.
- Mobile navigation must keep real buttons, `aria-expanded`, `aria-controls`, usable tap targets, and readable active states.
- The skip link targets `#main-content` and must remain keyboard accessible.

Step 10 hero asset preparation details:

- The selected dark-mode source image is stored at `assets/source/hero/singularity-hero-source.png`.
- Source assets stay separate from optimized production assets.
- Optimized still posters are generated into `public/media/hero`.
- The generated desktop poster is `public/media/hero/singularity-poster.webp`.
- The generated tablet poster is `public/media/hero/singularity-poster-tablet.webp`.
- The generated mobile poster is `public/media/hero/singularity-poster-mobile.webp`.
- Typed media paths live in `src/config/media.ts`.
- Poster generation is repeatable with `npm run prepare:hero`.
- Future hero animation or video should derive from this source or its approved descendants.
- These assets are not integrated into the homepage yet.
- Dark cinematic hero assets must only load in dark mode later.
- Light mode must not download dark cinematic hero assets.
- Text, navigation, buttons, telemetry, and UI panels must remain coded UI, not baked into the image.

Step 12 optimized hero video details:

- Production hero video assets live in `public/media/hero`.
- Desktop video paths are `singularity-loop.webm` and `singularity-loop.mp4`.
- Mobile video paths are `singularity-loop-mobile.webm` and `singularity-loop-mobile.mp4`.
- Typed media paths live in `src/config/media.ts`.
- Regenerate approved production videos with `npm run optimize:hero-video`.
- The raw candidate folder `assets/source/hero/animation-candidates/` remains ignored and uncommitted.
- Homepage integration still comes later.
- Future homepage implementation must conditionally load these dark video assets only in dark mode.
- Reduced-motion and video failure states must use the still poster fallback.
- No text, buttons, navigation, metrics, or UI panels should be baked into the video.

Step 13 static dark home hero details:

- Home feature files live in `src/features/home`.
- `HomePage` chooses between theme-specific views using the current theme.
- `HomeDark` renders the static Singularity OS hero with the optimized poster image.
- `HomeLight` remains a polished Ivory Observatory temporary view until the final light hero step.
- Shared homepage copy lives in `src/features/home/home-content.ts`.
- The dark poster is only rendered by `HomeDark`.
- The light view must not render dark hero poster or video tags.
- No video integration happened in this step.
- Text, CTAs, telemetry chips, and UI are coded elements layered over the asset.

Step 14 dark hero video integration details:

- `HomeDark` now uses the optimized hero video as an environmental background layer.
- The reusable video layer lives in `src/features/home/HeroVideoBackground.tsx`.
- WebM sources are ordered before MP4 fallbacks.
- Mobile WebM and MP4 sources are preserved for small viewports.
- The still poster remains behind the video as the loading, failure, and reduced-motion fallback.
- Reduced-motion users should see the static poster and should not autoplay the video.
- `HomeLight` remains isolated and must not render or reference dark poster or video assets.
- The video is decorative, `aria-hidden`, muted, looped, and `playsInline`.
- Hero text, CTAs, telemetry chips, navigation, and overlays remain coded UI layered above media.

Step 15 light home hero details:

- `HomeLight` is now a final-direction Ivory Observatory hero instead of a temporary placeholder.
- Dark and light home heroes intentionally diverge in layout and visual language while sharing the same core content and links.
- The light hero uses coded CSS and SVG observatory motifs, including orbital rings, axis lines, metadata chips, and an editorial instrument panel.
- The light hero uses the ivory, charcoal, and laal red token family from `src/app/globals.css`.
- `HomeLight` must not render or reference dark hero posters, videos, source tags, or media paths.
- Shared home copy remains in `src/features/home/home-content.ts`.
- No lower homepage sections were added in this step.

Step 16 orbital navigation details:

- The reusable orbital destination navigation lives in `src/components/navigation/OrbitalNavigation.tsx`.
- Destination data lives in `src/config/site.ts` as `orbitalDestinations`.
- The orbital navigation is secondary to the global header navigation, not a replacement.
- `HomeDark` uses the dark Singularity OS variant beside the hero copy.
- `HomeLight` uses the light Ivory Observatory variant inside the observatory panel.
- The component includes a desktop SVG orbit map and a mobile card fallback.
- Links are real navigation links with accessible labels and visible focus states.
- No animation library was added.
- Light mode must continue to avoid dark cinematic media while using the orbital navigation.

## 5. Dark mode: Singularity OS

Singularity OS is the default visual identity.

- Dark obsidian and void black foundation.
- Warm gold light as the primary accent.
- Cinematic black hole, orbital, and astrophysics direction.
- Orbital navigation and telemetry motifs.
- Premium cinematic motion when later implemented.
- Final hero video or image should only load in dark mode.
- Avoid cheesy sci-fi clutter.
- Preserve readability, performance, and accessibility.

## 6. Light mode: Ivory Observatory

Ivory Observatory is the alternate visual identity.

- Ivory and beige editorial/product interface.
- Laal red, lacquer red, and deep oxblood accents.
- Subtle orbital diagrams.
- No animated black-hole video background.
- Calm, premium, readable composition.
- Same content and routes as dark mode.
- Different layout is allowed where useful.

## 7. Shared data/content architecture

Content starts locally in `src/content` and `src/data`. Future Supabase content should follow the same typed shapes rather than forcing route components to change.

- Public pages should consume typed content/data through shared models.
- Do not hardcode theme-specific copy into shared data.
- Theme-specific display logic can exist, but source content should stay unified.
- No fake data, fake stats, fake claims, fake links, or fake live metrics.
- Published content should be explicit later, especially once backend content exists.

## 8. Feature folder architecture

Recommended future feature folders:

```text
src/features/home/
src/features/about/
src/features/experience/
src/features/projects/
src/features/tracker/
src/features/services/
src/features/collaborate/
src/features/contact/
src/features/admin/
```

Guidelines:

- Route files stay thin.
- Feature components own page-specific composition.
- Content and data stay separate from visual components.
- Theme-specific visual divergence is allowed when useful.
- Not every page needs separate dark and light files if a shared layout works.
- Do not move the current temporary homepage until a later step assigns that refactor.

## 9. Component architecture

Recommended component folders:

```text
src/components/shared/
src/components/ui/
src/components/layout/
src/components/theme/
src/components/effects/
```

- `shared` contains reusable cross-site components.
- `ui` contains primitive UI pieces such as buttons, badges, inputs, and panels.
- `layout` contains shells, navigation, footer, and page chrome.
- `theme` contains future theme controls, provider code, and theme utilities.
- `effects` contains visual-only CSS, SVG, canvas, or WebGL wrappers.

Effects must degrade gracefully. Do not put business logic or data access inside visual effects components.

## 10. Asset architecture

Current and future asset folders:

```text
public/media/hero/
public/media/projects/
public/media/og/
public/media/social/
public/media/textures/
public/media/references/
```

Naming conventions:

- `singularity-hero-source.png`
- `singularity-poster.webp`
- `singularity-loop.webm`
- `singularity-loop.mp4`
- `singularity-mobile-poster.webp`
- `project-aletheia-cover.webp`
- `project-atlas-cover.webp`
- `og-home-dark.webp`
- `og-home-light.webp`

Rules:

- Important text must not be baked into images or videos.
- Dark hero video loads only in dark mode.
- Light mode must not download dark cinematic video.
- Image and video assets should be optimized before production use.
- Poster fallback is required for heavy video.
- Mobile fallback is required for heavy assets.
- Reduced-motion fallback is required.
- `public/media/references` is for inspiration and raw references, not necessarily production assets.

## 11. Motion/animation architecture

Future stack options, not installed now:

- Motion for UI animation.
- GSAP for cinematic, timeline, or scroll sequences if needed.
- Three.js, React Three Fiber, and Drei only when real 3D or WebGL is justified.
- Lenis only if premium scroll behavior is needed.
- AI-generated image or video assets for cinematic backgrounds.
- CSS and SVG for lightweight orbital motifs.

Best stack does not mean install everything immediately. Install libraries only when their step begins and there is a clear purpose.

## 12. Performance architecture

Performance rules:

- Keep public pages fast.
- Avoid unnecessary client components.
- Prefer Server Components unless interactivity is needed.
- Lazy-load heavy visual layers.
- Do not load dark hero video in light mode.
- Support reduced motion.
- Optimize images and videos before production use.
- Protect first contentful paint.
- Avoid layout shift.
- Use progressive enhancement for WebGL and cinematic effects.
- Avoid laggy cool-demo behavior.
- Avoid global client wrappers unless they serve a clear need.

## 13. Accessibility architecture

Accessibility rules:

- Use semantic HTML.
- Preserve keyboard navigation.
- Provide visible focus states.
- Support reduced motion.
- Maintain color contrast.
- Use labels for forms.
- Do not bake text into images.
- Navigation must be usable without orbital UI.
- Dark and light themes must both be accessible.
- Mobile must be usable.
- Interactions must not rely only on hover.
- Visual spectacle must not block content access.

## 14. SEO/metadata architecture

Metadata should be accurate and minimal early. Do not add fake Open Graph claims or imply unfinished systems are live.

- Canonical domain is `https://yuvrajkashyap.com`.
- Public copy should be real and maintainable.
- Metadata should evolve with real pages and real content.
- Future OG images may have dark and light variants.
- Do not add `metadataBase` until deployment/domain handling is intentionally assigned or already safe.

## 15. Supabase/backend boundary

Supabase comes later. Do not implement it in the architecture step.

Future approach:

- Portfolio schema comes later.
- Public site first, admin second.
- Local content first, then Supabase-backed content.
- No service role key in client-side code.
- Public reads for published content later.
- Public inserts for submissions later.
- Admin-only management later.
- Treat Supabase and Postgres as a real backend, not magic.
- Keep data access behind server-side boundaries when needed.

## 16. Admin boundary

Admin routes are stubs right now. They should eventually manage projects, about sections, experience, tracker content, submissions, social links, and site settings.

- Admin is not public-facing.
- Admin must use real auth later.
- No admin functionality should be faked.
- Admin implementation must not leak private operations into public client code.
- Public pages should never rely on private admin-only client state.

## 17. Deployment/domain architecture

Current known deployment:

- GitHub repo: `https://github.com/YuvrajKashyap/personal-website`
- Vercel project: `personal-website`
- Production branch: `main`
- Canonical domain: `https://yuvrajkashyap.com`
- `www` redirects to the apex/root domain.
- Current temporary landing page is live.
- Vercel redeploys from `main`.

## 18. Future implementation sequence notes

High-level sequence guardrails:

- Architecture docs first.
- Theme foundation now exists.
- Design token foundation now exists.
- Typography and spacing foundation now exists.
- Public layout, navigation, mobile menu, and footer now exist.
- Dark hero still poster assets now exist.
- Optimized dark hero video assets now exist.
- Static dark home hero now exists.
- Dark hero video integration now exists.
- Final-direction light home hero now exists.
- Orbital home navigation now exists.
- Final home architecture later.
- Cinematic assets later.
- Feature pages later.
- Supabase and admin later.
- Analytics and performance measurement later.

Do not jump ahead just because a folder exists.

## 19. Non-negotiable guardrails

- Do not split into two apps.
- Do not duplicate routes for dark/light.
- Do not duplicate data logic for dark/light.
- Do not load heavy dark assets in light mode.
- Do not install major visual libraries before their step.
- Do not add fake stats or fake claims.
- Do not commit secrets.
- Do not use service role keys in client code.
- Do not bake important text into images or videos.
- Do not sacrifice accessibility for cinematic effects.
- Do not sacrifice performance for spectacle.
- Do not use em dashes in final website copy.
- Preserve the canonical domain setup.
