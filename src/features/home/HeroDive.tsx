"use client";

import { useEffect, useRef } from "react";

/** The elements whose styles read `--dive` (see the hero dive in globals.css). */
const DIVE_TARGETS =
  ".home-hero-media, .home-hero-orbit, .home-dark-hero-section, .home-light-hero-section";

/**
 * Scroll-linked hero exit. Publishes how far the hero has scrolled away as
 * `--dive` (0 to 1); `globals.css` turns that into the camera pushing toward
 * the singularity while the copy lifts away. Renders nothing visible and
 * stays inert for reduced-motion users.
 *
 * Kept cheap because it runs on every scroll frame:
 *  - `--dive` is written straight onto the few elements that use it and is
 *    registered as non-inherited, so the browser restyles those elements
 *    instead of the whole hero subtree.
 *  - The hero's height is measured when its size changes, not per frame, and
 *    the scroll offset comes from the scroll event, so a frame never forces
 *    a layout. Once the hero is fully scrolled away, frames do nothing.
 */
export function HeroDive() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = ref.current?.closest("section");
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const targets = Array.from(section.querySelectorAll<HTMLElement>(DIVE_TARGETS));
    let frame = 0;
    let last = -1;
    let height = section.offsetHeight || 1;
    let scrollY = window.scrollY;

    const apply = () => {
      frame = 0;
      const progress = Math.min(1, Math.max(0, scrollY / height));
      if (Math.abs(progress - last) < 0.002) return;
      last = progress;
      const value = progress.toFixed(3);
      for (const target of targets) target.style.setProperty("--dive", value);
    };

    const schedule = () => {
      if (frame === 0) frame = window.requestAnimationFrame(apply);
    };

    const onScroll = () => {
      scrollY = window.scrollY;
      schedule();
    };

    // Layout is fresh when a resize observer runs, so reading it here is free.
    const resizeObserver = new ResizeObserver(() => {
      height = section.offsetHeight || 1;
      scrollY = window.scrollY;
      schedule();
    });

    apply();
    resizeObserver.observe(section, { box: "border-box" });
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      if (frame !== 0) window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      for (const target of targets) target.style.removeProperty("--dive");
    };
  }, []);

  return <span ref={ref} hidden />;
}
