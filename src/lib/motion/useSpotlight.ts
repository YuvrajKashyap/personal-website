"use client";

import type { PointerEvent } from "react";

export function useSpotlight() {
  function onPointerMove(event: PointerEvent<HTMLElement>) {
    if (event.pointerType !== "mouse") {
      return;
    }

    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    target.style.setProperty("--spotlight-x", `${x.toFixed(1)}%`);
    target.style.setProperty("--spotlight-y", `${y.toFixed(1)}%`);
  }

  function onPointerLeave(event: PointerEvent<HTMLElement>) {
    event.currentTarget.style.setProperty("--spotlight-x", "50%");
    event.currentTarget.style.setProperty("--spotlight-y", "50%");
  }

  return { onPointerMove, onPointerLeave };
}
