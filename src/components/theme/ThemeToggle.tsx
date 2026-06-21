"use client";

import { useTheme } from "@/components/theme/useTheme";

function MoonIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="theme-toggle__icon"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    >
      <path d="M20.5 15.5A8.5 8.5 0 0 1 8.5 3.5 7 7 0 1 0 20.5 15.5Z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="theme-toggle__icon"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    >
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 2.8v2.1M12 19.1v2.1M4.2 4.2l1.5 1.5M18.3 18.3l1.5 1.5M2.8 12h2.1M19.1 12h2.1M4.2 19.8l1.5-1.5M18.3 5.7l1.5-1.5" />
    </svg>
  );
}

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const nextThemeLabel = isDark ? "light" : "dark";
  const currentThemeLabel = isDark ? "Dark" : "Light";

  return (
    <div className="theme-toggle" data-theme-state={theme}>
      <button
        type="button"
        aria-label={`Switch to ${nextThemeLabel} mode`}
        onClick={toggleTheme}
        className="theme-toggle__button focus-ring"
        title={`Switch to ${nextThemeLabel} mode`}
      >
        <span className="theme-toggle__thumb" aria-hidden="true" />
        <span
          className="theme-toggle__option theme-toggle__option--dark"
          aria-hidden="true"
        >
          <MoonIcon />
        </span>
        <span
          className="theme-toggle__option theme-toggle__option--light"
          aria-hidden="true"
        >
          <SunIcon />
        </span>
      </button>
      <span className="theme-toggle__label" aria-hidden="true">
        {currentThemeLabel}
      </span>
    </div>
  );
}
