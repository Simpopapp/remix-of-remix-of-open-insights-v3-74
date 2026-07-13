import { useMemo } from "react";
import { course, allLessons, type Module, type Lesson } from "./course-data";
import { useProgress } from "./progress";

/**
 * Related lessons for the currently-viewed lesson.
 * Priority: incomplete siblings in the same module (nearest first),
 * then first incomplete lessons of subsequent modules.
 */
export function useRelated(moduleId: string, lessonId: string, limit = 3) {
  const { isDone, completedCount } = useProgress();
  return useMemo(() => {
    void completedCount; // recompute when progress changes
    const result: { module: Module; lesson: Lesson; reason: string }[] = [];
    const mod = course.modules.find((m) => m.id === moduleId);
    if (!mod) return result;
    const idx = mod.lessons.findIndex((l) => l.id === lessonId);

    const after = mod.lessons.slice(idx + 1);
    const before = mod.lessons.slice(0, Math.max(0, idx)).reverse();
    for (const l of [...after, ...before]) {
      if (result.length >= limit) break;
      if (isDone(mod.id, l.id)) continue;
      result.push({ module: mod, lesson: l, reason: "Mesmo módulo" });
    }

    if (result.length < limit) {
      const modIdx = course.modules.findIndex((m) => m.id === moduleId);
      for (const m of course.modules.slice(modIdx + 1)) {
        if (result.length >= limit) break;
        const first = m.lessons.find((l) => !isDone(m.id, l.id));
        if (first) result.push({ module: m, lesson: first, reason: `Próximo módulo · ${m.title}` });
      }
    }

    return result.slice(0, limit);
  }, [moduleId, lessonId, isDone, completedCount]);
}

/**
 * The single "next best thing to do" — used by the dashboard.
 */
export function useNextStep() {
  const { isDone, completedCount } = useProgress();
  return useMemo(() => {
    const all = allLessons();
    const nextIncomplete = all.find(({ module, lesson }) => !isDone(module.id, lesson.id));
    if (!nextIncomplete) return undefined;
    return {
      module: nextIncomplete.module,
      lesson: nextIncomplete.lesson,
      reason:
        completedCount === 0
          ? "Comece por aqui"
          : `${completedCount} aulas concluídas · continue de onde parou`,
    };
  }, [isDone, completedCount]);
}
