"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import Image from "next/image";
import type { PointerEvent } from "react";

const TILT_SPRING = { stiffness: 220, damping: 22, mass: 0.6 };

/**
 * Interactive portrait: tilts in 3D toward the cursor with a specular glare
 * that tracks the pointer, and settles flat when the pointer leaves.
 */
export function AboutPortrait() {
  const shouldReduceMotion = useReducedMotion();

  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);

  const rotateX = useSpring(
    useTransform(pointerY, [0, 1], [8, -8]),
    TILT_SPRING,
  );
  const rotateY = useSpring(
    useTransform(pointerX, [0, 1], [-10, 10]),
    TILT_SPRING,
  );
  const glareX = useTransform(pointerX, (value) => `${value * 100}%`);
  const glareY = useTransform(pointerY, (value) => `${value * 100}%`);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgb(255 244 214 / 0.22), transparent 55%)`;

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - bounds.left) / bounds.width);
    pointerY.set((event.clientY - bounds.top) / bounds.height);
  }

  function onPointerLeave() {
    pointerX.set(0.5);
    pointerY.set(0.5);
  }

  const image = (
    <Image
      src="/media/portrait/yuvraj-worlds-fair.webp"
      alt="Yuvraj Kashyap"
      width={1080}
      height={1350}
      sizes="(max-width: 960px) 90vw, 27rem"
      className="about-portrait-image"
    />
  );

  if (shouldReduceMotion) {
    return <div className="about-portrait-frame">{image}</div>;
  }

  return (
    <motion.div
      className="about-portrait-frame"
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      whileHover={{ scale: 1.025 }}
      transition={{ type: "spring", ...TILT_SPRING }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {image}
      <motion.span
        className="about-portrait-glare"
        style={{ background: glare }}
        aria-hidden="true"
      />
    </motion.div>
  );
}
