import { useCallback, useSyncExternalStore } from "react";

const KEY = "aiae:video:v1";
type Store = Record<string, { t: number; d: number }>; // key -> {time, duration}

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

export function useVideoProgress(moduleId: string, lessonId: string) {
  const key = `${moduleId}/${lessonId}`;
  const store = useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    read,
    () => ({}),
  );
  const entry = store[key] ?? { t: 0, d: 0 };

  const save = useCallback(
    (t: number, d: number) => {
      const cur = read();
      cur[key] = { t: Math.max(0, Math.floor(t)), d: Math.max(0, Math.floor(d)) };
      write(cur);
    },
    [key],
  );

  return { time: entry.t, duration: entry.d, save };
}
