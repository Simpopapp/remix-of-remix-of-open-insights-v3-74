import { useSyncExternalStore } from "react";
import { useActivity } from "@/lib/activity";

const KEY = "aiae:weekly-goal:v1";
const DEFAULT = 300; // minutes/week
const FOCUS_MIN = 25; // one focus event = one pomodoro
const listeners = new Set<() => void>();

function read(): number {
  if (typeof window === "undefined") return DEFAULT;
  const v = Number(localStorage.getItem(KEY));
  return Number.isFinite(v) && v > 0 ? v : DEFAULT;
}
function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => e.key === KEY && cb();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

export function setWeeklyGoal(minutes: number) {
  localStorage.setItem(KEY, String(Math.max(15, Math.round(minutes))));
  listeners.forEach((l) => l());
}

export function useWeeklyGoal() {
  const goal = useSyncExternalStore(subscribe, read, () => DEFAULT);
  const { days } = useActivity(7);
  const focusEvents = days.reduce((a, d) => a + (d.kinds.focus ?? 0), 0);
  const current = focusEvents * FOCUS_MIN;
  const pct = Math.min(100, Math.round((current / goal) * 100));
  return { goal, current, pct, setGoal: setWeeklyGoal };
}
