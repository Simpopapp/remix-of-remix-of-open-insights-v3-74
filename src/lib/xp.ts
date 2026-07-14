// Canonical XP + level source. All XP-earning surfaces feed here.
// Total XP = derived (lessons, exercises, watchSeconds, streakDays) + persistent questsXp bank.
import { useSyncExternalStore, useMemo } from "react";
import { useProgress } from "./progress";
import { useExercises } from "./user-state";
import { useStreak } from "./streak";

const QUESTS_XP_KEY = "aiae:quests-xp:v1";
const WATCH_KEY = "aiae:watch:v1";

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

// ---- questsXp bank (persistent, monotonically increasing) ----
let __qxpRaw: string | null | undefined;
let __qxp = 0;
function readQuestsXp(): number {
  if (typeof window === "undefined") return __qxp;
  let raw: string | null;
  try { raw = window.localStorage.getItem(QUESTS_XP_KEY); } catch { return __qxp; }
  if (raw === __qxpRaw) return __qxp;
  __qxpRaw = raw;
  const n = Number(raw ?? "0");
  __qxp = Number.isFinite(n) && n >= 0 ? n : 0;
  return __qxp;
}
export function addQuestXp(amount: number) {
  if (typeof window === "undefined" || !Number.isFinite(amount) || amount <= 0) return;
  const next = readQuestsXp() + Math.round(amount);
  const raw = String(next);
  window.localStorage.setItem(QUESTS_XP_KEY, raw);
  __qxpRaw = raw;
  __qxp = next;
  notify();
}

// ---- watch seconds (kept here so xp reads a single key) ----
let __wRaw: string | null | undefined;
let __w = 0;
function readWatch(): number {
  if (typeof window === "undefined") return __w;
  let raw: string | null;
  try { raw = window.localStorage.getItem(WATCH_KEY); } catch { return __w; }
  if (raw === __wRaw) return __w;
  __wRaw = raw;
  const n = Number(raw ?? "0");
  __w = Number.isFinite(n) && n >= 0 ? n : 0;
  return __w;
}
export function addWatchSeconds(s: number) {
  if (typeof window === "undefined" || !Number.isFinite(s) || s <= 0) return;
  const next = Math.floor(readWatch() + s);
  const raw = String(next);
  window.localStorage.setItem(WATCH_KEY, raw);
  __wRaw = raw;
  __w = next;
  notify();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === QUESTS_XP_KEY || e.key === WATCH_KEY) cb();
  };
  if (typeof window !== "undefined") window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    if (typeof window !== "undefined") window.removeEventListener("storage", onStorage);
  };
}

export type XpBreakdown = {
  lessons: number;
  exercises: number;
  watchHours: number;
  streakDays: number;
  quests: number;
  total: number;
};

export function computeXp(input: {
  lessons: number;
  exercises: number;
  watchSeconds: number;
  streakDays: number;
  questsXp: number;
}): XpBreakdown {
  const lessons = input.lessons * 50;
  const exercises = input.exercises * 120;
  const watchHours = Math.floor(input.watchSeconds / 3600) * 5;
  const streakDays = input.streakDays * 25;
  const quests = Math.max(0, Math.round(input.questsXp));
  return {
    lessons,
    exercises,
    watchHours,
    streakDays,
    quests,
    total: lessons + exercises + watchHours + streakDays + quests,
  };
}

export function levelForXp(xp: number) {
  let l = 1;
  while ((l + 1) * (l + 1) * 100 <= xp) l++;
  const prevLevelXp = l * l * 100;
  const nextLevelXp = (l + 1) * (l + 1) * 100;
  const levelProgress = Math.min(1, Math.max(0, (xp - prevLevelXp) / (nextLevelXp - prevLevelXp)));
  return { level: l, prevLevelXp, nextLevelXp, levelProgress };
}

export function rankForLevel(level: number) {
  if (level >= 20) return "Arquiteto Imperial";
  if (level >= 15) return "Mestre Concierge";
  if (level >= 10) return "Operador de Elite";
  if (level >= 6) return "Estrategista";
  if (level >= 3) return "Aprendiz Avançado";
  return "Iniciante";
}

export function useXp() {
  const { completedCount } = useProgress();
  const { count: exercisesDone } = useExercises();
  const { current: streakDays } = useStreak();
  const watchSeconds = useSyncExternalStore(subscribe, readWatch, readWatch);
  const questsXp = useSyncExternalStore(subscribe, readQuestsXp, readQuestsXp);

  return useMemo(() => {
    const breakdown = computeXp({
      lessons: completedCount,
      exercises: exercisesDone,
      watchSeconds,
      streakDays,
      questsXp,
    });
    const { level, prevLevelXp, nextLevelXp, levelProgress } = levelForXp(breakdown.total);
    return {
      xp: breakdown.total,
      breakdown,
      level,
      prevLevelXp,
      nextLevelXp,
      levelProgress,
      rank: rankForLevel(level),
      watch: watchSeconds,
    };
  }, [completedCount, exercisesDone, watchSeconds, streakDays, questsXp]);
}
