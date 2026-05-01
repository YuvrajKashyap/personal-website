import { cookies } from "next/headers";

import {
  THEME_COOKIE_NAME,
  resolveTheme,
  type ThemeMode,
} from "@/lib/theme/theme";

export async function getServerTheme(): Promise<ThemeMode> {
  const cookieStore = await cookies();

  return resolveTheme(cookieStore.get(THEME_COOKIE_NAME)?.value);
}
