import { ImageResponse } from "next/og";

import { getProjectBySlug } from "@/lib/projects/projects";

export const runtime = "edge";
export const alt = "Yuvraj Kashyap project preview";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

type ProjectOpenGraphImageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function formatCategory(value?: string) {
  return value
    ? value
        .split("_")
        .map((part) => part[0]?.toUpperCase() + part.slice(1))
        .join(" ")
    : "Project";
}

export default async function ProjectOpenGraphImage({
  params,
}: ProjectOpenGraphImageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  const isPublic = project?.visibility === "published";
  const title = isPublic ? project.title : "Project Boundary";
  const summary = isPublic
    ? project.summary
    : "No public project detail is available for this slug.";
  const label = isPublic ? formatCategory(project.category) : "Content Boundary";

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          display: "flex",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          background: "#030406",
          color: "#f8f3e7",
          fontFamily: "system-ui, sans-serif",
          padding: 64,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 18% 12%, rgba(79, 127, 255, 0.22), transparent 30%), radial-gradient(circle at 86% 42%, rgba(245, 178, 74, 0.3), transparent 25%), linear-gradient(135deg, #030406 0%, #090a10 62%, #130c07 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: -90,
            top: 54,
            width: 420,
            height: 420,
            border: "1px solid rgba(245, 178, 74, 0.25)",
            borderRadius: 999,
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
          }}
        >
          <div
            style={{
              color: "#f5b24a",
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            {label}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div
              style={{
                fontSize: 76,
                lineHeight: 0.96,
                fontWeight: 780,
                maxWidth: 820,
              }}
            >
              {title}
            </div>
            <div
              style={{
                color: "rgba(248, 243, 231, 0.78)",
                fontSize: 30,
                lineHeight: 1.22,
                maxWidth: 860,
              }}
            >
              {summary}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              color: "rgba(248, 243, 231, 0.68)",
              fontSize: 23,
              letterSpacing: 1,
            }}
          >
            <span>Yuvraj Kashyap</span>
            <span>yuvrajkashyap.com/projects/{slug}</span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
