"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useId, useState } from "react";

import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { siteConfig } from "@/config/site";
import type { NavItem } from "@/types/site";

function isNavItemActive(item: NavItem, pathname: string) {
  if (item.href === "/") {
    return pathname === "/";
  }

  if (item.href === "/projects") {
    return pathname === "/projects" || pathname.startsWith("/projects/");
  }

  return pathname === item.href;
}

function navLinkClassName(item: NavItem, isActive: boolean) {
  const baseClass = item.cta ? "nav-cta" : "nav-link";

  return isActive ? `${baseClass} nav-link-active` : baseClass;
}

export function SiteNavigation() {
  const pathname = usePathname();
  const menuId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const primaryItems = siteConfig.navItems.filter((item) => !item.cta);
  const ctaItem = siteConfig.navItems.find((item) => item.cta);

  return (
    <div className="flex items-center gap-3">
      <nav
        aria-label="Primary navigation"
        className="hidden items-center gap-1 lg:flex"
      >
        {primaryItems.map((item) => {
          const isActive = isNavItemActive(item, pathname);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={navLinkClassName(item, isActive)}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="hidden items-center gap-3 lg:flex">
        <ThemeToggle />
        {ctaItem ? (
          <Link
            href={ctaItem.href}
            aria-current={isNavItemActive(ctaItem, pathname) ? "page" : undefined}
            className={navLinkClassName(
              ctaItem,
              isNavItemActive(ctaItem, pathname),
            )}
          >
            {ctaItem.label}
          </Link>
        ) : null}
      </div>

      <div className="flex items-center gap-2 lg:hidden">
        <ThemeToggle />
        <button
          type="button"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          aria-controls={menuId}
          onClick={() => setIsOpen((current) => !current)}
          className="focus-ring inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-border bg-surface-glass text-foreground shadow-[var(--shadow-soft)]"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.8"
          >
            {isOpen ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M5 7h14M5 12h14M5 17h14" />
            )}
          </svg>
        </button>
      </div>

      <div
        id={menuId}
        className={`mobile-menu-panel lg:hidden ${isOpen ? "block" : "hidden"}`}
      >
        <nav aria-label="Mobile primary navigation" className="stack-sm">
          {siteConfig.navItems.map((item) => {
            const isActive = isNavItemActive(item, pathname);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={navLinkClassName(item, isActive)}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
