"use client";

import { FormEvent, useState } from "react";

import {
  createSupabaseBrowserClient,
  getSupabaseBrowserConfig,
} from "@/lib/supabase/client";

type LoginStatus = "idle" | "submitting" | "success" | "error";

function getEmailRedirectTo(nextPath: string) {
  const redirectUrl = new URL("/admin/auth/callback", window.location.origin);

  if (nextPath !== "/admin") {
    redirectUrl.searchParams.set("next", nextPath);
  }

  return redirectUrl.toString();
}

export function AdminLoginForm({
  nextPath,
}: Readonly<{
  nextPath: string;
}>) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<LoginStatus>("idle");
  const isConfigured = getSupabaseBrowserConfig() !== null;
  const isDisabled = status === "submitting" || !isConfigured;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setStatus("error");
      return;
    }

    setStatus("submitting");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: getEmailRedirectTo(nextPath),
        shouldCreateUser: false,
      },
    });

    setStatus(error ? "error" : "success");
  }

  return (
    <form className="admin-auth-form" onSubmit={handleSubmit}>
      <div>
        <label className="text-mono-label" htmlFor="admin-email">
          Email
        </label>
        <input
          id="admin-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
        />
      </div>
      <button className="focus-ring" type="submit" disabled={isDisabled}>
        {status === "submitting" ? "Sending link" : "Send magic link"}
      </button>
      {status === "success" ? (
        <p className="text-caption text-success">
          Check your email for the admin login link.
        </p>
      ) : null}
      {status === "error" ? (
        <p className="text-caption text-danger">
          The magic link could not be sent. Confirm Supabase Auth setup and try
          again.
        </p>
      ) : null}
      {!isConfigured ? (
        <p className="text-caption text-muted-foreground">
          Supabase auth env values are missing, so login is disabled.
        </p>
      ) : null}
    </form>
  );
}
