"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

import styles from "./MailPage.module.css";

type MobileSignupDockProps = Readonly<{
  confirmed?: boolean;
}>;

/**
 * Phone-only floating dock: one thumb tap scrolls to the (auto-opened) letter
 * and focuses the email field. Hides itself whenever the letter is already on
 * screen, and never renders on desktop or for confirmed subscribers.
 */
export function MobileSignupDock({ confirmed = false }: MobileSignupDockProps) {
  const shouldReduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const [ready, setReady] = useState(false);
  const [letterVisible, setLetterVisible] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 1200);
    return () => window.clearTimeout(timer);
  }, []);

  // The envelope peeks into the first viewport on phones, so intersection
  // alone would hide the dock forever. Instead: the dock yields only once the
  // letter's CENTER is on screen (i.e. the form is genuinely reachable).
  useEffect(() => {
    if (!isMobile) {
      return undefined;
    }

    let frame = 0;

    const check = () => {
      frame = 0;
      const letter = document.getElementById("the-letter");

      if (!letter) {
        return;
      }

      // The dock yields once the actual email field is genuinely reachable
      // on screen — not merely when the envelope's top edge peeks into the
      // viewport. Until Kit's field exists, the dock stays.
      const input = document.getElementById("yuv-got-mail-email");

      if (!input) {
        setLetterVisible(false);
        return;
      }

      const rect = input.getBoundingClientRect();
      setLetterVisible(rect.top < window.innerHeight - 96 && rect.bottom > 0);
    };

    const request = () => {
      if (!frame) {
        frame = window.requestAnimationFrame(check);
      }
    };

    check();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request, { passive: true });
    // Kit injects the field asynchronously with no scroll to re-trigger the
    // check, so poll gently as a backstop (one rect read per tick).
    const interval = window.setInterval(check, 900);

    return () => {
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      window.clearInterval(interval);
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, [isMobile]);

  const show = isMobile && ready && !letterVisible && !confirmed;

  const handleTap = () => {
    document.getElementById("the-letter")?.scrollIntoView({
      behavior: shouldReduceMotion ? "auto" : "smooth",
      block: "center",
    });

    // Focus the field once the letter has finished presenting (the envelope
    // auto-opens as it scrolls into view). Best effort: some mobile browsers
    // ignore async focus, in which case the field is right there anyway.
    const tryFocus = (attempt: number) => {
      const presented = document.querySelector('[data-phase="presented"]');
      const input = document.getElementById(
        "yuv-got-mail-email",
      ) as HTMLInputElement | null;

      if (presented && input) {
        input.focus({ preventScroll: true });
        return;
      }

      if (attempt < 14) {
        window.setTimeout(() => tryFocus(attempt + 1), 300);
      }
    };

    window.setTimeout(() => tryFocus(0), 650);
  };

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          className={styles.mobileDock}
          initial={shouldReduceMotion ? false : { y: 88, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={
            shouldReduceMotion ? { opacity: 0 } : { y: 88, opacity: 0 }
          }
          transition={{ type: "spring", stiffness: 300, damping: 26, mass: 0.8 }}
        >
          <button
            type="button"
            className={styles.mobileDockButton}
            onClick={handleTap}
          >
            <span className={styles.mobileDockSeal} aria-hidden="true">
              YK
            </span>
            join the letter
            <svg
              width="20"
              height="20"
              viewBox="0 0 46 46"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M2 24 L44 4 L30 42 L22 28 Z"
                fill="var(--accent)"
                stroke="var(--accent-strong)"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
