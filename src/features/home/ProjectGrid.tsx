"use client";

import {
  AnimatePresence,
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import Link from "next/link";
import {
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type PointerEvent,
  type ReactNode,
} from "react";

import type { Project } from "@/types/project";
import { useSectionReveal } from "@/components/motion/SectionRevealContext";
import { gravitationalEase } from "@/lib/motion/presets";

type ProjectGridProps = Readonly<{
  projects: readonly Project[];
}>;

const TILT_SPRING = { stiffness: 240, damping: 20, mass: 0.55 };

const FINE_POINTER_QUERY = "(hover: hover) and (pointer: fine)";

function subscribeToFinePointer(callback: () => void) {
  const mediaQuery = window.matchMedia(FINE_POINTER_QUERY);
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getFinePointerSnapshot() {
  return window.matchMedia(FINE_POINTER_QUERY).matches;
}

function getFinePointerServerSnapshot() {
  return true;
}

function useFinePointer() {
  return useSyncExternalStore(
    subscribeToFinePointer,
    getFinePointerSnapshot,
    getFinePointerServerSnapshot,
  );
}

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
  const finePointer = useFinePointer();
  const tileRef = useRef<HTMLDivElement>(null);
  // Touch devices have no hover, so the preview activates while the tile is
  // on screen instead: fade in as it enters, fade out as it leaves.
  const tileInView = useInView(tileRef, { amount: 0.55 });
  const previewActive = !finePointer && tileInView;
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

  useEffect(() => {
    if (!finePointer) {
      hover.set(tileInView ? 1 : 0);
    }
  }, [finePointer, tileInView, hover]);

  function onPointerEnter(event: PointerEvent<HTMLElement>) {
    if (!finePointer) {
      return;
    }

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

    if (finePointer) {
      hover.set(0);
    }
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
          style={
            shouldReduceMotion
              ? undefined
              : finePointer
                ? { clipPath: previewClip }
                : // clipPath must be explicitly cleared: the server render
                  // assumes a fine pointer and its stale inline circle(0%)
                  // would otherwise keep the faded-in preview invisible
                  { opacity: hover, clipPath: "none" }
          }
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
      ref={tileRef}
      data-preview-active={previewActive || undefined}
      layout={shouldReduceMotion ? false : "position"}
      variants={shouldReduceMotion ? undefined : cardVariants}
      exit={
        shouldReduceMotion
          ? { opacity: 0, transition: { duration: 0.15 } }
          : {
              opacity: 0,
              scale: 0.9,
              y: 16,
              transition: { duration: 0.3, ease: gravitationalEase },
            }
      }
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

function buildHaystack(project: Project) {
  return [
    project.title,
    project.summary,
    project.eyebrow ?? "",
    project.slug,
    ...project.tags,
    ...project.stack,
  ]
    .join(" ")
    .toLowerCase();
}

/**
 * Minimal project grid: each tile is a single button — title, summary, and a
 * quiet stack line on a calm cover — that opens the project's GitHub repo
 * (falling back to the project page when no public repo exists). Hover keeps
 * the theatrics: the project's screenshot blooms open from the cursor entry
 * point with parallax depth, plus tilt, glare, scanline, corner brackets, and
 * the open arrow. A seamless search line above the grid live-filters tiles:
 * survivors glide to their new spots, matches deal back in, misses fold away.
 */
export function ProjectGrid({ projects }: ProjectGridProps) {
  const shouldReduceMotion = useReducedMotion();
  const section = useSectionReveal();
  const sectionDriven = section !== null;
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const haystacks = useMemo(
    () => new Map(projects.map((project) => [project.id, buildHaystack(project)])),
    [projects],
  );

  const filtered = useMemo(() => {
    const trimmed = deferredQuery.trim().toLowerCase();

    if (!trimmed) {
      return projects;
    }

    const terms = trimmed.split(/\s+/);
    return projects.filter((project) => {
      const haystack = haystacks.get(project.id) ?? "";
      return terms.every((term) => haystack.includes(term));
    });
  }, [projects, deferredQuery, haystacks]);

  return (
    <>
      <div className="project-search" role="search">
        <svg
          className="project-search-icon"
          viewBox="0 0 24 24"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="M15.5 15.5 20 20" />
        </svg>
        <input
          type="text"
          className="project-search-input"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="search projects…"
          aria-label="Search projects"
          spellCheck={false}
          autoComplete="off"
        />
        {query ? (
          <>
            <span className="project-search-count" aria-live="polite">
              {filtered.length}/{projects.length}
            </span>
            <button
              type="button"
              className="project-search-clear"
              onClick={() => setQuery("")}
              aria-label="Clear search"
            >
              ×
            </button>
          </>
        ) : null}
      </div>

      <motion.div
        className="project-grid"
        initial={shouldReduceMotion ? false : "hidden"}
        animate={sectionDriven ? (section ? "visible" : "hidden") : undefined}
        whileInView={sectionDriven ? undefined : "visible"}
        viewport={sectionDriven ? undefined : { amount: 0.12, once: false }}
        variants={shouldReduceMotion ? undefined : gridVariants}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {filtered.map((project) => (
            <ProjectTile key={project.id} project={project} />
          ))}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {filtered.length === 0 ? (
          <motion.p
            className="project-search-empty"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: gravitationalEase }}
          >
            no project matches &ldquo;{deferredQuery.trim()}&rdquo; yet. try a
            stack, a keyword, or clear the search.
          </motion.p>
        ) : null}
      </AnimatePresence>
    </>
  );
}
