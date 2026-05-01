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
- Avoid hardcoded colors in components.
- Avoid hardcoded spacing values when shared utilities fit.
- Do not add random fonts or one-off type scales.
- Do not overuse mono.
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
- Do not install Motion, GSAP, Three.js, React Three Fiber, Lenis, Supabase, or future system libraries unless the assigned step explicitly requires them.
