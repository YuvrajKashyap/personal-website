"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
} from "motion/react";
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

const WIDE_QUERY = "(min-width: 900px)";
const PATH_SEGMENT_HEIGHT = 384;
const PATH_EFFECT_PADDING = 24;
const PATH_LANE_PADDING = 32;

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
  laneStart: number;
  laneWidth: number;
  d: string;
  total: number;
  anchors: readonly PathAnchor[];
  pointAt: (progress: number) => PathPoint;
}>;

type PathSegment = Readonly<{
  start: number;
  end: number;
  renderStart: number;
  renderEnd: number;
}>;

type PathLayout = Readonly<{
  width: number;
  height: number;
  anchorPoints: readonly PathPoint[];
  points: readonly PathPoint[];
  signature: string;
}>;

function createPathSegments(geometry: PathGeometry) {
  const segments: PathSegment[] = [];
  let start = 0;

  while (start < geometry.height) {
    const end = Math.min(geometry.height, start + PATH_SEGMENT_HEIGHT);

    segments.push({
      start,
      end,
      renderStart: Math.max(0, start - PATH_EFFECT_PADDING),
      renderEnd: Math.min(geometry.height, end + PATH_EFFECT_PADDING),
    });
    start = end;
  }

  return segments;
}

function getActiveSegmentIndex(
  segments: readonly PathSegment[],
  travelerY: number,
) {
  const index = segments.findIndex(
    (segment, segmentIndex) =>
      travelerY < segment.end || segmentIndex === segments.length - 1,
  );

  return Math.max(0, index);
}

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

function measurePathLayout(parent: HTMLElement): PathLayout | null {
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

  const signature = [width, height, ...points.flatMap(({ x, y }) => [x, y])]
    .map((value) => value.toFixed(1))
    .join(":");

  return { width, height, anchorPoints, points, signature };
}

function createPathGeometry(layout: PathLayout): PathGeometry | null {
  const { anchorPoints, height, points, width } = layout;

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

    for (let index = 0; index <= sampleCount; index += 1) {
      const sample = samples[index];
      const distance = Math.hypot(sample.x - anchor.x, sample.y - anchor.y);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestIndex = index;
      }
    }

    return { x: anchor.x, y: anchor.y, frac: bestIndex / sampleCount };
  });

  const sampledX = samples.map((sample) => sample.x);
  const laneStart = Math.max(
    0,
    Math.floor(Math.min(...sampledX) - PATH_LANE_PADDING),
  );
  const laneEnd = Math.min(
    width,
    Math.ceil(Math.max(...sampledX) + PATH_LANE_PADDING),
  );

  function pointAt(progress: number) {
    const clamped = Math.min(1, Math.max(0, progress));
    const point = probe.getPointAtLength(clamped * total);
    return { x: point.x, y: point.y };
  }

  return {
    width,
    height,
    laneStart,
    laneWidth: Math.max(1, laneEnd - laneStart),
    d,
    total,
    anchors,
    pointAt,
  };
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
    <svg
      className="scroll-path-node"
      width="32"
      height="32"
      viewBox="-16 -16 32 32"
      style={{ left: anchor.x, top: anchor.y }}
    >
      <motion.circle
        className="scroll-path-node-ring"
        r={9}
        style={{ opacity: ringOpacity }}
      />
      <motion.circle
        className="scroll-path-node-dot"
        r={3.6}
        style={{ scale: pop, opacity: raw }}
      />
    </svg>
  );
}

function ActiveProgressPath({
  geometry,
  progress,
}: Readonly<{
  geometry: PathGeometry;
  progress: MotionValue<number>;
}>) {
  const dashOffset = useTransform(
    progress,
    (value) => geometry.total * (1 - Math.min(1, Math.max(0, value))),
  );

  return (
    <motion.path
      className="scroll-path-progress"
      d={geometry.d}
      style={{
        strokeDasharray: geometry.total,
        strokeDashoffset: dashOffset,
      }}
    />
  );
}

function ScrollPathSegment({
  geometry,
  isActive,
  isComplete,
  progress,
  segment,
}: Readonly<{
  geometry: PathGeometry;
  isActive: boolean;
  isComplete: boolean;
  progress: MotionValue<number>;
  segment: PathSegment;
}>) {
  const clipId = useId().replaceAll(":", "");
  const renderHeight = segment.renderEnd - segment.renderStart;

  return (
    <svg
      className="scroll-path-svg scroll-path-segment"
      width={geometry.laneWidth}
      height={renderHeight}
      viewBox={`${geometry.laneStart} ${segment.renderStart} ${geometry.laneWidth} ${renderHeight}`}
      style={{ left: geometry.laneStart, top: segment.renderStart }}
    >
      <defs>
        <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
          <rect
            x={geometry.laneStart}
            y={segment.start}
            width={geometry.laneWidth}
            height={segment.end - segment.start}
          />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <path className="scroll-path-track" d={geometry.d} />
      </g>
      {isComplete ? (
        <g className="scroll-path-progress-effect">
          <g clipPath={`url(#${clipId})`}>
            <path
              className="scroll-path-progress"
              d={geometry.d}
              strokeDasharray={geometry.total}
              strokeDashoffset={0}
            />
          </g>
        </g>
      ) : null}
      {isActive ? (
        <g className="scroll-path-progress-effect">
          <g clipPath={`url(#${clipId})`}>
            <ActiveProgressPath geometry={geometry} progress={progress} />
          </g>
        </g>
      ) : null}
    </svg>
  );
}

