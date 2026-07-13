import { Target } from "lucide-react";
import { useState } from "react";
import { useWeeklyGoal } from "@/lib/weekly-goal";

export function WeeklyGoalCard() {
  const { goal, current, pct, setGoal } = useWeeklyGoal();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(goal);
  const remaining = Math.max(0, goal - current);

  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-primary">
          <Target className="h-3 w-3" /> Meta da semana
        </div>
        <button
          onClick={() => {
            setDraft(goal);
            setEditing((v) => !v);
          }}
          className="text-[11px] text-muted-foreground hover:text-primary transition"
        >
          {editing ? "Cancelar" : "Ajustar"}
        </button>
      </div>

      {editing ? (
        <form
          className="mt-3 flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            setGoal(draft);
            setEditing(false);
          }}
        >
          <input
            type="number"
            min={15}
            step={15}
            value={draft}
            onChange={(e) => setDraft(Number(e.target.value))}
            className="w-24 rounded-md border border-border bg-background px-2 py-1 text-sm tabular-nums"
            aria-label="Meta em minutos por semana"
          />
          <span className="text-xs text-muted-foreground">min / semana</span>
          <button
            type="submit"
            className="ml-auto rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground hover:opacity-95"
          >
            Salvar
          </button>
        </form>
      ) : (
        <>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-serif text-3xl text-primary tabular-nums">{current}</span>
            <span className="text-sm text-muted-foreground">/ {goal} min de foco</span>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-border">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${pct}%` }}
              aria-valuenow={pct}
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
          <div className="mt-2 text-[11px] text-muted-foreground">
            {pct >= 100
              ? "Meta batida — próxima semana sobe a régua."
              : `Faltam ${remaining} min pra fechar a semana.`}
          </div>
        </>
      )}
    </div>
  );
}
