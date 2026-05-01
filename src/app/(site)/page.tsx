import Link from "next/link";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export default function HomePage() {
  return (
    <main className="page-shell relative isolate flex overflow-hidden py-[var(--page-padding-y)] transition-colors duration-300">
      <div aria-hidden="true" className="grain-overlay pointer-events-none absolute inset-0 -z-10" />
      <div aria-hidden="true" className="vignette-overlay pointer-events-none absolute inset-0 -z-10" />
      <svg
        aria-hidden="true"
        className="orbital-glow pointer-events-none absolute right-[-18rem] top-[-12rem] -z-10 h-[42rem] w-[42rem] sm:right-[-10rem] sm:top-[-14rem] sm:h-[52rem] sm:w-[52rem]"
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
          d="M85 336C156 199 294 126 447 157"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          className="orbital-line"
          d="M168 495C276 558 426 528 509 426"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <section className="site-container flex min-h-[calc(100vh-4rem)] flex-col justify-between">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-kicker">
            PERSONAL WEBSITE / SYSTEM IN PROGRESS
          </p>
          <div className="hidden h-px flex-1 bg-[image:var(--gradient-orbital)] sm:block" />
          <ThemeToggle />
        </div>

        <div className="stack-lg max-w-5xl py-[var(--section-padding-y-compact)] sm:py-[var(--section-padding-y)]">
          <p className="text-mono-label">
            Yuvraj Kashyap
          </p>
          <h1 className="text-display text-balance">
            Building the next version of my operating interface.
          </h1>
          <p className="text-body-large text-pretty">
            Software, systems, projects, and current-state signal. A more
            complete experience is coming online soon.
          </p>

          <div className="cluster">
            <span className="rounded-full border border-border bg-accent-soft px-4 py-2 font-mono text-sm text-accent">
              yuvrajkashyap.com is live
            </span>
            <span className="rounded-full border border-border bg-surface-glass px-4 py-2 font-mono text-sm text-muted-foreground">
              Final cinematic site in progress
            </span>
          </div>

          <div className="cluster pt-1">
            <a
              href="https://github.com/YuvrajKashyap"
              target="_blank"
              rel="noreferrer"
              className="focus-ring inline-flex min-h-12 items-center justify-center rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition hover:bg-[var(--interactive-hover)]"
            >
              View GitHub
            </a>
            <Link
              href="/contact"
              className="focus-ring inline-flex min-h-12 items-center justify-center rounded-full border border-border bg-surface-glass px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-surface-strong"
            >
              Contact
            </Link>
          </div>
        </div>

        <footer className="border-t border-border py-6 text-caption">
          Built by Yuvraj Kashyap.
        </footer>
      </section>
    </main>
  );
}
