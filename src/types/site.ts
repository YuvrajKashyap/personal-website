export type { ThemeMode } from "@/lib/theme/theme";

export type RouteStatus = "stub" | "planned" | "live";

export type NavItem = {
  label: string;
  href: string;
  external?: boolean;
  cta?: boolean;
};

export type OrbitalDestination = {
  label: string;
  href: string;
  description: string;
  code: string;
  cta?: boolean;
};

export type PublicRoute = {
  label: string;
  href: string;
  status: RouteStatus;
};

export type SocialLink = {
  label: string;
  href: string;
  external: true;
};
