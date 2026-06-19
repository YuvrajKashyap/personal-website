import type { Metadata } from "next";

import { TrackerPage } from "@/features/tracker/TrackerPage";

export const metadata: Metadata = {
  title: "Tracker | Yuvraj Kashyap",
  description:
    "Current state, active systems, and manual operating signal for Yuvraj Kashyap.",
};

export default function TrackerRoute() {
  return <TrackerPage />;
}
