import Link from "next/link";

import { OrbitalNavigation } from "@/components/navigation/OrbitalNavigation";
import { orbitalDestinations } from "@/config/site";
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

          <OrbitalNavigation
            items={orbitalDestinations}
            variant="light"
            className="home-light-orbital-nav"
            eyebrow="Observatory Routes"
            title="Destination instrument"
          />

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
