# Design Tokens

## 1. Purpose

Design tokens are the semantic source of truth for future UI. They give the site a stable visual language before the final homepage, navigation, cinematic hero, motion system, pages, Supabase, and admin work are built.

Typography and spacing decisions are documented separately in `docs/typography-spacing.md`. Use that document for type scale, theme-aware font usage, layout rhythm, containers, and spacing utilities.

## 2. Token philosophy

- Tokens are semantic.
- Token values can differ by theme.
- Components should consume tokens instead of hardcoded colors.
- Dark and light are distinct visual systems, not simple inversions.
- Shared components should use shared semantic tokens unless a later step assigns theme-specific presentation.

## 3. Dark mode palette direction

Singularity OS uses void black, obsidian surfaces, warm gold accents, restrained ion blue and violet secondary accents, premium glows, and cinematic depth. It should feel orbital and technical while staying readable and controlled.

## 4. Light mode palette direction

Ivory Observatory uses ivory and beige foundations, parchment and paper surfaces, charcoal text, laal red, lacquer red, and deep oxblood accents, and subtle warmth. It should feel editorial, calm, premium, and readable. It is not an inverted dark mode.

## 5. Token groups

Core page tokens:

- `--background`
- `--foreground`
- `--foreground-soft`
- `--muted`
- `--muted-foreground`
- `--border`
- `--border-strong`

Surface tokens:

- `--surface`
- `--surface-soft`
- `--surface-strong`
- `--surface-glass`
- `--surface-inverse`

Accent tokens:

- `--accent`
- `--accent-foreground`
- `--accent-soft`
- `--accent-muted`
- `--accent-strong`

Secondary accent tokens:

- `--accent-secondary`
- `--accent-secondary-soft`
- `--accent-tertiary`

State tokens:

- `--success`
- `--warning`
- `--danger`
- `--info`

Focus and interaction tokens:

- `--focus`
- `--focus-ring`
- `--interactive`
- `--interactive-hover`
- `--interactive-active`

Glow tokens:

- `--glow-primary`
- `--glow-secondary`
- `--glow-soft`
- `--glow-strong`

Shadow tokens:

- `--shadow-soft`
- `--shadow-medium`
- `--shadow-strong`
- `--shadow-glow`

Gradient tokens:

- `--gradient-page`
- `--gradient-hero`
- `--gradient-surface`
- `--gradient-orbital`
- `--gradient-accent`

Orbital tokens:

- `--orbit-line`
- `--orbit-line-strong`
- `--orbit-node`
- `--orbit-node-active`

Selection tokens:

- `--selection-background`
- `--selection-foreground`

Radius and layout tokens:

- `--radius-sm`
- `--radius-md`
- `--radius-lg`
- `--radius-xl`
- `--radius-2xl`
- `--container-max`
- `--section-padding-x`
- `--section-padding-y`

## 6. Utility classes

- `.page-shell` sets the theme-aware page background and foreground.
- `.content-container` controls max width and responsive page padding.
- `.glass-panel` creates a premium translucent surface with tokenized border, blur, and shadow.
- `.premium-card` creates a stronger card surface for future repeated content.
- `.orbital-line` applies tokenized orbital stroke color for SVG or CSS line work.
- `.orbital-glow` applies a restrained tokenized glow for orbital elements.
- `.focus-ring` applies the shared visible focus treatment.
- `.vignette-overlay` provides a token-compatible vignette layer for future sections.
- `.grain-overlay` provides a lightweight tokenized field pattern.

## 7. Usage examples

Preferred Tailwind token utilities:

```tsx
<section className="bg-background text-foreground">
  <div className="border border-border bg-surface text-muted-foreground" />
</section>
```

Use CSS variables directly when Tailwind utilities are not expressive enough:

```tsx
<div className="bg-[var(--gradient-surface)] shadow-[var(--shadow-medium)]" />
```

Use shared focus treatment on interactive elements:

```tsx
<button className="focus-ring bg-accent text-accent-foreground">
  Action
</button>
```

Use structural utilities for page work:

```tsx
<main className="page-shell">
  <section className="content-container" />
</main>
```

## 8. Rules for future components

- Test both themes.
- Preserve contrast.
- Avoid hardcoded colors.
- Use semantic tokens.
- Use `docs/typography-spacing.md` for type scale and layout rhythm decisions.
- Use `docs/hero-assets.md` for dark hero poster asset rules.
- Treat font variables as theme-aware tokens that work with the color and surface system.
- Treat hero assets as separate media layers. Future overlays should use semantic tokens.
- The light home hero uses the Ivory Observatory token family: ivory surfaces, charcoal foreground, laal red accents, and tokenized orbital lines.
- CSS and SVG orbital diagrams should use `--orbit-line`, `--orbit-line-strong`, `--orbit-node`, `--orbit-node-active`, `--border`, and `--accent` instead of one-off colors.
- Orbital navigation should use semantic surface, border, accent, focus, shadow, and orbital tokens so both visual modes stay coherent.
- Motion should reuse semantic tokens for focus, glow, and surface states. Do not animate tokenized color or glow aggressively.
- Step 18 Home sections use semantic surface, card, border, orbital, accent, focus, and glow tokens. Future Home refinements should continue using semantic tokens instead of one-off colors.
- Step 19 internal page components use semantic token surfaces, borders, accents, focus rings, status tones, shadows, and orbital line variables. Future internal pages should use these primitives before adding page-specific color decisions.
- Do not create one-off colors without a clear reason.
- Do not make light mode an inverted dark mode.
- Do not load dark-specific assets in light mode.
- Keep important text in HTML, not images.
- Keep shared content and data models theme-neutral.

## 9. Anti-patterns

- Hardcoding random hex values in components.
- Using dark-only assumptions in shared components.
- Baking text into images.
- Relying on glow for readability.
- Sacrificing accessibility for spectacle.
- Creating duplicate dark/light data models.
- Adding a new color every time a component needs emphasis.
