import { redirect } from "next/navigation";

import { AdminAccessDenied } from "@/features/admin/AdminAccessDenied";
import { AdminLoginForm } from "@/features/admin/AdminLoginForm";
import { AdminSetupNotice } from "@/features/admin/AdminSetupNotice";
import { AdminShell } from "@/features/admin/AdminShell";
import {
  getAdminAuthState,
  getSafeAdminNextPath,
} from "@/lib/supabase/auth";

type AdminLoginPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function statusMessage(status: string | undefined) {
  if (status === "signed_out") {
    return "You have been signed out.";
  }

  if (status === "invalid_link") {
    return "That admin login link is missing a valid code.";
  }

  if (status === "auth_error") {
    return "The admin login link could not be verified.";
  }

  if (status === "setup_required") {
    return "Supabase admin auth setup is required before login can work.";
  }

  return null;
}

export async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const params = (await searchParams) ?? {};
  const nextPath = getSafeAdminNextPath(firstParam(params.next));
  const authState = await getAdminAuthState();

  if (authState.status === "authorized") {
    redirect(nextPath);
  }

  if (authState.status === "not_configured") {
    return (
      <AdminShell eyebrow="Admin Login" title="Setup required">
        <AdminSetupNotice authState={authState} />
      </AdminShell>
    );
  }

  if (
    authState.status === "access_denied" ||
    authState.status === "authorization_error"
  ) {
    return (
      <AdminShell eyebrow="Admin Login" title="Access boundary">
        <AdminAccessDenied authState={authState} />
      </AdminShell>
    );
  }

  const message = statusMessage(firstParam(params.status));

  return (
    <AdminShell eyebrow="Admin Login" title="Private admin entry">
      <div className="admin-login">
        <div className="admin-status-card">
          <p className="text-body">
            Enter the email tied to a Supabase Auth user with an active
            `admin_users` row.
          </p>
          {message ? (
            <p className="text-caption text-muted-foreground">{message}</p>
          ) : null}
        </div>
        <AdminLoginForm nextPath={nextPath} />
      </div>
    </AdminShell>
  );
}
