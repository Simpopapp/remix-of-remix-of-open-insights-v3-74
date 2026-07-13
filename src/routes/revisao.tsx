import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, CheckCircle2, Flame, Printer, StickyNote, Target, Timer } from "lucide-react";
import { useWeeklyStats } from "@/lib/weekly-stats";
import { useStreak } from "@/lib/streak";
import { WeeklyGoalCard } from "@/components/WeeklyGoalCard";

export const Route = createFileRoute("/revisao")({
  head: () => ({
    meta: [
      { title: "Revisão semanal — AI App Empire" },
      {
        name: "description",
        content: "Retrospectiva dos últimos 7 dias: aulas, foco, exercícios e o módulo em que você mais avançou.",
      },
    ],
  }),
  component: RevisaoPage,
});

function RevisaoPage() {
  const { totals, bars, maxBar, activeDays, topModule } = useWeeklyStats();
  const { current, longest } = useStreak();

  const rows: { icon: React.ReactNode; label: string; value: string; hint: string }[] = [
    {
      icon: <BookOpen className="h-4 w-4" />,
      label: "Aulas assistidas",
      value: String(totals.lesson),
      hint: totals.lesson >= 5 ? "Ritmo elite." : "Meta: 5 por semana.",
    },
    {
      icon: <Target className="h-4 w-4" />,
      label: "Exercícios entregues",
      value: String(totals.exercise),
      hint: totals.exercise > 0 ? "Prática cria diferença." : "Comece por um só.",
    },
    {
      icon: <Timer className="h-4 w-4" />,
      label: "Minutos em foco",
      value: `${totals.focus} min`,
      hint: totals.focus >= 100 ? "Deep work sério." : "Meta: 100 min/semana.",
    },
    {
      icon: <StickyNote className="h-4 w-4" />,
      label: "Notas escritas",
      value: String(totals.note),
      hint: totals.note > 0 ? "Seu segundo cérebro cresce." : "Escreva pelo menos 1.",
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10 lg:py-14">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.28em] text-primary">Últimos 7 dias</div>
          <h1 className="mt-2 font-serif text-4xl lg:text-5xl tracking-tight">Revisão semanal</h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Uma leitura honesta do seu ritmo. Sem vaidade, sem punição — só o dado.
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="print:hidden inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-primary/60 hover:text-primary transition shrink-0"
          aria-label="Imprimir revisão"
        >
          <Printer className="h-3.5 w-3.5" /> Imprimir
        </button>
      </div>

      <div className="mt-8">
        <WeeklyGoalCard />
      </div>

      {/* Streak headline */}
      <div className="mt-8 rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card p-6">
        <div className="flex flex-wrap items-center gap-6">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-primary/15 text-primary">
            <Flame className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs uppercase tracking-[0.24em] text-primary">Streak</div>
            <div className="mt-1 font-serif text-3xl">
              {current} {current === 1 ? "dia" : "dias"} seguidos
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              {activeDays}/7 dias ativos · recorde {longest} dias
            </div>
          </div>
        </div>
      </div>

      {/* Weekly bars */}
      <div className="mt-6 rounded-2xl border border-border bg-card p-6">
        <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
          Atividade dia a dia
        </div>
        <div className="mt-6 grid grid-cols-7 gap-2 sm:gap-3">
          {bars.map((b) => {
            const h = Math.round((b.total / maxBar) * 96);
            return (
              <div key={b.date} className="flex flex-col items-center gap-2">
                <div className="relative h-24 w-full rounded-md bg-muted/50 overflow-hidden">
                  <div
                    className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary to-primary/60"
                    style={{ height: `${b.total > 0 ? Math.max(6, h) : 0}px` }}
                    aria-label={`${b.total} eventos em ${b.date}`}
                  />
                </div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  {b.label}
                </div>
                <div className="text-[11px] tabular-nums text-foreground">{b.total}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Totals grid */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {rows.map((r) => (
          <div key={r.label} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <div className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                {r.label}
              </div>
              <div className="grid h-7 w-7 place-items-center rounded-full bg-primary/15 text-primary">
                {r.icon}
              </div>
            </div>
            <div className="mt-3 font-serif text-3xl">{r.value}</div>
            <div className="mt-1 text-xs text-muted-foreground">{r.hint}</div>
          </div>
        ))}
      </div>

      {/* Top module */}
      {topModule && topModule.done > 0 && (
        <div className="mt-6 rounded-2xl border border-border bg-card p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="text-xs uppercase tracking-[0.24em] text-primary">
                Módulo em progressão
              </div>
              <div className="mt-1 font-serif text-2xl truncate">{topModule.title}</div>
              <div className="mt-1 text-xs text-muted-foreground">
                {topModule.done}/{topModule.total} aulas concluídas
              </div>
            </div>
            <Link
              to="/modulo/$moduleId"
              params={{ moduleId: topModule.id }}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-95 shrink-0"
            >
              Continuar
            </Link>
          </div>
        </div>
      )}

      {/* Intention CTA */}
      <div className="mt-6 rounded-2xl border border-dashed border-border p-6 text-center">
        <CheckCircle2 className="mx-auto h-6 w-6 text-primary" />
        <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto">
          Feche a semana com uma intenção clara. Abra a Agenda e reserve os blocos da próxima.
        </p>
        <Link
          to="/agenda"
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-sm text-primary hover:bg-primary/20"
        >
          Ir para Agenda
        </Link>
      </div>
    </div>
  );
}
