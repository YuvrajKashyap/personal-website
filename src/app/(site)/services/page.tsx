import type { Metadata } from "next";

import { ServicesPage } from "@/features/services/ServicesPage";

export const metadata: Metadata = {
  title: "Services | Yuvraj Kashyap",
  description:
    "Scoped build requests for product surfaces, systems, prototypes, and technical execution.",
};

export default function ServicesRoute() {
  return <ServicesPage />;
}
