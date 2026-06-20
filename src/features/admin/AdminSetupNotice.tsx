import type { AdminAuthState } from "@/lib/supabase/auth";

import { adminSetupSteps } from "./admin-content";

export function AdminSetupNotice({
  authState,
}: Readonly<{
  authState?: Extract<AdminAuthState, { status: "not_configured" }>;
}>) {
  return (
    <div className="admin-setup">
      <div className="admin-status-card">
        <p className="text-mono-label text-accent">Setup Required</p>
        <h2 className="text-card-title">Supabase admin auth is not live yet.</h2>
        <p className="text-body">
          The public site remains available. Admin authentication needs the real
          Supabase project, schema, environment values, Auth user, and active
          admin_users row before login can work.
        </p>
        {authState?.reason ? (
          <p className="text-caption text-muted-foreground">{authState.reason}</p>
        ) : null}
      </div>
      <div className="admin-dashboard-grid">
        {adminSetupSteps.map((step, index) => (
          <div className="admin-status-card" key={step}>
            <p className="text-mono-label text-accent">
              Step {String(index + 1).padStart(2, "0")}
            </p>
            <p className="text-body">{step}</p>
          </div>
        ))}
      </div>
      <p className="text-caption text-muted-foreground">
        No secrets belong in Git. Use `.env.local` locally and Vercel
        environment variables for production.
      </p>
    </div>
  );
}
