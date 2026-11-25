# Motion System

## 1. Purpose

The motion system defines the first controlled animation layer for Yuvraj Kashyap's personal website. It gives future UI work reusable motion primitives, keeps the hero interactions consistent, and protects accessibility and performance.

This is not the final cinematic motion system. It is the foundation for premium coded UI motion.

## 2. Motion philosophy

Motion should feel gravitational, slow, controlled, premium, cinematic, precise, intentional, and subtle.

Motion should not feel bouncy, chaotic, game-like, flashy, distracting, random, laggy, or inaccessible.

The core metaphor is gravity, orbit, signal, slow reveal, focus, drift, and controlled pull.

## 3. Library choice

The project uses Motion for React for UI animation.

Motion is enough for this phase because the current needs are entrance reveals, small interactions, subtle orbital affordances, and reduced-motion-safe coded UI.

## 4. Installed package

Installed package:

```bash
motion
```

Do not install `framer-motion`, GSAP, Three.js, React Three Fiber, Drei, Lenis, Theatre.js, Supabase, or analytics packages unless a later assigned step explicitly asks for them.

## 5. Import pattern

Use:

```tsx
import { motion, MotionConfig, useReducedMotion } from "motion/react";
```

Do not import directly from `framer-motion`.

## 6. Motion provider

Provider location:

```text
src/components/motion/MotionSystemProvider.tsx
```

The provider wraps the app inside `src/app/layout.tsx`, inside the existing `ThemeProvider`.

It uses:

```tsx
<MotionConfig reducedMotion="user" />
```

The root layout remains a server component. The motion provider is the small client boundary for Motion configuration.

## 7. Reduced-motion strategy

Reduced motion is handled in three layers:

- `MotionConfig reducedMotion="user"` respects the user preference.
- `Reveal` uses `useReducedMotion()` to skip entrance motion.
- `MotionScrollCue` disables the repeating scroll cue pulse when reduced motion is requested.

The dark hero video fallback still lives in `HeroVideoBackground`. It should not autoplay video for reduced-motion users.

## 8. Presets

Preset file:

```text
src/lib/motion/presets.ts
```

Key exports:

- `gravitationalEase`
- `orbitalEase`
- `signalEase`
- `softSpring`
- `slowRevealTransition`
- `fastInteractionTransition`
- `staggerContainer`
- `fadeUp`
- `fadeIn`
- `scaleSoft`
- `blurIn`
- `orbitalNodeReveal`
- `orbitalLineReveal`
- `chipReveal`
- `ctaReveal`
- `scrollCueMotion`
- `reducedMotionReveal`
- `getRevealTransition`

Presets should prefer opacity and transform. Avoid layout-affecting properties.

## 9. Reveal components

Primary component:

```text
src/components/motion/Reveal.tsx
```

Supported variants:

- `fade-up`
- `fade-in`
- `scale-soft`
- `chip`
- `cta`
- `blur-in`

Use `Reveal` for above-the-fold coded UI such as hero text, chips, CTAs, and panels.

Step 18 also uses `Reveal` for the lower Home gateway sections. Section headers, preview cards, tracker panels, opportunity cards, and final CTA may reveal with existing presets. Do not add scroll-timeline effects, GSAP, or continuous lower-page motion in this phase.

Scroll cue component:

```text
src/components/motion/MotionScrollCue.tsx
```

It adds a slow cue pulse only when reduced motion is not requested.

## 10. Hero entrance strategy

Dark hero:

- Telemetry chips reveal first with a tight stagger.
- Kicker, headline, body, and CTAs reveal with short delays.
- Orbital navigation reveals after text is readable.
- The video background is not animated by Motion.

Light hero:

- Metadata chips reveal softly.
- Copy enters with simpler editorial timing.
- The observatory panel and destination instrument come online after the core text.
- No dark hero media is imported or rendered in light mode.

Hero text should become readable quickly. Do not hide core copy behind long delays.

## 11. Orbital interaction strategy

Orbital navigation keeps real links and visible focus states.

Current Motion behavior:

- Header and SVG orbit map reveal subtly on mount.
- Nodes reveal with a small stagger.
- Links get small tap feedback.
- CSS focus and hover styles remain the primary accessibility surface.

Do not add constant orbit spinning yet. Do not make navigation hover-only.

## 12. Performance rules

- Animate opacity and transform first.
- Avoid animating layout dimensions.
- Avoid continuous shadow, filter, blur, or color animation.
- Avoid long page-wide animation chains.
- Keep above-the-fold text readable quickly.
- Do not animate the hero video layer destructively.
- Do not create layout shift with motion wrappers.
- Avoid new client boundaries unless interaction requires them.

## 13. Accessibility rules

