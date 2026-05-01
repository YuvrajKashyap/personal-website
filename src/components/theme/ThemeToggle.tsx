"use client";

import { useTheme } from "@/components/theme/useTheme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const nextThemeLabel = isDark ? "light" : "dark";

  return (
    <div className="flex items-center gap-3 rounded-full border border-[var(--border)] bg-[color:var(--surface)] px-3 py-2 text-[var(--muted-foreground)] shadow-[0_16px_40px_var(--glow)] backdrop-blur">
      <span className="text-xs font-medium uppercase tracking-[0.22em]">
        Mode
      </span>
      <button
        type="button"
        aria-label={`Switch to ${nextThemeLabel} mode`}
        onClick={toggleTheme}
        className="rounded-full bg-[color:var(--accent)] px-3 py-1.5 text-sm font-semibold text-[color:var(--accent-foreground)] transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
      >
        {isDark ? "Switch to light" : "Switch to dark"}
      </button>
    </div>
  );
}
