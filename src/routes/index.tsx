import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, PlayCircle } from "lucide-react";
import { course, totalLessons } from "@/lib/course-data";
import { useProgress } from "@/lib/progress";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

function Dashboard() {
  const { isDone, completedCount } = useProgress();
  const pct = Math.round((completedCount / totalLessons) * 100);

  // find next lesson (first not-done)
  let next: { moduleId: string; lessonId: string; title: string; moduleTitle: string } | null = null;
  outer: for (const m of course.modules) {
    for (const l of m.lessons) {
      if (!isDone(m.id, l.id)) {
        next = { moduleId: m.id, lessonId: l.id, title: l.title, moduleTitle: m.title };
        break outer;
      }
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 lg:py-14">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 lg:p-12">
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            background:
              "radial-gradient(600px circle at 15% 10%, oklch(0.76 0.09 82 / 0.18), transparent 60%), radial-gradient(500px circle at 90% 90%, oklch(0.5 0.1 260 / 0.15), transparent 60%)",
          }}
        />
        <div className="relative">
          <div className="text-xs uppercase tracking-[0.24em] text-primary">Curso premium</div>
          <h1 className="mt-3 font-serif text-4xl lg:text-6xl leading-[1.05] tracking-tight">
            {course.title}
          </h1>
          <p className="mt-4 max-w-2xl text-base lg:text-lg text-muted-foreground">
            {course.subtitle}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-6">
            <div className="min-w-[220px]">
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-3xl">{pct}%</span>
                <span className="text-xs uppercase tracking-widest text-muted-foreground">
                  concluído
                </span>
              </div>
              <Progress value={pct} className="mt-2 h-1.5" />
              <div className="mt-2 text-xs text-muted-foreground">
                {completedCount} de {totalLessons} aulas
              </div>
            </div>

            {next ? (
              <Link
                to="/aula/$moduleId/$lessonId"
                params={{ moduleId: next.moduleId, lessonId: next.lessonId }}
                className="group inline-flex items-center gap-3 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-95"
              >
                <PlayCircle className="h-4 w-4" />
                Continuar: {next.title}
                <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            ) : (
              <div className="text-sm text-muted-foreground">Você concluiu tudo. Bem-vindo ao topo.</div>
            )}
          </div>
        </div>
      </section>

      {/* Modules */}
      <section className="mt-14">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Trilha</div>
            <h2 className="font-serif text-3xl mt-1">Módulos</h2>
          </div>
          <div className="text-sm text-muted-foreground">
            {course.modules.length} módulos · {totalLessons} aulas
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {course.modules.map((m) => {
            const done = m.lessons.filter((l) => isDone(m.id, l.id)).length;
            const mpct = Math.round((done / m.lessons.length) * 100);
            return (
              <Link
                key={m.id}
                to="/modulo/$moduleId"
                params={{ moduleId: m.id }}
                className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition hover:border-primary/50"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="text-xs font-mono text-primary">
                    M{String(m.number).padStart(2, "0")}
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground transition group-hover:text-primary group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
                <h3 className="mt-3 font-serif text-2xl leading-tight tracking-tight">
                  {m.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{m.tagline}</p>
                <div className="mt-6 flex items-center gap-3">
                  <Progress value={mpct} className="h-1 flex-1" />
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {done}/{m.lessons.length}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
