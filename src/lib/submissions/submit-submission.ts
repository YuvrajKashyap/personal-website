import "server-only";

import type { Json, SupabaseSubmissionInsert } from "@/lib/supabase/database.types";
import { createSupabaseServiceClient } from "@/lib/supabase/service-client";
import type { NormalizedSubmission } from "@/types/submission";

export type CreateSubmissionResult =
  | {
      ok: true;
    }
  | {
      ok: false;
      reason: "not_configured" | "insert_failed";
    };

export async function createSubmissionRecord(
  submission: NormalizedSubmission,
  metadata: Json,
): Promise<CreateSubmissionResult> {
  const supabase = createSupabaseServiceClient();

  if (!supabase) {
    return {
      ok: false,
      reason: "not_configured",
    };
  }

  const record: SupabaseSubmissionInsert = {
    submission_type: submission.submissionType,
    status: "new",
    name: submission.name,
    email: submission.email,
    subject: submission.subject,
    message: submission.message,
    company: submission.company ?? null,
    website: submission.website ?? null,
    source_path: submission.sourcePath,
    metadata,
  };

  const { error } = await supabase.from("submissions").insert(record);

  if (error) {
    return {
      ok: false,
      reason: "insert_failed",
    };
  }

  return {
    ok: true,
  };
}
