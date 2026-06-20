import Link from "next/link";

import { AdminSignOutButton } from "@/features/admin/AdminSignOutButton";
import { adminStatusCards, futureAdminAreas } from "@/features/admin/admin-content";
import type { ProjectsDataSourceStatus } from "@/lib/projects/project-data-source";
import type { AdminAuthState } from "@/lib/supabase/auth";

type AuthorizedAdminState = Extract<AdminAuthState, { status: "authorized" }>;

function dataSourceLabel(status: ProjectsDataSourceStatus) {
  if (status.source === "supabase") {
    return "Supabase public reads";
  }

  if (status.source === "local_fallback") {
    return "Local fallback";
  }

  return "Local content";
}

export function AdminDashboard({
  authState,
  dataSourceStatus,
  localProjectCount,
}: Readonly<{
  authState: AuthorizedAdminState;
  dataSourceStatus: ProjectsDataSourceStatus;
  localProjectCount: number;
}>) {
  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard-topline">
        <div>
          <p className="text-mono-label text-accent">Signed In</p>
          <p className="text-body">
            {authState.email ?? authState.adminUser.email ?? "Authenticated admin"}
          </p>
          <p className="text-caption text-muted-foreground">
            Role: {authState.adminUser.role}. Status: {authState.adminUser.status}.
          </p>
        </div>
        <AdminSignOutButton />
      </div>

      <div className="admin-dashboard-grid">
        {adminStatusCards.map((card) => (
          <div className="admin-status-card" key={card.title}>
            <p className="text-mono-label text-accent">{card.label}</p>
            <h2 className="text-card-title">{card.title}</h2>
            <p className="text-body">{card.description}</p>
          </div>
        ))}
        <div className="admin-status-card">
          <p className="text-mono-label text-accent">Data Source</p>
          <h2 className="text-card-title">{dataSourceLabel(dataSourceStatus)}</h2>
          <p className="text-body">
            Mode: {dataSourceStatus.mode}. Supabase configured:{" "}
            {dataSourceStatus.supabaseConfigured ? "yes" : "no"}.
          </p>
          {dataSourceStatus.reason ? (
            <p className="text-caption text-muted-foreground">
              {dataSourceStatus.reason}
            </p>
          ) : null}
        </div>
        <div className="admin-status-card">
          <p className="text-mono-label text-accent">Local Model</p>
          <h2 className="text-card-title">{localProjectCount} project records</h2>
          <p className="text-body">
            Count is derived from the local typed project model. It is not a live
            database metric.
          </p>
        </div>
      </div>

      <section className="admin-panel admin-dashboard-section">
        <div className="admin-section-heading">
          <p className="text-mono-label text-accent">Future Admin Areas</p>
          <h2 className="text-section-title">Management surfaces</h2>
          <p className="text-body">
            These cards define the future dashboard shape. Editing is not built
            in this step.
          </p>
        </div>
        <div className="admin-dashboard-grid">
          {futureAdminAreas.map((area) => (
            <article className="admin-status-card" key={area.title}>
              <p className="text-mono-label text-accent">Editing later</p>
              <h3 className="text-card-title">{area.title}</h3>
              <p className="text-body">{area.description}</p>
              {area.previewHref ? (
                <Link className="admin-quiet-link focus-ring" href={area.previewHref}>
                  Preview public page
                </Link>
              ) : (
                <span className="admin-disabled-action">Editing not built</span>
              )}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
