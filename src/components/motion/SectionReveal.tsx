"use client";

import { useInView } from "motion/react";
import { useRef, type ReactNode } from "react";

import { SectionRevealContext } from "@/components/motion/SectionRevealContext";

type SectionRevealProps = Readonly<{
  children: ReactNode;
  className?: string;
}>;

/**
 * Wraps a section's content and broadcasts a single in-view signal to every
 * reveal inside it. All descendant reveals animate in together when the
 * section scrolls into view and out together once it has fully left — so no
 * individual element vanishes while you are still reading the section. The
 * bottom margin holds the trigger just inside the viewport so content isn't
 * revealed before it's actually on screen.
 */
export function SectionReveal({ children, className }: SectionRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const active = useInView(ref, {
    amount: "some",
    margin: "0px 0px -12% 0px",
  });

  return (
    <div
      ref={ref}
      className={className}
      data-section-reveal-active={active ? "true" : "false"}
    >
      <SectionRevealContext.Provider value={active}>
        {children}
      </SectionRevealContext.Provider>
    </div>
  );
}
