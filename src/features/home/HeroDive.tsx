"use client";

import { useEffect, useRef } from "react";

/**
 * Scroll-linked hero exit. Publishes how far the hero has scrolled away as
 * `--dive` (0 to 1) on the surrounding section; `globals.css` turns that into
 * the camera pushing toward the singularity while the copy lifts away.
 * Renders nothing visible and stays inert for reduced-motion users.
 */
export function HeroDive() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = ref.current?.closest("section");
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let last = -1;

    const apply = () => {
      frame = 0;
      const height = section.offsetHeight || 1;
      const progress = Math.min(1, Math.max(0, window.scrollY / height));
      if (Math.abs(progress - last) < 0.002) return;
      last = progress;
      section.style.setProperty("--dive", progress.toFixed(3));
    };

    const onScroll = () => {
      if (frame === 0) frame = window.requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (frame !== 0) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      section.style.removeProperty("--dive");
    };
  }, []);

  return <span ref={ref} hidden />;
}
