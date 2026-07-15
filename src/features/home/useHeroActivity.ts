"use client";

import { useEffect, useState, type RefObject } from "react";

const HERO_SELECTOR = ".home-hero, .home-light-hero";

export function useHeroActivity<T extends HTMLElement>(
  elementRef: RefObject<T | null>,
) {
  const [isHeroActive, setIsHeroActive] = useState(true);

  useEffect(() => {
    const hero = elementRef.current?.closest<HTMLElement>(HERO_SELECTOR);

    if (!hero) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isActive = entry.isIntersecting;
        hero.dataset.heroActivity = isActive ? "active" : "paused";
        setIsHeroActive(isActive);
      },
      { threshold: 0.01 },
    );

    observer.observe(hero);

    return () => {
      observer.disconnect();
    };
  }, [elementRef]);

  return isHeroActive;
}
