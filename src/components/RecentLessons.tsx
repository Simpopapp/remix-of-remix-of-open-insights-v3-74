import { Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { Clock3, PlayCircle } from "lucide-react";
import { course } from "@/lib/course-data";
import { useProgress } from "@/lib/progress";
import { useVideoStore } from "@/lib/video-progress";

function fmt(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function RecentLessons({ limit = 5 }: { limit?: number }) {
  const store = useVideoStore();
  const { isDone } = useProgress();

  const items = useMemo(() => {
    return Object.entries(store)
      .map(([k, v]) => {
        const [moduleId, lessonId] = k.split("/");
        return { key: k, moduleId, lessonId, ...v };
      })
      .filter((x) => x.moduleId && x.lessonId && x.u)
      .sort((a, b) => (b.u ?? 0) - (a.u ?? 0))
      .slice(0, limit)
      .map((x) => {
        const mod = course.modules.find((m) => m.id === x.moduleId);
        const les = mod?.lessons.find((l) => l.id === x.lessonId);
        if (!mod || !les) return null;
        return {
          ...x,
          mod,
          les,
          done: isDone(x.moduleId, x.lessonId),
          pct: x.d > 0 ? Math.min(100, Math.round((x.t / x.d) * 100)) : 0,
        };
      })
      .filter(<T,>(v: T | null): v is T => v !== null);
  }, [store, isDone, limit]);

  if (items.length === 0) return null;

  return (
    <section className="mt-14">
      <div className="flex items-end justify-between mb-4">
        <div>
          <div className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
            Últimas aulas
          </div>
          <h2 className="font-serif text-2xl mt-1">Vistas recentemente</h2>
        </div>
      </div>
      <ul className="divide-y divide-border rounded-2xl border border-border bg-card overflow-hidden">
        {items.map((it) => (
          <li key={it.key}>
            <Link
              to="/aula/$moduleId/$lessonId"
              params={{ moduleId: it.mod.id, lessonId: it.les.id }}
              search={{ t: it.done ? undefined : it.t || undefined }}
              className="group flex items-center gap-4 p-4 hover:bg-primary/5 transition"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/15 text-primary">
                <PlayCircle className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-primary">
                  M{String(it.mod.number).padStart(2, "0")} · {it.mod.title}
                </div>
                <div className="mt-0.5 truncate font-medium">{it.les.title}</div>
                <div className="mt-2 flex items-center gap-3">
                  <div className="h-1 flex-1 rounded-full bg-border overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${it.done ? 100 : it.pct}%` }}
                    />
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] tabular-nums text-muted-foreground shrink-0">
                    <Clock3 className="h-3 w-3" />
                    {it.done ? "Concluída" : `${fmt(it.t)} / ${fmt(it.d)}`}
                  </span>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
