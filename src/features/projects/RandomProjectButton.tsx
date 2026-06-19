"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";

import type { Project } from "@/types/project";

type RandomProjectButtonProps = Readonly<{
  projects: Pick<Project, "slug" | "title">[];
  label?: string;
  className?: string;
}>;

export function RandomProjectButton({
  projects,
  label = "Enter Random Orbit",
  className,
}: RandomProjectButtonProps) {
  const router = useRouter();
  const eligibleProjects = useMemo(() => [...projects], [projects]);
  const hasProjects = eligibleProjects.length > 0;

  function pickProject() {
    if (!hasProjects) {
      return;
    }

    const index = Math.floor(Math.random() * eligibleProjects.length);
    const project = eligibleProjects[index];

    router.push(`/projects/${project.slug}`);
  }

  return (
    <button
      type="button"
      className={["project-random-button focus-ring", className]
        .filter(Boolean)
        .join(" ")}
      onClick={pickProject}
      disabled={!hasProjects}
      aria-label={
        hasProjects
          ? "Open a random eligible project"
          : "Random project unavailable"
      }
    >
      <span>{label}</span>
      <span aria-hidden="true" className="project-random-button-mark">
        GO
      </span>
    </button>
  );
}
