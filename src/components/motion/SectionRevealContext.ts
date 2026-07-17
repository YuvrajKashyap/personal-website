"use client";

import { createContext, useContext } from "react";

/**
 * Section-level reveal signal. `null` means "no section is driving reveals"
 * (components fall back to their own per-element `whileInView` trigger). A
 * boolean means a surrounding section controls reveals: `true` while any part
 * of the section is on screen, `false` once it has fully left — so nothing
 * disappears while you are still inside the section.
 */
export const SectionRevealContext = createContext<boolean | null>(null);

export function useSectionReveal(): boolean | null {
  return useContext(SectionRevealContext);
}
