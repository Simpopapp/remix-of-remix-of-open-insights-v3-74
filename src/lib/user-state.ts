import { useCallback, useEffect, useSyncExternalStore } from "react";
import { pingActivity } from "./activity";

const KEY_BOOK = "aiae:bookmarks:v1";
const KEY_EX = "aiae:exercises:v1";

type Map1 = Record<string, true>;
const bookListeners = new Set<() => void>();
const exListeners = new Set<() => void>();

function read(k: string): Map1 {
  if (typeof window === "undefined") return __cachedValue;
  try {
    return JSON.parse(window.localStorage.getItem(k) ?? "{}") as Map1;
  } catch {
    return {};
  }
}
function write(k: string, v: Map1, set: Set<() => void>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(k, JSON.stringify(v));
  set.forEach((l) => l());
}

function makeHook(key: string, set: Set<() => void>) {
  const sub = (cb: () => void) => {
    set.add(cb);
    return () => set.delete(cb);
  };
  return function useMap() {
    const map = useSyncExternalStore(sub, () => read(key), () => read(key)),
    );
    useEffect(() => {
      const onStorage = (e: StorageEvent) => {
        if (e.key === key) set.forEach((l) => l());
      };
      window.addEventListener("storage", onStorage);
      return () => window.removeEventListener("storage", onStorage);
    }, []);
    const has = useCallback((k: string) => Boolean(map[k]), [map]);
    const toggle = useCallback((k: string) => {
      const cur = read(key);
      if (cur[k]) delete cur[k];
      else {
        cur[k] = true;
        if (key === KEY_EX) pingActivity("exercise");
      }
      write(key, cur, set);
    }, []);
    const setVal = useCallback((k: string, on: boolean) => {
      const cur = read(key);
      if (on) cur[k] = true;
      else delete cur[k];
      write(key, cur, set);
    }, []);
    return { map, has, toggle, setVal, count: Object.keys(map).length };
  };
}

export const useBookmarks = makeHook(KEY_BOOK, bookListeners);
export const useExercises = makeHook(KEY_EX, exListeners);

export const lessonKey = (m: string, l: string) => `${m}/${l}`;
