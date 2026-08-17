"use client";

import {
  motion,
  useInView,
  useMotionTemplate,
  useReducedMotion,
  useSpring,
} from "motion/react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";

import { MAIL_OPENED_EVENT, MAIL_SENT_EVENT } from "@/features/mail/mail-events";
import { Postmark } from "@/features/mail/Postmark";
import { gravitationalEase } from "@/lib/motion/presets";
import { createPhasePreservingAnimationController } from "@/lib/performance/animation-runtime";
import {
  createElementRectCache,
  createLatestFrameScheduler,
} from "@/lib/performance/runtime-utils";

import styles from "./MailPage.module.css";

type Phase = "sealed" | "cracked" | "flap" | "up" | "presented";

type EnvelopeCenterpieceProps = Readonly<{
  confirmed?: boolean;
  children: ReactNode;
}>;

type PointerSample = {
  clientX: number;
  clientY: number;
};

type PointerScheduler = {
  schedule: (sample: PointerSample) => void;
  cancel: () => void;
};

const TILT_SPRING = { stiffness: 200, damping: 22, mass: 0.6 };

const SEAL_SPARKS = [
  { x: -42, y: -30 },
  { x: 38, y: -38 },
  { x: -52, y: 8 },
  { x: 54, y: 2 },
  { x: -20, y: -52 },
  { x: 24, y: 40 },
];

/**
 * The page centerpiece: a sealed envelope that cracks its wax seal, swings its
 * flap open, and lifts the letter (the signup form) up and out to present it.
 * The letter sits in normal document flow so the layout never jumps; the
 * envelope is an absolutely positioned scene layered behind/in front of it.
 */
