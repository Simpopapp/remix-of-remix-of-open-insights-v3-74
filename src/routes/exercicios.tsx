import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Circle, Edit3, ExternalLink, Target, X } from "lucide-react";
import { useState } from "react";
import { course, totalExercises } from "@/lib/course-data";
import { useExercises, lessonKey } from "@/lib/user-state";
import { useSubmissions } from "@/lib/exercise-subs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/exercicios")({
  head: () => ({
    meta: [
      { title: "Exercícios — AI App Empire" },
      { name: "description", content: "Todos os exercícios executáveis do curso, ranqueados por dificuldade." },
    ],
  }),
  component: ExercisesPage,
});

type Filter = "Todos" | "Fácil" | "Média" | "Difícil" | "Elite" | "Pendentes" | "Entregues";

function ExercisesPage() {
  const ex = useExercises();
  const subs = useSubmissions();
  const [filter, setFilter] = useState<Filter>("Todos");
  const [openKey, setOpenKey] = useState<string | null>(null);
  const pct = Math.round((ex.count / totalExercises) * 100);

  const rows = course.modules.flatMap((m) =>
    m.lessons.map((l) => ({
      moduleId: m.id,
      moduleTitle: m.title,
      moduleNumber: m.number,
      lessonId: l.id,
      lessonTitle: l.title,
      exercise: l.exercise,
      key: lessonKey(m.id, l.id),
      done: ex.has(lessonKey(m.id, l.id)),
      sub: subs.get(lessonKey(m.id, l.id)),
    })),
  );

  const visible = rows.filter((r) => {
    if (filter === "Pendentes") return !r.done;
    if (filter === "Entregues") return r.done;
    if (["Fácil", "Média", "Difícil", "Elite"].includes(filter)) return r.exercise.difficulty === filter;
    return true;
  });

  const filters: Filter[] = ["Todos", "Pendentes", "Entregues", "Fácil", "Média", "Difícil", "Elite"];

  const diffColor: Record<string, string> = {
    Fácil: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
    Média: "bg-amber-500/15 text-amber-500 border-amber-500/30",
    Difícil: "bg-orange-500/15 text-orange-500 border-orange-500/30",
    Elite: "bg-primary/15 text-primary border-primary/40",
  };

  const opened = visible.find((r) => r.key === openKey);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 lg:py-14">
      <div className="text-xs uppercase tracking-[0.28em] text-primary">Prática</div>
      <h1 className="mt-2 font-serif text-4xl lg:text-5xl tracking-tight">Exercícios</h1>
      <p className="mt-3 text-muted-foreground max-w-xl">
        Entregue o exercício com um resumo + link do seu trabalho. Progresso é evidência.
      </p>

      <div className="mt-6 flex items-center gap-4 max-w-md">
        <Progress value={pct} className="h-1.5 flex-1" />
        <span className="text-xs tabular-nums text-muted-foreground">
          {ex.count}/{totalExercises} · {pct}%
        </span>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={
              "rounded-full border px-3 py-1.5 text-xs uppercase tracking-widest transition " +
              (filter === f
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground")
            }
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-8 space-y-3">
        {visible.map((r) => (
          <div
            key={r.key}
            className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 hover:border-primary/50 transition"
          >
            <button
              onClick={() => ex.toggle(r.key)}
              aria-label={r.done ? "Desmarcar" : "Marcar como entregue"}
              className="shrink-0 mt-1"
            >
              {r.done ? <Check className="h-5 w-5 text-primary" /> : <Circle className="h-5 w-5 text-muted-foreground/60 group-hover:text-foreground" />}
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono tracking-widest text-primary">M{String(r.moduleNumber).padStart(2, "0")}</span>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{r.moduleTitle}</span>
                <Badge className={"border " + diffColor[r.exercise.difficulty]}>{r.exercise.difficulty}</Badge>
                {r.sub && (
                  <span className="rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-primary">
                    Entregue
                  </span>
                )}
              </div>
              <Link
                to="/aula/$moduleId/$lessonId"
                params={{ moduleId: r.moduleId, lessonId: r.lessonId }}
                className="mt-1 block font-serif text-lg leading-tight hover:text-primary transition"
              >
                {r.exercise.title}
              </Link>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{r.exercise.brief}</p>
              <div className="mt-3 text-xs text-muted-foreground flex items-center gap-2">
                <Target className="h-3 w-3" /> Entregável: {r.exercise.deliverable}
              </div>

              {r.sub && (
                <div className="mt-3 rounded-md border border-primary/25 bg-primary/5 p-3 text-xs">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Sua entrega · {new Date(r.sub.at).toLocaleDateString("pt-BR")}</span>
                    {r.sub.link && (
                      <a href={r.sub.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
                        <ExternalLink className="h-3 w-3" /> abrir
                      </a>
                    )}
                  </div>
                  <p className="mt-1 line-clamp-3 text-foreground/90">{r.sub.text}</p>
                </div>
              )}
            </div>
            <div className="flex shrink-0 flex-col items-end gap-2">
              <button
                onClick={() => setOpenKey(r.key)}
                className="inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs text-primary hover:bg-primary/20"
              >
                <Edit3 className="h-3 w-3" /> {r.sub ? "Editar entrega" : "Entregar"}
              </button>
              <Link
                to="/aula/$moduleId/$lessonId"
                params={{ moduleId: r.moduleId, lessonId: r.lessonId }}
                className="hidden sm:inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs hover:border-primary/50 hover:text-primary transition"
              >
                Abrir aula →
              </Link>
            </div>
          </div>
        ))}
        {visible.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground text-sm">
            Nada por aqui neste filtro.
          </div>
        )}
      </div>

      {opened && (
        <SubmitModal
          initial={opened.sub}
          title={opened.exercise.title}
          onClose={() => setOpenKey(null)}
          onSubmit={(text, link) => {
            subs.submit(opened.key, text, link, opened.lessonTitle);
            if (!opened.done) ex.setVal(opened.key, true);
            setOpenKey(null);
          }}
          onDelete={
            opened.sub
              ? () => {
                  subs.remove(opened.key);
                  ex.setVal(opened.key, false);
                  setOpenKey(null);
                }
              : undefined
          }
        />
      )}
    </div>
  );
}

