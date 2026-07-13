"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useId, useRef, useState } from "react";

import type {
  SubmissionType,
  SubmissionValidationErrors,
} from "@/types/submission";

type SubmissionFormProps = Readonly<{
  submissionType: SubmissionType;
  backendEnabled: boolean;
  sourcePath: string;
  title?: string;
  description?: string;
}>;

type SubmissionStatus = "idle" | "submitting" | "success" | "error";

type SubmissionApiResponse =
  | {
      ok: true;
      message?: string;
    }
  | {
      ok: false;
      error?: string;
      message?: string;
      fields?: SubmissionValidationErrors;
    };

type FieldConfig = Readonly<{
  name: "name" | "email" | "subject" | "company" | "website";
  label: string;
  type: string;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
}>;

const FIELDS: FieldConfig[] = [
  {
    name: "name",
    label: "Name",
    type: "text",
    required: true,
    autoComplete: "name",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    required: true,
    autoComplete: "email",
  },
  {
    name: "subject",
    label: "Subject",
    type: "text",
    required: true,
  },
  {
    name: "company",
    label: "Company",
    type: "text",
    autoComplete: "organization",
    placeholder: "Optional",
  },
  {
    name: "website",
    label: "Website",
    type: "url",
    autoComplete: "url",
    placeholder: "Optional",
  },
];

export function SubmissionForm({
  submissionType,
  backendEnabled,
  sourcePath,
  title = "Submit context",
  description = "Share the minimum useful context for manual review.",
}: SubmissionFormProps) {
  const formId = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [status, setStatus] = useState<SubmissionStatus>("idle");
  const [errors, setErrors] = useState<SubmissionValidationErrors>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isSubmitting = status === "submitting";
  const isDisabled = !backendEnabled || isSubmitting;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!backendEnabled) {
      return;
    }

    setStatus("submitting");
    setErrors({});
    setErrorMessage(null);

    const formData = new FormData(event.currentTarget);
    const payload = {
      submissionType,
      sourcePath,
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
      company: formData.get("company"),
      website: formData.get("website"),
      companyFax: formData.get("companyFax"),
      confirmEmail: formData.get("confirmEmail"),
    };

    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as SubmissionApiResponse;

      if (!response.ok || !result.ok) {
        setStatus("error");
        setErrors(result.ok ? {} : (result.fields ?? {}));
        setErrorMessage(
          result.ok
            ? "Submission could not be saved."
            : (result.message ?? "Review the highlighted fields."),
        );
        return;
      }

      setStatus("success");
      formRef.current?.reset();
    } catch {
      setStatus("error");
      setErrorMessage("Submission could not be saved.");
    }
  }

  return (
    <form
      ref={formRef}
      className="submission-form"
      aria-describedby={`${formId}-description ${formId}-status`}
      onSubmit={handleSubmit}
    >
      <div className="stack-xs">
        <h3 className="text-card-title">{title}</h3>
        <p id={`${formId}-description`} className="text-body">
          {description}
        </p>
      </div>

      {!backendEnabled ? (
        <div className="submission-form__disabled" role="status">
          <strong>Submission backend is not configured yet.</strong>
          <span>Use the verified channels on the Contact page for now.</span>
          <span>
            This form will connect once Supabase environment values are set.
          </span>
        </div>
      ) : null}

      <input type="hidden" name="submissionType" value={submissionType} />
      <input type="hidden" name="sourcePath" value={sourcePath} />

      <div className="submission-form__honeypot" aria-hidden="true">
        <label htmlFor={`${formId}-company-fax`}>Company fax</label>
        <input
          id={`${formId}-company-fax`}
          name="companyFax"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
        <label htmlFor={`${formId}-confirm-email`}>Confirm email</label>
        <input
          id={`${formId}-confirm-email`}
          name="confirmEmail"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="submission-form__grid">
        {FIELDS.map((field) => {
          const fieldId = `${formId}-${field.name}`;
          const error = errors[field.name];

          return (
            <div key={field.name} className="submission-form__field">
              <label className="submission-form__label" htmlFor={fieldId}>
                {field.label}
                {field.required ? <span aria-hidden="true"> *</span> : null}
              </label>
              <input
                id={fieldId}
                className="submission-form__input"
                name={field.name}
                type={field.type}
                required={field.required}
                disabled={isDisabled}
                autoComplete={field.autoComplete}
                placeholder={field.placeholder}
                aria-invalid={error ? "true" : undefined}
                aria-describedby={error ? `${fieldId}-error` : undefined}
              />
              {error ? (
                <p id={`${fieldId}-error`} className="submission-form__error">
                  {error}
                </p>
              ) : null}
            </div>
          );
        })}

        <div className="submission-form__field submission-form__field--full">
          <label className="submission-form__label" htmlFor={`${formId}-message`}>
            Message <span aria-hidden="true">*</span>
          </label>
          <textarea
            id={`${formId}-message`}
            className="submission-form__textarea"
            name="message"
            required
            disabled={isDisabled}
            rows={7}
            aria-invalid={errors.message ? "true" : undefined}
            aria-describedby={
              errors.message ? `${formId}-message-error` : undefined
            }
          />
          {errors.message ? (
            <p
              id={`${formId}-message-error`}
              className="submission-form__error"
            >
              {errors.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="submission-form__actions">
        <button
          className={[
            "submission-form__button focus-ring",
            isSubmitting ? "submission-form__button-loading" : undefined,
          ]
            .filter(Boolean)
            .join(" ")}
          type="submit"
          disabled={isDisabled}
        >
          {isSubmitting ? (
            <span className="submission-form__spinner" aria-hidden="true" />
          ) : null}
          <span>{isSubmitting ? "Saving" : "Send for manual review"}</span>
        </button>
        <p className="text-caption">
          Required fields are name, email, subject, and message.
        </p>
      </div>

      <div id={`${formId}-status`} aria-live="polite">
        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.p
              key="success"
              className="submission-form__success"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.32, ease: [0.22, 0.8, 0.28, 1] }}
            >
              <strong>Submission received.</strong>
              <span>Your message was saved for manual review.</span>
            </motion.p>
          ) : null}
          {status === "error" && errorMessage ? (
            <motion.p
              key="error"
              className="submission-form__error submission-form__error--form"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.32, ease: [0.22, 0.8, 0.28, 1] }}
            >
              {errorMessage}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>
    </form>
  );
}
