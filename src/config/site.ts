import type {
  NavItem,
  OrbitalDestination,
  PublicRoute,
  SocialLink,
} from "@/types/site";

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
    { label: "Get in Touch", href: "/contact", cta: true },
  ] satisfies NavItem[],
  publicRoutes: [
    { label: "Home", href: "/", status: "live" },
    { label: "About", href: "/about", status: "live" },
    { label: "Experience", href: "/experience", status: "live" },
    { label: "Projects", href: "/projects", status: "live" },
    { label: "Project Detail", href: "/projects/[slug]", status: "live" },
    { label: "Tracker", href: "/tracker", status: "live" },
    { label: "Services", href: "/services", status: "live" },
    { label: "Collaborate", href: "/collaborate", status: "live" },
    { label: "Get in Touch", href: "/contact", status: "live" },
  ] satisfies PublicRoute[],
  socialLinks: [
    {
      label: "GitHub",
      href: "https://github.com/YuvrajKashyap",
      external: true,
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/yuvraj-kashyap",
      external: true,
    },
    {
      label: "X",
      href: "https://x.com/Yuv_kk",
      external: true,
    },
    {
      label: "YouTube",
      href: "https://www.youtube.com/@yk.blueprint",
      external: true,
    },
    {
      label: "Instagram",
      href: "https://www.instagram.com/y.kxshyap/",
      external: true,
    },
  ] satisfies SocialLink[],
  resume: {
    label: "Resume",
    href: "/media/resume/yuvraj-kashyap-resume.pdf",
  },
};

export const orbitalDestinations = [
  {
    label: "About",
    href: "/about",
    description: "Origin and trajectory",
    code: "01",
  },
  {
    label: "Experience",
    href: "/experience",
    description: "Proof and progression",
    code: "02",
  },
  {
    label: "Projects",
    href: "/projects",
    description: "Build archive",
    code: "03",
  },
  {
    label: "Tracker",
    href: "/tracker",
    description: "Current-state signal",
    code: "04",
  },
  {
    label: "Services",
    href: "/services",
    description: "Scoped builds",
    code: "05",
  },
  {
    label: "Collaborate",
    href: "/collaborate",
    description: "Aligned opportunities",
    code: "06",
  },
  {
    label: "Get in Touch",
    href: "/contact",
    description: "Open channel",
    code: "07",
    cta: true,
  },
] satisfies OrbitalDestination[];
