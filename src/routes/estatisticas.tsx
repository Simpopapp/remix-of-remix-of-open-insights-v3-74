import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, Flame, NotebookPen, Play, Target, TrendingDown, TrendingUp, Timer, CalendarRange } from "lucide-react";
import { useMonthlyStats } from "@/lib/monthly-stats";
import { useProgress } from "@/lib/progress";
import { totalLessons } from "@/lib/course-data";
import { useStreak } from "@/lib/streak";
import type { ActivityKind } from "@/lib/activity";

export const Route = createFileRoute("/estatisticas")({
  head: () => ({
    meta: [
      { title: "Estatísticas — AI App Empire" },
      { name: "description", content: "Seu desempenho dos últimos 30 dias: aulas, foco, notas e ofensivas." },
    ],
  }),
  component: StatsPage,
});

const LABELS: Record<ActivityKind, string> = {
  lesson: "Aulas concluídas",
  exercise: "Exercícios",
  focus: "Pomodoros",
  note: "Notas escritas",
  watch: "Sessões de vídeo",
};

const ICONS: Record<ActivityKind, React.ReactNode> = {
  lesson: <BookOpen className="h-4 w-4" />,
  exercise: <Target className="h-4 w-4" />,
  focus: <Timer className="h-4 w-4" />,
  note: <NotebookPen className="h-4 w-4" />,
  watch: <Play className="h-4 w-4" />,
};

function StatsPage() {
  const { totals, deltas, activeDays, prevActiveDays, bestDay, days } = useMonthlyStats();
  const { completedCount } = useProgress();
  const { current: streak, longest } = useStreak();
  const coursePct = Math.round((completedCount / totalLessons) * 100);

  const max = Math.max(1, ...days.map((d) => d.total));
  const activeDelta = activeDays - prevActiveDays;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 lg:py-12">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-primary">
        <CalendarRange className="h-3.5 w-3.5" /> Últimos 30 dias
      </div>
      <h1 className="mt-2 font-serif text-3xl sm:text-4xl">Estatísticas</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Compare seus últimos 30 dias com os 30 anteriores. Sem métrica, sem melhora.
      </p>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Big label="Progresso do curso" value={`${coursePct}%`} hint={`${completedCount}/${totalLessons} aulas`} />
        <Big label="Ofensiva atual" value={`${streak}d`} hint={`Recorde: ${longest}d`} icon={<Flame className="h-4 w-4" />} />
        <Big label="Dias ativos" value={`${activeDays}`} hint={`${activeDelta >= 0 ? "+" : ""}${activeDelta} vs. mês anterior`} delta={activeDelta} />
        <Big label="Melhor dia" value={bestDay ? `${bestDay.total}` : "—"} hint={bestDay ? new Date(bestDay.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }) : "Sem dados"} />
      </section>

      <section className="mt-8">
        <h2 className="font-serif text-2xl mb-3">Atividade por tipo</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {(Object.keys(LABELS) as ActivityKind[]).map((k) => (
            <div key={k} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <div className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{LABELS[k]}</div>
                <div className="grid h-7 w-7 place-items-center rounded-full bg-primary/15 text-primary">{ICONS[k]}</div>
              </div>
              <div className="mt-3 font-serif text-2xl tabular-nums">{totals[k]}</div>
              <DeltaLine value={deltas[k]} />
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-border bg-card p-6">
        <h2 className="font-serif text-2xl mb-4">Volume diário</h2>
        <div className="flex items-end gap-1 h-40">
          {days.map((d) => {
            const h = Math.round((d.total / max) * 100);
            return (
              <div key={d.date} className="flex-1 flex flex-col items-center gap-1" title={`${d.date}: ${d.total}`}>
                <div
                  className={"w-full rounded-t " + (d.total > 0 ? "bg-primary/70" : "bg-muted")}
                  style={{ height: `${Math.max(2, h)}%` }}
                />
              </div>
            );
          })}
        </div>
        <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
          <span>{new Date(days[0]?.date ?? Date.now()).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}</span>
          <span>hoje</span>
        </div>
      </section>
    </div>
  );
}

function Big({ label, value, hint, icon, delta }: { label: string; value: string; hint: string; icon?: React.ReactNode; delta?: number }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <div className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{label}</div>
        {icon && <div className="grid h-7 w-7 place-items-center rounded-full bg-primary/15 text-primary">{icon}</div>}
      </div>
      <div className="mt-3 font-serif text-3xl tabular-nums">{value}</div>
      <div className={"mt-1 text-xs " + (delta === undefined ? "text-muted-foreground" : delta >= 0 ? "text-primary" : "text-muted-foreground")}>{hint}</div>
    </div>
  );
}

function DeltaLine({ value }: { value: number }) {
  if (value === 0) return <div className="mt-1 text-xs text-muted-foreground">estável</div>;
  const up = value > 0;
  return (
    <div className={"mt-1 flex items-center gap-1 text-xs " + (up ? "text-primary" : "text-muted-foreground")}>
      {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      {up ? "+" : ""}{value} vs. mês anterior
    </div>
  );
}
