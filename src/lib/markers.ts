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

function read(): Store {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "{}") as Store;
  } catch {
    return {};
  }
}
function write(next: Store) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(next));
  notify();
}
function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function useMarkers(moduleId?: string, lessonId?: string) {
  const map = useSyncExternalStore(subscribe, read, () => ({}) as Store);

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
