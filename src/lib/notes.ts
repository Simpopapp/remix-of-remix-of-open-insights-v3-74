import { useCallback, useEffect, useSyncExternalStore } from "react";
import { addNoteWritten } from "./quests";

const KEY = "aiae:notes:v1";
type NotesMap = Record<string, string>;
const listeners = new Set<() => void>();

let __cachedRaw: string | null | undefined;
let __cachedValue: any = {};
function read(): NotesMap {
  if (typeof window === "undefined") return __cachedValue;
  let raw: string | null;
  try { raw = window.localStorage.getItem(KEY); } catch { return __cachedValue; }
  if (raw === __cachedRaw) return __cachedValue;
  __cachedRaw = raw;
  try { __cachedValue = JSON.parse(raw ?? "{}") as NotesMap; } catch { __cachedValue = {}; }
  return __cachedValue;
}
function __invalidateCache(raw: string | null, value: any) { __cachedRaw = raw; __cachedValue = value; }
function write(next: NotesMap) {
  if (typeof window === "undefined") return;
  const __raw = JSON.stringify(next);
  window.localStorage.setItem(KEY, __raw);
  __invalidateCache(__raw, next);
  listeners.forEach((l) => l());
}
function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
const empty: NotesMap = {};
export function useNotes(moduleId: string, lessonId: string) {
  const map = useSyncExternalStore(subscribe, () => read(), () => read());
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
      const wasEmpty = !cur[key];
      if (v) cur[key] = v;
      else delete cur[key];
      write(cur);
      if (wasEmpty && v.trim().length > 3) addNoteWritten();
    },
    [key],
  );
  return [value, setValue] as const;
}
