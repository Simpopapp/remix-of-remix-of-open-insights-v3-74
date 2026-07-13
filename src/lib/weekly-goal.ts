import { useSyncExternalStore } from "react";
import { readActivity } from "@/lib/activity";

const KEY = "aiae:weekly-goal:v1";
const DEFAULT = 300; // minutes/week
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

function weekMinutes(): number {
  const a = readActivity();
  const now = new Date();
  let total = 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const day = a[key];
    if (day?.focusMinutes) total += day.focusMinutes;
  }
  return total;
}

export function useWeeklyGoal() {
  const goal = useSyncExternalStore(subscribe, read, () => DEFAULT);
  const current = weekMinutes();
  const pct = Math.min(100, Math.round((current / goal) * 100));
  return { goal, current, pct, setGoal: setWeeklyGoal };
}