- Respect reduced motion.
- Preserve keyboard navigation.
- Preserve visible focus states.
- Keep links and buttons as real semantic controls.
- Do not rely only on hover.
- Do not use motion to hide essential content for long periods.
- Mobile interactions must remain usable.

## 14. What not to animate

- Do not animate page layout dimensions when opacity or transform works.
- Do not animate important text as an image or video.
- Do not animate the dark hero video into light mode.
- Do not animate global route transitions across the whole app yet.
- Do not add constant orbital spinning.
- Do not animate every element just because Motion exists.

## 15. Future GSAP, Three, and Lenis boundary

GSAP, Three.js, React Three Fiber, Drei, and Lenis are not installed.

They may be considered only in later assigned steps when there is a clear need:

- GSAP for cinematic timelines or scroll sequences.
- Three.js or React Three Fiber for justified 3D or WebGL.
- Lenis for premium scroll behavior if native scroll is not enough.

Best stack does not mean install everything immediately.

## 16. Anti-patterns

- Random animation timings.
- Bouncy default spring behavior.
- Long delays before readable text appears.
- Hover-only interactions.
- Hidden dark media in the light DOM.
- Animating box shadows continuously.
- Using filter blur heavily across large surfaces.
- Making the site feel like a game trailer.
- Installing animation packages outside the assigned step.

## 17. Step 19 internal page template motion

Internal page templates use the existing `Reveal` component for PageHero, SectionShell headings, and page content.

- Motion stays restrained and readable.
- No new motion package was added.
- No GSAP, scroll timeline, or constant internal page animation was added.
- Reduced-motion behavior continues through `MotionSystemProvider` and `MotionConfig`.

## 18. Step 21 Projects archive motion

The Projects archive uses the existing `Reveal` component and motion presets only.

- PageHero, featured rows, archive cards, filters, and discovery panels may reveal with restrained opacity and transform.
- Filters and random project routing should stay responsive without timeline effects.
- Do not add new animation packages for the Projects archive.
- Do not add constant orbital spinning, card chaos, or motion that delays project readability.
- Reduced-motion behavior continues through the shared motion foundation.

## 19. Step 22 project detail motion

Project detail pages use the existing internal page motion foundation.

- PageHero and SectionShell already use `Reveal`.
- Detail media placeholders, sections, and related cards may reveal with existing presets.
- Motion should support reading the case-study content rather than distract from it.
- No GSAP, Three.js, scroll timeline, or new animation package was added.
- Reduced-motion behavior continues through `MotionSystemProvider`.

## 20. Step 25 Tracker page motion

The Tracker page uses the existing internal page motion foundation only.

- PageHero, status cards, focus cards, surface links, roadmap items, source note, and CTA may reveal with existing `Reveal` presets.
- Motion should support scanability and trust, not make the page feel like a fake control room.
- No GSAP, Three.js, scroll timeline, constant loops, or new animation package was added.
- Reduced-motion behavior continues through `MotionSystemProvider`.

## 21. Step 26 Services page motion

The Services page uses the existing internal page motion foundation only.

- PageHero, service lanes, fit panels, request process steps, proof cards, comparison cards, and CTA may reveal with existing `Reveal` presets.
- Motion should support clarity, selectivity, and scanability rather than sales-page theatrics.
- No GSAP, Three.js, scroll timeline, constant loops, or new animation package was added.
- Reduced-motion behavior continues through `MotionSystemProvider`.

## 22. Step 27 Collaborate page motion

The Collaborate page uses the existing internal page motion foundation only.

- PageHero, collaboration lanes, fit panels, alignment principles, reach-out steps, proof cards, comparison cards, and CTA may reveal with existing `Reveal` presets.
- Motion should support clarity, seriousness, and scanability rather than networking-page theatrics.
- No GSAP, Three.js, scroll timeline, constant loops, or new animation package was added.
- Reduced-motion behavior continues through `MotionSystemProvider`.

## 23. Step 28 Contact page motion

The Contact page uses the existing internal page motion foundation only.

- PageHero, verified channel cards, route cards, message brief items, proof cards, and CTA may reveal with existing `Reveal` presets.
- Motion should support clarity, routing, and trust rather than fake form drama.
- No GSAP, Three.js, scroll timeline, constant loops, or new animation package was added.
- Reduced-motion behavior continues through `MotionSystemProvider`.

## 24. Immersion pass: spacetime, warp, and physical surfaces

This pass adds scene-level motion without adding any package. Everything is canvas 2D, CSS, or Motion for React.

