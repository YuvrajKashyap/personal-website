import type { Metadata } from "next";

import { AboutPage } from "@/features/about/AboutPage";

export const metadata: Metadata = {
  title: "About | Yuvraj Kashyap",
  description:
    "Background, trajectory, discipline, and current building phase of Yuvraj Kashyap.",
};

export default function AboutRoutePage() {
  return <AboutPage />;
}
