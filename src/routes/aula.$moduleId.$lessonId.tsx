import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, FileText, PlayCircle, Sparkles } from "lucide-react";
import { findLesson } from "@/lib/course-data";
import { useProgress } from "@/lib/progress";
import { useNotes } from "@/lib/notes";

export const Route = createFileRoute("/aula/$moduleId/$lessonId")({
  loader: ({ params }) => {
    const data = findLesson(params.moduleId, params.lessonId);
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData }) =>
    loaderData
      ? {
          meta: [
            { title: `${loaderData.lesson.title} — ${loaderData.module.title}` },
            { name: "description", content: loaderData.lesson.description },
          ],
        }
      : { meta: [{ title: "Aula não encontrada" }, { name: "robots", content: "noindex" }] },
  component: LessonPage,
  notFoundComponent: () => (
    <div className="p-10 text-center text-muted-foreground">Aula não encontrada.</div>
  ),
  errorComponent: ({ error }) => (
    <div className="p-10 text-center text-destructive">{error.message}</div>
  ),
});

function LessonPage() {
  const { module: mod, lesson, prev, next } = Route.useLoaderData();
  const { isDone, setDone } = useProgress();
  const done = isDone(mod.id, lesson.id);
  const [notes, setNotes] = useNotes(mod.id, lesson.id);

  return (
    <div className="mx-auto max-w-5xl px-6 py-8 lg:py-12">
      <Link
        to="/modulo/$moduleId"
        params={{ moduleId: mod.id }}
        className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3 w-3" />
        {mod.title}
      </Link>

      {/* Player */}
      <div className="mt-6 relative aspect-video overflow-hidden rounded-2xl border border-border bg-card">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, oklch(0.76 0.09 82 / 0.15), transparent 60%), radial-gradient(circle at 70% 80%, oklch(0.5 0.1 260 / 0.2), transparent 60%)",
          }}
        />
        <div className="relative h-full w-full grid place-items-center">
          <button
            className="group flex flex-col items-center gap-3 text-center"
            aria-label="Reproduzir aula"
          >
            <span className="grid h-20 w-20 place-items-center rounded-full bg-primary text-primary-foreground shadow-[0_0_60px_-10px_oklch(0.76_0.09_82/0.6)] transition group-hover:scale-105">
              <PlayCircle className="h-10 w-10" />
            </span>
            <span className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
              {lesson.duration}
            </span>
          </button>
        </div>
      </div>

      {/* Meta */}
      <div className="mt-8 flex items-start justify-between gap-6 flex-wrap">
        <div className="max-w-2xl">
          <div className="text-xs font-mono text-primary">
            M{String(mod.number).padStart(2, "0")} · {mod.title}
          </div>
          <h1 className="mt-2 font-serif text-3xl lg:text-4xl tracking-tight leading-tight">
            {lesson.title}
          </h1>
          <p className="mt-3 text-base text-muted-foreground">{lesson.description}</p>
        </div>

        <button
          onClick={() => setDone(mod.id, lesson.id, !done)}
          className={
            "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition border " +
            (done
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-transparent text-foreground border-border hover:border-primary/60")
          }
        >
          <Check className="h-4 w-4" />
          {done ? "Concluída" : "Marcar como concluída"}
        </button>
      </div>

      {/* Content grid */}
      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-primary">
              <Sparkles className="h-3 w-3" /> Sobre esta aula
            </div>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              {lesson.description} Nesta aula você recebe o framework prático, os
              exemplos reais e o passo a passo para aplicar imediatamente no seu
              projeto. O padrão AI App Empire: zero enrolação, tudo executável.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-primary">
                <FileText className="h-3 w-3" /> Suas anotações
              </div>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                {notes.length} car.
              </span>
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Capture insights, comandos e decisões desta aula…"
              rows={6}
              className="mt-3 w-full resize-y rounded-xl border border-border bg-background/60 p-4 text-sm leading-relaxed placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <div className="mt-2 text-[11px] text-muted-foreground">
              Salvo automaticamente no seu dispositivo.
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="text-xs uppercase tracking-[0.24em] text-primary">
              Recursos
            </div>
            <ul className="mt-3 space-y-2 text-sm">
              {[
                "Slides da aula",
                "Repositório de exemplo",
                "Checklist executável",
                "Transcrição completa",
              ].map((r) => (
                <li
                  key={r}
                  className="flex items-center justify-between rounded-lg border border-transparent hover:border-border hover:bg-accent/40 -mx-2 px-2 py-1.5 transition cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" /> {r}
                  </span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-transparent p-6">
            <div className="text-xs uppercase tracking-[0.24em] text-primary">
              Nota do Concierge
            </div>
            <p className="mt-2 text-sm leading-relaxed">
              Assista uma vez sem pausar. Depois volte e execute cada passo. É
              assim que os alunos de elite aprendem 3x mais rápido.
            </p>
          </div>
        </div>
      </div>

      {/* Prev / Next */}
      <div className="mt-10 grid gap-3 sm:grid-cols-2">
        {prev ? (
          <Link
            to="/aula/$moduleId/$lessonId"
            params={{ moduleId: mod.id, lessonId: prev.id }}
            className="group rounded-xl border border-border bg-card p-4 hover:border-primary/50 transition"
          >
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
              <ArrowLeft className="h-3 w-3" /> Anterior
            </div>
            <div className="mt-1 font-medium truncate">{prev.title}</div>
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link
            to="/aula/$moduleId/$lessonId"
            params={{ moduleId: mod.id, lessonId: next.id }}
            className="group rounded-xl border border-border bg-card p-4 hover:border-primary/50 transition text-right sm:text-right"
          >
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground flex items-center justify-end gap-2">
              Próxima <ArrowRight className="h-3 w-3" />
            </div>
            <div className="mt-1 font-medium truncate">{next.title}</div>
          </Link>
        ) : (
          <Link
            to="/modulo/$moduleId"
            params={{ moduleId: mod.id }}
            className="rounded-xl border border-border bg-card p-4 hover:border-primary/50 transition text-right"
          >
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Fim do módulo
            </div>
            <div className="mt-1 font-medium">Voltar ao módulo</div>
          </Link>
        )}
      </div>
    </div>
  );
}