- `src/components/effects/spacetime-scene.ts` and `SpacetimeField.tsx`: a live spacetime fabric. A primary body sits in a gravity well, small bodies orbit it under softened gravity, the cursor carries mass (it dents the sheet and perturbs the orbits), and a press sends a gravitational wave across it. Variants: `hero` (interior `PageBackdrop`), `well` (site footer), `abyss` (404). Colors come from the `--spacetime-*` tokens in `globals.css`, so both themes share one scene.
- `src/components/effects/WarpTransit.tsx`: route changes inside the public shell spool into star streaks behind a veil and drop out of warp on the new page. It doubles as the loading state for slow routes. Admin, mail, API, and file links are skipped.
- `src/features/home/HeroDive.tsx`: publishes `--dive` on the Home hero so scrolling away pushes the camera toward the singularity while the copy lifts off.
- `src/components/motion/WordReveal.tsx`: masked word-by-word rise for page and section titles. Words stay whole, so wrapping and balance are unchanged.
- `useSpotlight` now also writes `--tilt-x` and `--tilt-y`; cards lean toward the cursor through CSS only.
- `LinkButton` accepts `magnetic` for standalone CTAs.
- `src/app/not-found.tsx`: the 404 is a full-viewport gravity well.

Rules that still hold: every loop pauses off screen and when the tab is hidden, reduced-motion users get a single still frame of the fabric and no warp, dive, tilt, or word motion, and none of the canvases take pointer events or carry content.

## 25. Home cosmos pass (Nov 2026)

The standalone interior pages were removed. Home is the public site, so the immersion work now lives there.

- `src/components/effects/cosmos-scene.ts` and `CosmosBackdrop.tsx`: deep space behind every Home chapter. Three domain-warped nebula clouds are baked once into small canvases and moved by CSS transforms only; a separate canvas draws a three-depth starfield that twinkles, parallaxes with the scroll, stretches into streaks on fast scrolls, bends around the cursor, and drops an occasional meteor (dark theme only). Mounted once inside `.home-sections`; the stage is `position: fixed` and clipped to that container with `clip-path`.
- Dark theme effects use nebula violet, indigo and orchid. Gold stays for UI accents. The spacetime fabric takes two line colors (`--spacetime-line`, `--spacetime-line-deep`) and shifts hue as lines sink into a well. Light theme keeps its ivory and oxblood palette.
- `.home-chapter-ghost`: each chapter name set huge and hollow behind its content, drifting with a CSS scroll timeline where supported.
- `ResumeLedger` marks roles inside the middle band of the viewport with `data-focus`; the rest dim, like depth of field.
- Do not add `mix-blend-mode` or `filter` to the nebula canvases. Both were tried and cut the frame rate badly.

### Landmarks and handoff (added in the same pass)

- `src/components/effects/celestial-scene.ts` and `CelestialBody.tsx`: a moon in About, a ringed gas giant beside Experience, and a tilted spiral galaxy behind Contact. Each is painted once per theme into a canvas; the drift uses a CSS view timeline and the galaxy spin is a keyframe, so there is no per-frame script. Passed to `ChapterShell` through its `landmark` prop and layered at `z-index: -1` inside the chapter, behind content.
- The starfield also draws nine small constellations and, for the first screen after the hero, short radial streaks that settle into points.
- Hero handoff: `.cosmos` starts at `--home-transition-depth`, below the hero overlap, and `.home-sections::before` is one long eased fade. Keep the sky out of the overlap zone or a hard-edged band appears under the hero.

### Live worlds and the orrery

- Worlds are now real spheres. `createWorld` in `celestial-scene.ts` builds an equirectangular surface map once (cloud bands with a storm for the gas giant, blotchy terrain with polar caps for the moon and ice world), precomputes latitude, longitude, lighting and rim per pixel, then redraws the sphere at a new rotation at 30 fps while on screen. The giant's rings are two static canvases, far half behind the world and near half in front.
- `src/components/effects/Orrery.tsx`: five worlds on inclined orbits around a star beside the Projects title, projected in 3D and depth-sorted, tipping toward the cursor.
- An ice world hangs beside the signal globe above the footer.
- Yuvraj approved this direction on 2026-11-25 ("love the 3D planets"). New landmarks should follow the same recipe: paint or precompute once, keep the per-frame work to table lookups or transforms, pause off screen.

### Footer star, cursor planet, and more worlds

- The spacetime primary is now a small living star (`drawPrimary` in `spacetime-scene.ts`): a 64px plasma surface repainted every other frame from two drifting noise layers with limb darkening, an additive corona, breathing streamers, and prominences that lift off the limb and fall back. Colors come from `--spacetime-star-core`, `-mid` and `-edge`. Lines deep in the well warm toward the star through `--spacetime-line-deep`.
- Keep `PULL` low. At 0.4 the sheet folded over itself at the bottom of the well and the lines collapsed into a spike; wells are also shallower and wider than before, on a finer mesh.
- Orbiting bodies are small lit spheres whose bright limb faces the star.
- Footer only (`variant="well"`): while the pointer is over the fabric, `SpacetimeField` sets `html[data-cursor-mode="blackhole"]`, which hides `.site-cursor`, and the scene draws the pointer as a tiny black hole (horizon, photon ring, lensed accretion disc) with more mass than elsewhere. The attribute is cleared when the pointer leaves, the footer scrolls away, or the component unmounts. Touch and reduced-motion users never enter this mode.
- New landmarks: an ember world at the end of Experience, a jade gas giant at the left edge of Projects, and a comet crossing above Contact. All follow the paint-once or precompute-once recipe.

