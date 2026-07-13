import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { Reveal } from "@/components/motion/Reveal";
import { aboutHomePreview } from "@/features/about/about-content";
import {
  collaborateHero,
  collaborationLanes,
} from "@/features/collaborate/collaborate-content";
import {
  experienceEntries,
  experienceHero,
} from "@/features/experience/experience-content";
import {
  trackerHero,
  trackerStatusCards,
} from "@/features/tracker/tracker-content";
import { getFeaturedProjects } from "@/lib/projects/projects";

type HomeSectionsProps = Readonly<{
  variant: "dark" | "light";
}>;

type ChapterShellProps = Readonly<{
  children: ReactNode;
  className: string;
  id: string;
  label: string;
  number: string;
}>;

function ChapterShell({
  children,
  className,
  id,
  label,
  number,
}: ChapterShellProps) {
  return (
    <section id={id} className={`home-section home-chapter ${className}`}>
      <div className="site-container-wide home-chapter-grid">
        <Reveal className="home-chapter-marker" inView variant="fade-in">
          <span>{number}</span>
          <p>{label}</p>
        </Reveal>
        <div className="home-chapter-content">{children}</div>
      </div>
    </section>
  );
}

function ChapterHeader({
  body,
  eyebrow,
  title,
}: Readonly<{ body: string; eyebrow: string; title: string }>) {
  return (
    <Reveal className="home-chapter-header" inView>
      <p className="text-kicker">{eyebrow}</p>
      <h2 className="text-section-title text-balance">{title}</h2>
      <p className="text-body text-pretty">{body}</p>
    </Reveal>
  );
}

function AboutChapter({ variant }: Readonly<{ variant: "dark" | "light" }>) {
  const emblemSrc =
    variant === "dark"
      ? "/media/emblem/king-emblem.webp"
      : "/media/emblem/light-emblem.webp";

  return (
    <ChapterShell
      className="home-about-chapter"
      id="home-about-preview"
      label="About"
      number="01"
    >
      <div className="home-about-story">
        <Reveal className="home-about-intro" inView>
          <p className="home-about-paragraph text-pretty">
            {aboutHomePreview.body}
          </p>
          <Link href="/about" className="home-section-link focus-ring">
            More about me
          </Link>
        </Reveal>

        <Reveal className="home-about-portrait" inView variant="blur-in">
          <Image
            src={emblemSrc}
            alt="YK emblem"
            className="home-about-emblem"
            width={880}
            height={880}
            sizes="(max-width: 900px) 80vw, 32rem"
          />
        </Reveal>
      </div>
    </ChapterShell>
  );
}

function ExperienceChapter() {
  const entries = experienceEntries.slice(0, 3);

  return (
    <ChapterShell
      className="home-experience-chapter"
      id="home-experience-preview"
      label="Experience"
      number="02"
    >
      <div className="home-experience-layout">
        <ChapterHeader
          eyebrow={experienceHero.eyebrow}
          title={experienceHero.title}
          body={experienceHero.description}
        />

        <div className="home-experience-ledger">
          {entries.map((entry, index) => (
            <Reveal
              key={entry.id}
              className="home-experience-entry"
              delay={index * 0.08}
              inView
            >
              <article>
                <div className="home-experience-entry-meta">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>{entry.eyebrow}</p>
                </div>
                <div className="home-experience-entry-copy">
                  <h3>{entry.title}</h3>
                  <p>{entry.body}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal inView variant="cta">
          <Link href="/experience" className="home-section-link focus-ring">
            View experience
          </Link>
        </Reveal>
      </div>
    </ChapterShell>
  );
}

function ProjectsChapter() {
  const projects = getFeaturedProjects().slice(0, 3);

  return (
    <ChapterShell
      className="home-projects-chapter"
      id="home-projects-preview"
      label="Projects"
      number="03"
    >
      <div className="home-projects-heading">
        <ChapterHeader
          eyebrow="PROJECTS"
          title="Systems that make the direction tangible."
          body="A focused set of active and published builds across AI, search infrastructure, product systems, and frontend craft."
        />
        <Reveal inView variant="cta">
          <Link href="/projects" className="home-section-link focus-ring">
            Explore all projects
          </Link>
        </Reveal>
      </div>

      <div className="home-project-showcase">
        {projects.map((project, index) => (
          <Reveal
            key={project.id}
            className={index === 0 ? "home-project-featured" : "home-project-secondary"}
            delay={index * 0.08}
            inView
            variant={index === 0 ? "scale-soft" : "fade-up"}
          >
            <Link
              href={`/projects/${project.slug}`}
              className="home-project-surface focus-ring"
              aria-label={`View ${project.title} project`}
            >
              <div className="home-project-surface-topline">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{project.eyebrow ?? project.priority}</p>
              </div>
              <div>
                <h3>{project.title}</h3>
                <p>{project.summary}</p>
              </div>
              <ul aria-label={`${project.title} technologies`}>
                {project.tags.slice(0, 3).map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            </Link>
          </Reveal>
        ))}
      </div>
    </ChapterShell>
  );
}

function TrackerChapter() {
  const statusCards = trackerStatusCards.slice(0, 3);

  return (
    <ChapterShell
      className="home-tracker-chapter"
      id="home-tracker-preview"
      label="Tracker"
      number="04"
    >
      <div className="home-tracker-heading">
        <ChapterHeader
          eyebrow={trackerHero.eyebrow}
          title={trackerHero.title}
          body={trackerHero.description}
        />
        <Reveal className="home-tracker-source" inView variant="fade-in">
          <span aria-hidden="true" />
          <p>Manual current-state signal</p>
        </Reveal>
      </div>

      <dl className="home-status-stream">
        {statusCards.map((card, index) => (
          <Reveal
            key={card.id}
            className="home-status-item"
            delay={index * 0.08}
            inView
            variant="fade-up"
          >
            <div>
              <dt>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {card.label}
              </dt>
              <dd>{card.value}</dd>
              <p>{card.description}</p>
              <small>{card.source}</small>
            </div>
          </Reveal>
        ))}
      </dl>

      <Reveal inView variant="cta">
        <Link href="/tracker" className="home-section-link focus-ring">
          Open tracker
        </Link>
      </Reveal>
    </ChapterShell>
  );
}

function CollaborateChapter() {
  const lanes = collaborationLanes.slice(0, 3);

  return (
    <ChapterShell
      className="home-collaborate-chapter"
      id="home-collaborate-preview"
      label="Collaborate"
      number="05"
    >
      <Reveal className="home-collaborate-stage" inView variant="scale-soft">
        <p className="text-kicker">{collaborateHero.eyebrow}</p>
        <h2 className="text-page-title text-balance">{collaborateHero.title}</h2>
        <p className="text-body-large text-pretty">{collaborateHero.description}</p>

        <ul className="home-collaborate-lanes" aria-label="Collaboration areas">
          {lanes.map((lane) => (
            <li key={lane.id}>{lane.eyebrow}</li>
          ))}
        </ul>

        <Link href="/collaborate" className="home-collaborate-link focus-ring">
          Explore collaboration
        </Link>
      </Reveal>
    </ChapterShell>
  );
}

export function HomeSections({ variant }: HomeSectionsProps) {
  return (
    <div className="home-sections" data-home-variant={variant}>
      <AboutChapter variant={variant} />
      <ExperienceChapter />
      <ProjectsChapter />
      <TrackerChapter />
      <CollaborateChapter />
    </div>
  );
}
