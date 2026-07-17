import type { ReactNode } from "react";

import { ParallaxDrift } from "@/components/motion/ParallaxDrift";
import { AboutPortrait } from "@/features/home/AboutPortrait";
import { Reveal } from "@/components/motion/Reveal";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { ScrollPath } from "@/components/motion/ScrollPath";
import { ScrollReadText } from "@/components/motion/ScrollReadText";
import { SectionLink } from "@/components/ui/SectionLink";
import { aboutHomePreview } from "@/features/about/about-content";
import { ContactSection } from "@/features/home/ContactSection";
import { ContactSignalLazy } from "@/features/home/ContactSignalLazy";
import { SplitTextReveal } from "@/components/motion/SplitTextReveal";
import {
  resumeEducation,
  resumeRoles,
} from "@/features/experience/experience-content";
import { ResumeLedger } from "@/features/home/ResumeLedger";
import { ProjectGrid } from "@/features/home/ProjectGrid";
import { getPublishedProjects } from "@/lib/projects/projects";

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
      <SectionReveal className="site-container-wide home-chapter-grid">
        <Reveal className="home-chapter-marker" inView variant="fade-in">
          <span>{number}</span>
          <p>{label}</p>
        </Reveal>
        <div className="home-chapter-content">{children}</div>
      </SectionReveal>
    </section>
  );
}

function ChapterHeader({
  body,
  eyebrow,
  secondaryBody,
  title,
}: Readonly<{
  body: string;
  eyebrow?: string;
  secondaryBody?: string;
  title: string;
}>) {
  return (
    <Reveal className="home-chapter-header" inView>
      {eyebrow ? <p className="text-kicker">{eyebrow}</p> : null}
      <h2 className="text-section-title text-balance">
        <SplitTextReveal text={title} variant="rise" hoverWave />
      </h2>
      <p className="text-body text-pretty">{body}</p>
      {secondaryBody ? (
        <p className="text-body text-pretty">{secondaryBody}</p>
      ) : null}
    </Reveal>
  );
}

function AboutChapter() {
  return (
    <ChapterShell
      className="home-about-chapter"
      id="home-about-preview"
      label="About"
      number="01"
    >
      <div className="home-about-story">
        <div className="home-about-intro">
          <ScrollReadText
            className="home-about-paragraph text-pretty"
            text={aboutHomePreview.body}
          />
        </div>

        <Reveal className="home-about-portrait" inView variant="blur-in">
          <ParallaxDrift range={30}>
            <AboutPortrait />
          </ParallaxDrift>
        </Reveal>
      </div>
    </ChapterShell>
  );
}

function ExperienceChapter() {
  return (
    <ChapterShell
      className="home-experience-chapter"
      id="home-experience-preview"
      label="Experience"
      number="02"
    >
      <h2 className="text-section-title text-balance home-experience-title">
        <SplitTextReveal text="Experience" variant="flip" hoverWave />
      </h2>
      <div className="home-experience-layout">
        <Reveal className="resume-credentials" inView>
          <div className="resume-credentials-head">
            <h3>
              <SplitTextReveal
                text={resumeEducation.school}
                variant="flip"
                hoverWave
              />
            </h3>
            <p>{resumeEducation.degree}</p>
          </div>
          <ul aria-label="Credentials">
            {resumeEducation.credentials.map((credential) => (
              <li key={credential}>{credential}</li>
            ))}
          </ul>
        </Reveal>

        <ResumeLedger roles={resumeRoles} />

        <div className="home-experience-links">
          <Reveal inView variant="cta">
            <SectionLink
              href="/media/resume/yuvraj-kashyap-resume.pdf"
              label="Download resume"
            />
          </Reveal>
        </div>
      </div>
    </ChapterShell>
  );
}

function ProjectsChapter() {
  const projects = getPublishedProjects();

  return (
    <ChapterShell
      className="home-projects-chapter"
      id="home-projects-preview"
      label="Projects"
      number="03"
    >
      <div className="home-projects-layout">
        <ChapterHeader
          title="Projects"
          body="Some of the software and hardware I've built."
          secondaryBody="A lot of them are hosted, some aren't, but feel free to explore the actual sites."
        />
        <ProjectGrid projects={projects} />
        <Reveal inView variant="cta">
          <SectionLink
            href="https://github.com/YuvrajKashyap"
            label="Explore my GitHub"
            external
          />
        </Reveal>
      </div>
    </ChapterShell>
  );
}

function ContactChapter() {
  return (
    <ChapterShell
      className="home-contact-chapter"
      id="home-contact"
      label="Contact"
      number="04"
    >
      <ContactSection />
    </ChapterShell>
  );
}

export function HomeSections({ variant }: HomeSectionsProps) {
  return (
    <div className="home-sections" data-home-variant={variant}>
      <ScrollPath />
      <AboutChapter />
      <ExperienceChapter />
      <ProjectsChapter />
      <ContactChapter />
      <div className="home-contact-hologram">
        <ContactSignalLazy />
      </div>
    </div>
  );
}
