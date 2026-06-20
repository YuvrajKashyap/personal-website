import type { Metadata } from "next";

import { ContactPage } from "@/features/contact/ContactPage";

export const metadata: Metadata = {
  title: "Contact | Yuvraj Kashyap",
  description:
    "Direct manual contact routes for scoped requests, broader collaboration, and project context.",
};

export default function ContactRoute() {
  return <ContactPage />;
}
