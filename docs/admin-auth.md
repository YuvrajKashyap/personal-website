# Admin Auth

## 1. Step 31 Purpose

Step 31 adds the private admin authentication and dashboard foundation for the personal website.

The goal is to protect `/admin`, provide a real Supabase Auth magic-link entry, and render a read-only dashboard shell without building content editing, submissions, public writes, or fake admin behavior.

## 2. What Is Implemented

- `@supabase/ssr` is installed for cookie-aware auth.
- Browser auth client lives in `src/lib/supabase/client.ts`.
- Server auth client lives in `src/lib/supabase/server.ts`.
- Admin auth helpers live in `src/lib/supabase/auth.ts`.
- Scoped admin token refresh lives in `proxy.ts`.
- `/admin/login` renders setup-required, access-denied, or magic-link login states.
- `/admin/auth/callback` exchanges PKCE auth codes for sessions.
- `/admin/logout` signs out through Supabase when configured.
- `/admin` is protected by a server-side admin guard.
- The dashboard is read-only and foundation-only.

## 3. What Is Not Implemented

- Content CRUD.
- Project editing.
- Tracker editing.
- Page editing.
- Admin submissions viewer.
- Public writes.
- Storage uploads.
- Admin user seeding.
- Service-role runtime clients.
- Analytics or monitoring.

## 4. Supabase Env Requirements

Admin auth requires safe public Supabase Auth values:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

The publishable key is preferred. The anon key remains a legacy fallback.

Server-only placeholders remain documented, but Step 31 does not use them at runtime:

```text
SUPABASE_SECRET_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_PROJECT_REF=
```

Real values belong in `.env.local` and Vercel environment variables only.

## 5. Admin Auth Flow

1. Admin opens `/admin/login`.
2. The login form creates a browser Supabase client.
3. The form calls `supabase.auth.signInWithOtp`.
4. `emailRedirectTo` points to `/admin/auth/callback`.
5. The callback route exchanges the code for a Supabase session.
6. The callback redirects to `/admin` or a safe `/admin` next path.
7. `/admin` checks verified auth claims server-side.
8. `/admin` checks for an active `admin_users` row.
9. Authorized users see the read-only dashboard.

The login form uses `shouldCreateUser: false`, so Auth users must be created manually.

## 6. Magic-Link Callback

Callback route:

```text
src/app/admin/auth/callback/route.ts
```

The route:

- requires a `code` search parameter
- exchanges the code with `exchangeCodeForSession`
- only redirects to safe paths under `/admin`
- redirects safely back to `/admin/login` for missing or invalid codes
- does not expose raw auth errors in the URL

## 7. Admin Authorization Via admin_users

Authorization relies on the `admin_users` table from Step 29.

Requirements:

- `user_id` must match the Supabase Auth user id.
- `status` must be `active`.
- `role` may be `owner`, `admin`, or `editor`.
- There is no hardcoded email allowlist.
- There is no local bypass.
- There is no automatic admin seed.

Server authorization uses `supabase.auth.getClaims()` from the installed SDK. `getSession()` is not used for admin authorization.

## 8. Setup-Required Behavior

If Supabase auth env values are missing:

- `/admin/login` renders a setup-required state.
- `/admin` renders setup-required instead of a fake dashboard.
- Public pages continue to build and load.
- No runtime env crash occurs.

## 9. First Admin User Manual Setup

Manual setup sequence:

1. Create or select the Supabase project.
2. Apply `supabase/migrations/20260620165000_initial_schema.sql`.
3. Add public Supabase env values outside Git.
4. Create the Supabase Auth user manually.
5. Insert a matching `admin_users` row manually.
6. Set `status = 'active'`.
7. Use `/admin/login` to request the magic link.

Do not commit real environment values.

## 10. RLS And admin_users Policy Notes

No new Step 31 migration was required.

The Step 29 migration already includes:

- `public.is_site_admin()`
- `public.is_site_owner_or_admin()`
- a select policy that allows active admins to read admin users
- a select policy path allowing authenticated users to read their own `admin_users` row

That is sufficient for the Step 31 server guard to check the current user's admin row without opening public reads or public writes.

## 11. Service-Role Boundary

Step 31 does not create a service-role client.

Rules:

- Never use `SUPABASE_SERVICE_ROLE_KEY` in browser code.
- Never expose `SUPABASE_SECRET_KEY` to client bundles.
- Do not use service role to bypass admin authorization.
- Service-role SQL may be used manually outside Git only for first-admin setup.

## 12. Dashboard Scope

The dashboard shows:

- authenticated admin status
- Supabase/Auth guard status
- public project data-source status
- local project model count
- future admin area cards

The dashboard does not edit content or write data.

## 13. Step 32 Forms Boundary

Step 32 adds public submission forms and a server route, but it does not add an admin submissions viewer.

The `submissions` table remains locked for public direct writes. Public forms post to `/api/submissions`, and the server route inserts only when server-side Supabase env values are configured.

Admin routes do not expose submissions yet. Future admin work should add a private viewer through the existing admin guard and should not leak private submission operations into public client code.

## 14. Future Content Editing Boundary

Future admin content editing should build on this guard and dashboard shell.

Editing flows should:

- keep server-side authorization
- use active admin checks
- avoid client-side-only protection
- write audit records where appropriate
- avoid fake success states
- preserve local fallback until migration is intentionally assigned

## 15. Anti-patterns

- Hardcoding an admin email bypass.
- Seeding an admin user automatically.
- Using `getSession()` as the server authorization source.
- Creating a service-role client in browser code.
- Exposing raw auth errors or secrets.
- Building CRUD during the auth foundation step.
- Enabling public writes.
- Pretending setup is live before a real Supabase project exists.
