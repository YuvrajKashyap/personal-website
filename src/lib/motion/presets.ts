import type { Transition, Variants } from "motion/react";

export const gravitationalEase = [0.16, 1, 0.3, 1] as const;
export const orbitalEase = [0.22, 0.8, 0.28, 1] as const;
export const signalEase = [0.4, 0, 0.2, 1] as const;

export const softSpring: Transition = {
  type: "spring",
  stiffness: 180,
  damping: 24,
  mass: 0.9,
};

export const slowRevealTransition: Transition = {
  duration: 0.72,
  ease: gravitationalEase,
};

export const fastInteractionTransition: Transition = {
  duration: 0.18,
  ease: signalEase,
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.08,
    },
  },
};

export const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 18,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

export const fadeIn: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
};

export const scaleSoft: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.975,
  },
  visible: {
    opacity: 1,
    scale: 1,
  },
};

export const blurIn: Variants = {
  hidden: {
    opacity: 0,
    filter: "blur(8px)",
    y: 12,
  },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
  },
};

export const orbitalNodeReveal: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: (index: number = 0) => ({
    opacity: 1,
    transition: {
      ...slowRevealTransition,
      delay: 0.28 + index * 0.045,
    },
  }),
};

export const orbitalLineReveal: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.9,
      ease: orbitalEase,
      delay: 0.2,
    },
  },
};

export const chipReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
    scale: 0.985,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
};

export const ctaReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

export const scrollCueMotion = {
  initial: {
    opacity: 0,
    y: 8,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  pulse: {
    opacity: [0.45, 1, 0.45],
    y: [0, 7, 0],
  },
};

export const reducedMotionReveal: Variants = {
  hidden: {
    opacity: 1,
    filter: "none",
    scale: 1,
    y: 0,
  },
  visible: {
    opacity: 1,
    filter: "none",
    scale: 1,
    y: 0,
  },
};

export function getRevealTransition(delay = 0): Transition {
  return {
    ...slowRevealTransition,
    delay,
  };
}