- The footer star was later doubled in size and mass (well depth roughly 1.2 world units) and given a rotating spotted surface at 128px, a chromosphere rim, spicules, tapered equatorial streamers, braided prominences and periodic mass ejections.

- The star was then reworked from a clean-edged ball to an ultraviolet-observatory look: the surface canvas now extends past the disc and paints plasma wisps streaming off a limb that boils in and out, with ridged-noise lanes between convection cells and bright plage around the sunspots. The stroked chromosphere outline was removed because a hard rim is what made it read as a smooth ball.

- Flares are no longer stroked curves. `paintStarSurface` paints them per pixel in the star's own canvas: three loop prominences (a knotted outer arch, a braided inner strand and a faint curtain hanging inside, with texture sliding along the arch) and one eruption that fans out and shreds into clumps. Each lives one cycle at a fresh limb position.

- The coronal mass ejection is a 420-particle cloud drawn in the main canvas (`EJECTA` in `spacetime-scene.ts`): a ragged leading front, a hollow, a dense trailing core and two legs back to the surface, launched on the same clock and bearing as the in-surface eruption flare. It widens, slows and cools from white to red over about nine seconds. An earlier version stroked a single arc for this and read as a stray line; do not go back to strokes for plasma.
- The footer system carries five planets.

### Lens sky (ported from the books repo's gravity scene)

- `src/components/effects/lens-sky.ts`: the Home starfield as a raw WebGL 1 fragment shader (no three.js) in which the cursor is a point-mass gravitational lens. Light seen at r from the lens is sampled from r - theta^2 / r, which smears stars into arcs, opens a dark patch at the centre, and draws a faint Einstein ring. Until the pointer moves, a mass wanders the sky on its own.
- The giant chapter names are part of that sky. `CosmosBackdrop` draws each `.home-chapter-ghost` to a canvas in its own computed font, uploads it as a texture, and passes its live box to the shader each frame; three slightly different bend strengths per colour channel fringe the letters. `html[data-sky-titles="on"]` hides the text copies while this is active.
- The names are centred and sized (`11.2vw`, capped) so the longest one always fits the viewport, and their drift is a couple of percent. Do not go back to oversized names that run off the edge.
- Fallback: touch devices, reduced motion, missing WebGL or a lost context keep the 2D starfield and the names as plain text. In lens mode the 2D canvas still draws constellations and meteors, bending constellation points with the lens's outer-image formula.
- The ring is deliberately faint (`ring` eases to 0.3). Yuvraj has rejected visible rings around the cursor before.

### Hero lens, dust, and two seam fixes

- `src/features/home/HeroLens.tsx` with `src/components/effects/video-lens.ts`: over the dark hero, a WebGL canvas copies the black-hole footage (the live video, or the poster before it has data) through the same point-mass lens as the sky, so the cursor bends the singularity itself. Away from the cursor the copy is identical to the footage, which is why it can fade in and out over the real video. A second canvas draws dust shed by the moving cursor that spirals into the black hole (`HOLE` holds its position in the desktop footage). Both sleep until the pointer moves over the hero; dark theme, fine pointers and full motion only.
- Star cells in `lens-sky.ts` fade to nothing before their edge and keep their halo round. Stretching the halo on fast scrolls drew tall glowing boxes clipped at cell edges.
- `.cosmos` starts 1.25rem below the top of the fade that covers it, and the fade is fully opaque for its first 2.5rem. With both starting on the same line a one pixel sliver of sky showed under the hero. `.home-hero::after` also melts the footage's bottom edge into the page colour.

### Light-mode parity and the phone pass

- Both themes get every effect. The hero lens canvas is rendered by `HeroVideoBackground` inside the media stack (above the video, under the theme washes); in the ivory hero it takes the footage's own filter, multiply blend and opacity and swaps with the video instantly, so nothing changes away from the cursor. Dust is gold light on dark and oxblood ink on ivory. Meteors run in both themes. Yuvraj's rule (2026-11-25): light mode is the same site in a light palette, never a reduced one.
- `HoverWaveText` and `SplitTextReveal` group letters by word (`.hover-wave-word`, `.split-text-word`) so narrow screens never break a line mid-word.
- Below 1280px the header gains a soft veil once the page has scrolled, so page text no longer tangles with the floating controls.
- Phones: worlds drop their glow filter and redraw at 20 fps, the footer star's plasma repaints every third frame, contact icons sit in two rows of three, and touch tiles get a deeper scrim.
