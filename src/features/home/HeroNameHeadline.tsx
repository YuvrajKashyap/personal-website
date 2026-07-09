"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

import { homeContent } from "@/features/home/home-content";

type HeroNameHeadlineProps = {
  className?: string;
};

export function HeroNameHeadline({ className }: HeroNameHeadlineProps) {
  const lockupRef = useRef<HTMLHeadingElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) {
      return undefined;
    }

    let animationFrame = 0;

    const resetInteraction = () => {
      const lockup = lockupRef.current;

      if (!lockup) {
        return;
      }

      lockup.style.setProperty("--hero-name-proximity", "0");
      lockup.style.setProperty("--hero-name-glow-x", "50%");
      lockup.style.setProperty("--hero-name-glow-y", "50%");
      lockup.style.setProperty("--hero-name-lustre-x", "50%");
      lockup.style.setProperty("--hero-name-sheen-offset", "0%");
      lockup.style.setProperty("--hero-name-shift-x", "0px");
      lockup.style.setProperty("--hero-name-shift-y", "0px");
    };

    const handlePointerMove = (event: PointerEvent) => {
      window.cancelAnimationFrame(animationFrame);

      animationFrame = window.requestAnimationFrame(() => {
        const lockup = lockupRef.current;

        if (!lockup) {
          return;
        }

        const rect = lockup.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distance = Math.hypot(event.clientX - centerX, event.clientY - centerY);
        const maxDistance = Math.max(rect.width * 0.92, 360);
        const proximity = Math.max(0, Math.min(1, 1 - distance / maxDistance));
        const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
        const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
        const shiftX = (x - 0.5) * proximity * 8;
        const shiftY = (y - 0.5) * proximity * 6;

        lockup.style.setProperty("--hero-name-proximity", proximity.toFixed(3));
        lockup.style.setProperty("--hero-name-glow-x", `${(x * 100).toFixed(1)}%`);
        lockup.style.setProperty("--hero-name-glow-y", `${(y * 100).toFixed(1)}%`);
        lockup.style.setProperty("--hero-name-lustre-x", `${(x * 100).toFixed(1)}%`);
        lockup.style.setProperty("--hero-name-sheen-offset", `${((x - 0.5) * 34).toFixed(1)}%`);
        lockup.style.setProperty("--hero-name-shift-x", `${shiftX.toFixed(2)}px`);
        lockup.style.setProperty("--hero-name-shift-y", `${shiftY.toFixed(2)}px`);
      });
    };

    const handlePointerOut = (event: PointerEvent) => {
      if (!event.relatedTarget) {
        resetInteraction();
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerout", handlePointerOut, { passive: true });

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerout", handlePointerOut);
    };
  }, [shouldReduceMotion]);

  return (
    <h1
      aria-label={homeContent.headline.label}
      className={`hero-name-lockup${className ? ` ${className}` : ""}`}
      ref={lockupRef}
    >
      <span className="visually-hidden">{homeContent.headline.label}</span>
      {homeContent.headline.lines.map((line, index) => (
        <span
          aria-hidden="true"
          className={`hero-name-line${index === 0 ? " hero-name-line-yuvraj" : ""}`}
          key={line}
        >
          {line}
        </span>
      ))}
    </h1>
  );
}
