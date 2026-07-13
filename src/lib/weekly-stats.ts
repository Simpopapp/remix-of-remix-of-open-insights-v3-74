import { useMemo } from "react";
import { useActivity, type ActivityKind } from "./activity";
import { course } from "./course-data";
import { useProgress } from "./progress";

const KINDS: ActivityKind[] = ["lesson", "exercise", "focus", "note", "watch"];

export function useWeeklyStats() {
  const { days } = useActivity(7);
  const { isDone } = useProgress();

  return useMemo(() => {
    const totals: Record<ActivityKind, number> = {
      lesson: 0,
      exercise: 0,
      focus: 0,
      note: 0,
      watch: 0,
    };
    for (const d of days) {
      for (const k of KINDS) {
        totals[k] += d.kinds[k] ?? 0;
      }
    }

    // Most active module: heuristic — module with the most completed lessons
    const byModule = course.modules.map((m) => ({
      id: m.id,
      title: m.title,
      done: m.lessons.filter((l) => isDone(m.id, l.id)).length,
      total: m.lessons.length,
    }));
    const topModule = [...byModule].sort((a, b) => b.done - a.done)[0];

    // Daily bars
    const bars = days.map((d) => ({
      date: d.date,
      label: new Date(d.date + "T00:00:00").toLocaleDateString("pt-BR", { weekday: "short" }),
      total: d.total,
    }));
    const maxBar = Math.max(1, ...bars.map((b) => b.total));

    return {
      totals,
      bars,
      maxBar,
      activeDays: days.filter((d) => d.total > 0).length,
      topModule,
      byModule,
    };
  }, [days, isDone]);
}
