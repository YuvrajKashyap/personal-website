# Services Content

## 1. Services page purpose

The Services page is the scoped build request surface for the public site. It explains what kinds of practical build requests Yuvraj is open to evaluating without turning the page into a generic agency, freelance, or sales page.

Services is about concrete execution:

- Product interfaces
- Frontend and product polish
- Internal tools
- Workflow systems
- AI, search, and data prototypes
- Build rescue or structured rebuild support

## 2. Services vs Collaborate distinction

Services is for scoped build requests with a clear deliverable, workflow, or technical surface.

Collaborate is for broader aligned opportunities, founders, creators, startups, partnerships, and longer-term possibilities.

The Services page may link to `/collaborate`, but it should not absorb Collaborate's purpose.

## 3. Content model

Structured Services content lives in `src/features/services/services-content.ts`.

Current exports:

- `servicesHero`
- `servicesDefinition`
- `serviceLanes`
- `serviceFitItems`
- `serviceNotFitItems`
- `serviceProcessSteps`
- `serviceProofLinks`
- `servicesComparison`
- `servicesClosingCta`

The model is local and typed so a future Supabase or admin layer can preserve the same shapes.

## 4. Service lane rules

Service lanes should stay conservative and practical.

Allowed lanes include:

- Product Interfaces
- Internal Tools
- AI, Search, and Data Prototypes
- Build Polish and Rescue

Do not convert lanes into fixed offers, public rates, guaranteed outcomes, or fake case studies.

## 5. Fit and not-fit rules

Best-fit items should describe request quality:

- Clear problem
- Defined workflow
- Real constraint or reason
- Fast feedback

Not-fit items should be respectful and boundary-setting:

- Vague app asks
- Clone requests
- Speculative work
- Needs that immediately require a larger dedicated team

Avoid hostile wording. The page should feel selective, not dismissive.

## 6. Manual contact and intake boundary

The current request path is manual and routes to `/contact`.

The Services page must not pretend there is:

- A functional submission flow
- Automated review
- A booking system
- A payment flow
- A database-backed intake system

Future work can add real contact, backend, and admin behavior when assigned.

## 7. No-pricing and no-package rule

The page must not publish fake rates, fixed offers, preset tiers, timelines, guarantees, or demand signals.

If future public commercial terms are approved, they should be added deliberately and documented. Until then, Services stays focused on fit, scope, routing, and proof surfaces.

## 8. Future Supabase, admin, and contact flow boundary

Supabase, admin editing, and contact submission handling remain future systems.

When those systems are assigned:

- Keep the current local content model as the shape reference.
- Keep public reads and private admin operations separated.
- Do not expose service role keys to client code.
- Do not fake successful submissions.
- Keep Contact as the public request route unless architecture changes explicitly.

## 9. Anti-patterns

- Turning Services into a generic freelancer page.
- Adding fake pricing, packages, testimonials, client claims, guarantees, delivery promises, or availability.
- Duplicating Collaborate's broader opportunity purpose.
- Creating a fake form submission.
- Adding a payment, booking, calendar, or scheduling integration without an assigned step.
- Adding external links that have not been verified.
- Adding sensitive private details.
- Using em dashes in public copy.
