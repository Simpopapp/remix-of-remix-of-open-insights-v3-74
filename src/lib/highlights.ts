import { useCallback, useSyncExternalStore } from "react";

const KEY = "aiae:highlights:v1";

export type Highlight = {
  id: string;
  moduleId: string;
  lessonId: string;
  text: string;
  t?: number; // optional video timestamp when highlight was taken
  createdAt: number;
  color?: "gold" | "violet" | "emerald" | "rose";
};

type Store = Record<string, Highlight[]>; // key = moduleId/lessonId

const listeners = new Set<() => void>();

let __cachedRaw: string | null | undefined;
let __cachedValue: any = {};
function read(): Store {
  if (typeof window === "undefined") return {};
  let raw: string | null;
  try { raw = window.localStorage.getItem(KEY); } catch { return __cachedValue; }
  if (raw === __cachedRaw) return __cachedValue;
  __cachedRaw = raw;
  try { __cachedValue = JSON.parse(raw ?? "{}"); } catch { __cachedValue = {}; }
  return __cachedValue;
}
function __invalidateCache(raw: string | null, value: any) { __cachedRaw = raw; __cachedValue = value; }
function write(s: Store) {
  if (typeof window === "undefined") return;
  const __raw = JSON.stringify(s);
  window.localStorage.setItem(KEY, __raw);
  __invalidateCache(__raw, s);
  listeners.forEach((l) => l());
}
function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function useHighlights(moduleId?: string, lessonId?: string) {
  const store = useSyncExternalStore(subscribe, read, () => ({}) as Store);
  const key = moduleId && lessonId ? `${moduleId}/${lessonId}` : null;
  const list = key ? (store[key] ?? []) : Object.values(store).flat();

  const add = useCallback(
    (h: Omit<Highlight, "id" | "createdAt">) => {
      if (!h.text.trim()) return;
      const cur = read();
      const k = `${h.moduleId}/${h.lessonId}`;
      const entry: Highlight = {
        ...h,
        text: h.text.trim().slice(0, 500),
        id: `h_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
        createdAt: Date.now(),
      };
      cur[k] = [entry, ...(cur[k] ?? [])];
      write(cur);
    },
    [],
  );

  const remove = useCallback((id: string) => {
    const cur = read();
    for (const k of Object.keys(cur)) {
      cur[k] = cur[k].filter((h) => h.id !== id);
      if (cur[k].length === 0) delete cur[k];
    }
    write(cur);
  }, []);

  return { list, add, remove };
}

export function totalHighlights(): number {
  const s = read();
  return Object.values(s).reduce((a, v) => a + v.length, 0);
}
