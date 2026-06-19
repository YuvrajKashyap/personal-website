# Collaborate Content Model

## 1. Purpose

The Collaborate page is the broader alignment route for Yuvraj Kashyap's personal website.

It is for serious opportunities with founders, builders, creators, startups, research groups, technical teams, and long-arc work where the fit is larger than a single scoped request.

Collaborate is not Services. Services is for scoped build requests. Collaborate is for aligned context that may need conversation before the shape becomes clear.

## 2. Page Responsibility

The page should help a serious person understand:

- what Collaborate means
- which lanes make sense
- what is a good fit
- what is not a good fit
- what principles govern alignment
- how to reach out
- which routes provide proof and context
- how Collaborate differs from Services

The page should not imply an automated intake flow, a scheduling system, or a hidden offer.

## 3. Content Source

Structured local content lives in:

`src/features/collaborate/collaborate-content.ts`

The route composition lives in:

`src/features/collaborate/CollaboratePage.tsx`

The public route is:

`src/app/(site)/collaborate/page.tsx`

## 4. Hero Model

The hero uses:

- eyebrow: `COLLABORATE`
- title: `Aligned work with serious builders.`
- description focused on broader aligned opportunities
- status chip: `Alignment route`
- meta chips for mode, scope, signal, and next step
- primary CTA to `/contact`
- secondary CTA to `/projects`

The hero is an alignment signal, not a final sales pitch.

## 5. Collaboration Lanes

The current lanes are:

- Founder and Startup Conversations
- Technical Product Opportunities
- Creator and Distribution Experiments
- Research and Technical Groups
- Long-Term Aligned Work

These lanes should stay broad enough to represent alignment while still being specific enough to avoid vague networking.

## 6. Best Fit And Not Fit

Best-fit content should emphasize:

- clear context
- serious builders
- meaningful technical, product, creative, or strategic surfaces
- honest constraints

Not-fit content should redirect:

- vague networking
- spammy pitches
- scoped build asks that belong on Services
- immediate large-team needs that should be routed elsewhere

## 7. Alignment Principles

The six alignment principles are:

- Build first
- Clear context
- High agency
- Taste matters
- Long-term signal
- Honest scope

These should remain short, direct, and operational. Do not turn them into vague motivational copy.

## 8. How To Reach Out

The current reach-out path is manual and routes through Contact.

The page should ask for:

- who the person is
- what exists now
- what is being built or explored
- why Yuvraj is relevant to the conversation
- what surface, constraint, or decision matters

Do not add a backend form, booking tool, calendar, payment flow, or automation in this step.

## 9. Proof And Context Links

Current proof links use real internal routes:

- Projects
- Experience
- About
- Services
- Aletheia
- Atlas

Do not add unverified external links, social links, or claims.

## 10. Services Vs Collaborate

Services means a scoped build request.

Collaborate means a broader aligned opportunity.

Both routes point to Contact for now, but they frame different kinds of context.

## 11. Copy Rules

- Keep copy concise, direct, and premium.
- Do not use em dashes in public website copy.
- Do not invent collaborators, outcomes, affiliations, testimonials, or metrics.
- Do not mention private or sensitive personal details.
- Do not include F-1, visa, or immigration details unless explicitly approved later.
- Do not imply current capacity, guaranteed response, or guaranteed outcome.

## 12. Future Editing Notes

Future Supabase or admin work can preserve this local content model.

If the page later gets a real form or routing logic, it should still preserve the content boundary:

- Collaborate for broader alignment.
- Services for scoped build requests.
- Contact for the actual communication route.
