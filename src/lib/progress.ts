import { useCallback, useEffect, useSyncExternalStore } from "react";

const KEY = "aiae:progress:v1";

type ProgressMap = Record<string, true>; // `${moduleId}/${lessonId}` -> true

const listeners = new Set<() => void>();

function read(): ProgressMap {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "{}") as ProgressMap;
  } catch {
    return {};
  }
}

function write(next: ProgressMap) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(next));
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function getSnapshot(): ProgressMap {
  return read();
}

function getServerSnapshot(): ProgressMap {
  return {};
}

export function useProgress() {
  const map = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Cross-tab sync
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) listeners.forEach((l) => l());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const key = (m: string, l: string) => `${m}/${l}`;

  const isDone = useCallback((m: string, l: string) => Boolean(map[key(m, l)]), [map]);

  const toggle = useCallback(
    (m: string, l: string) => {
      const cur = read();
      const k = key(m, l);
      if (cur[k]) delete cur[k];
      else cur[k] = true;
      write(cur);
    },
    [],
  );

  const setDone = useCallback((m: string, l: string, done: boolean) => {
    const cur = read();
    const k = key(m, l);
    if (done) cur[k] = true;
    else delete cur[k];
    write(cur);
  }, []);

  const completedCount = Object.keys(map).length;

  return { map, isDone, toggle, setDone, completedCount };
}
