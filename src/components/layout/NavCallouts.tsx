"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { useCursorTrailEnabled } from "@/components/theme/CursorTrailToggle";

const TRAIL_DELAY = 1.7;
const THEME_DELAY = 2.6;
const AUTO_HIDE_MS = 12000;

type Spark = Readonly<{ x: number; y: number; r: number; p: number }>;

// Spark positions hug each arrow's curve; p is the position along the draw
// so they flare in step with the stroke heading toward the button.
const TRAIL_SPARKS: readonly Spark[] = [
  { x: 30, y: 43, r: 1.6, p: 0.1 },
  { x: 23, y: 35, r: 2.1, p: 0.35 },
  { x: 21, y: 26, r: 1.4, p: 0.55 },
  { x: 26, y: 18, r: 1.9, p: 0.75 },
  { x: 28, y: 9, r: 1.5, p: 0.95 },
];

const THEME_SPARKS: readonly Spark[] = [
  { x: 40, y: 72, r: 1.7, p: 0.08 },
  { x: 28, y: 62, r: 1.4, p: 0.28 },
  { x: 16, y: 49, r: 2.1, p: 0.5 },
  { x: 12, y: 33, r: 1.5, p: 0.7 },
  { x: 18, y: 19, r: 1.9, p: 0.9 },
];

const calloutExit = {
  opacity: 0,
  scale: 0.82,
  y: -12,
  transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const },
};

type CalloutArrowProps = Readonly<{
  curve: string;
  head: string;
  headTransform?: string;
  delay: number;
  sparks: readonly Spark[];
  viewBox: string;
  className: string;
}>;

function CalloutArrow({
  curve,
  head,
  headTransform,
  delay,
  sparks,
  viewBox,
  className,
}: CalloutArrowProps) {
  return (
    <svg viewBox={viewBox} fill="none" className={className}>
      <motion.path
        d={curve}
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay, duration: 0.85, ease: "easeInOut" }}
      />
      <motion.path
        d={head}
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        transform={headTransform}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: delay + 0.7, type: "spring", stiffness: 380, damping: 17 }}
      />
      {sparks.map((spark) => (
        <motion.circle
          key={`${spark.x}-${spark.y}`}
          cx={spark.x}
          cy={spark.y}
          className={spark.p > 0.6 ? "nav-callout-spark is-white" : "nav-callout-spark"}
          initial={{ r: 0, opacity: 0 }}
          animate={{ r: [0, spark.r, 0], opacity: [0, 1, 0] }}
          transition={{
            delay: delay + spark.p * 0.8,
            duration: 0.75,
            ease: "easeOut",
            times: [0, 0.35, 1],
          }}
        />
      ))}
    </svg>
  );
}

/**
 * First-load onboarding callouts hanging under the nav toggles: hand-drawn
 * arrows draw themselves up toward the cursor-trail and theme buttons with
 * trailing sparks and clip-revealed labels. Each callout zips away into its
 * button the moment that feature is actually used (trail toggled on, theme
 * switched), and both retire on scroll or after a short while. Home only,
 * desktop only, skipped entirely under reduced motion, and the trail callout
 * never shows if the trail is already on.
 */
export function NavCallouts({
  variant = "desktop",
}: Readonly<{ variant?: "desktop" | "compact" }>) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();
  const trailEnabled = useCursorTrailEnabled();
  const [mounted, setMounted] = useState(false);
  const [themeTouched, setThemeTouched] = useState(false);
  const [retired, setRetired] = useState(false);

  useEffect(() => {
    const observer = new MutationObserver(() => setThemeTouched(true));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  // Arm after a beat (avoids hydration mismatch with the localStorage-backed
  // trail state), then retire on scroll or after the auto-hide window — the
  // callouts are a first-load prompt, not a passenger.
  useEffect(() => {
    const armTimer = window.setTimeout(() => setMounted(true), 40);
    const hideTimer = window.setTimeout(() => setRetired(true), AUTO_HIDE_MS);

    function onScroll() {
      if (window.scrollY > 60) {
        setRetired(true);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.clearTimeout(armTimer);
      window.clearTimeout(hideTimer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  if (!mounted || pathname !== "/" || shouldReduceMotion) {
    return null;
  }

  // The compact nav (below 1280px) has no trail toggle, so only the theme
  // callout applies there.
  const showTrail = variant === "desktop" && !trailEnabled && !retired;
  const showTheme = !themeTouched && !retired;

  return (
    <span
      className={`nav-callouts nav-callouts-${variant}`}
      aria-hidden="true"
    >
      <AnimatePresence>
        {showTrail ? (
          <motion.span key="trail" className="nav-callout nav-callout-trail" exit={calloutExit}>
            <span className="nav-callout-inner nav-callout-inner-trail">
              <CalloutArrow
                className="nav-callout-arrow nav-callout-arrow-trail"
                viewBox="0 0 40 48"
                curve="M 32 46 C 14 38, 24 26, 24 12"
                head="M 24 3 L 19.6 12.5 L 28.4 12.5 Z"
                delay={TRAIL_DELAY}
                sparks={TRAIL_SPARKS}
              />
              <motion.span
                className="nav-callout-text"
                initial={{ clipPath: "inset(0 100% 0 0)" }}
                animate={{ clipPath: "inset(0 0% 0 0)" }}
                transition={{
                  delay: TRAIL_DELAY + 0.2,
                  duration: 0.65,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                click me to activate a trail!
              </motion.span>
            </span>
          </motion.span>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {showTheme ? (
          <motion.span key="theme" className="nav-callout nav-callout-theme" exit={calloutExit}>
            <span className="nav-callout-inner nav-callout-inner-theme">
              <CalloutArrow
                className="nav-callout-arrow nav-callout-arrow-theme"
                viewBox="0 0 48 78"
                curve="M 42 76 C 18 66, 10 40, 16 14"
                head="M 0 -9.5 L -4.6 0.5 L 4.6 0.5 Z"
                headTransform="translate(16 14) rotate(13)"
                delay={THEME_DELAY}
                sparks={THEME_SPARKS}
              />
              <motion.span
                className="nav-callout-text"
                initial={{ clipPath: "inset(0 100% 0 0)" }}
                animate={{ clipPath: "inset(0 0% 0 0)" }}
                transition={{
                  delay: THEME_DELAY + 0.2,
                  duration: 0.65,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                click me to switch themes!
              </motion.span>
            </span>
          </motion.span>
        ) : null}
      </AnimatePresence>
    </span>
  );
}
