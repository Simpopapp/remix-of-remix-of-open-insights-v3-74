import { Link } from "@tanstack/react-router";
import { PlayCircle, RotateCcw } from "lucide-react";
import { useMemo } from "react";
import { course } from "@/lib/course-data";
import { useProgress } from "@/lib/progress";
import { useVideoStore, readLastKey } from "@/lib/video-progress";

function fmt(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function ContinueWatching() {
  const store = useVideoStore();
  const { isDone } = useProgress();

  const pick = useMemo(() => {
    const last = readLastKey();
    const candidates = Object.entries(store)
      .map(([k, v]) => {
        const [moduleId, lessonId] = k.split("/");
        return { key: k, moduleId, lessonId, ...v };
      })
      .filter(
        (c) =>
          c.moduleId &&
          c.lessonId &&
          !isDone(c.moduleId, c.lessonId) &&
          c.d > 0 &&
          c.t > 5 &&
          c.t < c.d - 5,
      );

    let chosen = candidates.find((c) => c.key === last);
    if (!chosen) {
      chosen = [...candidates].sort((a, b) => (b.u ?? 0) - (a.u ?? 0))[0];
    }
    if (!chosen) return null;

    const mod = course.modules.find((m) => m.id === chosen!.moduleId);
    const les = mod?.lessons.find((l) => l.id === chosen!.lessonId);
    if (!mod || !les) return null;
    return { chosen, mod, les };
  }, [store, isDone]);

  if (!pick) return null;
  const { chosen, mod, les } = pick;
  const pct = Math.min(100, Math.round((chosen.t / chosen.d) * 100));

  return (
    <section className="mt-8">
      <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground shadow-[0_0_40px_-8px_oklch(0.76_0.09_82/0.7)]">
            <PlayCircle className="h-7 w-7" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-primary">
              <RotateCcw className="h-3 w-3" /> Retomar de onde parou
            </div>
            <div className="mt-1 font-serif text-lg sm:text-xl leading-tight truncate">
              {les.title}
            </div>
            <div className="mt-0.5 text-xs text-muted-foreground truncate">
              {mod.title} · {fmt(chosen.t)} / {fmt(chosen.d)}
            </div>
            <div className="mt-3 h-1 w-full rounded-full bg-border overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
          <Link
            to="/aula/$moduleId/$lessonId"
            params={{ moduleId: mod.id, lessonId: les.id }}
            search={{ t: chosen.t }}
            className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-95"
          >
            Continuar
          </Link>
        </div>
      </div>
    </section>
  );
}
