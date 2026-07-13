import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  Award,
  Clock3,
  Flame,
  PlayCircle,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import { course, totalLessons } from "@/lib/course-data";
import { useProgress } from "@/lib/progress";
import { Progress } from "@/components/ui/progress";
import heroImg from "@/assets/hero-midnight.jpg";
import { QuestsWidget } from "@/components/QuestsWidget";
import { ContinueWatching } from "@/components/ContinueWatching";
import { RecentLessons } from "@/components/RecentLessons";
import { useStreak } from "@/lib/streak";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

// Parse "mm:ss" duration to minutes
function toMinutes(d: string) {
  const [m, s] = d.split(":").map(Number);
  return m + (s || 0) / 60;
}

const totalMinutes = Math.round(
  course.modules.reduce(
    (n, m) => n + m.lessons.reduce((a, l) => a + toMinutes(l.duration), 0),
    0,
  ),
);

const moduleAccents = [
  "from-[oklch(0.76_0.09_82/0.35)] to-transparent",
  "from-[oklch(0.55_0.16_280/0.35)] to-transparent",
  "from-[oklch(0.62_0.14_20/0.30)] to-transparent",
  "from-[oklch(0.7_0.12_150/0.28)] to-transparent",
];

function Dashboard() {
  const { isDone, completedCount } = useProgress();
  const pct = Math.round((completedCount / totalLessons) * 100);
  const watchedMinutes = Math.round(
    course.modules.reduce(
      (n, m) =>
        n +
        m.lessons.reduce(
          (a, l) => a + (isDone(m.id, l.id) ? toMinutes(l.duration) : 0),
          0,
        ),
      0,
    ),
  );
  const xp = completedCount * 120;
  const { current: streak, longest: longestStreak } = useStreak();

  let next: {
    moduleId: string;
    lessonId: string;
    title: string;
    moduleTitle: string;
    duration: string;
    description: string;
  } | null = null;
  outer: for (const m of course.modules) {
    for (const l of m.lessons) {
      if (!isDone(m.id, l.id)) {
        next = {
          moduleId: m.id,
          lessonId: l.id,
          title: l.title,
          moduleTitle: m.title,
          duration: l.duration,
          description: l.description,
        };
        break outer;
      }
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 lg:py-14">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-border">
        <img
          src={heroImg}
          alt=""
          width={1600}
          height={900}
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-background/40" />
        <div className="absolute inset-0 bg-[radial-gradient(600px_circle_at_85%_10%,oklch(0.76_0.09_82/0.18),transparent_60%)]" />

        <div className="relative p-6 sm:p-8 lg:p-14">
          <div className="flex items-center gap-2 text-[10px] sm:text-xs uppercase tracking-[0.28em] text-primary">
            <Sparkles className="h-3 w-3" />
            Curso premium · Cohort 01
          </div>
          <h1 className="mt-4 font-serif text-3xl sm:text-4xl lg:text-6xl leading-[1.05] tracking-tight max-w-3xl">
            {course.title}
            <span className="block bg-gradient-to-r from-primary via-[oklch(0.86_0.09_82)] to-primary bg-clip-text text-transparent">
              Sua vez de construir o império.
            </span>
          </h1>
          <p className="mt-4 sm:mt-5 max-w-2xl text-sm sm:text-base lg:text-lg text-muted-foreground">
            {course.subtitle}
          </p>

          <div className="mt-8 sm:mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] items-end">
            <div className="max-w-md min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-4xl">{pct}%</span>
                <span className="text-xs uppercase tracking-widest text-muted-foreground">
                  concluído
                </span>
              </div>
              <Progress value={pct} className="mt-3 h-1.5" />
              <div className="mt-2 text-xs text-muted-foreground">
                {completedCount} de {totalLessons} aulas ·{" "}
                {watchedMinutes} de {totalMinutes} min
              </div>
            </div>

            {next ? (
              <Link
                to="/aula/$moduleId/$lessonId"
                params={{ moduleId: next.moduleId, lessonId: next.lessonId }}
                className="group relative inline-flex items-center gap-3 sm:gap-4 rounded-2xl border border-primary/40 bg-primary/10 backdrop-blur p-4 sm:p-5 pr-5 sm:pr-6 transition hover:bg-primary/20 w-full lg:w-auto lg:min-w-[300px]"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground shadow-[0_0_40px_-8px_oklch(0.76_0.09_82/0.7)] transition group-hover:scale-105">
                  <PlayCircle className="h-6 w-6" />
                </span>
                <span className="text-left min-w-0 flex-1">
                  <span className="block text-[10px] uppercase tracking-[0.24em] text-primary">
                    Continuar
                  </span>
                  <span className="block font-serif text-lg leading-tight truncate">
                    {next.title}
                  </span>
                  <span className="block text-xs text-muted-foreground mt-0.5 truncate">
                    {next.moduleTitle} · {next.duration}
                  </span>
                </span>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-primary transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            ) : (
              <div className="text-sm text-muted-foreground">
                Você concluiu tudo. Bem-vindo ao topo.
              </div>
            )}
          </div>
        </div>
      </section>

      <ContinueWatching />




      {/* Stats */}
      <section className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Streak"
          value={`${streak} ${streak === 1 ? "dia" : "dias"}`}
          hint={longestStreak > streak ? `Recorde: ${longestStreak} dias` : "Consistência é status."}
          icon={<Flame className="h-4 w-4" />}
        />
        <StatCard
          label="Tempo assistido"
          value={`${watchedMinutes} min`}
          hint={`de ${totalMinutes} min totais`}
          icon={<Clock3 className="h-4 w-4" />}
        />
        <StatCard
          label="XP"
          value={xp.toLocaleString("pt-BR")}
          hint="120 XP por aula concluída"
          icon={<Trophy className="h-4 w-4" />}
        />
        <StatCard
          label="Rank"
          value={
            pct === 100
              ? "Imperador"
              : pct >= 75
                ? "Sênior"
                : pct >= 40
                  ? "Operador"
                  : pct >= 10
                    ? "Aprendiz"
                    : "Iniciado"
          }
          hint="Sobe conforme conclui aulas."
          icon={<Award className="h-4 w-4" />}
        />
      </section>

      {/* Modules */}
      <section className="mt-14">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
              Trilha
            </div>
            <h2 className="font-serif text-3xl mt-1">Módulos</h2>
          </div>
          <div className="text-sm text-muted-foreground">
            {course.modules.length} módulos · {totalLessons} aulas · {totalMinutes} min
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {course.modules.map((m, i) => {
            const done = m.lessons.filter((l) => isDone(m.id, l.id)).length;
            const mpct = Math.round((done / m.lessons.length) * 100);
            const dur = Math.round(
              m.lessons.reduce((a, l) => a + toMinutes(l.duration), 0),
            );
            return (
              <Link
                key={m.id}
                to="/modulo/$moduleId"
                params={{ moduleId: m.id }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition hover:border-primary/50 hover:-translate-y-0.5"
              >
                <div
                  className={
                    "absolute inset-0 opacity-90 pointer-events-none bg-gradient-to-br " +
                    moduleAccents[i % moduleAccents.length]
                  }
                />
                <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
                <div className="relative">
                  <div className="flex items-start justify-between gap-4">
                    <div className="text-[11px] font-mono tracking-widest text-primary">
                      MÓDULO {String(m.number).padStart(2, "0")}
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground transition group-hover:text-primary group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>
                  <h3 className="mt-3 font-serif text-2xl leading-tight tracking-tight">
                    {m.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                    {m.tagline}
                  </p>
                  <div className="mt-6 flex items-center gap-3">
                    <Progress value={mpct} className="h-1 flex-1" />
                    <span className="text-xs tabular-nums text-muted-foreground">
                      {done}/{m.lessons.length} · {dur}min
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Ritual + Community */}
      <section className="mt-14">
        <QuestsWidget />
      </section>

      <section className="mt-14 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 relative overflow-hidden rounded-2xl border border-border bg-card p-6 lg:p-8">
          <div className="absolute -left-20 -bottom-20 h-56 w-56 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
          <div className="text-xs uppercase tracking-[0.24em] text-primary">
            Ritual semanal
          </div>
          <h3 className="mt-2 font-serif text-2xl">Sua semana no Império</h3>
          <div className="mt-6 divide-y divide-border">
            {[
              { day: "Seg", title: "Sessão de estudo — 60 min", tag: "Trilha" },
              { day: "Qua", title: "Live com o Concierge", tag: "Cohort" },
              { day: "Sex", title: "Build session — envie seu app", tag: "Prática" },
              { day: "Dom", title: "Revisão + planejamento", tag: "Reflexão" },
            ].map((r) => (
              <div
                key={r.day}
                className="flex items-center gap-4 py-3 first:pt-0 last:pb-0"
              >
                <div className="w-10 text-xs font-mono text-primary uppercase">
                  {r.day}
                </div>
                <div className="flex-1 text-sm">{r.title}</div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground border border-border rounded-full px-2 py-1">
                  {r.tag}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card p-6 lg:p-8">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-primary">
            <Users className="h-3 w-3" /> Círculo privado
          </div>
          <h3 className="mt-3 font-serif text-2xl leading-tight">
            Próxima live
            <span className="block text-primary">Quarta · 20h</span>
          </h3>
          <p className="mt-3 text-sm text-muted-foreground">
            Traga seu app. Revisão ao vivo com o Concierge e a mesa de senior
            builders da cohort.
          </p>
          <button className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-95">
            Reservar assento <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* Certificate */}
      <section className="mt-14 relative overflow-hidden rounded-2xl border border-border bg-card p-8">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="text-xs uppercase tracking-[0.24em] text-primary">
              Certificado de conclusão
            </div>
            <h3 className="mt-2 font-serif text-2xl">
              Termine as {totalLessons} aulas e receba seu selo AI App Empire.
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Selo verificável, publicável no LinkedIn e enviado em edição
              impressa para os top 100 alunos da cohort.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <Progress value={pct} className="h-1.5 w-56" />
              <span className="text-xs tabular-nums text-muted-foreground">
                {pct}%
              </span>
            </div>
          </div>
          <div
            aria-hidden
            className="grid h-28 w-28 place-items-center rounded-full border border-primary/50 bg-gradient-to-br from-primary/20 to-transparent"
          >
            <Award className="h-10 w-10 text-primary" />
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string;
  hint: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <div className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          {label}
        </div>
        <div className="grid h-7 w-7 place-items-center rounded-full bg-primary/15 text-primary">
          {icon}
        </div>
      </div>
      <div className="mt-3 font-serif text-2xl">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{hint}</div>
    </div>
  );
}
