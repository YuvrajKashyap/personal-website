# Supabase Runbook

This folder contains the local Supabase schema foundation for Yuvraj Kashyap's personal website.

## What Exists

- `supabase/migrations/20260620165000_initial_schema.sql`
  - Initial schema migration.
  - Tables for admin users, settings, social links, projects, page content, tracker content, future submissions, and audit history.
  - RLS enabled on every table.
  - Public reads limited to safe public records.
  - Public writes disabled.
  - Admin management policies prepared for future authenticated admin flows.

No frontend page reads from Supabase yet.
No admin auth or dashboard exists yet.
No form submission backend exists yet.

## Manual Project Setup

If no Supabase project exists yet:

1. Open the Supabase dashboard.
2. Create a new project named `personal-website` or `yuvraj-personal-website`.
3. Keep the database password and service role key private.
4. Do not paste secrets into Git, docs, screenshots, or chat reports.

## Apply Migration Through SQL Editor

If the Supabase CLI is not available or not authenticated:

1. Open the project dashboard.
2. Open SQL Editor.
3. Open `supabase/migrations/20260620165000_initial_schema.sql` locally.
4. Paste the migration SQL into the SQL Editor.
5. Run it once.
6. Confirm the tables exist in the `public` schema.
7. Confirm Row Level Security is enabled on every table.
8. Confirm `submissions` has no public insert policy.
9. Confirm no first admin user was seeded automatically.

## Apply Migration Through CLI

Only use this if the Supabase CLI is installed, authenticated, and linked safely:

```bash
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

Do not run CLI commands that print secrets into logs.

## Environment Variables

Use `.env.local` locally and Vercel environment variables later. Do not commit real values.

Required placeholders are documented in `.env.example`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_PROJECT_REF`

The service role key is server-only. It must never be exposed to browser code.

## First Admin User

The migration does not seed an admin user.

After Supabase Auth is wired in a later step, create the first admin manually with a known `auth.users.id`, for example through SQL Editor:

```sql
insert into public.admin_users (user_id, email, display_name, role, status)
values (
  'AUTH_USER_UUID_HERE',
  'PUBLIC_OR_PRIVATE_EMAIL_IF_APPROVED',
  'Yuvraj Kashyap',
  'owner',
  'active'
);
```

Do not guess the Auth user id or email.

## RLS Summary

- Public users can read only published public content.
- Public users can read verified public social links.
- Public users can read public tracker rows.
- Public users cannot write content.
- Public users cannot read `admin_users`, `submissions`, or `content_audit_log`.
- Public users cannot insert `submissions` yet.
- Authenticated active site admins can manage content tables.
- Admin user management is restricted to active owners/admins or manual service-role SQL.

## Deferred Work

- Step 30 can connect the frontend data layer.
- Step 31 can build auth/admin foundations if assigned.
- Step 32 can add real form submission behavior if assigned.
- Storage/media upload UI is not implemented.
- Analytics and integrations are not implemented.
