"use client";

import { MotionConfig } from "motion/react";

import { slowRevealTransition } from "@/lib/motion/presets";

export function MotionSystemProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <MotionConfig reducedMotion="user" transition={slowRevealTransition}>
      {children}
    </MotionConfig>
  );
}
