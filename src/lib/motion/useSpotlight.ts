"use client";

import type { PointerEvent } from "react";

/** Peak lean, in degrees, when the cursor reaches a card's edge. */
const MAX_TILT = 3.4;

/**
 * Cursor-reactive card surface. Writes the spotlight position and a small
 * perspective lean as CSS custom properties, so the styling stays in
 * `globals.css` and nothing re-renders while the pointer moves.
 */
export function useSpotlight() {
  function onPointerMove(event: PointerEvent<HTMLElement>) {
    if (event.pointerType !== "mouse") {
      return;
    }

    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    const ratioX = (event.clientX - rect.left) / rect.width;
    const ratioY = (event.clientY - rect.top) / rect.height;

    target.style.setProperty("--spotlight-x", `${(ratioX * 100).toFixed(1)}%`);
    target.style.setProperty("--spotlight-y", `${(ratioY * 100).toFixed(1)}%`);
    target.style.setProperty(
      "--tilt-x",
      `${((0.5 - ratioY) * 2 * MAX_TILT).toFixed(2)}deg`,
    );
    target.style.setProperty(
      "--tilt-y",
      `${((ratioX - 0.5) * 2 * MAX_TILT).toFixed(2)}deg`,
    );
  }

  function onPointerLeave(event: PointerEvent<HTMLElement>) {
    const target = event.currentTarget;
    target.style.setProperty("--spotlight-x", "50%");
    target.style.setProperty("--spotlight-y", "50%");
    target.style.setProperty("--tilt-x", "0deg");
    target.style.setProperty("--tilt-y", "0deg");
  }

  return { onPointerMove, onPointerLeave };
}
