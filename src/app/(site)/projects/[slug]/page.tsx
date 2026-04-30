import { RouteStub } from "@/components/shared/RouteStub";

type ProjectDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { slug } = await params;

  return (
    <RouteStub
      eyebrow="Projects"
      title="Project Detail"
      description={`A future project case study route for ${slug}.`}
    />
  );
}
