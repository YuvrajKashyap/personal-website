import "server-only";

import { redirect } from "next/navigation";

import { getSupabasePublicConfig } from "@/lib/supabase/config";
import type { SupabaseAdminUserRow } from "@/lib/supabase/database.types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AdminAuthState =
  | {
      status: "not_configured";
      supabaseConfigured: false;
      reason: string;
      verificationMethod: "none";
    }
  | {
      status: "unauthenticated";
      supabaseConfigured: true;
      verificationMethod: "getClaims";
    }
  | {
      status: "access_denied";
      supabaseConfigured: true;
      verificationMethod: "getClaims";
      userId: string;
      email?: string;
      adminUser?: SupabaseAdminUserRow | null;
      reason: string;
    }
  | {
      status: "authorization_error";
      supabaseConfigured: true;
      verificationMethod: "getClaims";
      userId?: string;
      email?: string;
      reason: string;
    }
  | {
      status: "authorized";
      supabaseConfigured: true;
      verificationMethod: "getClaims";
      userId: string;
      email?: string;
      adminUser: SupabaseAdminUserRow;
    };

type SupabaseClaims = {
  sub?: string;
  email?: string;
};

export function isSupabaseAuthConfigured() {
  return getSupabasePublicConfig() !== null;
}

export function getAdminLoginRedirect(nextPath = "/admin") {
  const params = new URLSearchParams();
  const safeNextPath = getSafeAdminNextPath(nextPath);

  if (safeNextPath !== "/admin") {
    params.set("next", safeNextPath);
  }

  const query = params.toString();
  return query ? `/admin/login?${query}` : "/admin/login";
}

export function getSafeAdminNextPath(value: string | null | undefined) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/admin";
  }

  try {
    const parsed = new URL(value, "https://yuvrajkashyap.com");

    if (
      parsed.origin !== "https://yuvrajkashyap.com" ||
      !parsed.pathname.startsWith("/admin") ||
      parsed.pathname.startsWith("/admin/auth/callback") ||
      parsed.pathname.startsWith("/admin/logout")
    ) {
      return "/admin";
    }

    return `${parsed.pathname}${parsed.search}`;
  } catch {
    return "/admin";
  }
}

export async function getAdminAuthState(): Promise<AdminAuthState> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return {
      status: "not_configured",
      supabaseConfigured: false,
      reason:
        "Supabase auth needs NEXT_PUBLIC_SUPABASE_URL and a publishable or anon key.",
      verificationMethod: "none",
    };
  }

  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();
  const claims = claimsData?.claims as SupabaseClaims | undefined;
  const userId = claims?.sub;

  if (claimsError || !userId) {
    return {
      status: "unauthenticated",
      supabaseConfigured: true,
      verificationMethod: "getClaims",
    };
  }

  const { data: adminUser, error: adminError } = await supabase
    .from("admin_users")
    .select("id,user_id,email,display_name,role,status,created_at,updated_at")
    .eq("user_id", userId)
    .maybeSingle();

  if (adminError) {
    return {
      status: "authorization_error",
      supabaseConfigured: true,
      verificationMethod: "getClaims",
      userId,
      email: claims?.email,
      reason:
        "Admin authorization could not be checked. Confirm the schema and policies are applied.",
    };
  }

  if (!adminUser) {
    return {
      status: "access_denied",
      supabaseConfigured: true,
      verificationMethod: "getClaims",
      userId,
      email: claims?.email,
      adminUser,
      reason: "No admin_users row exists for this authenticated user.",
    };
  }

  if (adminUser.status !== "active") {
    return {
      status: "access_denied",
      supabaseConfigured: true,
      verificationMethod: "getClaims",
      userId,
      email: claims?.email ?? adminUser.email ?? undefined,
      adminUser,
      reason: "The matching admin_users row is not active.",
    };
  }

  return {
    status: "authorized",
    supabaseConfigured: true,
    verificationMethod: "getClaims",
    userId,
    email: claims?.email ?? adminUser.email ?? undefined,
    adminUser,
  };
}

export async function requireAdmin() {
  const authState = await getAdminAuthState();

  if (authState.status === "unauthenticated") {
    redirect(getAdminLoginRedirect());
  }

  return authState;
}
