"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";

import type { OrbitalDestination } from "@/types/site";

type OrbitalNavigationProps = {
  items: readonly OrbitalDestination[];
  variant: "dark" | "light";
  className?: string;
  eyebrow?: string;
  title?: string;
};

type OrbitalPosition = {
  x: string;
  y: string;
  ring: "inner" | "outer";
};

type OrbitalNodeStyle = CSSProperties & {
  "--orbital-x": string;
  "--orbital-y": string;
};

const orbitalPositions: OrbitalPosition[] = [
  { x: "52%", y: "14%", ring: "outer" },
  { x: "78%", y: "28%", ring: "outer" },
  { x: "82%", y: "58%", ring: "outer" },
  { x: "52%", y: "82%", ring: "outer" },
  { x: "22%", y: "66%", ring: "outer" },
  { x: "18%", y: "34%", ring: "outer" },
  { x: "50%", y: "50%", ring: "inner" },
];

function isDestinationActive(destination: OrbitalDestination, pathname: string) {
  if (destination.href === "/projects") {
    return pathname === "/projects" || pathname.startsWith("/projects/");
  }

  return pathname === destination.href;
}

function getNodeClassName(destination: OrbitalDestination, isActive: boolean) {
  return [
    "orbital-navigation__node",
    destination.cta ? "orbital-navigation__node--cta" : "",
    isActive ? "orbital-navigation__node--active" : "",
  ]
    .filter(Boolean)
    .join(" ");
}

export function OrbitalNavigation({
  items,
  variant,
  className,
  eyebrow = "Destination Map",
  title = "Explore the system",
}: OrbitalNavigationProps) {
  const pathname = usePathname();
  const classNames = ["orbital-navigation", className]
    .filter(Boolean)
    .join(" ");

  return (
    <nav
      className={classNames}
      data-variant={variant}
      aria-label="Home hero destination navigation"
    >
      <div className="orbital-navigation__header">
        <p className="orbital-navigation__eyebrow">{eyebrow}</p>
        <p className="orbital-navigation__title">{title}</p>
      </div>

      <div className="orbital-navigation__map" aria-hidden="false">
        <svg
          className="orbital-navigation__svg"
          viewBox="0 0 420 420"
          fill="none"
          aria-hidden="true"
        >
          <circle className="orbital-navigation__ring" cx="210" cy="210" r="132" />
          <circle
            className="orbital-navigation__ring orbital-navigation__ring--outer"
            cx="210"
            cy="210"
            r="174"
            strokeDasharray="3 18"
          />
          <path
            className="orbital-navigation__arc"
            d="M66 238C102 120 226 54 344 98"
            strokeLinecap="round"
          />
          <path
            className="orbital-navigation__arc orbital-navigation__arc--soft"
            d="M86 310C164 382 290 374 354 292"
            strokeLinecap="round"
          />
          <line className="orbital-navigation__axis" x1="210" y1="52" x2="210" y2="368" />
          <line className="orbital-navigation__axis" x1="52" y1="210" x2="368" y2="210" />
          <circle className="orbital-navigation__core" cx="210" cy="210" r="9" />
        </svg>

        <div className="orbital-navigation__nodes">
          {items.map((item, index) => {
            const position = orbitalPositions[index] ?? orbitalPositions[0];
            const isActive = isDestinationActive(item, pathname);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                aria-label={`${item.label}: ${item.description}`}
                className={getNodeClassName(item, isActive)}
                data-ring={position.ring}
                style={{
                  "--orbital-x": position.x,
                  "--orbital-y": position.y,
                } as OrbitalNodeStyle}
              >
                <span className="orbital-navigation__code">{item.code}</span>
                <span className="orbital-navigation__label">{item.label}</span>
                <span className="orbital-navigation__description">
                  {item.description}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="orbital-navigation__mobile" aria-label="Destination links">
        {items.map((item) => {
          const isActive = isDestinationActive(item, pathname);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={[
                "orbital-navigation__mobile-link",
                item.cta ? "orbital-navigation__mobile-link--cta" : "",
                isActive ? "orbital-navigation__mobile-link--active" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <span>{item.code}</span>
              <span>
                <strong>{item.label}</strong>
                <small>{item.description}</small>
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
