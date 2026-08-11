export type PointTrail = {
  points: Float32Array;
  count: number;
  head: number;
};

type PathWriter = {
  moveTo: (x: number, y: number) => void;
  lineTo: (x: number, y: number) => void;
};

export function createPointTrail(capacity: number): PointTrail {
  return {
    points: new Float32Array(capacity * 2),
    count: 0,
    head: 0,
  };
}

export function pushTrailPoint(trail: PointTrail, x: number, y: number) {
  const capacity = trail.points.length / 2;
  trail.head = (trail.head - 1 + capacity) % capacity;
  trail.points[trail.head * 2] = x;
  trail.points[trail.head * 2 + 1] = y;
  trail.count = Math.min(trail.count + 1, capacity);
}

export function getTrailPointOffset(trail: PointTrail, index: number) {
  const capacity = trail.points.length / 2;
  return ((trail.head + index) % capacity) * 2;
}

export function tracePolyline(path: PathWriter, points: Float32Array) {
  if (points.length < 2) {
    return;
  }

  path.moveTo(points[0], points[1]);
  for (let offset = 2; offset < points.length; offset += 2) {
    path.lineTo(points[offset], points[offset + 1]);
  }
}

export function createLatestFrameScheduler<T>(
  requestFrame: (callback: () => void) => number,
  cancelFrame: (frame: number) => void,
  flush: (value: T) => void,
) {
  let frame: number | null = null;
  let latest: T | null = null;

  const run = () => {
    frame = null;
    const value = latest;
    latest = null;
    if (value !== null) {
      flush(value);
    }
  };

  return {
    schedule(value: T) {
      latest = value;
      if (frame === null) {
        frame = requestFrame(run);
      }
    },
    cancel() {
      if (frame !== null) {
        cancelFrame(frame);
        frame = null;
      }
      latest = null;
    },
  };
}

export function createLazyEventSink<TClient, TEvent>(
  loadClient: () => Promise<TClient>,
  dispatch: (client: TClient, event: TEvent) => void,
) {
  let clientPromise: Promise<TClient | null> | null = null;

  const load = () => {
    clientPromise ??= loadClient().catch(() => null);
    return clientPromise;
  };

  return {
    load,
    async push(event: TEvent) {
      const client = await load();
      if (client) {
        dispatch(client, event);
      }
    },
  };
}
