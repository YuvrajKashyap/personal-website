"use client";

import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { useCallback, useEffect, useId, useRef, useState } from "react";

type OrbitalMarkProps = Readonly<{
  className?: string;
  variant?: "nav" | "display";
}>;

const CENTER = 60;
const INNER_R = 38;
const OUTER_R = 52;
const MOON_ORBIT_DURATION = 13.846;
const ASTEROID_ORBIT_DURATION = 40;

/**
 * Comet trail behind the moon: three stacked arcs of increasing weight and
 * opacity, all ending at the moon anchor (98, 60), swept clockwise so they
 * fade out behind the direction of travel.
 */
const MOON_TRAILS = [
  { d: "M 81.8 28.87 A 38 38 0 0 1 98 60", width: 1.5, opacity: 0.14 },
  { d: "M 92.23 39.87 A 38 38 0 0 1 98 60", width: 2.1, opacity: 0.28 },
  { d: "M 96.87 50.81 A 38 38 0 0 1 98 60", width: 2.6, opacity: 0.46 },
];

const ASTEROID_TRAIL = "M 108.86 42.21 A 52 52 0 0 1 112 60";

type PointerSample = Readonly<{ x: number; y: number }>;
type PointerSubscriber = (sample: PointerSample | null) => void;

const pointerSubscribers = new Set<PointerSubscriber>();
let latestPointer: PointerSample | null = null;
let pointerFrame = 0;
let detachPointerSource: (() => void) | null = null;

function flushPointerSubscribers() {
  pointerFrame = 0;
  pointerSubscribers.forEach((subscriber) => subscriber(latestPointer));
}

function startPointerSource() {
  const onMove = (event: PointerEvent) => {
    latestPointer = { x: event.clientX, y: event.clientY };
    if (!pointerFrame) {
      pointerFrame = window.requestAnimationFrame(flushPointerSubscribers);
    }
  };
  const onLeave = () => {
    latestPointer = null;
    pointerSubscribers.forEach((subscriber) => subscriber(null));
  };

  window.addEventListener("pointermove", onMove, { passive: true });
  document.documentElement.addEventListener("pointerleave", onLeave);

  detachPointerSource = () => {
    window.removeEventListener("pointermove", onMove);
    document.documentElement.removeEventListener("pointerleave", onLeave);
    if (pointerFrame) {
      window.cancelAnimationFrame(pointerFrame);
      pointerFrame = 0;
    }
    latestPointer = null;
    detachPointerSource = null;
  };
}

function subscribeToPointer(subscriber: PointerSubscriber) {
  if (!detachPointerSource) {
    startPointerSource();
  }
  pointerSubscribers.add(subscriber);
  subscriber(latestPointer);

  return () => {
    pointerSubscribers.delete(subscriber);
    if (pointerSubscribers.size === 0) {
      detachPointerSource?.();
    }
  };
}

/** Fixed star specks scattered between the two orbits. */
const STARS = [
  { x: 31, y: 30, r: 0.85, delay: "0s" },
  { x: 95, y: 33, r: 0.6, delay: "1.1s" },
  { x: 88, y: 92, r: 0.7, delay: "2.3s" },
  { x: 24, y: 74, r: 0.55, delay: "0.6s" },
];

const entranceSpring = {
  type: "spring" as const,
  stiffness: 120,
  damping: 18,
};

const ringVariants = (delay: number) => ({
  hidden: { opacity: 0, scale: 0.74 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { ...entranceSpring, delay },
  },
});

const lettersVariants = {
  hidden: { opacity: 0, scale: 0.72 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { ...entranceSpring, stiffness: 170, delay: 0.42 },
  },
};

const fadeVariants = (delay: number) => ({
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.55, delay } },
});

