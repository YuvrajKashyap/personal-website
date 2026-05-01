export const THEME_COOKIE_NAME = "yk-theme";
export const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
export const THEMES = ["dark", "light"] as const;

export type ThemeMode = (typeof THEMES)[number];

export const DEFAULT_THEME: ThemeMode = "dark";

export function isThemeMode(value: unknown): value is ThemeMode {
  return value === "dark" || value === "light";
}

export function resolveTheme(value: unknown): ThemeMode {
  return isThemeMode(value) ? value : DEFAULT_THEME;
}
