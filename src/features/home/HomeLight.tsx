import Link from "next/link";

import { homeContent } from "@/features/home/home-content";

export function HomeLight() {
  return (
    <main className="page-shell relative isolate overflow-hidden py-[var(--page-padding-y)]">
      <div aria-hidden="true" className="grain-overlay pointer-events-none absolute inset-0 -z-10" />
      <div aria-hidden="true" className="vignette-overlay pointer-events-none absolute inset-0 -z-10 opacity-40" />
      <svg
        aria-hidden="true"
        className="orbital-glow pointer-events-none absolute right-[-18rem] top-[-12rem] -z-10 h-[42rem] w-[42rem] text-accent sm:right-[-8rem] sm:top-[-14rem] sm:h-[52rem] sm:w-[52rem]"
        viewBox="0 0 640 640"
        fill="none"
      >
        <circle className="orbital-line" cx="320" cy="320" r="210" />
        <circle
          className="orbital-line"
          cx="320"
          cy="320"
          r="272"
          strokeDasharray="2 18"
        />
        <path
          className="orbital-line"
          d="M88 336C164 206 300 132 452 160"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      <section className="site-container flex min-h-[calc(100svh-10rem)] flex-col justify-center">
        <div className="mb-8 flex flex-wrap items-center gap-3">
          {homeContent.lightTelemetry.map((item) => (
            <span
              key={item}
              className="hero-chip"
            >
              {item}
            </span>
          ))}
        </div>

        <div className="premium-card stack-lg max-w-4xl rounded-[var(--radius-2xl)]">
          <p className="text-kicker">{homeContent.name}</p>
          <h1 className="text-page-title text-balance">
            {homeContent.headline}
          </h1>
          <p className="text-body-large text-pretty">
            {homeContent.body}
          </p>

          <div className="cluster pt-1">
            <Link
              href={homeContent.primaryCta.href}
              className="focus-ring inline-flex min-h-12 items-center justify-center rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition hover:bg-[var(--interactive-hover)]"
            >
              {homeContent.primaryCta.label}
            </Link>
            <Link
              href={homeContent.secondaryCta.href}
              className="focus-ring inline-flex min-h-12 items-center justify-center rounded-full border border-border bg-surface-glass px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-surface-strong"
            >
              {homeContent.secondaryCta.label}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
