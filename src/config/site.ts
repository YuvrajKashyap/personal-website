import type { NavItem, PublicRoute, SocialLink } from "@/types/site";

export const siteConfig = {
  name: "Yuvraj Kashyap",
  domain: "yuvrajkashyap.com",
  url: "https://yuvrajkashyap.com",
  description: "Personal website and operating interface for Yuvraj Kashyap.",
  navItems: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Experience", href: "/experience" },
    { label: "Projects", href: "/projects" },
    { label: "Tracker", href: "/tracker" },
    { label: "Services", href: "/services" },
    { label: "Collaborate", href: "/collaborate" },
    { label: "Get in Touch", href: "/contact" },
  ] satisfies NavItem[],
  publicRoutes: [
    { label: "Home", href: "/", status: "stub" },
    { label: "About", href: "/about", status: "stub" },
    { label: "Experience", href: "/experience", status: "stub" },
    { label: "Projects", href: "/projects", status: "stub" },
    { label: "Project Detail", href: "/projects/[slug]", status: "stub" },
    { label: "Tracker", href: "/tracker", status: "stub" },
    { label: "Services", href: "/services", status: "stub" },
    { label: "Collaborate", href: "/collaborate", status: "stub" },
    { label: "Get in Touch", href: "/contact", status: "stub" },
  ] satisfies PublicRoute[],
  socialLinks: [] satisfies SocialLink[],
};

