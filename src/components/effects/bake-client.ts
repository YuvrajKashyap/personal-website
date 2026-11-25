/**
 * Main-thread side of the sky bakes. Jobs go to one shared worker so the
 * page stays responsive while the clouds and worlds are worked out; results
 * are cached for the life of the page, so a theme switch or a return visit to
 * Home reuses them. If workers are unavailable the job runs here instead,
 * with the same function and the same pixels.
 */

import {
  bakeKey,
  runBake,
  type BakeJob,
  type BakeResult,
} from "@/components/effects/bake-jobs";

type Pending = { resolve: (value: unknown) => void; reject: (error: unknown) => void };

const results = new Map<string, unknown>();
const inflight = new Map<string, Promise<unknown>>();
const pending = new Map<number, Pending>();
let worker: Worker | null | undefined;
let nextId = 1;

function getWorker(): Worker | null {
  if (worker !== undefined) return worker;
  try {
    worker = new Worker(new URL("./bake.worker.ts", import.meta.url));
    worker.onmessage = (event: MessageEvent<{ id: number; result?: unknown; error?: string }>) => {
      const entry = pending.get(event.data.id);
      if (!entry) return;
      pending.delete(event.data.id);
      if (event.data.error) entry.reject(new Error(event.data.error));
      else entry.resolve(event.data.result);
    };
    worker.onerror = () => {
      // A worker that fails to start: finish everything on the main thread.
      worker?.terminate();
      worker = null;
      for (const [, entry] of pending) entry.reject(new Error("bake worker failed"));
      pending.clear();
    };
  } catch {
    worker = null;
  }
  return worker;
}

function runOnMainThread<J extends BakeJob>(job: J): Promise<BakeResult<J>> {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(runBake(job)), 0);
  });
}

/** The finished result if it is already cached, without starting anything. */
export function peekBake<J extends BakeJob>(job: J): BakeResult<J> | undefined {
  return results.get(bakeKey(job)) as BakeResult<J> | undefined;
}

/** The result now: cached, or baked synchronously on the main thread. */
export function takeBake<J extends BakeJob>(job: J): BakeResult<J> {
  const key = bakeKey(job);
  const cached = results.get(key);
  if (cached !== undefined) return cached as BakeResult<J>;
  const result = runBake(job);
  results.set(key, result);
  return result;
}

/** Bakes off the main thread (deduplicated and cached). */
export function requestBake<J extends BakeJob>(job: J): Promise<BakeResult<J>> {
  const key = bakeKey(job);
  const cached = results.get(key);
  if (cached !== undefined) return Promise.resolve(cached as BakeResult<J>);
  const running = inflight.get(key);
  if (running) return running as Promise<BakeResult<J>>;

  const target = getWorker();
  const promise = (
    target
      ? new Promise<BakeResult<J>>((resolve, reject) => {
          const id = nextId;
          nextId += 1;
          pending.set(id, { resolve: resolve as (value: unknown) => void, reject });
          target.postMessage({ id, job });
        }).catch(() => runOnMainThread(job))
      : runOnMainThread(job)
  ).then((result) => {
    // A synchronous take may have landed first; keep that one.
    if (!results.has(key)) results.set(key, result);
    inflight.delete(key);
    return results.get(key) as BakeResult<J>;
  });

  inflight.set(key, promise);
  return promise;
}
