import { AdminSignOutButton } from "@/features/admin/AdminSignOutButton";
import type { AdminAuthState } from "@/lib/supabase/auth";

type DeniedState = Extract<
  AdminAuthState,
  { status: "access_denied" | "authorization_error" }
>;

export function AdminAccessDenied({
  authState,
}: Readonly<{
  authState: DeniedState;
}>) {
  return (
    <div className="admin-access-denied">
      <div className="admin-status-card">
        <p className="text-mono-label text-danger">Access Boundary</p>
        <h2 className="text-card-title">
          This authenticated user is not an active admin.
        </h2>
        <p className="text-body">
          Admin access requires a matching active row in `admin_users`. No local
          bypass or hardcoded allowlist is available.
        </p>
        <p className="text-caption text-muted-foreground">{authState.reason}</p>
        {authState.email ? (
          <p className="text-caption text-muted-foreground">
            Signed in as {authState.email}
          </p>
        ) : null}
      </div>
      <AdminSignOutButton />
    </div>
  );
}
