import "server-only";

export type SubmissionBackendConfig = Readonly<{
  url: string;
  key: string;
  keySource: "secret" | "service_role";
}>;

function cleanEnvValue(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export function getSubmissionBackendConfig(): SubmissionBackendConfig | null {
  const url = cleanEnvValue(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const secretKey = cleanEnvValue(process.env.SUPABASE_SECRET_KEY);
  const serviceRoleKey = cleanEnvValue(process.env.SUPABASE_SERVICE_ROLE_KEY);
  const key = secretKey ?? serviceRoleKey;

  if (!url || !key) {
    return null;
  }

  return {
    url,
    key,
    keySource: secretKey ? "secret" : "service_role",
  };
}

export function isSubmissionBackendConfigured() {
  return getSubmissionBackendConfig() !== null;
}
