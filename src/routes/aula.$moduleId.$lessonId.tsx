import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  Check,
  Clock3,
  FileText,
  ListChecks,
  MessageSquare,
  Sparkles,
  Target,
} from "lucide-react";
import { VideoPlayer } from "@/components/VideoPlayer";
import { useState } from "react";
import { findLesson, type Lesson, type Module } from "@/lib/course-data";
import { useProgress } from "@/lib/progress";
import { useNotes } from "@/lib/notes";
import { useBookmarks, useExercises, lessonKey } from "@/lib/user-state";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

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
  const data = Route.useLoaderData() as { module: Module; lesson: Lesson; prev?: Lesson; next?: Lesson };
  const { module: mod, lesson, prev, next } = data;
  const { isDone, setDone } = useProgress();
  const done = isDone(mod.id, lesson.id);
  const [notes, setNotes] = useNotes(mod.id, lesson.id);
  const bookmarks = useBookmarks();
  const exercises = useExercises();
  const k = lessonKey(mod.id, lesson.id);
  const bookmarked = bookmarks.has(k);
  const exerciseDone = exercises.has(k);
  const [copied, setCopied] = useState(false);

  const difficultyColors: Record<Lesson["exercise"]["difficulty"], string> = {
    Fácil: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
    Média: "bg-amber-500/15 text-amber-500 border-amber-500/30",
    Difícil: "bg-orange-500/15 text-orange-500 border-orange-500/30",
    Elite: "bg-primary/15 text-primary border-primary/40",
  };
  const difficultyColor = difficultyColors[lesson.exercise.difficulty];

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
      <div className="mt-6">
        <VideoPlayer
          moduleId={mod.id}
          lessonId={lesson.id}
          onNearComplete={() => setDone(mod.id, lesson.id, true)}
        />
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
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <Clock3 className="h-3 w-3" /> {lesson.duration}
            <span className="mx-1">·</span>
            <ListChecks className="h-3 w-3" /> {lesson.chapters.length} capítulos
            <span className="mx-1">·</span>
            <Target className="h-3 w-3" /> Exercício {lesson.exercise.difficulty}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => bookmarks.toggle(k)}
            aria-label={bookmarked ? "Remover favorito" : "Favoritar"}
            className={
              "inline-flex items-center justify-center h-10 w-10 rounded-full border transition " +
              (bookmarked
                ? "bg-primary/15 text-primary border-primary/50"
                : "bg-transparent text-muted-foreground border-border hover:border-primary/60 hover:text-foreground")
            }
          >
            {bookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
          </button>
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
      </div>

      {/* Tabs */}
      <Tabs defaultValue="visao" className="mt-10">
        <TabsList className="grid grid-cols-3 sm:grid-cols-6 w-full bg-card border border-border p-1 h-auto">
          <TabsTrigger value="visao" className="text-xs">Visão</TabsTrigger>
          <TabsTrigger value="capitulos" className="text-xs">Capítulos</TabsTrigger>
          <TabsTrigger value="transcricao" className="text-xs">Transcrição</TabsTrigger>
          {lesson.code && <TabsTrigger value="codigo" className="text-xs">Código</TabsTrigger>}
          <TabsTrigger value="exercicio" className="text-xs">Exercício</TabsTrigger>
          <TabsTrigger value="recursos" className="text-xs">Recursos</TabsTrigger>
        </TabsList>

        {/* VISÃO */}
        <TabsContent value="visao" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-primary">
                <Sparkles className="h-3 w-3" /> Pontos-chave
              </div>
              <ul className="mt-4 space-y-3">
                {lesson.keyPoints.map((p, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-6 border-t border-border">
                <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Sobre</div>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {lesson.transcript.slice(0, 220)}…
                </p>
              </div>
            </div>
            <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-transparent p-6">
              <div className="text-xs uppercase tracking-[0.24em] text-primary">
                Nota do Concierge
              </div>
              <p className="mt-2 text-sm leading-relaxed">
                Assista uma vez sem pausar. Depois volte, faça o exercício em
                até 24h e poste o resultado no #builds. É assim que os alunos
                de elite aprendem 3x mais rápido.
              </p>
            </div>
          </div>
        </TabsContent>

        {/* CAPÍTULOS */}
        <TabsContent value="capitulos" className="mt-6">
          <div className="rounded-2xl border border-border bg-card overflow-hidden divide-y divide-border">
            {lesson.chapters.map((c, i) => (
              <button
                key={i}
                className="flex w-full items-center gap-4 p-4 text-left hover:bg-accent/40 transition"
              >
                <span className="grid h-8 w-8 place-items-center rounded-full bg-primary/15 text-primary text-xs font-mono">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 text-sm">{c.title}</span>
                <span className="text-xs font-mono tabular-nums text-muted-foreground">
                  {c.time}
                </span>
              </button>
            ))}
          </div>
        </TabsContent>

        {/* TRANSCRIÇÃO */}
        <TabsContent value="transcricao" className="mt-6">
          <div className="rounded-2xl border border-border bg-card p-6 lg:p-8">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-primary">
              <FileText className="h-3 w-3" /> Transcrição da aula
            </div>
            <p className="mt-4 text-sm leading-loose text-foreground/90">
              {lesson.transcript}
            </p>
          </div>
        </TabsContent>

        {/* CÓDIGO */}
        {lesson.code && (
          <TabsContent value="codigo" className="mt-6">
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-primary uppercase tracking-widest">
                    {lesson.code.lang}
                  </span>
                  <span className="text-muted-foreground">· {lesson.code.title}</span>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(lesson.code!.code);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                  }}
                  className="text-xs text-muted-foreground hover:text-primary transition"
                >
                  {copied ? "Copiado ✓" : "Copiar"}
                </button>
              </div>
              <pre className="overflow-x-auto p-5 text-xs leading-relaxed font-mono bg-background/60">
                <code>{lesson.code.code}</code>
              </pre>
            </div>
          </TabsContent>
        )}

        {/* EXERCÍCIO */}
        <TabsContent value="exercicio" className="mt-6">
          <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card p-6 lg:p-8">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-primary">
                <Target className="h-3 w-3" /> Exercício executável
              </div>
              <Badge className={"border " + difficultyColor}>
                {lesson.exercise.difficulty}
              </Badge>
            </div>
            <h3 className="mt-4 font-serif text-2xl">{lesson.exercise.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              {lesson.exercise.brief}
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-background/40 p-4">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  Entregável
                </div>
                <div className="mt-1 text-sm">{lesson.exercise.deliverable}</div>
              </div>
              <div className="rounded-xl border border-border bg-background/40 p-4">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  Dicas
                </div>
                <ul className="mt-1 space-y-1 text-sm">
                  {lesson.exercise.hints.map((h, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-primary">→</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <button
              onClick={() => exercises.toggle(k)}
              className={
                "mt-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition border " +
                (exerciseDone
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-transparent text-foreground border-border hover:border-primary/60")
              }
            >
              <Check className="h-4 w-4" />
              {exerciseDone ? "Exercício entregue" : "Marcar como entregue"}
            </button>
          </div>
        </TabsContent>

        {/* RECURSOS */}
        <TabsContent value="recursos" className="mt-6">
          <div className="grid gap-3 sm:grid-cols-2">
            {lesson.resources.map((r, i) => (
              <div
                key={i}
                className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 hover:border-primary/50 transition cursor-pointer"
              >
                <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/15 text-primary text-[10px] font-mono uppercase">
                  {r.type.slice(0, 4)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] uppercase tracking-widest text-primary">
                    {r.type}
                  </div>
                  <div className="text-sm font-medium truncate">{r.title}</div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Notes always visible */}
      <div className="mt-10 rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-primary">
            <MessageSquare className="h-3 w-3" /> Suas anotações
          </div>
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
            {notes.length} car.
          </span>
        </div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Capture insights, comandos e decisões desta aula…"
          rows={5}
          className="mt-3 w-full resize-y rounded-xl border border-border bg-background/60 p-4 text-sm leading-relaxed placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
        <div className="mt-2 text-[11px] text-muted-foreground">
          Salvo automaticamente no seu dispositivo.
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
            className="group rounded-xl border border-border bg-card p-4 hover:border-primary/50 transition text-right"
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
