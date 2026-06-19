import type { Metadata } from "next";

import { CollaboratePage } from "@/features/collaborate/CollaboratePage";

export const metadata: Metadata = {
  title: "Collaborate | Yuvraj Kashyap",
  description:
    "Broader aligned opportunities with founders, builders, creators, startups, and technical teams.",
};

export default function CollaborateRoute() {
  return <CollaboratePage />;
}
