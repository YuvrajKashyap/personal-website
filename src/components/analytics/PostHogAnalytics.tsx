"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { createLazyEventSink } from "@/lib/performance/runtime-utils";

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const PRIVATE_PATH_PREFIXES = ["/admin", "/api/"];

type PostHogClient = (typeof import("posthog-js"))["default"];
type AnalyticsEvent = {
  name: string;
  properties: Record<string, unknown>;
};

const postHogSink = POSTHOG_KEY
  ? createLazyEventSink<PostHogClient, AnalyticsEvent>(
      async () => {
        const { default: posthog } = await import("posthog-js");
        posthog.init(POSTHOG_KEY, {
          api_host: "https://us.i.posthog.com",
          autocapture: false,
          capture_pageleave: true,
          capture_pageview: false,
          disable_session_recording: true,
          person_profiles: "identified_only",
        });
        return posthog;
      },
      (posthog, event) => posthog.capture(event.name, event.properties),
    )
  : null;

function capture(name: string, properties: Record<string, unknown>) {
  void postHogSink?.push({ name, properties });
}

function isPrivatePath(pathname: string) {
  return PRIVATE_PATH_PREFIXES.some(
    (prefix) => pathname === prefix.slice(0, -1) || pathname.startsWith(prefix),
  );
}

function getLinkEvent(anchor: HTMLAnchorElement) {
  const href = anchor.getAttribute("href");

  if (!href || href.startsWith("#") || href.startsWith("javascript:")) {
    return null;
  }

  if (href.startsWith("mailto:")) {
    return { destination: "email", event: "portfolio_contact_intent" };
  }

  const target = new URL(href, window.location.href);

  if (target.pathname.startsWith("/media/resume/")) {
    return { destination: "resume", event: "portfolio_resume_opened" };
  }

  if (target.origin !== window.location.origin) {
    return {
      destination: target.hostname,
      event: "portfolio_outbound_link_clicked",
    };
  }

  return null;
}

/**
 * Captures high-signal portfolio behavior without recording form fields,
 * session replay, or activity on private/admin routes.
 */
export function PostHogAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    void postHogSink?.load();
  }, []);

  useEffect(() => {
    if (!POSTHOG_KEY || isPrivatePath(pathname)) {
      return;
    }

    capture("$pageview", {
      $current_url: window.location.href,
    });
  }, [pathname]);

  useEffect(() => {
    if (!POSTHOG_KEY || isPrivatePath(pathname)) {
      return;
    }

    function trackLinkClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const anchor = target.closest<HTMLAnchorElement>("a[href]");
      if (!anchor) {
        return;
      }

      const linkEvent = getLinkEvent(anchor);
      if (!linkEvent) {
        return;
      }

      capture(linkEvent.event, {
        destination: linkEvent.destination,
        source_path: window.location.pathname,
      });
    }

    function trackSubmission() {
      capture("portfolio_contact_submission_succeeded", {
        source_path: window.location.pathname,
      });
    }

    function trackCopiedEmail() {
      capture("portfolio_contact_email_copied", {
        source_path: window.location.pathname,
      });
    }

    function trackProjectHover(event: Event) {
      const detail = (event as CustomEvent<{
        dwell_ms?: number;
        project_slug?: string;
      }>).detail;

      if (
        !detail ||
        typeof detail.project_slug !== "string" ||
        typeof detail.dwell_ms !== "number"
      ) {
        return;
      }

      capture("portfolio_project_engaged_hover", {
        dwell_ms: Math.min(Math.round(detail.dwell_ms / 100) * 100, 120_000),
        project_slug: detail.project_slug,
        source_path: window.location.pathname,
      });
    }

    document.addEventListener("click", trackLinkClick);
    window.addEventListener("portfolio-submission-succeeded", trackSubmission);
    window.addEventListener("contact-email-copied", trackCopiedEmail);
    window.addEventListener("portfolio-project-engaged-hover", trackProjectHover);

    return () => {
      document.removeEventListener("click", trackLinkClick);
      window.removeEventListener("portfolio-submission-succeeded", trackSubmission);
      window.removeEventListener("contact-email-copied", trackCopiedEmail);
      window.removeEventListener(
        "portfolio-project-engaged-hover",
        trackProjectHover,
      );
    };
  }, [pathname]);

  return null;
}
