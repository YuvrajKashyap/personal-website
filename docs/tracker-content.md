# Tracker Content Guide

## 1. Tracker page purpose

The Tracker page is the public current-state signal surface for the website.

It should show what Yuvraj is focused on, what routes and systems are active, and what future systems are planned without pretending the site has connected data sources.

## 2. Content model

Tracker content currently lives in:

```text
src/features/tracker/tracker-content.ts
```

The model exports:

- `trackerHero`
- `trackerStatusCards`
- `trackerFocusAreas`
- `trackerOperatingPillars`
- `trackerActiveSurfaces`
- `trackerRoadmap`
- `trackerSourceNote`
- `trackerClosingCta`

The shape is intentionally structured so future admin editing or Supabase-backed content can use similar fields.

## 3. Manual signal rule

The Tracker page is manual/local content right now.

Any card that could look like a data surface must include a source label such as:

- Source: manual note
- Source: local content
- Source: route map
- Source: local model

Do not imply connected data sources until they actually exist.

## 4. What can be shown now

Allowed current content:

- Current mode labels
- Manual source labels
- Focus areas
- Active route and surface names
- Qualitative operating pillars
- Roadmap or next-up items
- Links to real routes inside the site

## 5. What cannot be faked

Do not publish:

- Fake metrics
- Fake timestamps
- Fake streaks
- Fake hours
- Fake LeetCode counts
- Fake GitHub activity
- Fake routine, workout, or sleep numbers
- Fake revenue, customers, users, or traction
- Fake automation or feed language
- Private personal details
- F-1, visa, or immigration details unless explicitly approved later

## 6. Future Supabase and admin editability

Supabase and admin editing come later.

When they are assigned, preserve the current content boundaries:

- The public route should keep the same role.
- Manual notes can become admin-edited records.
- Future integrations should be labeled by source.
- Public pages should not expose private operations.

## 7. Future integration boundary

Future integrations may support real activity or measurement surfaces, but they must not be described as active before they exist.

Until then, use language like:

- Future system
- Future page work
- Ready for later
- Manual current-state content

## 8. Difference between Tracker and analytics

Tracker is a public operating signal page.

Analytics would be measurement infrastructure. That is not implemented in this step.

Do not turn Tracker into a fake analytics dashboard.

## 9. Anti-patterns

- Pretending manual content is connected data.
- Publishing fake counts or personal stats.
- Writing fake urgency.
- Turning the page into a generic dashboard template.
- Duplicating Projects, About, or Experience content.
- Exposing private routines or sensitive details.
- Adding packages or service integrations during content-only page work.
- Using em dashes in public website copy.
