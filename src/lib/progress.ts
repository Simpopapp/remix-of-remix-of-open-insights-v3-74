import { useCallback, useEffect, useSyncExternalStore } from "react";
import { pingActivity } from "./activity";

const KEY = "aiae:progress:v1";

type ProgressMap = Record<string, true>; // `${moduleId}/${lessonId}` -> true

const listeners = new Set<() => void>();

let __cachedRaw: string | null | undefined;
let __cachedValue: any = {};
function read(): ProgressMap {
  if (typeof window === "undefined") return __cachedValue;
  let raw: string | null;
  try { raw = window.localStorage.getItem(KEY); } catch { return __cachedValue; }
  if (raw === __cachedRaw) return __cachedValue;
  __cachedRaw = raw;
  try { __cachedValue = JSON.parse(raw ?? "{}") as ProgressMap; } catch { __cachedValue = {}; }
  return __cachedValue;
}
function __invalidateCache(raw: string | null, value: any) { __cachedRaw = raw; __cachedValue = value; }

function write(next: ProgressMap) {
  if (typeof window === "undefined") return;
  const __raw = JSON.stringify(next);
  window.localStorage.setItem(KEY, __raw);
  __invalidateCache(__raw, next);
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
  return __cachedValue;
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
    if (done) {
      if (!cur[k]) pingActivity("lesson");
      cur[k] = true;
    } else delete cur[k];
    write(cur);
  }, []);

  const completedCount = Object.keys(map).length;

  return { map, isDone, toggle, setDone, completedCount };
}
