"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import { NavCallouts } from "@/components/layout/NavCallouts";
import { CursorTrailToggle } from "@/components/theme/CursorTrailToggle";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { siteConfig } from "@/config/site";
import type { NavItem } from "@/types/site";

const MotionLink = motion.create(Link);

const activePillSpring = {
  type: "spring",
  stiffness: 380,
  damping: 32,
} as const;

const hoverGhostSpring = {
  type: "spring",
  stiffness: 560,
  damping: 40,
} as const;

const capsuleVariants = {
  hidden: { opacity: 0, y: -18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 220,
      damping: 26,
      delayChildren: 0.16,
      staggerChildren: 0.05,
    },
  },
};

const navItemVariants = {
  hidden: { opacity: 0, y: -12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 340, damping: 26 },
  },
};

const actionsVariants = {
  hidden: { opacity: 0, y: -18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 220,
      damping: 26,
      delay: 0.34,
    },
  },
};

const panelVariants = {
  hidden: { opacity: 0, y: -14, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 320,
      damping: 28,
      delayChildren: 0.05,
      staggerChildren: 0.045,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.98,
    transition: { duration: 0.16, ease: "easeIn" as const },
  },
};

const panelItemVariants = {
  hidden: { opacity: 0, x: -14 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring" as const, stiffness: 340, damping: 27 },
  },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

const sectionIds = siteConfig.navItems
  .map((item) => item.href.split("#")[1])
  .filter((id): id is string => Boolean(id));

let sectionCache: Array<{ id: string; element: HTMLElement }> | null = null;

function getSections() {
  if (!sectionCache) {
    sectionCache = [];

    for (const id of sectionIds) {
      const element = document.getElementById(id);

      if (element) {
        sectionCache.push({ id, element });
      }
    }
  }

  return sectionCache;
}

function isNavItemActive(
  item: NavItem,
  pathname: string,
  activeSection: string,
) {
  const hashIndex = item.href.indexOf("#");

  if (hashIndex !== -1) {
    return pathname === "/" && activeSection === item.href.slice(hashIndex + 1);
  }

  if (item.href === "/") {
    return pathname === "/" && activeSection === "";
  }

  return pathname === item.href;
}

export function SiteNavigation() {
  const pathname = usePathname();
  const menuId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const { scrollY } = useScroll();
  const scrolledRef = useRef(false);
  const activeSectionRef = useRef("");
  const sectionThresholdsRef = useRef<Array<{ id: string; scrollY: number }>>(
    [],
  );

  const updateActiveSection = useCallback((scrollPosition: number) => {
    let nextSection = "";

    for (const section of sectionThresholdsRef.current) {
      if (scrollPosition >= section.scrollY) {
        nextSection = section.id;
      }
    }

    if (nextSection !== activeSectionRef.current) {
      activeSectionRef.current = nextSection;
      setActiveSection(nextSection);
    }
  }, []);

  useEffect(() => {
    sectionCache = null;
    let measureFrame = 0;

    const measureSections = () => {
      measureFrame = 0;

      if (pathname !== "/") {
        sectionThresholdsRef.current = [];

        if (activeSectionRef.current !== "") {
          activeSectionRef.current = "";
          setActiveSection("");
        }

        return;
      }

      const scrollPosition = window.scrollY;
      const viewportThreshold = window.innerHeight * 0.45;

      sectionThresholdsRef.current = getSections().map((section) => ({
        id: section.id,
        scrollY:
          section.element.getBoundingClientRect().top +
          scrollPosition -
          viewportThreshold,
      }));

      updateActiveSection(scrollPosition);
    };

    const scheduleMeasurement = () => {
      if (!measureFrame) {
        measureFrame = window.requestAnimationFrame(measureSections);
      }
    };

    scheduleMeasurement();

    if (pathname !== "/") {
      return () => window.cancelAnimationFrame(measureFrame);
    }

    const resizeObserver = new ResizeObserver(scheduleMeasurement);

    for (const section of getSections()) {
      resizeObserver.observe(section.element);
    }

    window.addEventListener("resize", scheduleMeasurement, { passive: true });

    return () => {
      window.cancelAnimationFrame(measureFrame);
      resizeObserver.disconnect();
      window.removeEventListener("resize", scheduleMeasurement);
    };
  }, [pathname, updateActiveSection]);

  useMotionValueEvent(scrollY, "change", (value) => {
    const nextScrolled = value > 24;

    if (nextScrolled !== scrolledRef.current) {
      scrolledRef.current = nextScrolled;
      setScrolled(nextScrolled);
    }

    if (pathname === "/") {
      updateActiveSection(value);
    }
  });

  const primaryItems = siteConfig.navItems;

  return (
    <div className="site-navigation" data-scrolled={scrolled || undefined}>
      <motion.nav
        aria-label="Primary navigation"
        className="site-navigation-primary nav-capsule"
        variants={capsuleVariants}
        initial="hidden"
        animate="visible"
        onPointerLeave={() => setHovered(null)}
      >
        {primaryItems.map((item) => {
          const isActive = isNavItemActive(item, pathname, activeSection);

          return (
            <MotionLink
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`nav-item${isActive ? " nav-item-active" : ""}`}
              variants={navItemVariants}
              onPointerEnter={() => setHovered(item.href)}
              onFocus={() => setHovered(item.href)}
              onBlur={() => setHovered(null)}
            >
              {hovered === item.href && !isActive ? (
                <motion.span
                  aria-hidden="true"
                  layoutId="nav-hover-ghost"
                  className="nav-item-ghost"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={hoverGhostSpring}
                />
              ) : null}
              {isActive ? (
                <motion.span
                  aria-hidden="true"
                  layoutId="nav-active-pill"
                  className="nav-item-pill"
                  transition={activePillSpring}
                />
              ) : null}
              <span className="nav-item-label">{item.label}</span>
            </MotionLink>
          );
        })}
      </motion.nav>

      <motion.div
        className="site-navigation-actions"
        variants={actionsVariants}
        initial="hidden"
        animate="visible"
      >
        <ThemeToggle />
        <CursorTrailToggle />
        <NavCallouts />
      </motion.div>

      <div className="site-navigation-mobile-actions">
        <NavCallouts variant="compact" />
        <ThemeToggle />
        <button
          type="button"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          aria-controls={menuId}
          onClick={() => setIsOpen((current) => !current)}
          className="mobile-menu-trigger focus-ring inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-border bg-surface-glass text-foreground shadow-[var(--shadow-soft)]"
        >
          <motion.svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.8"
          >
            <motion.path
              animate={{ d: isOpen ? "M6 6 L18 18" : "M5 7 L19 7" }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
            <motion.path
              d="M5 12 L19 12"
              animate={{ opacity: isOpen ? 0 : 1 }}
              transition={{ duration: 0.12 }}
            />
            <motion.path
              animate={{ d: isOpen ? "M6 18 L18 6" : "M5 17 L19 17" }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          </motion.svg>
        </button>
      </div>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            id={menuId}
            className="mobile-menu-panel xl:hidden"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ transformOrigin: "top right" }}
          >
            <nav aria-label="Mobile primary navigation" className="mobile-menu-list">
              {siteConfig.navItems.map((item, index) => {
                const isActive = isNavItemActive(item, pathname, activeSection);

                return (
                  <MotionLink
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`mobile-menu-link${isActive ? " mobile-menu-link-active" : ""}`}
                    variants={panelItemVariants}
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="mobile-menu-index" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="mobile-menu-label">{item.label}</span>
                    <span className="mobile-menu-arrow" aria-hidden="true">
                      &rarr;
                    </span>
                  </MotionLink>
                );
              })}
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
