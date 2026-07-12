import { useCallback, useSyncExternalStore } from "react";

const KEY = "aiae:feedback:v1";
export type Rating = "up" | "down" | null;
type Entry = { rating: Rating; comment: string };
type Store = Record<string, Entry>;

const listeners = new Set<() => void>();
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
