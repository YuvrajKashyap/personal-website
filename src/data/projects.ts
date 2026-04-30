export type ProjectSummary = {
  slug: string;
  title: string;
  summary: string;
  status: "planned" | "draft" | "live";
};

export const projects: ProjectSummary[] = [];

