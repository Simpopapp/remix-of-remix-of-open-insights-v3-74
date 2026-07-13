import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  Check,
  Clock3,
  FileText,
  Highlighter,
  Link2,
  ListChecks,
  MessageSquare,
  Quote,
  Sparkles,
  Target,
  ThumbsDown,
  ThumbsUp,
  Timer,
  Trash2,
} from "lucide-react";
import { VideoPlayer } from "@/components/VideoPlayer";
import { useCallback, useEffect, useRef, useState } from "react";
import { findLesson, type Lesson, type Module } from "@/lib/course-data";
import { useProgress } from "@/lib/progress";
import { useNotes } from "@/lib/notes";
import { useBookmarks, useExercises, lessonKey } from "@/lib/user-state";
import { useMarkers } from "@/lib/markers";
import { RelatedLessons } from "@/components/RelatedLessons";
import { useLessonFeedback } from "@/lib/feedback";
import { useHighlights } from "@/lib/highlights";
import { seekTo, parseTimestamp, fmtTimestamp, getCurrentTime } from "@/lib/video-bus";
import { renderMarkdown, bindTimestamps } from "@/lib/markdown";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const Route = createFileRoute("/aula/$moduleId/$lessonId")({
  validateSearch: (s: Record<string, unknown>) => ({
    t: typeof s.t === "number" ? s.t : s.t ? Number(s.t) || undefined : undefined,
  }),
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
  const search = Route.useSearch();
  useEffect(() => {
    if (search.t && search.t > 0) {
      const id = window.setTimeout(() => seekTo(search.t!), 400);
      return () => window.clearTimeout(id);
    }
  }, [search.t, mod.id, lesson.id]);
  const { isDone, setDone } = useProgress();
  const done = isDone(mod.id, lesson.id);
  const [notes, setNotes] = useNotes(mod.id, lesson.id);
  const bookmarks = useBookmarks();
  const exercises = useExercises();
  const k = lessonKey(mod.id, lesson.id);
  const bookmarked = bookmarks.has(k);
  const exerciseDone = exercises.has(k);
  const [copied, setCopied] = useState(false);
  const feedback = useLessonFeedback(mod.id, lesson.id);
  const highlights = useHighlights(mod.id, lesson.id);
  const markers = useMarkers(mod.id, lesson.id);
  const transcriptRef = useRef<HTMLParagraphElement>(null);
  const [selectedText, setSelectedText] = useState("");
  const notesRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [preview, setPreview] = useState(false);
  useEffect(() => bindTimestamps(previewRef.current), [preview, notes]);

  const onTranscriptSelect = useCallback(() => {
    const sel = window.getSelection?.();
    if (!sel) return;
    const text = sel.toString().trim();
    if (!text) {
      setSelectedText("");
      return;
    }
    // Only accept selection if fully inside the transcript node
    if (transcriptRef.current && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      if (transcriptRef.current.contains(range.commonAncestorContainer)) {
        setSelectedText(text.slice(0, 500));
        return;
      }
    }
    setSelectedText("");
  }, []);

  const saveHighlight = () => {
    if (!selectedText) return;
    highlights.add({
      moduleId: mod.id,
      lessonId: lesson.id,
      text: selectedText,
      t: Math.floor(getCurrentTime()) || undefined,
    });
    toast.success("Trecho destacado", { description: selectedText.slice(0, 80) + (selectedText.length > 80 ? "…" : "") });
    setSelectedText("");
    window.getSelection?.()?.removeAllRanges();
  };

  const shareLink = async () => {
    const t = Math.floor(getCurrentTime());
    const base = `${window.location.origin}/aula/${mod.id}/${lesson.id}`;
    const url = t > 0 ? `${base}?t=${t}` : base;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copiado", { description: t > 0 ? `Aponta para ${fmtTimestamp(t)}` : "Link da aula" });
    } catch {
      toast.error("Não consegui copiar", { description: url });
    }
  };


  const insertTimestamp = () => {
    const stamp = `[${fmtTimestamp(getCurrentTime())}] `;
    const ta = notesRef.current;
    if (!ta) {
      setNotes(notes + stamp);
      return;
    }
    const start = ta.selectionStart ?? notes.length;
    const end = ta.selectionEnd ?? notes.length;
    const next = notes.slice(0, start) + stamp + notes.slice(end);
    setNotes(next);
    requestAnimationFrame(() => {
      ta.focus();
      const pos = start + stamp.length;
      ta.setSelectionRange(pos, pos);
    });
  };
  const noteStamps = Array.from(notes.matchAll(/\[(\d{1,2}:\d{2}(?::\d{2})?)\]/g)).map((m) => m[1]);

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
          chapters={lesson.chapters}
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
            onClick={shareLink}
            aria-label="Copiar link da aula com o tempo atual"
            title="Copiar link (com timestamp)"
            className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-border text-muted-foreground hover:border-primary/60 hover:text-foreground transition"
          >
            <Link2 className="h-4 w-4" />
          </button>
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
        <TabsList className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-8 w-full bg-card border border-border p-1 h-auto">
          <TabsTrigger value="visao" className="text-xs">Visão</TabsTrigger>
          <TabsTrigger value="capitulos" className="text-xs">Capítulos</TabsTrigger>
          <TabsTrigger value="transcricao" className="text-xs">Transcrição</TabsTrigger>
          <TabsTrigger value="trechos" className="text-xs">
            Trechos{highlights.list.length > 0 && ` · ${highlights.list.length}`}
          </TabsTrigger>
          <TabsTrigger value="marcadores" className="text-xs">
            Marcadores{markers.list.length > 0 && ` · ${markers.list.length}`}
          </TabsTrigger>
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
                onClick={() => seekTo(parseTimestamp(c.time))}
                aria-label={`Ir para ${c.title} em ${c.time}`}
                className="flex w-full items-center gap-4 p-4 text-left hover:bg-accent/40 transition min-h-11"
              >
                <span className="grid h-8 w-8 place-items-center rounded-full bg-primary/15 text-primary text-xs font-mono">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 text-sm">{c.title}</span>
                <span className="text-xs font-mono tabular-nums text-primary group-hover:underline">
                  {c.time}
                </span>
              </button>
            ))}
          </div>
        </TabsContent>

        {/* TRANSCRIÇÃO */}
        <TabsContent value="transcricao" className="mt-6">
          <div className="rounded-2xl border border-border bg-card p-6 lg:p-8">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-primary">
                <FileText className="h-3 w-3" /> Transcrição da aula
              </div>
              <div className="flex flex-wrap gap-1.5">
                {lesson.chapters.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => seekTo(parseTimestamp(c.time))}
                    className="rounded-full border border-border px-2 py-1 text-[11px] font-mono tabular-nums text-muted-foreground hover:border-primary/60 hover:text-primary transition"
                  >
                    {c.time}
                  </button>
                ))}
              </div>
            </div>
            <p
              ref={transcriptRef}
              onMouseUp={onTranscriptSelect}
              onKeyUp={onTranscriptSelect}
              onTouchEnd={onTranscriptSelect}
              className="mt-4 text-sm leading-loose text-foreground/90 whitespace-pre-wrap select-text"
            >
              {lesson.transcript}
            </p>
            {selectedText && (
              <div
                role="region"
                aria-label="Ação sobre trecho selecionado"
                className="sticky bottom-4 mt-4 flex items-center gap-3 rounded-full border border-primary/40 bg-primary/10 backdrop-blur px-4 py-2 shadow-lg"
              >
                <Quote className="h-4 w-4 text-primary shrink-0" />
                <span className="text-xs text-muted-foreground truncate flex-1">
                  "{selectedText.slice(0, 80)}
                  {selectedText.length > 80 ? "…" : ""}"
                </span>
                <button
                  onClick={saveHighlight}
                  className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground hover:opacity-95 shrink-0"
                >
                  <Highlighter className="h-3 w-3" /> Destacar
                </button>
              </div>
            )}
          </div>
        </TabsContent>

        {/* TRECHOS */}
        <TabsContent value="trechos" className="mt-6">
          <div className="rounded-2xl border border-border bg-card p-6 lg:p-8">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-primary">
                <Highlighter className="h-3 w-3" /> Trechos destacados
              </div>
              <div className="text-[11px] text-muted-foreground">
                Selecione texto na aba Transcrição para destacar.
              </div>
            </div>
            {highlights.list.length === 0 ? (
              <div className="mt-6 rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                Nenhum trecho ainda. Vá para <em>Transcrição</em>, selecione uma frase e toque em <em>Destacar</em>.
              </div>
            ) : (
              <ul className="mt-4 space-y-3">
                {highlights.list.map((h) => (
                  <li
                    key={h.id}
                    className="group relative rounded-xl border-l-2 border-primary bg-primary/5 p-4"
                  >
                    <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
                      "{h.text}"
                    </p>
                    <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground">
                      {typeof h.t === "number" && h.t > 0 && (
                        <button
                          onClick={() => seekTo(h.t!)}
                          className="inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 font-mono tabular-nums text-primary hover:bg-primary/20"
                        >
                          ▶ {fmtTimestamp(h.t)}
                        </button>
                      )}
                      <span>
                        {new Date(h.createdAt).toLocaleString("pt-BR", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <button
                        onClick={() => highlights.remove(h.id)}
                        aria-label="Remover trecho"
                        className="ml-auto inline-flex items-center gap-1 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive transition"
                      >
                        <Trash2 className="h-3 w-3" /> Remover
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </TabsContent>

        {/* MARCADORES */}
        <TabsContent value="marcadores" className="mt-6">
          <div className="rounded-2xl border border-border bg-card p-6 lg:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-primary">
                <Bookmark className="h-3 w-3" /> Marcadores de tempo
              </div>
              <button
                onClick={() => {
                  const t = Math.floor(getCurrentTime());
                  const label = window.prompt("Rótulo para este marcador (opcional):", "") ?? "";
                  markers.add({ moduleId: mod.id, lessonId: lesson.id, t, label: label.trim() });
                  toast.success(`Marcador salvo em ${fmtTimestamp(t)}`);
                }}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-95"
              >
                <Bookmark className="h-3 w-3" /> Salvar marcador aqui
              </button>
            </div>
            {markers.list.length === 0 ? (
              <div className="mt-6 rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                Nenhum marcador nesta aula. Pause no momento certo e toque em <em>Salvar marcador aqui</em>.
              </div>
            ) : (
              <ul className="mt-4 divide-y divide-border">
                {markers.list
                  .slice()
                  .sort((a, b) => a.t - b.t)
                  .map((m) => (
                    <li key={m.id} className="group flex items-center gap-3 py-3">
                      <button
                        onClick={() => seekTo(m.t)}
                        className="inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 font-mono text-xs tabular-nums text-primary hover:bg-primary/20"
                      >
                        ▶ {fmtTimestamp(m.t)}
                      </button>
                      <span className="flex-1 truncate text-sm">{m.label || "Sem rótulo"}</span>
                      <button
                        onClick={() => {
                          const label = window.prompt("Novo rótulo:", m.label) ?? m.label;
                          markers.rename(m.id, label.trim());
                        }}
                        className="text-[11px] text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-primary"
                      >
                        Renomear
                      </button>
                      <button
                        onClick={() => markers.remove(m.id)}
                        aria-label="Remover marcador"
                        className="text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  ))}
              </ul>
            )}
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
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-primary">
            <MessageSquare className="h-3 w-3" /> Suas anotações
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPreview((v) => !v)}
              className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-[11px] hover:border-primary/60 hover:text-primary transition min-h-9"
              aria-pressed={preview}
            >
              {preview ? "Editar" : "Prévia"}
            </button>
            <button
              type="button"
              onClick={insertTimestamp}
              className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-[11px] hover:border-primary/60 hover:text-primary transition min-h-9"
            >
              <Timer className="h-3 w-3" /> Inserir tempo
            </button>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
              {notes.length} car.
            </span>
          </div>
        </div>
        {preview ? (
          <div
            ref={previewRef}
            className="mt-3 min-h-[9rem] rounded-xl border border-border bg-background/60 p-4 text-sm text-foreground/90 space-y-2 [&_p]:m-0"
            dangerouslySetInnerHTML={{
              __html: notes.trim()
                ? renderMarkdown(notes)
                : '<p class="text-muted-foreground/70">Sem notas ainda. Toque em Editar para começar. Suporta **negrito**, *itálico*, `código`, listas, # títulos e [mm:ss].</p>',
            }}
          />
        ) : (
          <textarea
            ref={notesRef}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Capture insights. Markdown suportado (**negrito**, *itálico*, - listas, # títulos). Use [Inserir tempo] para marcar um trecho."
            rows={5}
            className="mt-3 w-full resize-y rounded-xl border border-border bg-background/60 p-4 text-sm leading-relaxed placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        )}
        {noteStamps.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {noteStamps.map((t, i) => (
              <button
                key={`${t}-${i}`}
                type="button"
                onClick={() => seekTo(parseTimestamp(t))}
                className="rounded-full border border-primary/40 bg-primary/10 px-2 py-1 text-[11px] font-mono tabular-nums text-primary hover:bg-primary/20 transition"
                aria-label={`Ir para ${t} no vídeo`}
              >
                ▶ {t}
              </button>
            ))}
          </div>
        )}
        <div className="mt-2 text-[11px] text-muted-foreground">
          Salvo automaticamente no seu dispositivo.
        </div>
      </div>

      {/* Feedback */}
      <div className="mt-6 rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <div className="text-xs uppercase tracking-[0.24em] text-primary">
              Essa aula te ajudou?
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Seu feedback afina o próximo lote de aulas.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => feedback.setRating(feedback.rating === "up" ? null : "up")}
              aria-label="Curti a aula"
              aria-pressed={feedback.rating === "up"}
              className={
                "inline-flex items-center justify-center h-11 w-11 rounded-full border transition " +
                (feedback.rating === "up"
                  ? "bg-primary/15 text-primary border-primary/50"
                  : "border-border text-muted-foreground hover:border-primary/60 hover:text-foreground")
              }
            >
              <ThumbsUp className="h-4 w-4" />
            </button>
            <button
              onClick={() => feedback.setRating(feedback.rating === "down" ? null : "down")}
              aria-label="Não curti"
              aria-pressed={feedback.rating === "down"}
              className={
                "inline-flex items-center justify-center h-11 w-11 rounded-full border transition " +
                (feedback.rating === "down"
                  ? "bg-destructive/15 text-destructive border-destructive/50"
                  : "border-border text-muted-foreground hover:border-destructive/60 hover:text-foreground")
              }
            >
              <ThumbsDown className="h-4 w-4" />
            </button>
          </div>
        </div>
        {feedback.rating && (
          <textarea
            value={feedback.comment}
            onChange={(e) => feedback.setComment(e.target.value)}
            placeholder={
              feedback.rating === "up"
                ? "O que fez a diferença? (opcional)"
                : "O que faltou ou poderia melhorar? (opcional)"
            }
            rows={3}
            className="mt-4 w-full resize-y rounded-xl border border-border bg-background/60 p-3 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        )}
      </div>

      <RelatedLessons moduleId={mod.id} lessonId={lesson.id} />

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
