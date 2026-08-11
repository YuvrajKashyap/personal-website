"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

import { MAIL_SENT_EVENT, type MailSentDetail } from "@/features/mail/mail-events";
import { orbitalEase } from "@/lib/motion/presets";

import styles from "./MailPage.module.css";

type Flight = Readonly<{
  id: number;
  x: number;
  y: number;
}>;

/**
 * Fixed overlay that launches a paper plane from wherever a signup landed and
 * flies it up and off the top-right of the viewport, trailing a soft glow.
 */
export function PaperPlaneOverlay() {
  const shouldReduceMotion = useReducedMotion();
  const [flight, setFlight] = useState<Flight | null>(null);

  useEffect(() => {
    if (shouldReduceMotion) {
      return undefined;
    }

    const handleSent = (event: Event) => {
      const detail = (event as CustomEvent<MailSentDetail>).detail;
      setFlight({
        id: Date.now(),
        x: detail?.x ?? window.innerWidth / 2,
        y: detail?.y ?? window.innerHeight / 2,
      });
    };

    window.addEventListener(MAIL_SENT_EVENT, handleSent);
    return () => window.removeEventListener(MAIL_SENT_EVENT, handleSent);
  }, [shouldReduceMotion]);

  useEffect(() => {
    if (!flight) {
      return undefined;
    }

    const timer = window.setTimeout(() => setFlight(null), 2400);
    return () => window.clearTimeout(timer);
  }, [flight]);

  if (shouldReduceMotion) {
    return null;
  }

  const reachX = typeof window !== "undefined" ? window.innerWidth : 1200;

  return (
    <div className={styles.planeOverlay} aria-hidden="true">
      <AnimatePresence>
        {flight ? (
          <motion.div
            key={flight.id}
            className={styles.plane}
            initial={{ x: flight.x, y: flight.y, rotate: -32, scale: 0.5, opacity: 0 }}
            animate={{
              x: [flight.x, flight.x + 90, flight.x + 260, reachX + 180],
              y: [flight.y, flight.y - 130, flight.y - 110, flight.y - 340],
              rotate: [-32, 4, -6, 8],
              scale: [0.5, 1, 1, 0.85],
              opacity: [0, 1, 1, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 2.1,
              times: [0, 0.22, 0.5, 1],
              ease: orbitalEase,
            }}
          >
            <svg width="46" height="46" viewBox="0 0 46 46" fill="none">
              <path
                d="M2 24 L44 4 L30 42 L22 28 Z"
                fill="var(--accent)"
                stroke="var(--accent-strong)"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
              <path d="M44 4 L22 28 L22 36 L27 30" fill="var(--accent-muted)" />
            </svg>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
