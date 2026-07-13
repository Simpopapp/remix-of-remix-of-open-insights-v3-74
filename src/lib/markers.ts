import { useCallback, useEffect, useMemo, useSyncExternalStore } from "react";

const KEY = "aiae:markers:v1";

export type Marker = {
  id: string;
  moduleId: string;
  lessonId: string;
  t: number; // seconds
  label: string;
  createdAt: number;
};

type Store = Record<string, Marker>;

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

let __cachedRaw: string | null | undefined;
let __cachedValue: any = {};
function read(): Store {
  if (typeof window === "undefined") return __cachedValue;
  let raw: string | null;
  try { raw = window.localStorage.getItem(KEY); } catch { return __cachedValue; }
  if (raw === __cachedRaw) return __cachedValue;
  __cachedRaw = raw;
  try { __cachedValue = JSON.parse(raw ?? "{}") as Store; } catch { __cachedValue = {}; }
  return __cachedValue;
}
function __invalidateCache(raw: string | null, value: any) { __cachedRaw = raw; __cachedValue = value; }
function write(next: Store) {
  if (typeof window === "undefined") return;
  const __raw = JSON.stringify(next);
  window.localStorage.setItem(KEY, __raw);
  __invalidateCache(__raw, next);
  notify();
}
function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function useMarkers(moduleId?: string, lessonId?: string) {
  const map = useSyncExternalStore(subscribe, read, read);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) notify();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const all = useMemo(
    () =>
      Object.values(map).sort((a, b) => {
        if (a.moduleId !== b.moduleId) return a.moduleId.localeCompare(b.moduleId);
        if (a.lessonId !== b.lessonId) return a.lessonId.localeCompare(b.lessonId);
        return a.t - b.t;
      }),
    [map],
  );

  const list = useMemo(
    () =>
      moduleId && lessonId
        ? all.filter((m) => m.moduleId === moduleId && m.lessonId === lessonId)
        : all,
    [all, moduleId, lessonId],
  );

  const add = useCallback(
    (marker: Omit<Marker, "id" | "createdAt">) => {
      const cur = read();
      const id = `${marker.moduleId}:${marker.lessonId}:${marker.t}:${Date.now()}`;
      cur[id] = { ...marker, id, createdAt: Date.now() };
      write(cur);
      return id;
    },
    [],
  );

  const remove = useCallback((id: string) => {
    const cur = read();
    delete cur[id];
    write(cur);
  }, []);

  const rename = useCallback((id: string, label: string) => {
    const cur = read();
    if (cur[id]) {
      cur[id] = { ...cur[id], label };
      write(cur);
    }
  }, []);

  return { list, all, add, remove, rename };
}
