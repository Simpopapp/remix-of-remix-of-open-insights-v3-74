import { useMemo } from "react";
import { useActivity, type ActivityKind } from "./activity";
import { course } from "./course-data";
import { useProgress } from "./progress";

const KINDS: ActivityKind[] = ["lesson", "exercise", "focus", "note", "watch"];

export function useWeeklyStats() {
  const { days } = useActivity(14);
  const { isDone } = useProgress();

  return useMemo(() => {
    const thisWeek = days.slice(-7);
    const prevWeek = days.slice(0, 7);

    const sum = (arr: typeof days) => {
      const t: Record<ActivityKind, number> = { lesson: 0, exercise: 0, focus: 0, note: 0, watch: 0 };
      for (const d of arr) for (const k of KINDS) t[k] += d.kinds[k] ?? 0;
      return t;
    };

    const totals = sum(thisWeek);
    const prevTotals = sum(prevWeek);

    const deltas: Record<ActivityKind, number> = {
      lesson: totals.lesson - prevTotals.lesson,
      exercise: totals.exercise - prevTotals.exercise,
      focus: totals.focus - prevTotals.focus,
      note: totals.note - prevTotals.note,
      watch: totals.watch - prevTotals.watch,
    };

    const byModule = course.modules.map((m) => ({
      id: m.id,
      title: m.title,
      done: m.lessons.filter((l) => isDone(m.id, l.id)).length,
      total: m.lessons.length,
    }));
    const topModule = [...byModule].sort((a, b) => b.done - a.done)[0];

    const bars = thisWeek.map((d) => ({
      date: d.date,
      label: new Date(d.date + "T00:00:00").toLocaleDateString("pt-BR", { weekday: "short" }),
      total: d.total,
    }));
    const maxBar = Math.max(1, ...bars.map((b) => b.total));

    return {
      totals,
      prevTotals,
      deltas,
      bars,
      maxBar,
      activeDays: thisWeek.filter((d) => d.total > 0).length,
      prevActiveDays: prevWeek.filter((d) => d.total > 0).length,
      topModule,
      byModule,
    };
  }, [days, isDone]);
}
