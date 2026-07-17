"use client";

import { useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

type TypeInViewProps = Readonly<{
  text: string;
  className?: string;
  /** Base delay per character in ms; a little jitter is added for feel. */
  speed?: number;
  /** Delay before typing starts once in view, in ms. */
  delay?: number;
}>;

/**
 * Types its text character-by-character the first time it scrolls into view,
 * with a blinking caret that fades out once the line completes. Layout space
 * is reserved up front so nothing reflows while typing.
 */
export function TypeInView({
  text,
  className,
  speed = 26,
  delay = 120,
}: TypeInViewProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const inView = useInView(ref, { once: false, amount: 0.6 });
  const [count, setCount] = useState(0);
  const done = count >= text.length;
  const [caretVisible, setCaretVisible] = useState(true);

  // When the line scrolls out of view, reset so it re-types from scratch the
  // next time it comes back. Adjusting state during render (guarded by the
  // previous in-view value) is React's sanctioned pattern for this — an effect
  // would flash the fully-typed line for a frame before clearing.
  const [wasInView, setWasInView] = useState(inView);
  if (wasInView !== inView) {
    setWasInView(inView);
    if (!inView && count !== 0) {
      setCount(0);
      setCaretVisible(true);
    }
  }

  useEffect(() => {
    if (!inView || shouldReduceMotion) {
      return undefined;
    }

    let index = 0;
    let timeout: ReturnType<typeof setTimeout>;

    function tick() {
      index += 1;
      setCount(index);

      if (index < text.length) {
        timeout = setTimeout(tick, speed + Math.random() * speed * 1.4);
      }
    }

    timeout = setTimeout(tick, delay);

    return () => clearTimeout(timeout);
  }, [inView, shouldReduceMotion, text, speed, delay]);

  useEffect(() => {
    if (!done) {
      return undefined;
    }

    const timeout = setTimeout(() => setCaretVisible(false), 1400);
    return () => clearTimeout(timeout);
  }, [done]);

  if (shouldReduceMotion) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span ref={ref} className={`type-in-view ${className ?? ""}`}>
      <span className="type-in-view-ghost" aria-hidden="true">
        {text}
      </span>
      <span className="scroll-read-sr">{text}</span>
      <span className="type-in-view-live" aria-hidden="true">
        {text.slice(0, count)}
        {caretVisible ? <span className="type-caret" /> : null}
      </span>
    </span>
  );
}
