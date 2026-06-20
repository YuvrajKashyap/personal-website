import type { Json } from "@/lib/supabase/database.types";
import { isSubmissionBackendConfigured } from "@/lib/submissions/config";
import { createSubmissionRecord } from "@/lib/submissions/submit-submission";
import { validateSubmissionPayload } from "@/lib/submissions/validation";
import { SUBMISSION_FIELD_LIMITS } from "@/types/submission";

export const dynamic = "force-dynamic";

function jsonResponse(body: unknown, init?: ResponseInit) {
  return Response.json(body, {
    ...init,
    headers: {
      "Cache-Control": "no-store",
      ...init?.headers,
    },
  });
}

function truncateMetadata(value: string | null, maxLength: number) {
  const trimmed = value?.trim();

  if (!trimmed) {
    return null;
  }

  return trimmed.slice(0, maxLength);
}

export function GET() {
  return jsonResponse(
    {
      ok: false,
      error: "method_not_allowed",
      message: "Submissions are accepted with POST only.",
    },
    {
      status: 405,
      headers: {
        Allow: "POST",
      },
    },
  );
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  if (!contentType.toLowerCase().includes("application/json")) {
    return jsonResponse(
      {
        ok: false,
        error: "unsupported_media_type",
        message: "Send submission data as JSON.",
      },
      {
        status: 415,
      },
    );
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return jsonResponse(
      {
        ok: false,
        error: "invalid_json",
        message: "The submission payload could not be read.",
      },
      {
        status: 400,
      },
    );
  }

  const validation = validateSubmissionPayload(payload);

  if (!validation.ok) {
    return jsonResponse(
      {
        ok: false,
        error:
          validation.reason === "honeypot"
            ? "submission_rejected"
            : "validation_error",
        fields: validation.errors,
      },
      {
        status: 400,
      },
    );
  }

  if (!isSubmissionBackendConfigured()) {
    return jsonResponse(
      {
        ok: false,
        error: "not_configured",
        message: "Submission backend is not configured yet.",
      },
      {
        status: 503,
      },
    );
  }

  const metadata: Json = {
    schemaVersion: 1,
    submittedVia: "/api/submissions",
    sourcePath: validation.data.sourcePath,
    userAgent: truncateMetadata(
      request.headers.get("user-agent"),
      SUBMISSION_FIELD_LIMITS.userAgent,
    ),
    referrer: truncateMetadata(
      request.headers.get("referer"),
      SUBMISSION_FIELD_LIMITS.referrer,
    ),
  };

  const result = await createSubmissionRecord(validation.data, metadata);

  if (!result.ok) {
    return jsonResponse(
      {
        ok: false,
        error:
          result.reason === "not_configured"
            ? "not_configured"
            : "insert_failed",
        message:
          result.reason === "not_configured"
            ? "Submission backend is not configured yet."
            : "Submission could not be saved.",
      },
      {
        status: result.reason === "not_configured" ? 503 : 500,
      },
    );
  }

  return jsonResponse(
    {
      ok: true,
      message: "Submission received.",
    },
    {
      status: 201,
    },
  );
}
