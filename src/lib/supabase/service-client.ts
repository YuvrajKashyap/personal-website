import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { getSubmissionBackendConfig } from "@/lib/submissions/config";
import type { Database } from "@/lib/supabase/database.types";

export function createSupabaseServiceClient(): SupabaseClient<Database> | null {
  const config = getSubmissionBackendConfig();

  if (!config) {
    return null;
  }

  return createClient<Database>(config.url, config.key, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });
}
