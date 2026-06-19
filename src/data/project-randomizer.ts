import type { ProjectRandomizerSettings } from "@/types/project";

export const projectRandomizerSettings = {
  mode: "full_random",
  curatedBucketSlugs: ["aletheia", "atlas", "personal-website", "capital"],
  buttonBehavior: "open_project_route",
  defaultEligibleVisibility: "published",
  allowNeedsReviewLinks: false,
} satisfies ProjectRandomizerSettings;