function ScrollPathTraveler({
  stretch,
  x,
  y,
}: Readonly<{
  stretch: MotionValue<number>;
  x: MotionValue<number>;
  y: MotionValue<number>;
}>) {
  const transform = useMotionTemplate`translate3d(${x}px, ${y}px, 0)`;

  return (
    <motion.div className="scroll-path-traveler" style={{ transform }}>
      <svg width="48" height="48" viewBox="-24 -24 48 48">
        <motion.circle
          className="scroll-path-traveler-halo"
          r={11}
          style={{ scale: stretch }}
        />
        <circle className="scroll-path-traveler-mid" r={6} />
        <circle className="scroll-path-traveler-core" r={3.2} />
      </svg>
    </motion.div>
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
  const travelerX = useMotionValue(0);
  const travelerY = useMotionValue(0);
  const segments = useMemo(() => createPathSegments(geometry), [geometry]);
  const initialPoint = geometry.pointAt(progress.get());
  const initialSegmentIndex = getActiveSegmentIndex(segments, initialPoint.y);
  const activeSegmentIndexRef = useRef(initialSegmentIndex);
  const [activeSegmentIndex, setActiveSegmentIndex] = useState(
    initialSegmentIndex,
  );

  useEffect(() => {
    const point = geometry.pointAt(progress.get());
    travelerX.set(point.x);
    travelerY.set(point.y);
  }, [geometry, progress, travelerX, travelerY]);

  useMotionValueEvent(progress, "change", (value) => {
    const point = geometry.pointAt(value);
    travelerX.set(point.x);
    travelerY.set(point.y);

    const nextSegmentIndex = getActiveSegmentIndex(segments, point.y);
    if (nextSegmentIndex !== activeSegmentIndexRef.current) {
      activeSegmentIndexRef.current = nextSegmentIndex;
      setActiveSegmentIndex(nextSegmentIndex);
    }
  });

  return (
    <>
      {segments.map((segment, index) => (
        <ScrollPathSegment
          key={segment.start}
          geometry={geometry}
          isActive={index === activeSegmentIndex}
          isComplete={index < activeSegmentIndex}
          progress={progress}
          segment={segment}
        />
      ))}
      {geometry.anchors.map((anchor) => (
        <PathNode
          key={`${anchor.x}-${anchor.y}`}
          anchor={anchor}
          progress={progress}
        />
      ))}
      <ScrollPathTraveler
        stretch={stretch}
        x={travelerX}
        y={travelerY}
      />
    </>
  );
}

function StaticScrollPathScene({
  geometry,
  progress,
}: Readonly<{
  geometry: PathGeometry;
  progress: MotionValue<number>;
}>) {
  const segments = useMemo(() => createPathSegments(geometry), [geometry]);

  return (
    <>
      {segments.map((segment) => (
        <ScrollPathSegment
          key={segment.start}
          geometry={geometry}
          isActive={false}
          isComplete={false}
          progress={progress}
          segment={segment}
        />
      ))}
      {geometry.anchors.map((anchor) => (
        <svg
          key={`${anchor.x}-${anchor.y}`}
          className="scroll-path-node"
          width="32"
          height="32"
          viewBox="-16 -16 32 32"
          style={{ left: anchor.x, top: anchor.y }}
        >
          <circle className="scroll-path-node-ring" r={9} />
          <circle className="scroll-path-node-dot" r={3.6} />
        </svg>
      ))}
    </>
  );
}

export function ScrollPath() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const layoutSignatureRef = useRef("");
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
      layoutSignatureRef.current = "";
      return undefined;
    }

    const parent = wrapperRef.current?.parentElement;

    if (!parent) {
      return undefined;
    }

    let frame = 0;

    function run() {
      frame = 0;
      const layout = measurePathLayout(parent as HTMLElement);

      if (!layout) {
        layoutSignatureRef.current = "";
        setGeometry(null);
        return;
      }

      if (layout.signature === layoutSignatureRef.current) {
        return;
      }

      const nextGeometry = createPathGeometry(layout);
      layoutSignatureRef.current = nextGeometry ? layout.signature : "";
      setGeometry(nextGeometry);
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
        <StaticScrollPathScene geometry={geometry} progress={progress} />
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
