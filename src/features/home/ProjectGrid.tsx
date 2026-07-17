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
import { useSectionReveal } from "@/components/motion/SectionRevealContext";
import { gravitationalEase } from "@/lib/motion/presets";

type ProjectGridProps = Readonly<{
  projects: readonly Project[];
}>;

const TILT_SPRING = { stiffness: 240, damping: 20, mass: 0.55 };

const gridVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.11, delayChildren: 0.06 },
  },
};

// Deal-in: each card is stacked flat and tipped away, then unfolds upright from
// its bottom edge as it settles — a physical "dealt from the deck" cascade.
const cardVariants = {
  hidden: {
    opacity: 0,
    y: 88,
    rotateX: -38,
    scale: 0.9,
    filter: "blur(6px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.85,
      ease: gravitationalEase,
      opacity: { duration: 0.5, ease: gravitationalEase },
      filter: { duration: 0.5, ease: gravitationalEase },
    },
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

  // Preview bloom: the screenshot irises open from the exact point the cursor
  // entered, then drifts against the tilt for depth and settles its zoom.
  const hover = useSpring(0, { stiffness: 150, damping: 25 });
  const entryX = useMotionValue(50);
  const entryY = useMotionValue(50);
  // 175% guarantees the circle clears the far corner from any entry point,
  // even while the spring is still settling toward its target.
  const bloomRadius = useTransform(hover, [0, 1], [0, 175]);
  const previewClip = useMotionTemplate`circle(${bloomRadius}% at ${entryX}% ${entryY}%)`;
  const previewShiftX = useSpring(
    useTransform(pointerX, [0, 1], [9, -9]),
    TILT_SPRING,
  );
  const previewShiftY = useSpring(
    useTransform(pointerY, [0, 1], [9, -9]),
    TILT_SPRING,
  );
  const previewScale = useTransform(hover, [0, 1], [1.18, 1.06]);

  function onPointerEnter(event: PointerEvent<HTMLElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    entryX.set(((event.clientX - bounds.left) / bounds.width) * 100);
    entryY.set(((event.clientY - bounds.top) / bounds.height) * 100);
    hover.set(1);
  }

  function onPointerMove(event: PointerEvent<HTMLElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - bounds.left) / bounds.width);
    pointerY.set((event.clientY - bounds.top) / bounds.height);
  }

  function onPointerLeave() {
    pointerX.set(0.5);
    pointerY.set(0.5);
    hover.set(0);
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
      onPointerEnter={shouldReduceMotion ? undefined : onPointerEnter}
      onPointerMove={shouldReduceMotion ? undefined : onPointerMove}
      onPointerLeave={shouldReduceMotion ? undefined : onPointerLeave}
    >
      <div className="project-tile-thumb" data-category={project.category}>
        <motion.span
          className="project-tile-preview"
          style={shouldReduceMotion ? undefined : { clipPath: previewClip }}
          aria-hidden="true"
        >
          <motion.img
            src={`/media/project-previews/${project.slug}.webp`}
            alt=""
            loading="lazy"
            decoding="async"
            style={
              shouldReduceMotion
                ? undefined
                : {
                    x: previewShiftX,
                    y: previewShiftY,
                    scale: previewScale,
                  }
            }
          />
          <span className="project-tile-preview-scrim" />
        </motion.span>
        <span className="project-tile-corner is-tl" aria-hidden="true" />
        <span className="project-tile-corner is-tr" aria-hidden="true" />
        <span className="project-tile-corner is-bl" aria-hidden="true" />
        <span className="project-tile-corner is-br" aria-hidden="true" />
        <div className="project-tile-thumb-copy">
          <strong>{project.title}</strong>
          <p className="project-tile-summary">{project.summary}</p>
          {project.stack.length > 0 ? (
            <ul className="project-tile-stack" aria-label="Tech stack">
              {project.stack.slice(0, 3).map((item) => (
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
    <motion.div
      variants={shouldReduceMotion ? undefined : cardVariants}
      style={
        shouldReduceMotion
          ? undefined
          : { transformOrigin: "50% 100%", transformPerspective: 1100 }
      }
    >
      {wrap(tileContent)}
    </motion.div>
  );
}

/**
 * Minimal project grid: each tile is a single button — title, summary, and a
 * quiet stack line on a calm cover — that opens the project's GitHub repo
 * (falling back to the project page when no public repo exists). Hover keeps
 * the theatrics: the project's screenshot blooms open from the cursor entry
 * point with parallax depth, plus tilt, glare, scanline, corner brackets, and
 * the open arrow.
 */
export function ProjectGrid({ projects }: ProjectGridProps) {
  const shouldReduceMotion = useReducedMotion();
  const section = useSectionReveal();
  const sectionDriven = section !== null;

  return (
    <motion.div
      className="project-grid"
      initial={shouldReduceMotion ? false : "hidden"}
      animate={sectionDriven ? (section ? "visible" : "hidden") : undefined}
      whileInView={sectionDriven ? undefined : "visible"}
      viewport={sectionDriven ? undefined : { amount: 0.12, once: false }}
      variants={shouldReduceMotion ? undefined : gridVariants}
    >
      {projects.map((project) => (
        <ProjectTile key={project.id} project={project} />
      ))}
    </motion.div>
  );
}
