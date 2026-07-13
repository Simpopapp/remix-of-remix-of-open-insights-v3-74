import { useCallback, useEffect, useMemo, useSyncExternalStore } from "react";
import { useActivity } from "./activity";

const KEY = "aiae:streak-freeze:v1";
const MAX_FREEZES = 3;
const REGEN_DAYS = 7; // 1 freeze regenerates per week of active use

type FreezeState = {
  used: string[]; // dates (YYYY-MM-DD) when a freeze was applied
  banked: number; // extra earned freezes (beyond MAX_FREEZES lifetime cap)
};

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

let __cachedRaw: string | null | undefined;
let __cachedValue: any = { used: [], banked: 0 };
function read(): FreezeState {
  if (typeof window === "undefined") return { used: [], banked: 0 };
  let raw: string | null;
  try { raw = window.localStorage.getItem(KEY); } catch { return __cachedValue; }
  if (raw === __cachedRaw) return __cachedValue;
  __cachedRaw = raw;
  try { __cachedValue = JSON.parse(raw ?? "") as FreezeState; } catch { __cachedValue = { used: [], banked: 0 }; }
  return __cachedValue;
}
function __invalidateCache(raw: string | null, value: any) { __cachedRaw = raw; __cachedValue = value; }
function write(next: FreezeState) {
  if (typeof window === "undefined") return;
  const __raw = JSON.stringify(next);
  window.localStorage.setItem(KEY, __raw);
  __invalidateCache(__raw, next);
  notify();
}
function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function useStreak() {
  const { days } = useActivity(84);
  const freezeState = useSyncExternalStore(subscribe, read, () => ({ used: [], banked: 0 }) as FreezeState);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) notify();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const used = useMemo(() => new Set(freezeState.used), [freezeState.used]);

  const computed = useMemo(() => {
    // Freezes available: MAX + banked - used
    const totalFreezes = MAX_FREEZES + (freezeState.banked ?? 0);
    const freezesLeft = Math.max(0, totalFreezes - freezeState.used.length);

    // Regenerate earned freezes: 1 per 7 fully-active days after each spend
    const activeCount = days.filter((d) => d.total > 0).length;
    const earned = Math.floor(activeCount / REGEN_DAYS);
    const bankedTarget = Math.max(freezeState.banked, earned - freezeState.used.length);

    // Streak calc with freezes filling gaps for TODAY only
    let current = 0;
    for (let i = days.length - 1; i >= 0; i--) {
      const d = days[i];
      if (d.total > 0) {
        current++;
      } else if (used.has(d.date)) {
        current++;
      } else {
        break;
      }
    }
    let longest = 0;
    let run = 0;
    for (const d of days) {
      if (d.total > 0 || used.has(d.date)) {
        run++;
        if (run > longest) longest = run;
      } else run = 0;
    }
    const activeDays = days.filter((d) => d.total > 0).length;
    return { current, longest, activeDays, freezesLeft, bankedTarget };
  }, [days, freezeState.banked, freezeState.used.length, used]);

  const applyFreeze = useCallback(
    (date?: string) => {
      const cur = read();
      const target = date ?? new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      if (cur.used.includes(target)) return false;
      const totalFreezes = MAX_FREEZES + (cur.banked ?? 0);
      if (cur.used.length >= totalFreezes) return false;
      write({ ...cur, used: [...cur.used, target] });
      return true;
    },
    [],
  );

  return { ...computed, applyFreeze };
}
