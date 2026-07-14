// Thin adapter over the canonical stores (xp.ts + streak.ts). Kept for
// backwards compatibility with existing consumers of `useGamification()`.
// New code should read from `useXp()` and `useStreak()` directly.
import { useCallback, useMemo } from "react";
import { useXp, addWatchSeconds } from "./xp";
import { useStreak } from "./streak";
import { pingActivity } from "./activity";

export { addWatchSeconds };

/** @deprecated Streak advances automatically via `pingActivity`. Kept as a no-op alias. */
export function pingStreak() {
  pingActivity("watch");
}

export function useGamification() {
  const xp = useXp();
  const streakData = useStreak();

  const streak = useMemo(
    () => ({
      current: streakData.current,
      best: streakData.longest,
      freezes: streakData.freezesLeft,
    }),
    [streakData.current, streakData.longest, streakData.freezesLeft],
  );

  const ping = useCallback(() => pingActivity("watch"), []);

  return {
    streak,
    watch: xp.watch,
    xp: xp.xp,
    level: xp.level,
    nextLevelXp: xp.nextLevelXp,
    prevLevelXp: xp.prevLevelXp,
    levelProgress: xp.levelProgress,
    rank: xp.rank,
    ping,
  };
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
