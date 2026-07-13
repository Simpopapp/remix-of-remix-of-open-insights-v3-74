import { useCallback, useSyncExternalStore } from "react";

const KEY = "aiae:video:v1";
const LAST_KEY = "aiae:video:last";
type Store = Record<string, { t: number; d: number; u?: number }>;
const EMPTY: Store = {};

const listeners = new Set<() => void>();

function read(): Store {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "{}");
  } catch {
    return {};
  }
}
function write(s: Store) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(s));
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function useVideoProgress(moduleId: string, lessonId: string) {
  const key = `${moduleId}/${lessonId}`;
  const store = useSyncExternalStore(subscribe, read, () => EMPTY);
  const entry = store[key] ?? { t: 0, d: 0 };

  const save = useCallback(
    (t: number, d: number) => {
      const cur = read();
      cur[key] = {
        t: Math.max(0, Math.floor(t)),
        d: Math.max(0, Math.floor(d)),
        u: Date.now(),
      };
      write(cur);
      if (typeof window !== "undefined") {
        try {
          window.localStorage.setItem(LAST_KEY, key);
        } catch {
          // ignore
        }
      }
    },
    [key],
  );

  return { time: entry.t, duration: entry.d, save };
}

export function useVideoStore() {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export function readLastKey(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(LAST_KEY);
  } catch {
    return null;
  }
}
