import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Circle, Target } from "lucide-react";
import { useState } from "react";
import { course, totalExercises } from "@/lib/course-data";
import { useExercises, lessonKey } from "@/lib/user-state";
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
  const [filter, setFilter] = useState<Filter>("Todos");
  const pct = Math.round((ex.count / totalExercises) * 100);

  const rows = course.modules.flatMap((m) =>
    m.lessons.map((l) => ({
      moduleId: m.id,
      moduleTitle: m.title,
      moduleNumber: m.number,
      lessonId: l.id,
      lessonTitle: l.title,
      exercise: l.exercise,
      done: ex.has(lessonKey(m.id, l.id)),
    })),
  );

  const visible = rows.filter((r) => {
    if (filter === "Pendentes") return !r.done;
    if (filter === "Entregues") return r.done;
    if (["Fácil", "Média", "Difícil", "Elite"].includes(filter)) {
      return r.exercise.difficulty === filter;
    }
    return true;
  });

  const filters: Filter[] = ["Todos", "Pendentes", "Entregues", "Fácil", "Média", "Difícil", "Elite"];

  const diffColor: Record<string, string> = {
    Fácil: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
    Média: "bg-amber-500/15 text-amber-500 border-amber-500/30",
    Difícil: "bg-orange-500/15 text-orange-500 border-orange-500/30",
    Elite: "bg-primary/15 text-primary border-primary/40",
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 lg:py-14">
      <div className="text-xs uppercase tracking-[0.28em] text-primary">Prática</div>
      <h1 className="mt-2 font-serif text-4xl lg:text-5xl tracking-tight">Exercícios</h1>
      <p className="mt-3 text-muted-foreground max-w-xl">
        Todo módulo entrega exercícios executáveis. Faça, entregue no #builds e
        marque como concluído. Progresso é evidência.
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
            key={`${r.moduleId}/${r.lessonId}`}
            className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 hover:border-primary/50 transition"
          >
            <button
              onClick={() => ex.toggle(lessonKey(r.moduleId, r.lessonId))}
              aria-label={r.done ? "Desmarcar" : "Marcar como entregue"}
              className="shrink-0 mt-1"
            >
              {r.done ? (
                <Check className="h-5 w-5 text-primary" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground/60 group-hover:text-foreground" />
              )}
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono tracking-widest text-primary">
                  M{String(r.moduleNumber).padStart(2, "0")}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  {r.moduleTitle}
                </span>
                <Badge className={"border " + diffColor[r.exercise.difficulty]}>
                  {r.exercise.difficulty}
                </Badge>
              </div>
              <Link
                to="/aula/$moduleId/$lessonId"
                params={{ moduleId: r.moduleId, lessonId: r.lessonId }}
                className="mt-1 block font-serif text-lg leading-tight hover:text-primary transition"
              >
                {r.exercise.title}
              </Link>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                {r.exercise.brief}
              </p>
              <div className="mt-3 text-xs text-muted-foreground flex items-center gap-2">
                <Target className="h-3 w-3" /> Entregável: {r.exercise.deliverable}
              </div>
            </div>
            <Link
              to="/aula/$moduleId/$lessonId"
              params={{ moduleId: r.moduleId, lessonId: r.lessonId }}
              className="hidden sm:inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs hover:border-primary/50 hover:text-primary transition shrink-0"
            >
              Abrir aula →
            </Link>
          </div>
        ))}
        {visible.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground text-sm">
            Nada por aqui neste filtro.
          </div>
        )}
      </div>
    </div>
  );
}
