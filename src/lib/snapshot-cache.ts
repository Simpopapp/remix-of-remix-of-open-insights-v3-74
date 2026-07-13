// Snapshot cache for useSyncExternalStore-backed localStorage stores.
// Ensures a stable object reference until the underlying JSON string changes,
// so React doesn't loop with "Maximum update depth exceeded".

export function createSnapshot<T>(key: string, parse: (raw: string | null) => T) {
  let cachedRaw: string | null | undefined = undefined;
  let cachedValue: T;

  function read(): T {
    if (typeof window === "undefined") {
      if (cachedValue === undefined) cachedValue = parse(null);
      return cachedValue;
    }
    let raw: string | null;
    try {
      raw = window.localStorage.getItem(key);
    } catch {
      if (cachedValue === undefined) cachedValue = parse(null);
      return cachedValue;
    }
    if (raw === cachedRaw && cachedValue !== undefined) return cachedValue;
    cachedRaw = raw;
    cachedValue = parse(raw);
    return cachedValue;
  }

  function invalidate(nextRaw?: string | null, nextValue?: T) {
    cachedRaw = nextRaw ?? undefined;
    if (nextValue !== undefined) cachedValue = nextValue;
    else cachedValue = undefined as unknown as T;
  }

  return { read, invalidate };
}
