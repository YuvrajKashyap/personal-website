import { MailPage } from "@/features/mail/MailPage";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Yuv Got Mail",
  description: "A weekly letter from Yuvraj about ideas, updates, discoveries, and occasional rabbit holes.",
  path: "/mail",
});

type MailRoutePageProps = Readonly<{
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>;

export default async function MailRoutePage({ searchParams }: MailRoutePageProps) {
  const params = await searchParams;
  return <MailPage confirmed={params.confirmed === "true"} />;
}
