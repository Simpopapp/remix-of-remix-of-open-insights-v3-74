import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { CheckCircle2, Circle, PlayCircle, ScrollText } from "lucide-react";
import type { Lesson } from "@/lib/course-data";
import { findModule, course } from "@/lib/course-data";
import { useProgress } from "@/lib/progress";
import { useQuizResults } from "@/lib/quiz-data";
import { Progress } from "@/components/ui/progress";
import { fireConfetti } from "@/lib/confetti";
import { toast } from "sonner";
import heroModule from "@/assets/hero-module.jpg";

export const Route = createFileRoute("/modulo/$moduleId")({
  loader: ({ params }) => {
    const mod = findModule(params.moduleId);
    if (!mod) throw notFound();
    return { mod };
  },
  head: ({ loaderData }) =>
    loaderData
      ? {
          meta: [
            { title: `${loaderData.mod.title} — AI App Empire` },
            { name: "description", content: loaderData.mod.tagline },
          ],
        }
      : { meta: [{ title: "Módulo não encontrado" }, { name: "robots", content: "noindex" }] },
  component: ModulePage,
  notFoundComponent: () => (
    <div className="p-10 text-center text-muted-foreground">Módulo não encontrado.</div>
  ),
  errorComponent: ({ error }) => (
    <div className="p-10 text-center text-destructive">{error.message}</div>
  ),
});

function ModulePage() {
  const { mod } = Route.useLoaderData();
  const { isDone, toggle } = useProgress();
  const { get: getQuiz } = useQuizResults();
  const quizResult = getQuiz(mod.id);
  const done = mod.lessons.filter((l: Lesson) => isDone(mod.id, l.id)).length;
  const pct = Math.round((done / mod.lessons.length) * 100);
  const nextModule = course.modules[course.modules.indexOf(mod) + 1];

  const celebratedKey = `aiae:module-celebrated:${mod.id}`;
  const firedRef = useRef(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (pct !== 100 || firedRef.current) return;
    if (window.localStorage.getItem(celebratedKey)) return;
    firedRef.current = true;
    window.localStorage.setItem(celebratedKey, "1");
    fireConfetti("epic");
    toast.success(`Módulo ${String(mod.number).padStart(2, "0")} finalizado 🎉`, {
      description: `Você concluiu "${mod.title}". Próximo passo: quiz e sair para a prática.`,
    });
  }, [pct, celebratedKey, mod.number, mod.title]);


  return (
    <div className="mx-auto max-w-4xl px-6 py-10 lg:py-14">
      <Link to="/" className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground">
        ← Dashboard
      </Link>

      <section className="relative mt-6 overflow-hidden rounded-3xl border border-border">
        <img
          src="/src/assets/hero-module.jpg"
          alt=""
          width={1600}
          height={640}
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-background via-background/85 to-background/30" />
        <div className="relative p-8 lg:p-12">
          <div className="text-xs font-mono tracking-[0.28em] text-primary">
            MÓDULO {String(mod.number).padStart(2, "0")} · CAPÍTULO DA JORNADA
          </div>
          <h1 className="mt-3 font-serif text-4xl lg:text-6xl tracking-tight leading-[1.05] max-w-3xl">
            {mod.title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">{mod.tagline}</p>
          <p className="mt-3 text-sm text-muted-foreground max-w-2xl leading-relaxed">{mod.summary}</p>

          <div className="mt-8 flex items-center gap-4">
            <Progress value={pct} className="h-1.5 flex-1 max-w-xs" />
            <span className="text-sm tabular-nums text-muted-foreground">
              {done}/{mod.lessons.length} aulas · {pct}%
            </span>
          </div>
        </div>
      </section>


      <ol className="mt-10 divide-y divide-border rounded-xl border border-border bg-card overflow-hidden">
        {mod.lessons.map((l: Lesson, i: number) => {
          const complete = isDone(mod.id, l.id);
          return (
            <li key={l.id} className="group flex items-center gap-4 p-4 hover:bg-accent/40 transition">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  toggle(mod.id, l.id);
                }}
                aria-label={complete ? "Marcar como não concluída" : "Marcar como concluída"}
                className="shrink-0"
              >
                {complete ? (
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground/60 group-hover:text-foreground" />
                )}
              </button>
              <div className="w-8 text-xs font-mono text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </div>
              <Link
                to="/aula/$moduleId/$lessonId"
                params={{ moduleId: mod.id, lessonId: l.id }}
                className="flex-1 min-w-0"
              >
                <div className="font-medium truncate">{l.title}</div>
                <div className="text-xs text-muted-foreground truncate">{l.description}</div>
              </Link>
              <div className="text-xs tabular-nums text-muted-foreground">{l.duration}</div>
              <Link
                to="/aula/$moduleId/$lessonId"
                params={{ moduleId: mod.id, lessonId: l.id }}
                className="ml-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition"
              >
                <PlayCircle className="h-4 w-4" />
              </Link>
            </li>
          );
        })}
      </ol>

      <Link
        to="/quiz/$moduleId"
        params={{ moduleId: mod.id }}
        className="mt-8 flex items-center gap-4 rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 to-transparent p-5 hover:border-primary/60 transition"
      >
        <span className="grid h-11 w-11 place-items-center rounded-full bg-primary/15 border border-primary/40">
          <ScrollText className="h-5 w-5 text-primary" />
        </span>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] uppercase tracking-[0.2em] text-primary/70">Quiz do módulo</div>
          <div className="font-serif text-lg">
            {quizResult
              ? `Sua melhor: ${quizResult.score}/${quizResult.total}`
              : "Teste sua absorção em 5 perguntas"}
          </div>
        </div>
        <span className="text-xs uppercase tracking-[0.2em] text-primary">
          {quizResult ? "refazer →" : "começar →"}
        </span>
      </Link>

      {nextModule && (
        <Link
          to="/modulo/$moduleId"
          params={{ moduleId: nextModule.id }}
          className="mt-8 block rounded-xl border border-border bg-card p-5 hover:border-primary/50 transition"
        >
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Próximo módulo</div>
          <div className="mt-1 font-serif text-xl">{nextModule.title}</div>
        </Link>
      )}
    </div>
  );
}
