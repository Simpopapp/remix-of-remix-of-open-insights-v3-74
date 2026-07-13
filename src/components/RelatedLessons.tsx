import { Link } from "@tanstack/react-router";
import { Sparkles, ArrowUpRight } from "lucide-react";
import { useRelated } from "@/lib/recommend";

export function RelatedLessons({ moduleId, lessonId }: { moduleId: string; lessonId: string }) {
  const related = useRelated(moduleId, lessonId, 3);
  if (related.length === 0) return null;

  return (
    <section className="mt-10 rounded-2xl border border-border bg-card p-6 lg:p-8">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-primary">
        <Sparkles className="h-3 w-3" /> Recomendado para você
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {related.map(({ module, lesson, reason }) => (
          <Link
            key={`${module.id}/${lesson.id}`}
            to="/aula/$moduleId/$lessonId"
            params={{ moduleId: module.id, lessonId: lesson.id }}
            className="group rounded-xl border border-border bg-background/40 p-4 hover:border-primary/50 transition"
          >
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {reason}
            </div>
            <div className="mt-1 flex items-start justify-between gap-2">
              <div className="font-medium text-sm leading-snug">{lesson.title}</div>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary transition" />
            </div>
            {lesson.duration && (
              <div className="mt-2 text-[11px] tabular-nums text-muted-foreground">
                {lesson.duration}
              </div>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
