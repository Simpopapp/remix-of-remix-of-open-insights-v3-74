import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Circle, Clock, PlayCircle } from "lucide-react";
import { course } from "@/lib/course-data";
import { useProgress } from "@/lib/progress";
import { useQuizResults } from "@/lib/quiz-data";

export const Route = createFileRoute("/mapa")({
  head: () => ({
    meta: [
      { title: "Mapa do curso — AI App Empire" },
      {
        name: "description",
        content:
          "Sitemap completo: todos os módulos, aulas e quizzes do curso, com status de conclusão.",
      },
    ],
  }),
  component: MapaPage,
});

function durationToMin(d: string) {
  const [mm, ss] = d.split(":").map((n) => parseInt(n, 10) || 0);
  return mm + ss / 60;
}

function MapaPage() {
  const { isDone } = useProgress();
  const { get: getQuiz } = useQuizResults();

  const totalLessons = course.modules.reduce((a, m) => a + m.lessons.length, 0);
  const doneLessons = course.modules.reduce(
    (a, m) => a + m.lessons.filter((l) => isDone(m.id, l.id)).length,
    0,
  );
  const totalMinutes = Math.round(
    course.modules.reduce(
      (a, m) => a + m.lessons.reduce((b, l) => b + durationToMin(l.duration), 0),
      0,
    ),
  );

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10 lg:py-14">
      <div className="text-xs uppercase tracking-[0.28em] text-primary">Sitemap</div>
      <h1 className="mt-2 font-serif text-4xl lg:text-5xl tracking-tight">Mapa do curso</h1>
      <p className="mt-3 max-w-xl text-muted-foreground">
        Tudo que existe: cada módulo, cada aula, cada quiz. Perfeito para escanear o caminho inteiro.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <Stat label="Módulos" value={String(course.modules.length)} />
        <Stat label="Aulas" value={`${doneLessons}/${totalLessons}`} />
        <Stat label="Duração total" value={`${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`} />
      </div>

      <div className="mt-10 space-y-8">
        {course.modules.map((m) => {
          const done = m.lessons.filter((l) => isDone(m.id, l.id)).length;
          const pct = Math.round((done / m.lessons.length) * 100);
          const quiz = getQuiz(m.id);
          return (
            <section key={m.id} className="rounded-2xl border border-border bg-card overflow-hidden">
              <header className="flex flex-wrap items-center gap-4 border-b border-border p-5">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-primary/15 border border-primary/40 font-mono text-primary text-sm">
                  {String(m.number).padStart(2, "0")}
                </div>
                <div className="min-w-0 flex-1">
                  <Link
                    to="/modulo/$moduleId"
                    params={{ moduleId: m.id }}
                    className="font-serif text-xl truncate hover:text-primary"
                  >
                    {m.title}
                  </Link>
                  <div className="text-xs text-muted-foreground truncate">{m.tagline}</div>
                </div>
                <div className="text-xs tabular-nums text-muted-foreground shrink-0">
                  {done}/{m.lessons.length} · {pct}%
                </div>
              </header>

              <ol className="divide-y divide-border">
                {m.lessons.map((l, i) => {
                  const c = isDone(m.id, l.id);
                  return (
                    <li key={l.id} className="flex items-center gap-3 p-3 hover:bg-accent/30 transition">
                      {c ? (
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                      ) : (
                        <Circle className="h-4 w-4 text-muted-foreground/60 shrink-0" />
                      )}
                      <div className="w-8 text-[10px] font-mono text-muted-foreground shrink-0">
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      <Link
                        to="/aula/$moduleId/$lessonId"
                        params={{ moduleId: m.id, lessonId: l.id }}
                        className="flex-1 min-w-0 text-sm truncate hover:text-primary"
                      >
                        {l.title}
                      </Link>
                      <div className="hidden sm:flex items-center gap-1 text-[11px] tabular-nums text-muted-foreground shrink-0">
                        <Clock className="h-3 w-3" /> {l.duration}
                      </div>
                      <Link
                        to="/aula/$moduleId/$lessonId"
                        params={{ moduleId: m.id, lessonId: l.id }}
                        aria-label={`Abrir aula ${l.title}`}
                        className="ml-2 grid h-7 w-7 place-items-center rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition shrink-0"
                      >
                        <PlayCircle className="h-3.5 w-3.5" />
                      </Link>
                    </li>
                  );
                })}
              </ol>

              <div className="border-t border-border bg-muted/20 px-5 py-3 text-xs text-muted-foreground flex items-center justify-between">
                <span>
                  Quiz do módulo: {quiz ? `${quiz.score}/${quiz.total}` : "não feito"}
                </span>
                <Link
                  to="/quiz/$moduleId"
                  params={{ moduleId: m.id }}
                  className="text-primary hover:underline"
                >
                  {quiz ? "refazer →" : "começar →"}
                </Link>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{label}</div>
      <div className="mt-2 font-serif text-2xl">{value}</div>
    </div>
  );
}