function SubmitModal({
  title,
  initial,
  onClose,
  onSubmit,
  onDelete,
}: {
  title: string;
  initial?: { text: string; link?: string };
  onClose: () => void;
  onSubmit: (text: string, link?: string) => void;
  onDelete?: () => void;
}) {
  const [text, setText] = useState(initial?.text ?? "");
  const [link, setLink] = useState(initial?.link ?? "");
  const canSubmit = text.trim().length >= 8;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl border border-primary/40 bg-card p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[10px] uppercase tracking-[0.28em] text-primary">Entrega</div>
            <h2 className="font-serif text-xl leading-tight">{title}</h2>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
        </div>

        <div className="mt-6 space-y-4 text-sm">
          <label className="block">
            <span className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">Descreva o que você fez *</span>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={5}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              placeholder="Resumo, aprendizados, decisões técnicas..."
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">Link do trabalho (opcional)</span>
            <input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              placeholder="https://github.com/..."
            />
          </label>
        </div>

        <div className="mt-6 flex items-center justify-between gap-2">
          {onDelete ? (
            <button onClick={onDelete} className="text-xs text-muted-foreground hover:text-destructive">
              Excluir entrega
            </button>
          ) : <span />}
          <div className="flex gap-2">
            <button onClick={onClose} className="rounded-md border border-input px-4 py-2 text-sm hover:bg-accent">Cancelar</button>
            <button
              disabled={!canSubmit}
              onClick={() => onSubmit(text.trim(), link.trim() || undefined)}
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-40"
            >
              {initial ? "Salvar" : "Entregar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
