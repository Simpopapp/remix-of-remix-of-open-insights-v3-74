import { Link, useRouterState } from "@tanstack/react-router";
import { PlayCircle, X } from "lucide-react";
import { useMemo, useState } from "react";
import { course } from "@/lib/course-data";
import { useProgress } from "@/lib/progress";
import { useVideoStore, readLastKey } from "@/lib/video-progress";

export function MiniPlayer() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const store = useVideoStore();
  const { isDone } = useProgress();
  const [dismissed, setDismissed] = useState(false);

  const pick = useMemo(() => {
    if (typeof window === "undefined") return null;
    const last = readLastKey();
    if (!last) return null;
    const v = store[last];
    if (!v || v.d <= 0 || v.t < 5 || v.t > v.d - 5) return null;
    const [moduleId, lessonId] = last.split("/");
    if (isDone(moduleId, lessonId)) return null;
    const mod = course.modules.find((m) => m.id === moduleId);
    const les = mod?.lessons.find((l) => l.id === lessonId);
    if (!mod || !les) return null;
    return { moduleId, lessonId, t: v.t, d: v.d, title: les.title };
  }, [store, isDone]);

  const hide =
    dismissed ||
    !pick ||
    pathname.startsWith("/aula/") ||
    pathname === "/onboarding" ||
    pathname.startsWith("/foco");

  if (hide || !pick) return null;
  const pct = Math.min(100, Math.round((pick.t / pick.d) * 100));

  return (
    <div className="fixed bottom-4 right-4 z-40 w-[300px] max-w-[calc(100vw-2rem)] rounded-2xl border border-primary/30 bg-card/95 backdrop-blur shadow-2xl print:hidden">
      <div className="p-3">
        <div className="flex items-start gap-2">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
            <PlayCircle className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] uppercase tracking-[0.2em] text-primary">Retomar aula</div>
            <div className="mt-0.5 truncate text-sm font-medium">{pick.title}</div>
          </div>
          <button
            onClick={() => setDismissed(true)}
            aria-label="Fechar mini player"
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-border">
          <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
        </div>
        <Link
          to="/aula/$moduleId/$lessonId"
          params={{ moduleId: pick.moduleId, lessonId: pick.lessonId }}
          search={{ t: pick.t }}
          className="mt-2 block rounded-full bg-primary px-3 py-1.5 text-center text-xs font-medium text-primary-foreground hover:opacity-95"
        >
          Continuar de {Math.floor(pick.t / 60)}:{String(Math.floor(pick.t % 60)).padStart(2, "0")}
        </Link>
      </div>
    </div>
  );
}
