import { NextRequest, NextResponse } from "next/server";

import { getSafeAdminNextPath } from "@/lib/supabase/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function loginRedirect(requestUrl: URL, status: string) {
  const redirectUrl = new URL("/admin/login", requestUrl.origin);
  redirectUrl.searchParams.set("status", status);
  return NextResponse.redirect(redirectUrl);
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const error = requestUrl.searchParams.get("error");
  const code = requestUrl.searchParams.get("code");

  if (error) {
    return loginRedirect(requestUrl, "auth_error");
  }

  if (!code) {
    return loginRedirect(requestUrl, "invalid_link");
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return loginRedirect(requestUrl, "setup_required");
  }

  const { error: exchangeError } =
    await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    return loginRedirect(requestUrl, "auth_error");
  }

  const nextPath = getSafeAdminNextPath(requestUrl.searchParams.get("next"));
  return NextResponse.redirect(new URL(nextPath, requestUrl.origin));
}
