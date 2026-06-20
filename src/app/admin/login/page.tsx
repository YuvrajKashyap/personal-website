import { AdminLoginPage } from "@/features/admin/AdminLoginPage";
import { createNoindexMetadata } from "@/lib/seo/metadata";

type AdminLoginRouteProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata = createNoindexMetadata(
  "Admin Login",
  "Private admin login for site operations.",
  "/admin/login",
);

export default function AdminLoginRoute(props: AdminLoginRouteProps) {
  return <AdminLoginPage {...props} />;
}
