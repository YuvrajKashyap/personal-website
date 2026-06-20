import {
  SUBMISSION_FIELD_LIMITS,
  SUBMISSION_TYPES,
  type NormalizedSubmission,
  type SubmissionPayload,
  type SubmissionType,
  type SubmissionValidationErrors,
  type SubmissionValidationResult,
} from "@/types/submission";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isSubmissionType(value: unknown): value is SubmissionType {
  return SUBMISSION_TYPES.includes(value as SubmissionType);
}

function resolveSubmissionType(value: unknown): SubmissionType {
  return isSubmissionType(value) ? value : "general";
}

function validateRequiredText(
  field: "name" | "email" | "subject" | "message",
  value: string,
  errors: SubmissionValidationErrors,
) {
  if (!value) {
    errors[field] = "This field is required.";
    return;
  }

  if (value.length > SUBMISSION_FIELD_LIMITS[field]) {
    errors[field] = `Keep this under ${SUBMISSION_FIELD_LIMITS[field]} characters.`;
  }
}

function validateOptionalText(
  field: "company" | "website",
  value: string,
  errors: SubmissionValidationErrors,
) {
  if (value.length > SUBMISSION_FIELD_LIMITS[field]) {
    errors[field] = `Keep this under ${SUBMISSION_FIELD_LIMITS[field]} characters.`;
  }
}

function normalizeWebsite(value: string, errors: SubmissionValidationErrors) {
  if (!value) {
    return undefined;
  }

  const withProtocol = value.includes("://") ? value : `https://${value}`;

  try {
    const url = new URL(withProtocol);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      errors.website = "Use an http or https URL.";
      return undefined;
    }

    return url.toString();
  } catch {
    errors.website = "Use a valid website URL.";
    return undefined;
  }
}

function normalizeSourcePath(value: string) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }

  return value.slice(0, SUBMISSION_FIELD_LIMITS.sourcePath);
}

export function validateSubmissionPayload(
  payload: unknown,
): SubmissionValidationResult {
  const raw: SubmissionPayload = isRecord(payload) ? payload : {};
  const companyFax = readString(raw.companyFax);
  const confirmEmail = readString(raw.confirmEmail);

  if (companyFax || confirmEmail) {
    return {
      ok: false,
      reason: "honeypot",
      errors: {
        form: "Submission rejected.",
      },
    };
  }

  const name = readString(raw.name);
  const email = readString(raw.email).toLowerCase();
  const subject = readString(raw.subject);
  const message = readString(raw.message);
  const company = readString(raw.company);
  const websiteInput = readString(raw.website);
  const sourcePath = normalizeSourcePath(readString(raw.sourcePath));
  const submissionType = resolveSubmissionType(raw.submissionType);
  const errors: SubmissionValidationErrors = {};

  validateRequiredText("name", name, errors);
  validateRequiredText("email", email, errors);
  validateRequiredText("subject", subject, errors);
  validateRequiredText("message", message, errors);
  validateOptionalText("company", company, errors);
  validateOptionalText("website", websiteInput, errors);

  if (email && !EMAIL_PATTERN.test(email)) {
    errors.email = "Use a valid email address.";
  }

  const website = normalizeWebsite(websiteInput, errors);

  if (Object.keys(errors).length > 0) {
    return {
      ok: false,
      reason: "validation",
      errors,
    };
  }

  const data: NormalizedSubmission = {
    submissionType,
    name,
    email,
    subject,
    message,
    sourcePath,
  };

  if (company) {
    data.company = company;
  }

  if (website) {
    data.website = website;
  }

  return {
    ok: true,
    data,
  };
}
