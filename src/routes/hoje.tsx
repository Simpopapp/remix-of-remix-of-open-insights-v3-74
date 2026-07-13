import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarCheck, Flame, PlayCircle, Sun, Target, Timer } from "lucide-react";
import { useAgenda, DAYS_FULL } from "@/lib/agenda";
import { course, totalLessons } from "@/lib/course-data";
import { useProgress } from "@/lib/progress";
import { useStreak } from "@/lib/streak";
import { useWeeklyGoal } from "@/lib/weekly-goal";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/hoje")({
  head: () => ({
    meta: [
      { title: "Hoje — AI App Empire" },
      { name: "description", content: "Seu plano do dia: próxima aula, agenda, metas e foco." },
    ],
  }),
  component: TodayPage,
});

function greeting(h: number) {
  if (h < 5) return "Boa madrugada";
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

function TodayPage() {
  const now = new Date();
  const today = now.getDay();
  const dateLabel = now.toLocaleDateString("pt-BR", {
    weekday: "long", day: "numeric", month: "long",
  });

  const { isDone, completedCount } = useProgress();
  const { current: streak } = useStreak();
  const { goal, current, pct } = useWeeklyGoal();
  const { blocks, toggleDone } = useAgenda();

  const todayBlocks = blocks
    .filter((b) => b.day === today)
    .sort((a, b) => a.start.localeCompare(b.start));

  let next: { moduleId: string; lessonId: string; title: string; moduleTitle: string; duration: string } | null = null;
  outer: for (const m of course.modules) {
    for (const l of m.lessons) {
      if (!isDone(m.id, l.id)) {
        next = { moduleId: m.id, lessonId: l.id, title: l.title, moduleTitle: m.title, duration: l.duration };
        break outer;
      }
    }
  }

  const coursePct = Math.round((completedCount / totalLessons) * 100);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 lg:py-12">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-primary">
        <Sun className="h-3.5 w-3.5" /> {DAYS_FULL[today]}
      </div>
      <h1 className="mt-2 font-serif text-3xl sm:text-4xl">
        {greeting(now.getHours())}. Foco no que importa hoje.
      </h1>
      <p className="mt-1 text-sm text-muted-foreground capitalize">{dateLabel}</p>

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <Metric icon={<Flame className="h-4 w-4" />} label="Ofensiva" value={`${streak}d`} hint="Volte amanhã." />
        <Metric icon={<Target className="h-4 w-4" />} label="Meta semanal" value={`${current}/${goal} min`} hint={`${pct}% da semana`} />
        <Metric icon={<CalendarCheck className="h-4 w-4" />} label="Curso" value={`${coursePct}%`} hint={`${completedCount}/${totalLessons} aulas`} />
      </section>

      {next && (
        <section className="mt-8 rounded-2xl border border-primary/40 bg-primary/5 p-6">
          <div className="text-[10px] uppercase tracking-[0.24em] text-primary">Próxima aula</div>
          <div className="mt-2 flex flex-wrap items-center gap-4">
            <PlayCircle className="h-10 w-10 text-primary" />
            <div className="flex-1 min-w-0">
              <div className="font-serif text-xl truncate">{next.title}</div>
              <div className="text-xs text-muted-foreground truncate">{next.moduleTitle} · {next.duration}</div>
            </div>
            <Link
              to="/aula/$moduleId/$lessonId"
              params={{ moduleId: next.moduleId, lessonId: next.lessonId }}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              Começar
            </Link>
          </div>
        </section>
      )}

      <section className="mt-8">
        <div className="flex items-end justify-between mb-3">
          <h2 className="font-serif text-2xl">Agenda de hoje</h2>
          <Link to="/agenda" className="text-xs text-primary hover:underline">Editar agenda →</Link>
        </div>
        {todayBlocks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/40 p-8 text-center text-sm text-muted-foreground">
            Nada agendado. <Link to="/agenda" className="text-primary hover:underline">Bloqueie um horário</Link> e proteja seu foco.
          </div>
        ) : (
          <ul className="divide-y divide-border rounded-2xl border border-border bg-card overflow-hidden">
            {todayBlocks.map((b) => (
              <li key={b.id} className="flex items-center gap-4 p-4">
                <button
                  onClick={() => toggleDone(b.id)}
                  aria-label="Marcar concluído"
                  className={
                    "h-5 w-5 shrink-0 rounded-full border transition " +
                    (b.done ? "bg-primary border-primary" : "border-muted-foreground/40 hover:border-primary")
                  }
                />
                <div className="w-24 text-xs font-mono text-primary">{b.start} → {b.end}</div>
                <div className={"flex-1 text-sm " + (b.done ? "line-through text-muted-foreground" : "")}>{b.title}</div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-8 rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-muted-foreground">
          <Timer className="h-3.5 w-3.5" /> Modo foco
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[220px]">
            <Progress value={pct} className="h-1.5" />
            <div className="mt-2 text-xs text-muted-foreground">
              {current} min de {goal} min esta semana.
            </div>
          </div>
          <Link to="/foco" className="inline-flex items-center gap-2 rounded-full border border-primary/50 px-4 py-2 text-sm text-primary hover:bg-primary/10">
            Iniciar Pomodoro
          </Link>
        </div>
      </section>
    </div>
  );
}

function Metric({ icon, label, value, hint }: { icon: React.ReactNode; label: string; value: string; hint: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <div className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{label}</div>
        <div className="grid h-7 w-7 place-items-center rounded-full bg-primary/15 text-primary">{icon}</div>
      </div>
      <div className="mt-3 font-serif text-2xl">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{hint}</div>
    </div>
  );
}