export function EnvelopeCenterpiece({
  confirmed = false,
  children,
}: EnvelopeCenterpieceProps) {
  const shouldReduceMotion = useReducedMotion();
  const skipTheater = shouldReduceMotion || confirmed;

  const rootRef = useRef<HTMLDivElement>(null);
  const tiltFrameRef = useRef<HTMLDivElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);
  const envelopeRef = useRef<HTMLDivElement>(null);
  const timeoutsRef = useRef<number[]>([]);
  const startedRef = useRef(skipTheater);
  const pointerSchedulerRef = useRef<PointerScheduler | null>(null);
  const pointerRectCacheRef = useRef<
    ReturnType<typeof createElementRectCache> | null
  >(null);

  const [phase, setPhase] = useState<Phase>(skipTheater ? "presented" : "sealed");
  const [flapBehind, setFlapBehind] = useState(skipTheater);
  const [sealedPose, setSealedPose] = useState<{ y: number; scale: number } | null>(null);
  const [upLift, setUpLift] = useState(-120);
  // Presented pose: the letter rests half-drawn from the pocket (its bottom
  // edge sits inside the envelope) rather than perched fully above it, so
  // the opened letter never climbs off the top of a one-screen layout.
  const [presentedY, setPresentedY] = useState(0);

  const inView = useInView(rootRef, { amount: 0.4 });

  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof CSSAnimation === "undefined") return undefined;

    const controller = createPhasePreservingAnimationController(
      () =>
        root
          .getAnimations({ subtree: true })
          .filter((animation) => animation instanceof CSSAnimation),
      () => performance.now(),
    );
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting ?? true) controller.resume();
        else controller.pause();
      },
      { rootMargin: "96px 0px" },
    );
    observer.observe(root);

    return () => {
      observer.disconnect();
      controller.resume();
    };
  }, []);

  // Measure the letter against the envelope so the sealed letter always fits
  // fully inside it (behind the flap and pocket) at any viewport size.
  useEffect(() => {
    const letter = letterRef.current;
    const envelope = envelopeRef.current;

    if (!letter || !envelope) {
      return undefined;
    }

    const measure = () => {
      const letterHeight = letter.offsetHeight || 1;
      const envelopeHeight = envelope.offsetHeight || 1;
      const scale = Math.min(0.52, (envelopeHeight * 0.84) / letterHeight);
      const letterLayoutBottom = letter.offsetTop + letterHeight;
      const envelopeBottom = envelope.offsetTop + envelopeHeight;

      setSealedPose({
        // Motion scales from the letter's bottom edge, so scaling alone does
        // not lift that edge. Place it from the two actual layout bottoms and
        // keep an 8% inset on every side of the closed envelope.
        y: envelopeBottom - envelopeHeight * 0.08 - letterLayoutBottom,
        scale,
      });
      setUpLift(-letterHeight * 0.24);
      // Bottom of the presented letter lands 62% down the envelope face, so
      // the letter reads as drawn out of the pocket rather than floated
      // clear above it. Never above its natural flow position.
      setPresentedY(
        Math.max(0, envelope.offsetTop + envelopeHeight * 0.62 - letterLayoutBottom),
      );
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(letter);
    observer.observe(envelope);

    return () => observer.disconnect();
  }, []);

  const runSequence = useCallback(() => {
    if (startedRef.current) {
      return;
    }
    startedRef.current = true;

    const schedule = (delay: number, action: () => void) => {
      timeoutsRef.current.push(window.setTimeout(action, delay));
    };

    setPhase("cracked");
    schedule(280, () => {
      setPhase("flap");
      window.dispatchEvent(new CustomEvent(MAIL_OPENED_EVENT));
    });
    schedule(700, () => setFlapBehind(true));
    schedule(860, () => setPhase("up"));
    schedule(1460, () => setPhase("presented"));
  }, []);

  // useReducedMotion can settle after hydration; never leave a reduced-motion
  // visitor stuck behind a sealed envelope with no way in.
  useEffect(() => {
    if (skipTheater && !startedRef.current) {
      startedRef.current = true;
      setPhase("presented");
      setFlapBehind(true);
    }
  }, [skipTheater]);

  // Phones skip the tap: breaking a wax seal is a cursor ritual. On small
  // screens the envelope opens itself shortly after scrolling into view, so
  // the theater still plays but signup is never gated behind it.
  const [autoOpen, setAutoOpen] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const update = () => setAutoOpen(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!autoOpen || skipTheater || !inView || startedRef.current) {
      return undefined;
    }

    const timer = window.setTimeout(runSequence, 550);
    return () => window.clearTimeout(timer);
  }, [autoOpen, inView, runSequence, skipTheater]);

  useEffect(() => {
    const timeouts = timeoutsRef.current;
    return () => timeouts.forEach((id) => window.clearTimeout(id));
  }, []);

  // Confirmed visits get the celebration: flare the canvas and launch the
  // paper plane from the letter once it has settled.
  useEffect(() => {
    if (!confirmed) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      const rect = letterRef.current?.getBoundingClientRect();
      window.dispatchEvent(
        new CustomEvent(MAIL_SENT_EVENT, {
          detail: {
            x: rect ? rect.left + rect.width / 2 : window.innerWidth / 2,
            y: rect ? rect.top + 40 : window.innerHeight / 2,
          },
        }),
      );
    }, 1200);

    return () => window.clearTimeout(timer);
  }, [confirmed]);

  // Pointer tilt + glare, active once the letter is presented.
  const rotateX = useSpring(0, TILT_SPRING);
  const rotateY = useSpring(0, TILT_SPRING);
  const glareX = useSpring(50, { stiffness: 160, damping: 24, mass: 0.6 });
  const glareY = useSpring(38, { stiffness: 160, damping: 24, mass: 0.6 });
  const glareStrength = useSpring(0, { stiffness: 140, damping: 26, mass: 0.7 });
  const glare = useMotionTemplate`radial-gradient(420px circle at ${glareX}% ${glareY}%, rgb(255 250 235 / ${glareStrength}), transparent 62%)`;

  const presented = phase === "presented";

  useEffect(() => {
    const target = tiltFrameRef.current;
    if (!target) return undefined;

    const cache = createElementRectCache(() => target.getBoundingClientRect());
    pointerRectCacheRef.current = cache;
    const invalidate = () => cache.invalidate();
    const resizeObserver = new ResizeObserver(invalidate);
    resizeObserver.observe(target);
    window.addEventListener("resize", invalidate, { passive: true });
    window.addEventListener("scroll", invalidate, { passive: true, capture: true });

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", invalidate);
      window.removeEventListener("scroll", invalidate, true);
      if (pointerRectCacheRef.current === cache) {
        pointerRectCacheRef.current = null;
      }
    };
  }, []);

  const applyPointerSample = useCallback(
    ({ clientX, clientY }: PointerSample) => {
      const rect = pointerRectCacheRef.current?.read();
      if (!rect || !rect.width || !rect.height) return;
      const px = (clientX - rect.left) / rect.width;
      const py = (clientY - rect.top) / rect.height;
      rotateX.set((0.5 - py) * 7);
      rotateY.set((px - 0.5) * 8);
      glareX.set(px * 100);
      glareY.set(py * 100);
      glareStrength.set(0.14);
    },
    [glareStrength, glareX, glareY, rotateX, rotateY],
  );

  useEffect(() => {
    const scheduler = createLatestFrameScheduler<PointerSample>(
      (callback) => window.requestAnimationFrame(callback),
      (frame) => window.cancelAnimationFrame(frame),
      applyPointerSample,
    );
    pointerSchedulerRef.current = scheduler;

    return () => {
      scheduler.cancel();
      if (pointerSchedulerRef.current === scheduler) {
        pointerSchedulerRef.current = null;
      }
    };
  }, [applyPointerSample]);

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!presented || shouldReduceMotion || event.pointerType !== "mouse") {
      return;
    }

    const sample = {
      clientX: event.clientX,
      clientY: event.clientY,
    };
    const scheduler = pointerSchedulerRef.current;
    if (scheduler) {
      scheduler.schedule(sample);
    } else {
      applyPointerSample(sample);
    }
  };

  const handlePointerLeave = () => {
    pointerSchedulerRef.current?.cancel();
    rotateX.set(0);
    rotateY.set(0);
    glareStrength.set(0);
    pointerRectCacheRef.current?.invalidate();
  };

  const letterTarget = presented
    ? { y: presentedY, scale: 1 }
    : phase === "up"
      ? { y: upLift, scale: 0.9 }
      : (sealedPose ?? { y: -120, scale: 0.5 });

  const letterTransition = presented
    ? { type: "spring" as const, stiffness: 230, damping: 23, mass: 0.85 }
    : phase === "up"
      ? { duration: 0.62, ease: gravitationalEase }
      : { duration: 0 };

  const sealCracked = phase !== "sealed";

  return (
    <motion.div
      ref={rootRef}
      className={styles.centerpiece}
      initial={shouldReduceMotion ? false : { opacity: 0, y: -64 }}
      animate={
        shouldReduceMotion
          ? undefined
          : inView
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: -64 }
      }
      transition={{ type: "spring", stiffness: 190, damping: 19, mass: 0.9 }}
    >
      <motion.div
        ref={tiltFrameRef}
        className={styles.tiltFrame}
        style={{ rotateX, rotateY, transformPerspective: 1200 }}
        onPointerEnter={() => pointerRectCacheRef.current?.invalidate()}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        <div
          className={styles.stage}
          data-phase={phase}
          onClick={phase === "sealed" ? runSequence : undefined}
        >
          <motion.div
            ref={letterRef}
            className={styles.letter}
            style={{
              zIndex: presented ? 6 : 2,
              transformOrigin: "50% 100%",
              visibility: !sealedPose && !presented && phase !== "up" ? "hidden" : undefined,
            }}
            initial={false}
            animate={letterTarget}
            transition={letterTransition}
          >
            <div className={styles.letterInner}>
              <motion.div
                className={styles.letterGlare}
                style={{ backgroundImage: glare }}
                aria-hidden="true"
              />
              <motion.div
                className={styles.letterPostmark}
                initial={
                  shouldReduceMotion
                    ? false
                    : { opacity: 0, scale: 1.7, rotate: -2 }
                }
                animate={
                  presented
                    ? { opacity: 0.5, scale: 1, rotate: -12 }
                    : { opacity: 0, scale: 1.7, rotate: -2 }
                }
                transition={{
                  type: "spring",
                  stiffness: 380,
                  damping: 22,
                  mass: 0.7,
                  delay: presented && !shouldReduceMotion ? 0.32 : 0,
                }}
                aria-hidden="true"
              >
                <Postmark markId="letter-mark" bars />
              </motion.div>

              {confirmed ? (
                <motion.div
                  className={styles.deliveredStamp}
                  initial={
                    shouldReduceMotion ? false : { opacity: 0, scale: 2.2, rotate: 2 }
                  }
                  animate={{ opacity: 1, scale: 1, rotate: -7 }}
                  transition={{
                    type: "spring",
                    stiffness: 460,
                    damping: 24,
                    mass: 0.8,
                    delay: shouldReduceMotion ? 0 : 0.55,
                  }}
                  aria-hidden="true"
                >
                  Delivered
                </motion.div>
              ) : null}

              {children}
            </div>
          </motion.div>

          <div ref={envelopeRef} className={styles.envelope} aria-hidden="true">
            <div className={styles.envBack} />
            <div className={styles.envLining} />
            <div
              className={styles.flapScene}
              style={{ zIndex: flapBehind ? 1 : 4 }}
            >
              <motion.div
                className={styles.flap}
                initial={false}
                animate={{ rotateX: phase === "sealed" || phase === "cracked" ? 0 : -150 }}
                transition={{ duration: 0.85, ease: gravitationalEase }}
              >
                <div className={styles.flapFace} />
                <div className={styles.flapBack} />
              </motion.div>
            </div>
            <div className={styles.pocket} />
            <div className={styles.envFace}>
              <div className={styles.envAddress}>
                <span style={{ width: "62%" }} />
                <span style={{ width: "44%" }} />
                <span style={{ width: "52%" }} />
              </div>
              <div className={styles.envStamp}>
                <svg width="26" height="26" viewBox="0 0 46 46" fill="none">
                  <path
                    d="M4 26 L42 8 L30 40 L22 28 Z"
                    stroke="currentColor"
                    strokeWidth="2.6"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className={styles.envEdge} />
            </div>

            <motion.p
              className={styles.openHint}
              initial={false}
              animate={
                phase === "sealed"
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 8 }
              }
              transition={{ duration: 0.4, ease: gravitationalEase }}
            >
              Break the seal
            </motion.p>

            <div className={styles.sealArea}>
              {phase === "sealed" && !skipTheater ? (
                <span className={styles.sealPulse} aria-hidden="true" />
              ) : null}
              {SEAL_SPARKS.map((spark, index) =>
                sealCracked && !skipTheater ? (
                  <motion.span
                    key={index}
                    className={styles.sealSpark}
                    initial={{ opacity: 0, x: 0, y: 0, scale: 0.4 }}
                    animate={{
                      opacity: [0, 1, 0],
                      x: spark.x,
                      y: spark.y,
                      scale: [0.4, 1, 0.5],
                    }}
                    transition={{ duration: 0.65, ease: gravitationalEase }}
                  />
                ) : null,
              )}
              {!skipTheater ? (
                <button
                  type="button"
                  className={styles.seal}
                  onClick={runSequence}
                  disabled={sealCracked}
                  tabIndex={sealCracked ? -1 : 0}
                  aria-label="Break the wax seal and open the letter"
                  aria-hidden={sealCracked}
                >
                  <motion.span
                    className={`${styles.sealHalf} ${styles.sealHalfLeft}`}
                    initial={false}
                    animate={
                      sealCracked
                        ? { x: -34, y: 24, rotate: -30, opacity: 0 }
                        : { x: 0, y: 0, rotate: 0, opacity: 1 }
                    }
                    transition={{
                      default: { type: "spring", stiffness: 280, damping: 19, mass: 0.7 },
                      opacity: { duration: 0.4, delay: sealCracked ? 0.18 : 0 },
                    }}
                  >
                    <span className={styles.sealFace}>YK</span>
                  </motion.span>
                  <motion.span
                    className={`${styles.sealHalf} ${styles.sealHalfRight}`}
                    initial={false}
                    animate={
                      sealCracked
                        ? { x: 34, y: 18, rotate: 26, opacity: 0 }
                        : { x: 0, y: 0, rotate: 0, opacity: 1 }
                    }
                    transition={{
                      default: { type: "spring", stiffness: 280, damping: 19, mass: 0.7 },
                      opacity: { duration: 0.4, delay: sealCracked ? 0.18 : 0 },
                    }}
                  >
                    <span className={styles.sealFace}>YK</span>
                  </motion.span>
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
