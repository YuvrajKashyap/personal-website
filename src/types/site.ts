export type { ThemeMode } from "@/lib/theme/theme";
export type * from "@/types/project";

export type NavItem = {
  label: string;
  href: string;
  external?: boolean;
  cta?: boolean;
};

export type SocialLink = {
  label: string;
  href: string;
  external: true;
};
