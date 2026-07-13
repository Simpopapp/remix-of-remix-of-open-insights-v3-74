import { useMemo } from "react";
import { course, allLessons, type Module, type Lesson } from "./course-data";
import { useProgress } from "./progress";

/**
 * Related lessons for the currently-viewed lesson.
 * Priority: incomplete siblings in the same module (nearest first),
 * then first incomplete lessons of subsequent modules.
 */
export function useRelated(moduleId: string, lessonId: string, limit = 3) {
  const { isDone } = useProgress();
  return useMemo(() => {
    const result: { module: Module; lesson: Lesson; reason: string }[] = [];
    const mod = course.modules.find((m) => m.id === moduleId);
    if (!mod) return result;
    const idx = mod.lessons.findIndex((l) => l.id === lessonId);

    // 1) Nearest incomplete siblings in same module (after current, then before)
    const after = mod.lessons.slice(idx + 1);
    const before = mod.lessons.slice(0, Math.max(0, idx)).reverse();
    for (const l of [...after, ...before]) {
      if (result.length >= limit) break;
      if (done.has(`${mod.id}/${l.id}`)) continue;
      result.push({ module: mod, lesson: l, reason: "Mesmo módulo" });
    }

    // 2) First incomplete lesson of subsequent modules
    if (result.length < limit) {
      const modIdx = course.modules.findIndex((m) => m.id === moduleId);
      for (const m of course.modules.slice(modIdx + 1)) {
        if (result.length >= limit) break;
        const first = m.lessons.find((l) => !done.has(`${m.id}/${l.id}`));
        if (first) result.push({ module: m, lesson: first, reason: `Próximo módulo · ${m.title}` });
      }
    }

    return result.slice(0, limit);
  }, [moduleId, lessonId, done]);
}

/**
 * The single "next best thing to do" — used by the dashboard.
 */
export function useNextStep() {
  const { done } = useProgress();
  return useMemo(() => {
    const all = allLessons();
    const nextIncomplete = all.find(({ module, lesson }) => !done.has(`${module.id}/${lesson.id}`));
    if (!nextIncomplete) return undefined;
    return {
      module: nextIncomplete.module,
      lesson: nextIncomplete.lesson,
      reason:
        done.size === 0
          ? "Comece por aqui"
          : `${done.size} aulas concluídas · continue de onde parou`,
    };
  }, [done]);
}
