import type { NavItem, SocialLink } from "@/types/site";

export const siteConfig = {
  name: "Yuvraj Kashyap",
  email: "ykyuvrajkashyap@gmail.com",
  domain: "yuvrajkashyap.com",
  url: "https://yuvrajkashyap.com",
  description: "Personal website and operating interface for Yuvraj Kashyap.",
  navItems: [
    { label: "Home", href: "/#top" },
    { label: "About", href: "/#home-about-preview" },
    { label: "Experience", href: "/#home-experience-preview" },
    { label: "Projects", href: "/#home-projects-preview" },
    { label: "Contact", href: "/#home-contact" },
  ] satisfies NavItem[],
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
