"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import Link from "next/link";
import type { PointerEvent, ReactNode } from "react";

import type { Project } from "@/types/project";
import { gravitationalEase } from "@/lib/motion/presets";

type ProjectGridProps = Readonly<{
  projects: readonly Project[];
}>;

const TILT_SPRING = { stiffness: 240, damping: 20, mass: 0.55 };

const gridVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 26, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.65, ease: gravitationalEase },
  },
};

function getRepoHref(project: Project) {
  return project.links.find(
    (link) => link.type === "repo" && link.status === "verified",
  )?.href;
}

function ProjectTile({ project }: Readonly<{ project: Project }>) {
  const shouldReduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);
  const rotateX = useSpring(
    useTransform(pointerY, [0, 1], [6, -6]),
    TILT_SPRING,
  );
  const rotateY = useSpring(
    useTransform(pointerX, [0, 1], [-7, 7]),
    TILT_SPRING,
  );
  const glareX = useTransform(pointerX, (value) => `${value * 100}%`);
  const glareY = useTransform(pointerY, (value) => `${value * 100}%`);
  const glare = useMotionTemplate`radial-gradient(340px circle at ${glareX} ${glareY}, rgb(255 244 214 / 0.16), transparent 60%)`;

  function onPointerMove(event: PointerEvent<HTMLElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - bounds.left) / bounds.width);
    pointerY.set((event.clientY - bounds.top) / bounds.height);
  }

  function onPointerLeave() {
    pointerX.set(0.5);
    pointerY.set(0.5);
  }

  const repoHref = getRepoHref(project);

  const tileContent = (
    <motion.div
      className="project-tile-inner"
      style={
        shouldReduceMotion
          ? undefined
          : { rotateX, rotateY, transformPerspective: 900 }
      }
      onPointerMove={shouldReduceMotion ? undefined : onPointerMove}
      onPointerLeave={shouldReduceMotion ? undefined : onPointerLeave}
    >
      <div className="project-tile-thumb" data-category={project.category}>
        <span className="project-tile-watermark" aria-hidden="true">
          {project.title[0]}
        </span>
        <span className="project-tile-corner is-tl" aria-hidden="true" />
        <span className="project-tile-corner is-tr" aria-hidden="true" />
        <span className="project-tile-corner is-bl" aria-hidden="true" />
        <span className="project-tile-corner is-br" aria-hidden="true" />
        <div className="project-tile-thumb-copy">
          <strong>{project.title}</strong>
          <p className="project-tile-summary">{project.summary}</p>
          {project.stack.length > 0 ? (
            <ul className="project-tile-stack" aria-label="Tech stack">
              {project.stack.slice(0, 4).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </div>
        <span className="project-tile-scan" aria-hidden="true" />
        {shouldReduceMotion ? null : (
          <motion.span
            className="project-tile-glare"
            style={{ background: glare }}
            aria-hidden="true"
          />
        )}
        <span className="project-tile-open" aria-hidden="true">
          <span>{repoHref ? "↗" : "→"}</span>
        </span>
      </div>
    </motion.div>
  );

  const wrap = (children: ReactNode) =>
    repoHref ? (
      <a
        href={repoHref}
        className="project-tile focus-ring"
        target="_blank"
        rel="noreferrer"
        aria-label={`Open ${project.title} on GitHub`}
      >
        {children}
      </a>
    ) : (
      <Link
        href={`/projects/${project.slug}`}
        className="project-tile focus-ring"
        aria-label={`View ${project.title} project`}
      >
        {children}
      </Link>
    );

  return (
    <motion.div variants={shouldReduceMotion ? undefined : cardVariants}>
      {wrap(tileContent)}
    </motion.div>
  );
}

/**
 * Minimal project grid: each tile is a single button — title, summary, and
 * stack chips on an animated cover — that opens the project's GitHub repo
 * (falling back to the project page when no public repo exists).
 */
export function ProjectGrid({ projects }: ProjectGridProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className="project-grid"
      initial={shouldReduceMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ amount: 0.12, once: true }}
      variants={shouldReduceMotion ? undefined : gridVariants}
    >
      {projects.map((project) => (
        <ProjectTile key={project.id} project={project} />
      ))}
    </motion.div>
  );
}
