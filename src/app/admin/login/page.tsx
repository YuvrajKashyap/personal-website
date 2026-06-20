import { AdminLoginPage } from "@/features/admin/AdminLoginPage";

type AdminLoginRouteProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default function AdminLoginRoute(props: AdminLoginRouteProps) {
  return <AdminLoginPage {...props} />;
}
