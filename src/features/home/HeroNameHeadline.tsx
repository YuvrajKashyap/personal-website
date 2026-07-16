"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

import { homeContent } from "@/features/home/home-content";
import { useHeroActivity } from "@/features/home/useHeroActivity";

type HeroNameHeadlineProps = {
  className?: string;
};

export function HeroNameHeadline({ className }: HeroNameHeadlineProps) {
  const lockupRef = useRef<HTMLHeadingElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const isHeroActive = useHeroActivity(lockupRef);

  useEffect(() => {
    let animationFrame = 0;

    const resetInteraction = () => {
      const lockup = lockupRef.current;

      if (!lockup) {
        return;
      }

      lockup.style.setProperty("--hero-name-proximity", "0");
      lockup.style.setProperty("--hero-name-hover", "0");
      lockup.style.setProperty("--hero-name-glow-x", "50%");
      lockup.style.setProperty("--hero-name-glow-y", "50%");
      lockup.style.setProperty("--hero-name-lustre-x", "50%");
      lockup.style.setProperty("--hero-name-lustre-y", "50%");
      lockup.style.setProperty("--hero-name-sheen-offset", "0%");
      lockup.style.setProperty("--hero-name-shift-x", "0px");
      lockup.style.setProperty("--hero-name-shift-y", "0px");

      lockup.querySelectorAll<HTMLElement>(".hero-name-line").forEach((line) => {
        line.style.setProperty("--hero-name-light-x", "50%");
        line.style.setProperty("--hero-name-light-y", "50%");
      });
    };

    if (shouldReduceMotion || !isHeroActive) {
      resetInteraction();
      return undefined;
    }

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
        const localX = Math.max(
          0,
          Math.min(1, (event.clientX - rect.left) / rect.width),
        );
        const localY = Math.max(
          0,
          Math.min(1, (event.clientY - rect.top) / rect.height),
        );
        const viewportX = Math.max(
          0,
          Math.min(1, event.clientX / window.innerWidth),
        );
        const viewportY = Math.max(
          0,
          Math.min(1, event.clientY / window.innerHeight),
        );
        const isHovered =
          event.clientX >= rect.left &&
          event.clientX <= rect.right &&
          event.clientY >= rect.top &&
          event.clientY <= rect.bottom;
        const shiftX = (localX - 0.5) * proximity * 8;
        const shiftY = (localY - 0.5) * proximity * 6;

        lockup.querySelectorAll<HTMLElement>(".hero-name-line").forEach((line) => {
          const lineRect = line.getBoundingClientRect();
          const lightX = (event.clientX - lineRect.left) / lineRect.width;
          const lightY = (event.clientY - lineRect.top) / lineRect.height;

          line.style.setProperty(
            "--hero-name-light-x",
            `${(lightX * 100).toFixed(1)}%`,
          );
          line.style.setProperty(
            "--hero-name-light-y",
            `${(lightY * 100).toFixed(1)}%`,
          );
        });

        lockup.style.setProperty("--hero-name-proximity", proximity.toFixed(3));
        lockup.style.setProperty("--hero-name-hover", isHovered ? "1" : "0");
        lockup.style.setProperty(
          "--hero-name-glow-x",
          `${(localX * 100).toFixed(1)}%`,
        );
        lockup.style.setProperty(
          "--hero-name-glow-y",
          `${(localY * 100).toFixed(1)}%`,
        );
        lockup.style.setProperty(
          "--hero-name-lustre-x",
          `${(viewportX * 100).toFixed(1)}%`,
        );
        lockup.style.setProperty(
          "--hero-name-lustre-y",
          `${(viewportY * 100).toFixed(1)}%`,
        );
        lockup.style.setProperty(
          "--hero-name-sheen-offset",
          `${((viewportX - 0.5) * 34).toFixed(1)}%`,
        );
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
  }, [isHeroActive, shouldReduceMotion]);

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
          data-text={line}
          key={line}
        >
          {line}
        </span>
      ))}
    </h1>
  );
}
