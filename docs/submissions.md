# Submissions

## 1. Purpose

Step 32 adds the foundation for Contact, Services, and Collaborate submissions.

The goal is to collect structured context through a server route while keeping public pages honest when Supabase server environment values are missing.

## 2. Scope

Implemented:

- Shared typed submission model.
- Server-side validation.
- Honeypot spam friction.
- Server-only Supabase insert helper.
- `/api/submissions` POST route.
- Shared `SubmissionForm` client component.
- Contact, Services, and Collaborate form sections.
- No-env disabled form state.

Not implemented:

- Admin submissions viewer.
- Email delivery.
- CRM integration.
- Scheduling or booking.
- Payments.
- Captcha packages.
- Public browser Supabase writes.

## 3. Route

Public forms post JSON to:

```text
/api/submissions
```

The route file is:

```text
src/app/api/submissions/route.ts
```

The route accepts `POST` only. `GET` returns a safe method-not-allowed response and does not expose stored submissions.

## 4. Submission Types

Allowed submission types:

- `contact`
- `services`
- `collaborate`
- `general`

The public pages use:

- `/contact` uses `contact`
- `/services` uses `services`
- `/collaborate` uses `collaborate`

Invalid or missing types normalize to `general`.

## 5. Fields

Required:

- `name`
- `email`
- `subject`
- `message`

Optional:

- `company`
- `website`

Hidden spam fields:

- `companyFax`
- `confirmEmail`

Do not add phone, budget, availability, payment, immigration, or sensitive private fields unless a later assigned step explicitly approves the change.

## 6. Field Limits

Validation limits live in:

```text
src/types/submission.ts
```

Current limits:

- `name`: 120
- `email`: 254
- `subject`: 160
- `message`: 4000
- `company`: 160
- `website`: 300
- `sourcePath`: 200
- `userAgent`: 300
- `referrer`: 300

## 7. Validation

Validation lives in:

```text
src/lib/submissions/validation.ts
```

It performs:

- Required field checks.
- Length caps.
- Basic email shape validation.
- Optional website URL normalization.
- Source path normalization.
- Submission type normalization.
- Honeypot rejection.

Validation is deliberately simple. It is not robust spam prevention.

## 8. Backend Configuration

Backend configuration lives in:

```text
src/lib/submissions/config.ts
```

Required server-side values:

```text
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SECRET_KEY=
```

Legacy fallback:

```text
SUPABASE_SERVICE_ROLE_KEY=
```

Only server code may read these keys. They must never be imported into browser components.

## 9. Server-only Insert Boundary

The server-only Supabase client lives in:

```text
src/lib/supabase/service-client.ts
```

The insert helper lives in:

```text
src/lib/submissions/submit-submission.ts
```

The browser form never imports Supabase. It posts to `/api/submissions`, and the server route decides whether a real insert is possible.

## 10. RLS Strategy

The `submissions` table remains locked from public direct writes.

There is no public insert grant and no public insert RLS policy.

The server route inserts with a server-only key when configured. This preserves the boundary between public browser code and private database writes.

## 11. No-env Behavior

If backend environment values are missing:

- Contact, Services, and Collaborate still render.
- Forms show a disabled setup state.
- No fake success state is shown.
- `/api/submissions` returns safe `503` JSON for otherwise valid payloads.

Required no-env copy:

```text
Submission backend is not configured yet.
Use the verified channels on the Contact page for now.
This form will connect once Supabase environment values are set.
```

## 12. Success Behavior

Success copy is shown only after `/api/submissions` returns a real success response.

Approved success copy:

```text
Submission received.
Your message was saved for manual review.
```

Do not show message-sent copy before the server insert succeeds.

## 13. Spam And Abuse Boundary

Step 32 includes only:

- Honeypot fields.
- Field length caps.
- Submission type whitelist.
- Server validation.
- `status = new`.
- Limited metadata.
- No file uploads.
- No HTML rendering of submitted content.

Do not describe this as strong spam prevention.

Future hardening can add rate limiting, captcha, email verification, moderation queues, or WAF rules only when explicitly assigned.

## 14. Metadata

Stored metadata is intentionally limited:

- schema version
- submitted route
- source path
- user agent, capped
- referrer, capped

Do not store IP addresses, fingerprints, private browser data, or hidden tracking fields in this step.

## 15. Public Page Integration

Forms are rendered through:

```text
src/features/submissions/SubmissionForm.tsx
```

Page integrations:

- `src/features/contact/ContactPage.tsx`
- `src/features/services/ServicesPage.tsx`
- `src/features/collaborate/CollaboratePage.tsx`

Each page still explains its route boundary. Services remains scoped execution. Collaborate remains broader alignment. Contact remains the verified channel and direct context route.

## 16. Anti-patterns

- Writing directly to Supabase from browser components.
- Importing service keys into client code.
- Adding public insert RLS policies without an assigned security decision.
- Showing fake success states.
- Claiming live submission handling before env and schema are verified.
- Adding email, CRM, scheduling, booking, payments, analytics, or captcha packages in this step.
- Asking for sensitive personal data.
- Rendering submitted HTML as trusted content.
- Building an admin inbox before that step is assigned.
