export const SUBMISSION_TYPES = [
  "contact",
  "services",
  "collaborate",
  "general",
] as const;

export type SubmissionType = (typeof SUBMISSION_TYPES)[number];

export const SUBMISSION_FIELD_LIMITS = {
  name: 120,
  email: 254,
  subject: 160,
  message: 4000,
  company: 160,
  website: 300,
  sourcePath: 200,
  userAgent: 300,
  referrer: 300,
} as const;

export type SubmissionField =
  | "name"
  | "email"
  | "subject"
  | "message"
  | "company"
  | "website"
  | "submissionType"
  | "sourcePath"
  | "form";

export type SubmissionValidationErrors = Partial<
  Record<SubmissionField, string>
>;

export type SubmissionPayload = {
  submissionType?: unknown;
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
  company?: unknown;
  website?: unknown;
  sourcePath?: unknown;
  companyFax?: unknown;
  confirmEmail?: unknown;
};

export type NormalizedSubmission = {
  submissionType: SubmissionType;
  name: string;
  email: string;
  subject: string;
  message: string;
  sourcePath: string;
  company?: string;
  website?: string;
};

export type SubmissionValidationResult =
  | {
      ok: true;
      data: NormalizedSubmission;
    }
  | {
      ok: false;
      reason: "validation" | "honeypot";
      errors: SubmissionValidationErrors;
    };
