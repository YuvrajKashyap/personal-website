# About Content

## 1. About page purpose

The About page is the human story layer for Yuvraj Kashyap. It explains background, trajectory, discipline, and the current building phase without becoming a resume page or duplicating Experience.

The page should help visitors understand the person behind the projects.

## 2. Story arc

The public story arc is:

1. Origin
2. Austin
3. Tennis
4. UT Dallas
5. Building
6. Direction

The arc should stay concise, grounded, and useful. It should connect movement, pressure, discipline, computer science, and current software work.

## 3. Phase model

Structured About content lives in `src/features/about/about-content.ts`.

Each phase uses:

- `id`
- `eyebrow`
- `title`
- `body`
- `signal`
- `tags`
- `order`

This structure is intentionally simple so it can later map to Supabase or admin-editable About sections without changing the route architecture.

## 4. Tone rules

The About page should feel human, controlled, serious, and premium.

Use direct language. Avoid motivational poster copy, generic biography language, and vague claims like being passionate about technology.

## 5. Tennis handling rule

Tennis is a discipline and proof signal.

It should communicate repetition, pressure, standards, execution, and recovery. It should not become the main visual theme, a statistics section, or a substitute for technical proof.

Do not invent rankings, trophies, records, teams, or competitive outcomes.

## 6. Future Supabase and admin editability

The local content model should remain clean enough to migrate later.

Future admin editing can map phases, signals, and operating links to database records. Until that step exists, keep the content local and typed.

Do not add Supabase, auth, private admin operations, or live content editing from the About page.

## 7. Anti-patterns

- Turning About into a resume page.
- Duplicating Experience.
- Adding fake awards, fake jobs, fake metrics, or fake outcomes.
- Overexposing private details.
- Publishing F-1, visa, or immigration details without explicit approval.
- Making tennis the main brand theme.
- Using hype, founder posturing, or generic portfolio biography copy.
- Using em dashes in public website copy.
