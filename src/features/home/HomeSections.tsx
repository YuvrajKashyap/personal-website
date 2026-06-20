import Link from "next/link";

import { Reveal } from "@/components/motion/Reveal";
import {
  aboutPreview,
  finalCta,
  opportunityPreview,
  signalItems,
  trackerPreview,
} from "@/features/home/home-content";
import { getFeaturedProjects } from "@/lib/projects/projects";

type HomeSectionsProps = Readonly<{
  variant: "dark" | "light";
}>;

type SectionHeaderProps = Readonly<{
  eyebrow: string;
  title: string;
  body?: string;
}>;

function SectionHeader({ eyebrow, title, body }: SectionHeaderProps) {
  return (
    <Reveal className="home-section-header">
      <p className="text-kicker">{eyebrow}</p>
      <h2 className="text-section-title text-balance">{title}</h2>
      {body ? <p className="text-body text-pretty">{body}</p> : null}
    </Reveal>
  );
}

function SignalStrip() {
  return (
    <section id="home-signal" className="home-section home-signal-section">
      <div className="site-container-wide">
        <SectionHeader
          eyebrow="Signal Strip"
          title="A quick read on the operating system."
        />

        <div className="home-signal-grid" aria-label="Yuvraj Kashyap signal areas">
          {signalItems.map((item, index) => (
            <Reveal key={item.label} delay={index * 0.06} variant="chip">
              <article className="home-signal-card">
                <span className="home-card-index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3>{item.label}</h3>
                <p>{item.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedProjectsPreview() {
  const featuredProjectPreviews = getFeaturedProjects().slice(0, 4);

  return (
    <section
      id="home-projects-preview"
      className="home-section home-projects-section"
    >
      <div className="site-container-wide">
        <div className="home-section-split">
          <SectionHeader
            eyebrow="Featured Projects"
            title="Proof surfaces, not a full archive."
            body="A focused preview of the systems that will anchor the Projects page."
          />

          <Reveal variant="cta">
            <Link href="/projects" className="home-section-link focus-ring">
              View Projects
            </Link>
          </Reveal>
        </div>

        <div className="home-project-grid">
          {featuredProjectPreviews.map((project, index) => (
            <Reveal key={project.title} delay={index * 0.07}>
              <Link
                href="/projects"
                className="home-project-card focus-ring"
                aria-label={`View Projects preview for ${project.title}`}
              >
                <span className="home-card-index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="home-project-status">
                    {project.eyebrow ?? project.priority}
                  </p>
                  <h3>{project.title}</h3>
                  <p>{project.summary}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrackerPreview() {
  return (
    <section
      id="home-tracker-preview"
      className="home-section home-tracker-section"
    >
      <div className="site-container-wide">
        <div className="home-tracker-panel">
          <SectionHeader
            eyebrow={trackerPreview.eyebrow}
            title={trackerPreview.title}
            body={trackerPreview.description}
          />

          <dl className="home-tracker-grid">
            {trackerPreview.items.map((item, index) => (
              <Reveal key={item.label} delay={index * 0.06} variant="fade-in">
                <div>
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              </Reveal>
            ))}
          </dl>

          <Reveal variant="cta">
            <Link href={trackerPreview.cta.href} className="home-section-link focus-ring">
              {trackerPreview.cta.label}
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function AboutPreview() {
  return (
    <section id="home-about-preview" className="home-section home-about-section">
      <div className="site-container-wide home-about-layout">
        <SectionHeader
          eyebrow={aboutPreview.eyebrow}
          title={aboutPreview.title}
          body={aboutPreview.body}
        />

        <Reveal className="home-about-path" variant="scale-soft">
          <ol aria-label="About preview path">
            {aboutPreview.path.map((item, index) => (
              <li key={item}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item}</strong>
              </li>
            ))}
          </ol>
          <Link href={aboutPreview.cta.href} className="home-section-link focus-ring">
            {aboutPreview.cta.label}
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

function OpportunitySplit() {
  const opportunities = [
    opportunityPreview.services,
    opportunityPreview.collaborate,
  ] as const;

  return (
    <section
      id="home-opportunities"
      className="home-section home-opportunities-section"
    >
      <div className="site-container-wide">
        <SectionHeader
          eyebrow={opportunityPreview.eyebrow}
          title={opportunityPreview.title}
        />

        <div className="home-opportunity-grid">
          {opportunities.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.08} variant="scale-soft">
              <article className="home-opportunity-card">
                <span className="home-card-index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <Link href={item.href} className="home-section-link focus-ring">
                  {item.cta}
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function HomeFinalCta() {
  return (
    <section id="home-contact" className="home-section home-final-section">
      <div className="site-container-narrow">
        <Reveal className="home-final-cta" variant="scale-soft">
          <p className="text-kicker">{finalCta.eyebrow}</p>
          <h2 className="text-page-title text-balance">{finalCta.title}</h2>
          <p className="text-body-large text-pretty">{finalCta.body}</p>
          <Link href={finalCta.cta.href} className="home-final-link focus-ring">
            {finalCta.cta.label}
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

export function HomeSections({ variant }: HomeSectionsProps) {
  return (
    <div className="home-sections" data-home-variant={variant}>
      <SignalStrip />
      <FeaturedProjectsPreview />
      <TrackerPreview />
      <AboutPreview />
      <OpportunitySplit />
      <HomeFinalCta />
    </div>
  );
}
