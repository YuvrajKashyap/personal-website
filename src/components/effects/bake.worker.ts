/// <reference lib="webworker" />

import { bakeTransfers, runBake, type BakeJob } from "@/components/effects/bake-jobs";

type Request = Readonly<{ id: number; job: BakeJob }>;

const scope = self as unknown as DedicatedWorkerGlobalScope;

scope.onmessage = (event: MessageEvent<Request>) => {
  const { id, job } = event.data;
  try {
    const result = runBake(job);
    scope.postMessage({ id, result }, bakeTransfers(result));
  } catch (error) {
    scope.postMessage({ id, error: String(error) });
  }
};
