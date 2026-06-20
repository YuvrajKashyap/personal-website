import { redirect } from "next/navigation";

import { AdminAccessDenied } from "@/features/admin/AdminAccessDenied";
import { AdminDashboard } from "@/features/admin/AdminDashboard";
import { AdminSetupNotice } from "@/features/admin/AdminSetupNotice";
import { AdminShell } from "@/features/admin/AdminShell";
import { getAllProjects } from "@/lib/projects/projects";
import { getProjectsDataSourceStatus } from "@/lib/projects/project-data-source";
import { getAdminAuthState, getAdminLoginRedirect } from "@/lib/supabase/auth";

export default async function AdminPage() {
  const authState = await getAdminAuthState();

  if (authState.status === "unauthenticated") {
    redirect(getAdminLoginRedirect());
  }

  if (authState.status === "not_configured") {
    return (
      <AdminShell eyebrow="Admin Setup" title="Admin setup required">
        <AdminSetupNotice authState={authState} />
      </AdminShell>
    );
  }

  if (
    authState.status === "access_denied" ||
    authState.status === "authorization_error"
  ) {
    return (
      <AdminShell eyebrow="Admin Access" title="Access needs review">
        <AdminAccessDenied authState={authState} />
      </AdminShell>
    );
  }

  return (
    <AdminShell eyebrow="Admin Dashboard" title="Site operations">
      <AdminDashboard
        authState={authState}
        dataSourceStatus={getProjectsDataSourceStatus()}
        localProjectCount={getAllProjects().length}
      />
    </AdminShell>
  );
}
