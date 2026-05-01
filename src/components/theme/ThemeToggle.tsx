"use client";

import { useTheme } from "@/components/theme/useTheme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const nextThemeLabel = isDark ? "light" : "dark";

  return (
    <div className="glass-panel flex items-center gap-3 rounded-full px-3 py-2 text-muted-foreground">
      <span className="text-xs font-medium uppercase tracking-[0.22em]">
        Mode
      </span>
      <button
        type="button"
        aria-label={`Switch to ${nextThemeLabel} mode`}
        onClick={toggleTheme}
        className="focus-ring rounded-full bg-accent px-3 py-1.5 text-sm font-semibold text-accent-foreground transition hover:bg-[var(--interactive-hover)]"
      >
        {isDark ? "Switch to light" : "Switch to dark"}
      </button>
    </div>
  );
}
