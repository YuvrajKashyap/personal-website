import { NextRequest, NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const redirectUrl = new URL("/admin/login", requestUrl.origin);
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    redirectUrl.searchParams.set("status", "setup_required");
    return NextResponse.redirect(redirectUrl);
  }

  await supabase.auth.signOut();
  redirectUrl.searchParams.set("status", "signed_out");

  return NextResponse.redirect(redirectUrl);
}
