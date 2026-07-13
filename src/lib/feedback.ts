import { useCallback, useSyncExternalStore } from "react";

const KEY = "aiae:feedback:v1";
export type Rating = "up" | "down" | null;
type Entry = { rating: Rating; comment: string };
type Store = Record<string, Entry>;

const listeners = new Set<() => void>();
let __cachedRaw: string | null | undefined;
let __cachedValue: any = {};
function read(): Store {
  if (typeof window === "undefined") return {};
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
  listeners.forEach((l) => l());
}
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
};
const empty: Store = {};

export function useLessonFeedback(moduleId: string, lessonId: string) {
  const map = useSyncExternalStore(subscribe, read, () => empty);
  const key = `${moduleId}/${lessonId}`;
  const entry = map[key] ?? { rating: null, comment: "" };

  const setRating = useCallback(
    (r: Rating) => {
      const cur = read();
      cur[key] = { ...(cur[key] ?? { rating: null, comment: "" }), rating: r };
      write(cur);
    },
    [key],
  );
  const setComment = useCallback(
    (c: string) => {
      const cur = read();
      cur[key] = { ...(cur[key] ?? { rating: null, comment: "" }), comment: c };
      write(cur);
    },
    [key],
  );
  return { rating: entry.rating, comment: entry.comment, setRating, setComment };
}