export function OrbitalMark({ className, variant = "nav" }: OrbitalMarkProps) {
  const frameRef = useRef<HTMLSpanElement>(null);
  const moonRotorRef = useRef<SVGGElement>(null);
  const asteroidRotorRef = useRef<SVGGElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [ripple, setRipple] = useState(0);
  const rawId = useId();
  const uid = rawId.replace(/[^a-zA-Z0-9_-]/g, "");
  const sunId = `orbital-sun-${uid}`;
  const ringId = `orbital-ring-${uid}`;
  const letterId = `orbital-letters-${uid}`;
  const moonGlowId = `orbital-moon-glow-${uid}`;

  const isDisplay = variant === "display";
  const maxTilt = isDisplay ? 9 : 13;
  const [isVisible, setIsVisible] = useState(!isDisplay);
  const [isDocumentVisible, setIsDocumentVisible] = useState(true);
  const isActive = isVisible && isDocumentVisible;
  const frameClassName = [
    "orbital-frame",
    `orbital-frame-${variant}`,
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  const rotateX = useSpring(0, { stiffness: 160, damping: 19, mass: 0.6 });
  const rotateY = useSpring(0, { stiffness: 160, damping: 19, mass: 0.6 });
  const glow = useSpring(0, { stiffness: 130, damping: 24 });
  const hover = useSpring(0, { stiffness: 190, damping: 24 });
  const letterScale = useSpring(1, { stiffness: 280, damping: 20 });

  const sunOpacity = useTransform(() =>
    Math.min(0.62, 0.2 + glow.get() * 0.2 + hover.get() * 0.24),
  );
  const innerRingOpacity = useTransform(() =>
    Math.min(1, 0.62 + glow.get() * 0.2 + hover.get() * 0.2),
  );

  /* Parallax between depth layers while the mark tilts toward the cursor. */
  const letterShiftX = useTransform(rotateY, (value) => value * 0.26);
  const letterShiftY = useTransform(rotateX, (value) => value * -0.26);
  const ringShiftX = useTransform(rotateY, (value) => value * -0.16);
  const ringShiftY = useTransform(rotateX, (value) => value * 0.16);

  const syncRotorPlaybackRate = useCallback(() => {
    const energy = 1 + glow.get() * 1.2 + hover.get() * 2.2;
    const rotors = [
      { node: moonRotorRef.current, duration: MOON_ORBIT_DURATION },
      { node: asteroidRotorRef.current, duration: ASTEROID_ORBIT_DURATION },
    ];

    rotors.forEach(({ node, duration }) => {
      if (!node) {
        return;
      }

      const animations =
        typeof node.getAnimations === "function" ? node.getAnimations() : [];

      if (animations.length > 0) {
        animations.forEach((animation) => {
          animation.updatePlaybackRate(energy);
        });
      } else {
        // Older or restricted browsers can still preserve the hover speed-up
        // without bringing back a permanent JavaScript animation loop.
        node.style.animationDuration = `${duration / energy}s`;
      }
    });
  }, [glow, hover]);

  useMotionValueEvent(glow, "change", syncRotorPlaybackRate);
  useMotionValueEvent(hover, "change", syncRotorPlaybackRate);

  useEffect(() => {
    syncRotorPlaybackRate();
  }, [syncRotorPlaybackRate]);

  useEffect(() => {
    const node = frameRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.01 },
    );
    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const syncDocumentVisibility = () => {
      setIsDocumentVisible(document.visibilityState === "visible");
    };

    syncDocumentVisibility();
    document.addEventListener("visibilitychange", syncDocumentVisibility);
    return () => {
      document.removeEventListener("visibilitychange", syncDocumentVisibility);
    };
  }, []);

  useEffect(() => {
    const node = frameRef.current;
    const reset = () => {
      rotateX.set(0);
      rotateY.set(0);
      glow.set(0);
    };

    if (
      shouldReduceMotion ||
      !isActive ||
      !node ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches
    ) {
      reset();
      return undefined;
    }

    const apply = (sample: PointerSample | null) => {
      if (!sample) {
        reset();
        return;
      }

      const rect = node.getBoundingClientRect();
      const deltaX = sample.x - (rect.left + rect.width / 2);
      const deltaY = sample.y - (rect.top + rect.height / 2);
      const radius = Math.max(rect.width * 1.9, 180);
      const distance = Math.hypot(deltaX, deltaY);
      const influence = Math.max(0, 1 - distance / radius);
      const eased = influence * influence * (3 - 2 * influence);
      rotateY.set((deltaX / radius) * maxTilt * 2 * eased);
      rotateX.set((-deltaY / radius) * maxTilt * 2 * eased);
      glow.set(eased);
    };

    const unsubscribe = subscribeToPointer(apply);

    return () => {
      unsubscribe();
      reset();
    };
  }, [glow, isActive, maxTilt, rotateX, rotateY, shouldReduceMotion]);

  const defs = (
    <defs>
      <radialGradient id={sunId}>
        <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.55" />
        <stop offset="55%" stopColor="var(--accent)" stopOpacity="0.14" />
        <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
      </radialGradient>
      <linearGradient id={ringId} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="var(--accent)" stopOpacity="1" />
        <stop offset="55%" stopColor="var(--accent)" stopOpacity="0.55" />
        <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.25" />
      </linearGradient>
      <linearGradient id={letterId} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="var(--mark-ink-hi)" />
        <stop offset="52%" stopColor="var(--mark-ink-mid)" />
        <stop offset="100%" stopColor="var(--mark-ink-low)" />
      </linearGradient>
      <radialGradient id={moonGlowId}>
        <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.62" />
        <stop offset="46%" stopColor="var(--accent)" stopOpacity="0.3" />
        <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
      </radialGradient>
    </defs>
  );

  if (shouldReduceMotion) {
    return (
      <span ref={frameRef} className={frameClassName}>
        <svg viewBox="0 0 120 120" aria-hidden="true" className="orbital-svg">
          {defs}
          <circle
            cx={CENTER}
            cy={CENTER}
            r={34}
            fill={`url(#${sunId})`}
            opacity={0.2}
          />
          <circle cx={CENTER} cy={CENTER} r={OUTER_R} className="orbital-ring-outer" />
          <circle
            cx={CENTER}
            cy={CENTER}
            r={INNER_R}
            stroke={`url(#${ringId})`}
            className="orbital-ring-inner"
            opacity={0.55}
          />
          <g transform="rotate(216 60 60)">
            <circle
              cx={98}
              cy={60}
              r={7}
              fill={`url(#${moonGlowId})`}
              className="orbital-moon-glow"
            />
            <circle cx={98} cy={60} r={3} className="orbital-moon" />
          </g>
          <g transform="rotate(96 60 60)">
            <circle cx={112} cy={60} r={1.5} className="orbital-asteroid" />
          </g>
          {STARS.map((star) => (
            <circle
              key={`${star.x}-${star.y}`}
              cx={star.x}
              cy={star.y}
              r={star.r}
              className="orbital-star orbital-star-static"
            />
          ))}
          <text
            x={CENTER}
            y={CENTER}
            fill={`url(#${letterId})`}
            className="orbital-letters-glow"
          >
            YK
          </text>
          <text
            x={CENTER}
            y={CENTER}
            fill={`url(#${letterId})`}
            className="orbital-letters"
          >
            YK
          </text>
        </svg>
      </span>
    );
  }

  return (
    <motion.span
      ref={frameRef}
      className={frameClassName}
      data-orbital-active={isActive ? "true" : "false"}
      style={{ rotateX, rotateY, transformPerspective: 700 }}
      onPointerEnter={() => {
        hover.set(1);
        letterScale.set(1.05);
      }}
      onPointerLeave={() => {
        hover.set(0);
        letterScale.set(1);
      }}
      onPointerDown={() => setRipple((count) => count + 1)}
    >
      <motion.svg
        viewBox="0 0 120 120"
        aria-hidden="true"
        className="orbital-svg"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
      >
        {defs}

        <motion.g variants={fadeVariants(0.15)}>
          <motion.circle
            cx={CENTER}
            cy={CENTER}
            r={34}
            fill={`url(#${sunId})`}
            style={{ opacity: sunOpacity }}
          />
        </motion.g>

        <motion.g style={{ x: ringShiftX, y: ringShiftY }}>
          <motion.g className="orbital-ring-scale" variants={ringVariants(0.28)}>
            <circle
              cx={CENTER}
              cy={CENTER}
              r={OUTER_R}
              className="orbital-ring-outer"
            />
          </motion.g>
          <motion.g className="orbital-ring-scale" variants={ringVariants(0.1)}>
            <motion.circle
              cx={CENTER}
              cy={CENTER}
              r={INNER_R}
              stroke={`url(#${ringId})`}
              className="orbital-ring-inner"
              style={{ opacity: innerRingOpacity }}
            />
          </motion.g>

          <motion.g variants={fadeVariants(0.95)}>
            <g
              ref={asteroidRotorRef}
              className="orbital-rotor orbital-rotor-asteroid"
            >
              <path d={ASTEROID_TRAIL} className="orbital-asteroid-trail" />
              <circle cx={112} cy={60} r={1.5} className="orbital-asteroid" />
            </g>
          </motion.g>

          <motion.g variants={fadeVariants(0.7)}>
            <g ref={moonRotorRef} className="orbital-rotor orbital-rotor-moon">
              {MOON_TRAILS.map((trail) => (
                <path
                  key={trail.d}
                  d={trail.d}
                  className="orbital-moon-trail"
                  strokeWidth={trail.width}
                  opacity={trail.opacity}
                />
              ))}
              <circle
                cx={98}
                cy={60}
                r={7}
                fill={`url(#${moonGlowId})`}
                className="orbital-moon-glow"
              />
              <circle cx={98} cy={60} r={3} className="orbital-moon" />
            </g>
          </motion.g>

          <motion.g variants={fadeVariants(1.15)}>
            {STARS.map((star) => (
              <circle
                key={`${star.x}-${star.y}`}
                cx={star.x}
                cy={star.y}
                r={star.r}
                className="orbital-star"
                style={{ animationDelay: star.delay }}
              />
            ))}
          </motion.g>
        </motion.g>

        <motion.g className="orbital-letters-anchor" variants={lettersVariants}>
          <text
            x={CENTER}
            y={CENTER}
            fill={`url(#${letterId})`}
            className="orbital-letters-glow"
          >
            YK
          </text>
          <motion.g
            className="orbital-letters-anchor"
            style={{ scale: letterScale, x: letterShiftX, y: letterShiftY }}
          >
            <text
              x={CENTER}
              y={CENTER}
              fill={`url(#${letterId})`}
              className="orbital-letters"
            >
              YK
            </text>
          </motion.g>
        </motion.g>

        {ripple > 0 ? (
          <motion.circle
            key={ripple}
            cx={CENTER}
            cy={CENTER}
            className="orbital-ripple"
            initial={{ r: 22, opacity: 0.65 }}
            animate={{ r: 56, opacity: 0 }}
            transition={{ duration: 0.75, ease: "easeOut" }}
          />
        ) : null}
      </motion.svg>
    </motion.span>
  );
}
