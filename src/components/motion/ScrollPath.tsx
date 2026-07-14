"use client";

import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
} from "motion/react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const WIDE_QUERY = "(min-width: 900px)";

function subscribeToWide(callback: () => void) {
  const mediaQuery = window.matchMedia(WIDE_QUERY);
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getWideSnapshot() {
  return window.matchMedia(WIDE_QUERY).matches;
}

function getWideServerSnapshot() {
  return false;
}

type PathPoint = Readonly<{ x: number; y: number }>;

type PathAnchor = Readonly<{ x: number; y: number; frac: number }>;

type PathGeometry = Readonly<{
  width: number;
  height: number;
  d: string;
  total: number;
  anchors: readonly PathAnchor[];
}>;

function catmullRomPath(points: readonly PathPoint[]) {
  if (points.length < 2) {
    return "";
  }

  let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;

  for (let index = 0; index < points.length - 1; index += 1) {
    const p0 = points[index - 1] ?? points[index];
    const p1 = points[index];
    const p2 = points[index + 1];
    const p3 = points[index + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }

  return d;
}

function measureGeometry(parent: HTMLElement): PathGeometry | null {
  const chapters = parent.querySelectorAll<HTMLElement>(".home-chapter");

  if (chapters.length === 0) {
    return null;
  }

  const parentRect = parent.getBoundingClientRect();
  const width = parent.clientWidth;
  const height = parent.scrollHeight;
  const grid = parent.querySelector<HTMLElement>(".home-chapter-grid");
  const gridLeft = grid
    ? grid.getBoundingClientRect().left - parentRect.left
    : 96;
  const base = Math.max(26, gridLeft - 34);
  const swing = Math.min(base + 108, width * 0.24);

  const anchorPoints: PathPoint[] = [];
  chapters.forEach((chapter, index) => {
    const top = chapter.getBoundingClientRect().top - parentRect.top;
    anchorPoints.push({
      x: index % 2 === 0 ? base : swing,
      y: top + 170,
    });
  });

  const points: PathPoint[] = [
    { x: base + 34, y: 6 },
    ...anchorPoints,
    { x: base + 44, y: height - 48 },
  ];

  const d = catmullRomPath(points);
  const probe = document.createElementNS("http://www.w3.org/2000/svg", "path");
  probe.setAttribute("d", d);
  const total = probe.getTotalLength();

  if (!total || Number.isNaN(total)) {
    return null;
  }

  const sampleCount = 480;
  const samples: PathPoint[] = [];
  for (let index = 0; index <= sampleCount; index += 1) {
    const point = probe.getPointAtLength((index / sampleCount) * total);
    samples.push({ x: point.x, y: point.y });
  }

  const anchors: PathAnchor[] = anchorPoints.map((anchor) => {
    let bestIndex = 0;
    let bestDistance = Number.POSITIVE_INFINITY;

    samples.forEach((sample, index) => {
      const distance = Math.hypot(sample.x - anchor.x, sample.y - anchor.y);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestIndex = index;
      }
    });

    return { x: anchor.x, y: anchor.y, frac: bestIndex / sampleCount };
  });

  return { width, height, d, total, anchors };
}

function PathNode({
  anchor,
  progress,
}: Readonly<{
  anchor: PathAnchor;
  progress: MotionValue<number>;
}>) {
  const raw = useTransform(
    progress,
    [anchor.frac - 0.012, anchor.frac + 0.004],
    [0, 1],
  );
  const pop = useSpring(raw, { stiffness: 460, damping: 21, mass: 0.6 });
  const ringOpacity = useTransform(raw, [0, 1], [0.4, 1]);

  return (
    <g>
      <motion.circle
        className="scroll-path-node-ring"
        cx={anchor.x}
        cy={anchor.y}
        r={9}
        style={{ opacity: ringOpacity }}
      />
      <motion.circle
        className="scroll-path-node-dot"
        cx={anchor.x}
        cy={anchor.y}
        r={3.6}
        style={{ scale: pop, opacity: raw }}
      />
    </g>
  );
}

function ScrollPathScene({
  geometry,
  progress,
  stretch,
}: Readonly<{
  geometry: PathGeometry;
  progress: MotionValue<number>;
  stretch: MotionValue<number>;
}>) {
  const progressPathRef = useRef<SVGPathElement>(null);
  const dashOffset = useTransform(
    progress,
    (value) => geometry.total * (1 - Math.min(1, Math.max(0, value))),
  );
  const travelerX = useMotionValue(0);
  const travelerY = useMotionValue(0);

  useEffect(() => {
    const path = progressPathRef.current;

    if (!path) {
      return;
    }

    const clamped = Math.min(1, Math.max(0, progress.get()));
    const point = path.getPointAtLength(clamped * geometry.total);
    travelerX.set(point.x);
    travelerY.set(point.y);
  }, [geometry, progress, travelerX, travelerY]);

  useMotionValueEvent(progress, "change", (value) => {
    const path = progressPathRef.current;

    if (!path) {
      return;
    }

    const clamped = Math.min(1, Math.max(0, value));
    const point = path.getPointAtLength(clamped * geometry.total);
    travelerX.set(point.x);
    travelerY.set(point.y);
  });

  return (
    <svg
      className="scroll-path-svg"
      width={geometry.width}
      height={geometry.height}
      viewBox={`0 0 ${geometry.width} ${geometry.height}`}
    >
      <path className="scroll-path-track" d={geometry.d} />
      <motion.path
        ref={progressPathRef}
        className="scroll-path-progress"
        d={geometry.d}
        style={{
          strokeDasharray: geometry.total,
          strokeDashoffset: dashOffset,
        }}
      />
      {geometry.anchors.map((anchor) => (
        <PathNode
          key={`${anchor.x}-${anchor.y}`}
          anchor={anchor}
          progress={progress}
        />
      ))}
      <motion.g style={{ x: travelerX, y: travelerY }}>
        <motion.circle
          className="scroll-path-traveler-halo"
          r={11}
          style={{ scale: stretch }}
        />
        <circle className="scroll-path-traveler-mid" r={6} />
        <circle className="scroll-path-traveler-core" r={3.2} />
      </motion.g>
    </svg>
  );
}

export function ScrollPath() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const isWide = useSyncExternalStore(
    subscribeToWide,
    getWideSnapshot,
    getWideServerSnapshot,
  );
  const [geometry, setGeometry] = useState<PathGeometry | null>(null);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start 0.85", "end 0.92"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    mass: 0.4,
  });
  const velocity = useVelocity(progress);
  const travelerStretch = useSpring(
    useTransform(velocity, [-0.9, 0, 0.9], [1.5, 1, 1.5]),
    { stiffness: 320, damping: 28 },
  );

  useEffect(() => {
    if (!isWide) {
      setGeometry(null);
      return undefined;
    }

    const parent = wrapperRef.current?.parentElement;

    if (!parent) {
      return undefined;
    }

    let frame = 0;

    function run() {
      frame = 0;
      setGeometry(measureGeometry(parent as HTMLElement));
    }

    frame = window.requestAnimationFrame(run);

    const observer = new ResizeObserver(() => {
      if (frame) {
        return;
      }
      frame = window.requestAnimationFrame(run);
    });
    observer.observe(parent);

    return () => {
      observer.disconnect();
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, [isWide]);

  if (!isWide || !geometry) {
    return (
      <div ref={wrapperRef} className="scroll-path-layer" aria-hidden="true" />
    );
  }

  if (shouldReduceMotion) {
    return (
      <div ref={wrapperRef} className="scroll-path-layer" aria-hidden="true">
        <svg
          className="scroll-path-svg"
          width={geometry.width}
          height={geometry.height}
          viewBox={`0 0 ${geometry.width} ${geometry.height}`}
        >
          <path className="scroll-path-track" d={geometry.d} />
          {geometry.anchors.map((anchor) => (
            <g key={`${anchor.x}-${anchor.y}`}>
              <circle
                className="scroll-path-node-ring"
                cx={anchor.x}
                cy={anchor.y}
                r={9}
              />
              <circle
                className="scroll-path-node-dot"
                cx={anchor.x}
                cy={anchor.y}
                r={3.6}
              />
            </g>
          ))}
        </svg>
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className="scroll-path-layer" aria-hidden="true">
      <ScrollPathScene
        key={`${geometry.width}x${geometry.height}-${Math.round(geometry.total)}`}
        geometry={geometry}
        progress={progress}
        stretch={travelerStretch}
      />
    </div>
  );
}
