# Typography and Spacing

## 1. Purpose

This system controls the site's type scale, font usage, spacing rhythm, containers, and layout utilities. It gives future pages a consistent premium foundation before final navigation, cinematic hero, motion, Supabase, and admin work are built.

## 2. Font system

The project uses a minimal two-font system per visual experience:

- Dark mode, Singularity OS:
  - main/interface: Space Grotesk
  - accent/telemetry: Space Mono
- Light mode, Ivory Observatory:
  - main/interface: Geist Sans
  - accent/metadata: Geist Mono

These fonts are loaded through the current Next.js font setup in `src/app/layout.tsx` and exposed through theme-aware CSS variables. Do not add extra fonts unless a later assigned step explicitly approves them.

## 3. Why two fonts only

Two fonts per visual experience keep the interface consistent, performant, restrained, and easier to maintain. Dark mode gets a more cinematic control-room voice, while light mode keeps a cleaner editorial/product voice. The app, routes, and content remain shared.

## 4. Main sans usage

Use the active main sans font for:

- headings
- body copy
- cards
- normal UI
- buttons
- long readable text

## 5. Mono usage

Use the active mono font for:

- labels
- telemetry
- route labels
- status chips
- metrics
- small metadata
- technical tags

Do not overuse mono. Do not use mono for long body text.

In dark mode, Space Mono should be used sparingly for telemetry, labels, chips, route markers, coordinates, and small technical metadata. Space Grotesk should not turn the page into cheesy sci-fi. Keep spacing, scale, and contrast restrained.

In light mode, Geist Mono should stay focused on metadata and labels. Geist Sans remains the main editorial interface voice.

Step 15 light hero note:

- The Ivory Observatory hero uses Geist Sans for the main editorial hierarchy.
- Geist Mono is reserved for metadata chips, observatory labels, readout labels, and coordinate-style text.
- Long body copy remains in the sans font for readability.

Step 16 orbital navigation note:

- Orbital destination labels use the active mono font for codes and metadata.
- Destination names use the active sans font and must stay readable at desktop and mobile sizes.
- Mobile fallback cards should not shrink labels below the established caption scale.

## 6. Type scale

Key typography utilities:

- `.text-display`
- `.text-page-title`
- `.text-section-title`
- `.text-card-title`
- `.text-body`
- `.text-body-large`
- `.text-caption`
- `.text-kicker`
- `.text-mono-label`
- `.text-stat`
- `.text-link-premium`
- `.font-telemetry`

These utilities use semantic CSS variables from `src/app/globals.css`.

## 7. Fluid headline strategy

Large headings use `clamp()` so mobile remains readable and desktop can feel cinematic without becoming oversized. Avoid one-off giant heading sizes in components. Use the shared utilities first.

## 8. Line-height strategy

- Tight line height is for display text.
- Balanced line height is for headings.
- Readable line height is for body copy.
- Looser line height is reserved for longer or calmer reading contexts.

## 9. Tracking strategy

- Tight tracking can be used for large headlines.
- Normal tracking is for body copy.
- Wider tracking is for labels and kickers.
- Do not overtrack body text.

## 10. Spacing philosophy

Premium spacing means deliberate breathing room. Mobile sections should not feel cramped, and desktop sections should not feel empty. Use shared spacing utilities for repeated patterns so rhythm stays consistent.

## 11. Container widths

- `.site-container` is the default content width.
- `.site-container-narrow` is for readable text columns.
- `.site-container-wide` is for project grids and visual sections.

## 12. Section spacing

- `.section-shell` is the default major section rhythm.
- `.section-shell-compact` is for tighter supporting sections.
- `.section-shell-loose` is for high-impact sections that need more breathing room.

## 13. Card spacing

Card spacing tokens:

- `--card-padding`
- `--card-padding-compact`
- `--card-gap`

Use these for panels, repeated cards, and future project surfaces.

## 14. Stack utilities

Vertical stack utilities:

- `.stack-xs`
- `.stack-sm`
- `.stack-md`
- `.stack-lg`
- `.stack-xl`

Use these to keep vertical rhythm consistent without hardcoding repeated gap values.

## 15. Mobile typography rules

- Do not use tiny labels.
- Keep body text readable.
- Control line length.
- Preserve sufficient tap targets.
- Reduce spacing on mobile, but do not make sections cramped.

## 16. Accessibility rules

- Body text must remain readable.
- Avoid low contrast labels.
- Preserve visible focus states.
- Do not rely only on all-caps labels.
- Keep line length controlled.
- Touch targets should be usable.

## 17. Usage examples

Headline:

```tsx
<h1 className="text-display text-balance">Building the next interface.</h1>
```

Body copy:

```tsx
<p className="text-body-large text-pretty">Readable supporting copy.</p>
```

Kicker:

```tsx
<p className="text-kicker">Personal Website</p>
```

Chip or label:

```tsx
<span className="text-mono-label rounded-full border border-border px-4 py-2">
  Live
</span>
```

Section shell:

```tsx
<section className="section-shell">
  <div className="site-container" />
</section>
```

Stack:

```tsx
<div className="stack-md">
  <h2 className="text-section-title">Section</h2>
  <p className="text-body">Copy</p>
</div>
```

## 18. Anti-patterns

- Motion should preserve reading rhythm. Do not delay primary headings, body copy, or CTAs long enough to make the page feel blocked.
- Step 18 Home sections use shared section, container, heading, body, mono label, stack, and grid rhythm. Future Home refinements should preserve controlled text measure and mobile spacing.
- Step 19 internal page components use the same heading scale, body text rhythm, mono label treatment, section spacing, containers, stacks, and responsive grids. Future internal pages should start with `PageHero`, `SectionShell`, and the shared UI primitives before creating one-off spacing.
- Do not add random fonts.
- Do not create one-off heading sizes.
- Do not overuse mono.
- Do not make body text too small.
- Do not make labels unreadable.
- Do not create cramped mobile sections.
- Do not hardcode spacing values everywhere.
- Do not use em dashes in public copy.
- Do not use typography as decoration at the expense of clarity.
