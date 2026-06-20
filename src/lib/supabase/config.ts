import "server-only";

export const SITE_DATA_SOURCE_MODES = ["local", "auto", "supabase"] as const;

export type SiteDataSourceMode = (typeof SITE_DATA_SOURCE_MODES)[number];

export type SupabasePublicConfig = Readonly<{
  url: string;
  key: string;
  keySource: "publishable" | "anon";
}>;

export type SupabaseDataLayerConfig = Readonly<{
  mode: SiteDataSourceMode;
  publicConfig: SupabasePublicConfig | null;
  isConfigured: boolean;
  reason?: string;
}>;

function cleanEnvValue(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function resolveDataSourceMode(value: string | undefined): SiteDataSourceMode {
  const normalized = cleanEnvValue(value)?.toLowerCase();

  if (normalized === "auto" || normalized === "supabase") {
    return normalized;
  }

  return "local";
}

export function getSiteDataSourceMode(): SiteDataSourceMode {
  return resolveDataSourceMode(process.env.SITE_DATA_SOURCE);
}

export function getSupabasePublicConfig(): SupabasePublicConfig | null {
  const url = cleanEnvValue(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const publishableKey = cleanEnvValue(
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
  const anonKey = cleanEnvValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const key = publishableKey ?? anonKey;

  if (!url || !key) {
    return null;
  }

  return {
    url,
    key,
    keySource: publishableKey ? "publishable" : "anon",
  };
}

export function getSupabaseDataLayerConfig(): SupabaseDataLayerConfig {
  const mode = getSiteDataSourceMode();
  const publicConfig = getSupabasePublicConfig();

  if (publicConfig) {
    return {
      mode,
      publicConfig,
      isConfigured: true,
    };
  }

  return {
    mode,
    publicConfig: null,
    isConfigured: false,
    reason:
      "NEXT_PUBLIC_SUPABASE_URL and a publishable or anon key are required for Supabase reads.",
  };
}
