import Link from "next/link";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export default function HomePage() {
  return (
    <main className="relative isolate flex min-h-screen overflow-hidden bg-[var(--background)] px-6 py-8 text-[var(--foreground)] transition-colors duration-300 sm:px-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 bg-[image:var(--landing-background)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.16] [background-image:var(--field-pattern)] [background-size:38px_38px]"
      />
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute right-[-18rem] top-[-12rem] -z-10 h-[42rem] w-[42rem] text-[color:var(--orbital-color)] sm:right-[-10rem] sm:top-[-14rem] sm:h-[52rem] sm:w-[52rem]"
        viewBox="0 0 640 640"
        fill="none"
      >
        <circle cx="320" cy="320" r="210" stroke="currentColor" />
        <circle
          cx="320"
          cy="320"
          r="272"
          stroke="currentColor"
          strokeDasharray="2 18"
        />
        <path
          d="M85 336C156 199 294 126 447 157"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M168 495C276 558 426 528 509 426"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl flex-col justify-between">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-medium uppercase tracking-[0.32em] text-[var(--accent)]">
            PERSONAL WEBSITE / SYSTEM IN PROGRESS
          </p>
          <div className="hidden h-px flex-1 bg-gradient-to-r from-[var(--accent)]/25 to-transparent sm:block" />
          <ThemeToggle />
        </div>

        <div className="max-w-4xl py-20 sm:py-28">
          <p className="mb-5 text-sm font-medium uppercase tracking-[0.24em] text-[var(--muted-foreground)]">
            Yuvraj Kashyap
          </p>
          <h1 className="max-w-4xl text-balance text-5xl font-semibold tracking-tight text-[var(--foreground)] sm:text-7xl lg:text-8xl">
            Building the next version of my operating interface.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-[var(--muted-foreground)] sm:text-xl">
            Software, systems, projects, and current-state signal. A more
            complete experience is coming online soon.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <span className="rounded-full border border-[var(--chip-border)] bg-[var(--chip-background)] px-4 py-2 text-sm text-[var(--accent)]">
              yuvrajkashyap.com is live
            </span>
            <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm text-[var(--muted-foreground)]">
              Final cinematic site in progress
            </span>
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a
              href="https://github.com/YuvrajKashyap"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--accent-foreground)] transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
            >
              View GitHub
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border border-[var(--border)] bg-[var(--secondary-button-background)] px-5 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--surface-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
            >
              Contact
            </Link>
          </div>
        </div>

        <footer className="border-t border-[var(--border)] py-6 text-sm text-[var(--muted-foreground)]">
          Built by Yuvraj Kashyap.
        </footer>
      </section>
    </main>
  );
}
