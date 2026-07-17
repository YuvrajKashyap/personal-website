"use client";

import dynamic from "next/dynamic";

/**
 * Defers the canvas hologram's chunk out of the initial bundle. The component
 * is below the fold, renders an empty canvas until its in-view boot sequence
 * runs, and has no server-rendered output, so deferring it is invisible.
 */
export const ContactSignalLazy = dynamic(
  () =>
    import("@/features/home/ContactSignal").then(
      (module) => module.ContactSignal,
    ),
  { ssr: false },
);
