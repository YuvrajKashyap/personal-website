import Link from "next/link";

import { homeContent } from "@/features/home/home-content";

export function HomeLight() {
  return (
    <main className="home-light-hero">
      <div aria-hidden="true" className="observatory-field" />
      <div aria-hidden="true" className="grain-overlay pointer-events-none absolute inset-0 z-0" />
      <div aria-hidden="true" className="observatory-wash" />

      <section className="home-light-hero-section site-container-wide">
        <div className="home-light-copy">
          <div className="home-light-chip-row" aria-label="Site status">
            {homeContent.lightTelemetry.map((item) => (
              <span key={item} className="observatory-chip">
                {item}
              </span>
            ))}
          </div>

          <p className="text-kicker">{homeContent.eyebrow}</p>
          <h1 className="mt-5 max-w-5xl text-page-title text-balance">
            {homeContent.headline}
          </h1>
          <p className="mt-7 text-body-large text-pretty">
            {homeContent.body}
          </p>

          <div className="cluster mt-10">
            <Link
              href={homeContent.primaryCta.href}
              className="focus-ring inline-flex min-h-12 items-center justify-center rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground shadow-[var(--shadow-glow)] transition hover:bg-[var(--interactive-hover)]"
            >
              {homeContent.primaryCta.label}
            </Link>
            <Link
              href={homeContent.secondaryCta.href}
              className="focus-ring inline-flex min-h-12 items-center justify-center rounded-full border border-border-strong bg-surface-glass px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-surface-strong"
            >
              {homeContent.secondaryCta.label}
            </Link>
          </div>
        </div>

        <aside
          className="observatory-panel"
          aria-label="Ivory Observatory status"
        >
          <div className="observatory-panel-header">
            <div>
              <p className="text-mono-label">Observatory Index</p>
              <p className="observatory-panel-title">{homeContent.name}</p>
            </div>
            <span className="observatory-seal" aria-hidden="true">
              YK
            </span>
          </div>

          <div className="observatory-map" aria-hidden="true">
            <span className="observatory-label observatory-label-top">
              ORBIT / 01
            </span>
            <span className="observatory-label observatory-label-right">
              SIGNAL / ACTIVE
            </span>
            <span className="observatory-label observatory-label-bottom">
              VECTOR / BUILD
            </span>
            <svg
              className="observatory-diagram"
              viewBox="0 0 520 520"
              fill="none"
            >
              <circle className="observatory-line" cx="260" cy="260" r="168" />
              <circle
                className="observatory-line observatory-line-soft"
                cx="260"
                cy="260"
                r="220"
                strokeDasharray="3 18"
              />
              <path
                className="observatory-line observatory-line-strong"
                d="M78 292C142 164 278 96 424 136"
                strokeLinecap="round"
              />
              <path
                className="observatory-line"
                d="M118 378C206 438 338 430 420 356"
                strokeLinecap="round"
              />
              <line
                className="observatory-axis-line"
                x1="260"
                y1="56"
                x2="260"
                y2="464"
              />
              <line
                className="observatory-axis-line"
                x1="56"
                y1="260"
                x2="464"
                y2="260"
              />
              <circle className="observatory-node" cx="398" cy="152" r="7" />
              <circle
                className="observatory-node observatory-node-muted"
                cx="140"
                cy="354"
                r="5"
              />
              <circle className="observatory-core" cx="260" cy="260" r="10" />
            </svg>
          </div>

          <dl className="observatory-readout">
            <div>
              <dt>Current mode</dt>
              <dd>Ivory Observatory</dd>
            </div>
            <div>
              <dt>System state</dt>
              <dd>Building</dd>
            </div>
            <div>
              <dt>Primary signal</dt>
              <dd>Software and systems</dd>
            </div>
          </dl>
        </aside>
      </section>
    </main>
  );
}
