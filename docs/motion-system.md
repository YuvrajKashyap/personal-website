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
