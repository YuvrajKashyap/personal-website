"use client";

import { useTheme } from "@/components/theme/useTheme";
import { HomeDark } from "@/features/home/HomeDark";
import { HomeLight } from "@/features/home/HomeLight";

export function HomePage() {
  const { theme } = useTheme();

  return theme === "dark" ? <HomeDark /> : <HomeLight />;
}
