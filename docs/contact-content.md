# Contact Content Model

## 1. Contact Page Purpose

The Contact page is the manual reach-out and routing surface for Yuvraj Kashyap's personal website.

It connects the Services and Collaborate flows to verified public channels while helping visitors choose the right context before reaching out.

## 2. Contact Boundary

Contact has verified channels and a backend-aware submission form.

The form posts to `/api/submissions`. If the server-side Supabase backend is missing, the form renders a disabled setup state and points users back to verified channels.

There is still no email API, CRM, scheduling tool, booking tool, payment flow, automated routing, or response promise.

## 3. Verified Channel Rule

Only contact channels already verified in the repo may render publicly.

Current verified sources:

- `src/config/site.ts`
- `src/components/layout/SiteFooter.tsx`

Current verified channels:

- GitHub
- canonical website URL

Do not invent an email address, phone number, booking link, calendar link, Discord, or other contact method.

## 4. No Invented Contact Method Rule

If a contact method is not present in public config or existing public code, do not render it.

Private memory, assumptions, likely usernames, or external guesses are not enough.

## 5. Message Brief Model

The message brief is guidance for the form or verified channels.

It asks for:

- who the sender is
- what the message is about
- why the route might fit
- scope or timing when relevant
- public links or context
- the next decision the sender wants to make

It should not ask for sensitive private information.

## 6. Services And Collaborate Routing

Services is for scoped build requests with a clear execution shape.

Collaborate is for broader aligned opportunities where context comes before shape.

Contact is the manual endpoint that both routes can point toward until a future intake system exists.

## 7. Submission Backend Boundary

Step 32 adds the form and server route while preserving the local content model in:

`src/features/contact/contact-content.ts`

Backend work must not leak private operations into public client code. The browser form posts to `/api/submissions`; it does not import Supabase write clients.

## 8. No Fake Submission Rule

Do not add:

- fake submit behavior
- fake success states
- message sent copy before an actual API success
- received copy before an actual API success
- hidden form endpoints
- fake response windows
- fake capacity or demand claims

The current page should stay honest that review is manual and backend setup may be missing.

## 9. Anti-Patterns

- Turning Contact into a generic form page.
- Adding placeholder `#` links.
- Adding `example.com` or fake contact routes.
- Inventing email or phone details.
- Adding response time promises.
- Adding booking or calendar language.
- Asking for sensitive private details.
- Duplicating Services or Collaborate instead of routing to them.
- Making the lack of backend feel broken.
