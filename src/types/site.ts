export type ThemeMode = "dark" | "light";

export type RouteStatus = "stub" | "planned" | "live";

export type NavItem = {
  label: string;
  href: string;
  external?: boolean;
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

