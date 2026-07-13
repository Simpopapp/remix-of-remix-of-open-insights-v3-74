import { useMemo } from "react";
import { useActivity, type ActivityKind } from "./activity";

const KINDS: ActivityKind[] = ["lesson", "exercise", "focus", "note", "watch"];

export function useMonthlyStats() {
  const { days } = useActivity(60);
  return useMemo(() => {
    const thisM = days.slice(-30);
    const prevM = days.slice(0, 30);
    const sum = (arr: typeof days) => {
      const t: Record<ActivityKind, number> = { lesson: 0, exercise: 0, focus: 0, note: 0, watch: 0 };
      for (const d of arr) for (const k of KINDS) t[k] += d.kinds[k] ?? 0;
      return t;
    };
    const totals = sum(thisM);
    const prevTotals = sum(prevM);
    const deltas: Record<ActivityKind, number> = {
      lesson: totals.lesson - prevTotals.lesson,
      exercise: totals.exercise - prevTotals.exercise,
      focus: totals.focus - prevTotals.focus,
      note: totals.note - prevTotals.note,
      watch: totals.watch - prevTotals.watch,
    };
    const activeDays = thisM.filter((d) => d.total > 0).length;
    const prevActiveDays = prevM.filter((d) => d.total > 0).length;
    const bestDay = [...thisM].sort((a, b) => b.total - a.total)[0];
    return { totals, prevTotals, deltas, activeDays, prevActiveDays, bestDay, days: thisM };
  }, [days]);
}
