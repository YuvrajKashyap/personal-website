import { HomeDark } from "@/features/home/HomeDark";
import { HomeLight } from "@/features/home/HomeLight";
import { HomePage } from "@/features/home/HomePage";
import { HomeSections } from "@/features/home/HomeSections";
import type { ThemeMode } from "@/lib/theme/theme";

/**
 * The Home tree, shared by the two prerendered copies of `/` (dark and
 * light). `serverTheme` only decides which hero is in the HTML; the client
 * still swaps heroes instantly when the theme is toggled.
 */
export function HomeView({ serverTheme }: Readonly<{ serverTheme: ThemeMode }>) {
  return (
    <HomePage
      serverTheme={serverTheme}
      darkHero={<HomeDark />}
      lightHero={<HomeLight />}
    >
      <HomeSections />
    </HomePage>
  );
}
