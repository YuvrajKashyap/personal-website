# Experience Content

## 1. Experience page purpose

The Experience page is the trajectory and proof layer for Yuvraj Kashyap.

It should show education, leadership, technical work, project building, discipline, and direction without becoming a copied resume or LinkedIn dump.

## 2. Content model

Structured Experience content lives in `src/features/experience/experience-content.ts`.

The model includes:

- `experienceHero`
- `experiencePillars`
- `experienceEntries`
- `proofSurfaces`
- `futureDirection`
- `experienceClosingCta`

Timeline entries use:

- `id`
- `eyebrow`
- `title`
- `organization`
- `context`
- `periodLabel`
- `body`
- `signals`
- `tags`
- `type`
- `reviewStatus`
- `order`

## 3. Difference between About and Experience

About is the human story page.

Experience is the trajectory and proof page.

About may explain origin, movement, and personal context. Experience should focus on structured roles, education, technical growth, leadership, discipline, and current building direction.

Do not duplicate the About story arc here.

## 4. Safe facts and review rules

Safe public facts currently include:

- University of Texas at Dallas
- Computer Science
- Ex-college tennis player
- Peer Advisor / UTD Housing
- Undergraduate research around UAV and smart-city systems
- NOVA Autonomous Driving involvement
- Consult Your Community project leadership
- Project building across the local project archive

Use exact dates, metrics, outcomes, awards, publications, GPA, internships, and company claims only when explicitly verified in a future assigned step.

## 5. Tennis handling

Tennis is a discipline and proof layer.

It can communicate repetition, pressure, recovery, standards, and execution. It should not become the visual theme, a statistics section, or the central identity of the page.

Do not invent rankings, records, awards, team outcomes, or competitive statistics.

## 6. Research, leadership, and project handling

Research content should stay conservative unless exact details are verified.

Leadership content should describe responsibility, communication, support, coordination, and execution without fake outcomes.

Project content should route visitors to `/projects` for concrete proof rather than inflating the Experience page.

## 7. Future Supabase and admin editability

The local Experience model should stay clean enough for later migration.

Future admin editing can map entries, pillars, proof surfaces, and direction signals into database records. Until that assigned step exists, keep this content local and typed.

Do not add Supabase, auth, admin editing, or live data behavior in the Experience page.

## 8. Anti-patterns

- Turning Experience into a resume dump.
- Duplicating About.
- Inventing roles, internships, dates, companies, outcomes, metrics, awards, publications, GPA, or research results.
- Publishing F-1, visa, immigration, or sensitive private details without explicit approval.
- Making tennis the main theme.
- Using unsupported company, funding, or founder claims.
- Using em dashes in public website copy.
