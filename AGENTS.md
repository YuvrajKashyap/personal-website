# AGENTS

## Project North Star

Build a visually unforgettable, cinematic, orbital and astrophysics-themed personal website that feels like entering Yuvraj's universe and instantly signals elite builder, future founder, and systems-thinker energy while staying smooth, minimal, premium, responsive, accessible, and production-grade.

## Mantra

We are not happy with decent or good. We go above and beyond.

## Design Direction

Default dark mode is Singularity OS: cinematic black hole, orbital and astrophysics interface language, obsidian, void black, warm gold light, orbital UI, telemetry, premium cinematic motion, and real coded UI layered over cinematic assets.

Alternate light mode is Ivory Observatory: ivory and beige editorial premium interface, laal red, lacquer red, and deep oxblood accents, no animated black-hole video background, calmer premium layout, same content and routes, and different layout allowed where useful.

## Rules For Future Agents

- Follow `docs/architecture.md` before making structural decisions.
- Preserve the one-app, two-visual-experience architecture.
- Do not create separate dark and light apps, URLs, routes, backends, or data layers.
- Preserve the cookie-backed theme initial render through `yk-theme`.
- Do not replace theme persistence with client-only `localStorage` logic.
- Do not hardcode theme-specific assumptions into shared data.
- Use semantic design tokens from `src/app/globals.css`.
- Use typography and spacing utilities from `src/app/globals.css` where appropriate.
- Preserve dark mode typography as Space Grotesk plus Space Mono.
- Preserve light mode typography as Geist Sans plus Geist Mono.
- Preserve the locked public nav order: Home, About, Experience, Projects, Tracker, Services, Collaborate, Get in Touch.
- Keep Get in Touch mapped to `/contact` and styled as a CTA.
- Keep public nav items centralized in `src/config/site.ts`.
- Keep orbital home destination data centralized in `src/config/site.ts`.
- Treat orbital navigation as secondary to the global top navigation, never as its replacement.
- Preserve accessible real links, visible focus states, and mobile fallback in orbital navigation.
- Do not make orbital navigation hover-only or pointer-only.
- Keep dark and light orbital navigation variants visually distinct but data-shared.
- Do not overclutter the hero with orbital navigation.
- Do not add animation libraries for orbital navigation unless a later assigned step explicitly asks for them.
- Do not add fake stats or fake live data to orbital navigation.
- Motion for React is the UI animation library. Import from `motion/react`.
- Use motion presets from `src/lib/motion/presets.ts` before inventing new timings.
- Use `MotionSystemProvider` and `MotionConfig` reduced-motion behavior.
- Respect reduced motion in loops, entrance animation, and interaction animation.
- Do not add random animation timings.
- Do not use bouncy, gimmicky, chaotic, or game-like motion.
- Do not animate layout-affecting properties when opacity and transform work.
- Do not sacrifice accessibility or performance for motion.
- Do not install GSAP, Three.js, React Three Fiber, Drei, Lenis, Supabase, or analytics unless a later assigned step explicitly asks for them.
- Do not wrap admin routes with the public shell unless a later assigned step explicitly changes that boundary.
- Keep the header and footer token-driven, accessible, and responsive.
- Keep mobile navigation keyboard accessible with real button semantics.
- Do not make the navigation generic SaaS template styling.
- Do not add fake social links.
- Preserve hero asset naming in `assets/source/hero`, `public/media/hero`, and `src/config/media.ts`.
- Do not replace `singularity-hero-source.png` without architect approval.
- Use `npm run prepare:hero` when regenerating hero posters.
- Use `npm run optimize:hero-video` when regenerating approved production hero videos.
- Keep generated hero assets optimized and documented.
- Do not edit optimized hero video names without updating `src/config/media.ts` and `docs/hero-assets.md`.
- Do not commit raw candidate videos.
- Preserve the `HomePage`, `HomeDark`, `HomeLight`, and `home-content` feature split unless an assigned step changes it.
- `HomeDark` and `HomeLight` may diverge visually while sharing content.
- Lower Home sections should stay curated, low-density, and gateway-oriented.
- Do not overload Home with full About, Projects, Tracker, Services, Collaborate, or Contact page content.
- Do not add fake Home metrics, fake project links, or fake live tracker data.
- Keep Tracker preview framed honestly as manual current-state signal until live systems exist.
- Keep Services and Collaborate distinct.
- Preserve shared Home section content/data where practical.
- Use internal page template components for future non-home public pages.
- Prefer `PageHero`, `SectionShell`, `DetailLayout`, `CosmicCard`, `TelemetryCard`, `StatusBadge`, `LinkButton`, `EmptyState`, and `FormShell` before creating one-off layouts.
- Do not build one-off page layouts unless the assigned step gives a clear reason.
- Do not fake tracker metrics, project details, live status, forms, submissions, or success states.
- Use source labels on telemetry cards when values could be mistaken for live data.
- Treat `FormShell` as a wrapper only until a real form step is assigned.
- Keep internal page placeholders honest and clearly bounded.
- Keep admin routes outside the public template system unless an assigned step changes that boundary.
- Use typed project data from `src/data/projects.ts` and helpers from `src/lib/projects`.
- Do not duplicate project preview content in Home when the shared project model can supply it.
- Never invent project links, repositories, screenshots, videos, metrics, customer counts, revenue, users, or live data.
- Never show `needs_review` project links as verified public links.
- Project media must point to existing assets, be marked for review, or be omitted.
- Preserve project randomizer fields so future discovery UI can use the same data model.
- Keep the project model friendly to a later Supabase migration.
- Do not overclaim Arcade or any project with third-party, embedded, or open-source attribution boundaries.
- Do not upgrade draft, practice, archive, or needs-review projects into flagship placement without architect approval.
- Preserve the `/projects` archive as the public project discovery surface.
- Keep Project archive filters backed by the shared project model, not duplicated arrays.
- Keep random project routing backed by `getRandomizerPool()`.
- Keep Project cards honest about missing media, links, metrics, screenshots, and case studies.
- Do not show `needs_review` links as public buttons, even when a card needs a secondary action.
- Keep project detail routes model-backed and bounded until full case studies are explicitly assigned.
- Project detail pages must stay driven by `src/data/projects.ts` and the typed project model.
- Future detail edits should update project data first, then render it through the shared detail components.
- Do not invent project architecture details, case-study results, screenshots, repos, demos, users, revenue, adoption, benchmarks, awards, or client claims.
- Do not show `needs_review` links as verified actions on project detail pages.
- If a project is draft or needs review, keep that status visible in the detail page.
- Unknown or hidden project slugs must stay behind a safe content boundary.
- Keep project detail media as coded placeholders unless real approved media exists.
- Keep the About page human, structured, and distinct from Experience.
- Keep About content driven by `src/features/about/about-content.ts`.
- Do not turn About into a resume dump or generic biography.
- Tennis should appear as discipline and proof, not as the main visual theme.
- Do not invent About awards, jobs, rankings, outcomes, founder claims, or metrics.
- Do not expose F-1, visa, immigration, or sensitive private details publicly without explicit approval.
- Keep the Experience page proof-oriented, structured, and distinct from About.
- Keep Experience content driven by `src/features/experience/experience-content.ts`.
- Do not turn Experience into a resume dump or LinkedIn clone.
- Do not invent Experience roles, internships, companies, dates, metrics, GPA claims, awards, research results, publications, or project outcomes.
- Tennis may appear as discipline and proof, not as the main visual theme.
- Keep the Tracker page manual, source-labeled, and distinct from Projects, About, and Experience.
- Keep Tracker content driven by `src/features/tracker/tracker-content.ts`.
- Do not turn Tracker into a fake dashboard or analytics surface.
- Do not fake Tracker metrics, timestamps, streaks, hours, LeetCode counts, GitHub activity, private routine numbers, revenue, customers, users, or traction.
- Use source labels on Tracker status cards and any surface that could look like connected data.
- Treat Tracker as local/manual content until Supabase, admin editing, and real integrations are assigned and implemented.
- Do not overexpose private personal data in Tracker.
- Keep the Services page focused on scoped build requests.
- Keep Services content driven by `src/features/services/services-content.ts`.
- Keep Services distinct from Collaborate. Services is scoped execution. Collaborate is broader aligned opportunity.
- Do not turn Services into a generic freelancer, agency, pricing, or booking page.
- Do not add fake pricing, packages, testimonials, client claims, guarantees, availability claims, delivery timelines, or demand signals.
- Do not add fake forms, fake submissions, payment flows, booking tools, scheduling integrations, or backend intake behavior unless an assigned step explicitly requires them.
- Route Services CTAs to Contact until a real contact flow is built.
- Keep the Collaborate page focused on broader aligned opportunities.
- Keep Collaborate content driven by `src/features/collaborate/collaborate-content.ts`.
- Keep Collaborate distinct from Services. Collaborate is broader alignment. Services is scoped execution.
- Do not turn Collaborate into a generic networking, startup theater, or vague opportunity page.
- Do not add fake collaborations, fake affiliations, fake outcomes, fake demand signals, fake founders, fake advisors, fake investors, or fake external proof.
- Do not add fake forms, fake submissions, payment flows, booking tools, scheduling integrations, calendars, or backend routing unless an assigned step explicitly requires them.
- Route Collaborate CTAs to Contact until a real contact flow is built.
- `HomeLight` is now the final-direction Ivory Observatory hero, not a placeholder.
- Keep `HomeLight` editorial, premium, token-driven, and distinct from the dark hero.
- Do not regress light mode into a generic beige template or a simple inverted dark hero.
- Do not bake UI text, navigation, panels, buttons, stats, or claims into hero assets.
- Do not load dark hero media in light mode.
- Do not render hidden dark hero media in the light DOM.
- Do not add fake hero stats.
- Dark hero video is integrated in `HomeDark` only.
- Video integration must preserve poster and reduced-motion fallbacks.
- Do not remove the poster fallback behind the video.
- Do not autoplay video for reduced-motion users.
- Keep hero text, CTAs, telemetry, navigation, and overlays as coded UI.
- Keep WebM sources before MP4 fallbacks.
- Preserve mobile video sources unless an assigned step changes the media strategy.
- Do not change hero video media paths without updating `src/config/media.ts` and `docs/hero-assets.md` together.
- Avoid hardcoded colors in components.
- Avoid hardcoded spacing values when shared utilities fit.
- Do not add random fonts or one-off type scales.
- Do not overuse mono.
- Do not convert body text to mono.
- Preserve readable line lengths.
- Test mobile spacing when touching layout.
- Preserve contrast in both themes.
- Test both themes when touching UI.
- Do not create one-off colors without a clear reason.
- Do not make light mode an inverted dark mode.
- Do not load heavy dark assets in light mode.
- Keep dark and light experiences accessible.
- Preserve reduced-motion support.
- Stay within the assigned step. Do not move ahead without explicit instruction.
- Do not create generic template pages or leave obvious framework starter copy.
- Do not add fake claims, fake stats, fake links, fake metrics, or fake live data.
- Do not hardcode secrets.
- Do not add service role keys.
- Do not commit secrets.
- Do not use em dashes in final public-facing website copy.
- Do not bake important text into images.
- Prioritize performance, accessibility, responsiveness, and production quality.
- Report files changed and commands run.
- Do not add a new theme package unless the assigned step explicitly requires it.
- Do not install major new libraries unless the assigned step asks for them.
- Do not install GSAP, Three.js, React Three Fiber, Lenis, Supabase, or future system libraries unless the assigned step explicitly requires them.
