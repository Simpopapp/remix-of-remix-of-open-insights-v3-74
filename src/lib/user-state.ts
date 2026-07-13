import { useCallback, useEffect, useSyncExternalStore } from "react";
import { pingActivity } from "./activity";

const KEY_BOOK = "aiae:bookmarks:v1";
const KEY_EX = "aiae:exercises:v1";

type Map1 = Record<string, true>;
const bookListeners = new Set<() => void>();
const exListeners = new Set<() => void>();

const caches: Record<string, { raw: string | null | undefined; value: Map1 }> = {};
function getCache(k: string) {
  if (!caches[k]) caches[k] = { raw: undefined, value: {} };
  return caches[k];
}

function read(k: string): Map1 {
  const c = getCache(k);
  if (typeof window === "undefined") return c.value;
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(k);
  } catch {
    return c.value;
  }
  if (raw === c.raw) return c.value;
  c.raw = raw;
  try {
    c.value = JSON.parse(raw ?? "{}") as Map1;
  } catch {
    c.value = {};
  }
  return c.value;
}
function write(k: string, v: Map1, set: Set<() => void>) {
  if (typeof window === "undefined") return;
  const raw = JSON.stringify(v);
  window.localStorage.setItem(k, raw);
  const c = getCache(k);
  c.raw = raw;
  c.value = v;
  set.forEach((l) => l());
}

function makeHook(key: string, set: Set<() => void>) {
  const sub = (cb: () => void) => {
    set.add(cb);
    return () => {
      set.delete(cb);
    };
  };
  const snap = () => read(key);
  return function useMap() {
    const map = useSyncExternalStore(sub, snap, snap);
    useEffect(() => {
      const onStorage = (e: StorageEvent) => {
        if (e.key === key) set.forEach((l) => l());
      };
      window.addEventListener("storage", onStorage);
      return () => window.removeEventListener("storage", onStorage);
    }, []);
    const has = useCallback((k: string) => Boolean(map[k]), [map]);
    const toggle = useCallback((k: string) => {
      const cur = { ...read(key) };
      if (cur[k]) delete cur[k];
      else {
        cur[k] = true;
        if (key === KEY_EX) pingActivity("exercise");
      }
      write(key, cur, set);
    }, []);
    const setVal = useCallback((k: string, on: boolean) => {
      const cur = { ...read(key) };
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
