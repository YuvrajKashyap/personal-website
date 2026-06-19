import type { Metadata } from "next";

import { ExperiencePage } from "@/features/experience/ExperiencePage";

export const metadata: Metadata = {
  title: "Experience | Yuvraj Kashyap",
  description:
    "Roles, technical work, leadership, projects, and discipline shaping how Yuvraj Kashyap builds.",
};

export default function ExperienceRoutePage() {
  return <ExperiencePage />;
}
