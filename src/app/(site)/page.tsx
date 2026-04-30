import Link from "next/link";

export default function HomePage() {
  return (
    <main className="relative isolate flex min-h-screen overflow-hidden bg-neutral-950 px-6 py-8 text-neutral-50 sm:px-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_22%_18%,rgba(245,158,11,0.16),transparent_34%),radial-gradient(circle_at_78%_20%,rgba(251,191,36,0.08),transparent_30%),linear-gradient(135deg,#050505_0%,#0a0a0a_52%,#12100a_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.16] [background-image:radial-gradient(circle_at_center,rgba(250,250,250,0.55)_1px,transparent_1px)] [background-size:38px_38px]"
      />
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute right-[-18rem] top-[-12rem] -z-10 h-[42rem] w-[42rem] text-amber-300/20 sm:right-[-10rem] sm:top-[-14rem] sm:h-[52rem] sm:w-[52rem]"
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
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs font-medium uppercase tracking-[0.32em] text-amber-300">
            PERSONAL WEBSITE / SYSTEM IN PROGRESS
          </p>
          <div className="hidden h-px flex-1 bg-gradient-to-r from-amber-300/25 to-transparent sm:block" />
        </div>

        <div className="max-w-4xl py-20 sm:py-28">
          <p className="mb-5 text-sm font-medium uppercase tracking-[0.24em] text-neutral-400">
            Yuvraj Kashyap
          </p>
          <h1 className="max-w-4xl text-balance text-5xl font-semibold tracking-tight text-neutral-50 sm:text-7xl lg:text-8xl">
            Building the next version of my operating interface.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-neutral-300 sm:text-xl">
            Software, systems, projects, and current-state signal. A more
            complete experience is coming online soon.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-sm text-amber-100">
              yuvrajkashyap.com is live
            </span>
            <span className="rounded-full border border-neutral-700 bg-neutral-900/70 px-4 py-2 text-sm text-neutral-300">
              Final cinematic site in progress
            </span>
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a
              href="https://github.com/YuvrajKashyap"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-amber-300 px-5 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-amber-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-300"
            >
              View GitHub
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border border-neutral-700 bg-neutral-950/70 px-5 py-3 text-sm font-semibold text-neutral-50 transition hover:border-neutral-500 hover:bg-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-300"
            >
              Contact
            </Link>
          </div>
        </div>

        <footer className="border-t border-neutral-800/80 py-6 text-sm text-neutral-500">
          Built by Yuvraj Kashyap.
        </footer>
      </section>
    </main>
  );
}
