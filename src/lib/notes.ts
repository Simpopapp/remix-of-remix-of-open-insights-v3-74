import { useCallback, useEffect, useSyncExternalStore } from "react";

const KEY = "aiae:notes:v1";
type NotesMap = Record<string, string>;
const listeners = new Set<() => void>();

function read(): NotesMap {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "{}") as NotesMap;
  } catch {
    return {};
  }
}
function write(next: NotesMap) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(next));
  listeners.forEach((l) => l());
}
function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
const empty: NotesMap = {};
export function useNotes(moduleId: string, lessonId: string) {
  const map = useSyncExternalStore(
    subscribe,
    () => read(),
    () => empty,
  );
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) listeners.forEach((l) => l());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  const key = `${moduleId}/${lessonId}`;
  const value = map[key] ?? "";
  const setValue = useCallback(
    (v: string) => {
      const cur = read();
      if (v) cur[key] = v;
      else delete cur[key];
      write(cur);
    },
    [key],
  );
  return [value, setValue] as const;
}
