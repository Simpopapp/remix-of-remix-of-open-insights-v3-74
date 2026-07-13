import { useEffect, useMemo, useSyncExternalStore } from "react";

const KEY = "aiae:activity:v1";

export type ActivityKind = "lesson" | "exercise" | "watch" | "focus" | "note";

type ActivityMap = Record<string, Partial<Record<ActivityKind, number>>>;

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

function today() {
  return new Date().toISOString().slice(0, 10);
}
let __cachedRaw: string | null | undefined;
let __cachedValue: any = {} as ActivityMap;
function read(): ActivityMap {
  if (typeof window === "undefined") return {} as ActivityMap;
  let raw: string | null;
  try { raw = window.localStorage.getItem(KEY); } catch { return __cachedValue; }
  if (raw === __cachedRaw) return __cachedValue;
  __cachedRaw = raw;
  try { __cachedValue = JSON.parse(raw ?? "{}") as ActivityMap; } catch { __cachedValue = {} as ActivityMap; }
  return __cachedValue;
}
function __invalidateCache(raw: string | null, value: any) { __cachedRaw = raw; __cachedValue = value; }
function write(next: ActivityMap) {
  if (typeof window === "undefined") return;
  const __raw = JSON.stringify(next);
  window.localStorage.setItem(KEY, __raw);
  __invalidateCache(__raw, next);
  notify();
}

export function pingActivity(kind: ActivityKind, amount = 1) {
  const cur = read();
  const t = today();
  const day = cur[t] ?? {};
  day[kind] = (day[kind] ?? 0) + amount;
  cur[t] = day;
  write(cur);
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function useActivity(daysBack = 84) {
  const map = useSyncExternalStore(subscribe, read, read) as ActivityMap);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) notify();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return useMemo(() => {
    const days: { date: string; total: number; kinds: Partial<Record<ActivityKind, number>> }[] = [];
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    for (let i = daysBack - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const kinds = map[key] ?? {};
      const total = Object.values(kinds).reduce<number>((a, b) => a + (b ?? 0), 0);
      days.push({ date: key, total, kinds });
    }
    const totalEvents = days.reduce((a, d) => a + d.total, 0);
    const activeDays = days.filter((d) => d.total > 0).length;
    return { days, totalEvents, activeDays };
  }, [map, daysBack]);
}
