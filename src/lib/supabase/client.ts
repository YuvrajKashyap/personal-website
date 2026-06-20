"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/database.types";

type BrowserSupabaseConfig = Readonly<{
  url: string;
  key: string;
}>;

function cleanEnvValue(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export function getSupabaseBrowserConfig(): BrowserSupabaseConfig | null {
  const url = cleanEnvValue(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const publishableKey = cleanEnvValue(
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
  const anonKey = cleanEnvValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const key = publishableKey ?? anonKey;

  if (!url || !key) {
    return null;
  }

  return { url, key };
}

export function createSupabaseBrowserClient(): SupabaseClient<Database> | null {
  const config = getSupabaseBrowserConfig();

  if (!config) {
    return null;
  }

  return createBrowserClient<Database>(config.url, config.key);
}
