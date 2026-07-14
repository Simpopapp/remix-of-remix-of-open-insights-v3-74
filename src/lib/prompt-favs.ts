import { useCallback, useSyncExternalStore } from "react";

const KEY = "aiae:prompt-favs:v1";
const listeners = new Set<() => void>();
let cachedRaw: string | null | undefined;
let cachedList: string[] = [];

function read(): string[] {
  if (typeof window === "undefined") return cachedList;
  let raw: string | null;
  try { raw = window.localStorage.getItem(KEY); } catch { return cachedList; }
  if (raw === cachedRaw) return cachedList;
  cachedRaw = raw;
  try { cachedList = raw ? JSON.parse(raw) : []; } catch { cachedList = []; }
  return cachedList;
}
function write(v: string[]) {
  if (typeof window === "undefined") return;
  const raw = JSON.stringify(v);
  window.localStorage.setItem(KEY, raw);
  cachedRaw = raw;
  cachedList = v;
  listeners.forEach((l) => l());
}

export function usePromptFavs() {
  const list = useSyncExternalStore((cb) => {
    listeners.add(cb); return () => listeners.delete(cb);
  }, read, read);
  const isFav = useCallback((id: string) => list.includes(id), [list]);
  const toggle = useCallback((id: string) => {
    const cur = read();
    write(cur.includes(id) ? cur.filter((x) => x !== id) : [id, ...cur]);
  }, []);
  return { list, isFav, toggle };
}
