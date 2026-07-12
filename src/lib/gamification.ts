import { useCallback, useEffect, useMemo, useSyncExternalStore } from "react";
import { useProgress } from "./progress";
import { useExercises } from "./user-state";

const STREAK_KEY = "aiae:streak:v1";
const WATCH_KEY = "aiae:watch:v1"; // seconds watched total

type StreakData = {
  lastDay: string; // YYYY-MM-DD
  current: number;
  best: number;
  freezes: number;
};

const DEFAULT_STREAK: StreakData = { lastDay: "", current: 0, best: 0, freezes: 2 };

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

function today() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}
function daysBetween(a: string, b: string) {
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000);
}

function readStreak(): StreakData {
  if (typeof window === "undefined") return DEFAULT_STREAK;
  try {
    return { ...DEFAULT_STREAK, ...JSON.parse(window.localStorage.getItem(STREAK_KEY) ?? "{}") };
  } catch {
    return DEFAULT_STREAK;
  }
}
function writeStreak(s: StreakData) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STREAK_KEY, JSON.stringify(s));
  notify();
}

function readWatch(): number {
  if (typeof window === "undefined") return 0;
  return Number(window.localStorage.getItem(WATCH_KEY) ?? "0") || 0;
}
function writeWatch(seconds: number) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(WATCH_KEY, String(Math.max(0, Math.floor(seconds))));
  notify();
}

export function pingStreak() {
  const cur = readStreak();
  const t = today();
  if (cur.lastDay === t) return cur;
  const gap = cur.lastDay ? daysBetween(cur.lastDay, t) : 1;
  let next = { ...cur };
  if (!cur.lastDay || gap === 1) {
    next.current = cur.current + 1;
  } else if (gap === 2 && cur.freezes > 0) {
    next.freezes = cur.freezes - 1;
    next.current = cur.current + 1;
  } else {
    next.current = 1;
  }
  next.best = Math.max(next.best, next.current);
  next.lastDay = t;
  writeStreak(next);
  return next;
}

export function addWatchSeconds(s: number) {
  writeWatch(readWatch() + s);
}

export function useGamification() {
  const streak = useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    readStreak,
    () => DEFAULT_STREAK,
  );
  const watch = useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    readWatch,
    () => 0,
  );

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STREAK_KEY || e.key === WATCH_KEY) notify();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const { completedCount } = useProgress();
  const { doneCount: exercisesDone } = useExercises();

  const xp = useMemo(() => {
    // 50 XP por aula, 120 por exercício, 5 por hora assistida, 25 por dia de streak
    return completedCount * 50 + exercisesDone * 120 + Math.floor(watch / 3600) * 5 + streak.current * 25;
  }, [completedCount, exercisesDone, watch, streak.current]);

  const level = useMemo(() => {
    // Level curve: L requires L*L*100 XP total
    let l = 1;
    while ((l + 1) * (l + 1) * 100 <= xp) l++;
    return l;
  }, [xp]);

  const nextLevelXp = (level + 1) * (level + 1) * 100;
  const prevLevelXp = level * level * 100;
  const levelProgress = Math.min(1, Math.max(0, (xp - prevLevelXp) / (nextLevelXp - prevLevelXp)));

  const rank = useMemo(() => {
    if (level >= 20) return "Arquiteto Imperial";
    if (level >= 15) return "Mestre Concierge";
    if (level >= 10) return "Operador de Elite";
    if (level >= 6) return "Estrategista";
    if (level >= 3) return "Aprendiz Avançado";
    return "Iniciante";
  }, [level]);

  const ping = useCallback(() => pingStreak(), []);

  return { streak, watch, xp, level, nextLevelXp, prevLevelXp, levelProgress, rank, ping };
}

// ---------- Leaderboard (mock cohort) ----------
export type LeaderRow = {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  xp: number;
  streak: number;
  country: string;
  isMe?: boolean;
};

const COHORT: LeaderRow[] = [
  { id: "1", name: "Marina Yamamoto", handle: "marina.y", avatar: "🌸", xp: 12480, streak: 47, country: "🇧🇷" },
  { id: "2", name: "Diego Fontana", handle: "diegof", avatar: "⚡", xp: 11220, streak: 39, country: "🇦🇷" },
  { id: "3", name: "Ana Beatriz Rocha", handle: "anabia", avatar: "♠︎", xp: 10870, streak: 44, country: "🇵🇹" },
  { id: "4", name: "Kaio Mendes", handle: "kaio.m", avatar: "◈", xp: 9640, streak: 22, country: "🇧🇷" },
  { id: "5", name: "Sophie Laurent", handle: "sophiel", avatar: "✦", xp: 9105, streak: 31, country: "🇫🇷" },
  { id: "6", name: "Rafa Guimarães", handle: "rafag", avatar: "▲", xp: 8420, streak: 18, country: "🇧🇷" },
  { id: "7", name: "Thiago Bastos", handle: "tbastos", avatar: "◆", xp: 7960, streak: 12, country: "🇧🇷" },
  { id: "8", name: "Isabela Cordeiro", handle: "isacord", avatar: "❖", xp: 7240, streak: 20, country: "🇧🇷" },
  { id: "9", name: "Lucas Petrini", handle: "lpetrini", avatar: "☾", xp: 6780, streak: 9, country: "🇮🇹" },
  { id: "10", name: "Beatriz Aoki", handle: "beaoki", avatar: "❀", xp: 6210, streak: 27, country: "🇯🇵" },
  { id: "11", name: "Rodrigo Silveira", handle: "rsilv", avatar: "◇", xp: 5450, streak: 14, country: "🇧🇷" },
  { id: "12", name: "Camila Ferraz", handle: "camif", avatar: "✧", xp: 4980, streak: 8, country: "🇧🇷" },
];

export function useLeaderboard(myXp: number, myStreak: number, myName: string, myAvatar: string) {
  const rows: LeaderRow[] = useMemo(() => {
    const me: LeaderRow = {
      id: "me",
      name: myName || "Você",
      handle: "voce",
      avatar: myAvatar || "◆",
      xp: myXp,
      streak: myStreak,
      country: "🇧🇷",
      isMe: true,
    };
    return [...COHORT, me].sort((a, b) => b.xp - a.xp);
  }, [myXp, myStreak, myName, myAvatar]);

  const myRank = rows.findIndex((r) => r.isMe) + 1;
  return { rows, myRank };
}
