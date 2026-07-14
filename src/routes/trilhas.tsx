import { createFileRoute, Link } from "@tanstack/react-router";
import { course } from "@/lib/course-data";
import { useProgress } from "@/lib/progress";
import { useProfile } from "@/lib/profile";
import { ArrowRight, Rocket, Users, Building, Compass, Sparkles } from "lucide-react";

export const Route = createFileRoute("/trilhas")({
  head: () => ({ meta: [{ title: "Trilhas — AI App Empire" }] }),
  component: TrilhasPage,
});

const GOAL_TO_TRACK: Record<string, string> = {
  "launch-mvp": "mvp",
  "acquire-clients": "clients",
  "scale-agency": "agency",
  explore: "master",
};

type Track = {
  id: string;
  icon: typeof Rocket;
  name: string;
  tagline: string;
  outcome: string;
  weeks: number;
  moduleIds: string[];
  gradient: string;
};

function TrilhasPage() {
  const modIds = course.modules.map((m) => m.id);
  const TRACKS: Track[] = [
    {
      id: "mvp",
      icon: Rocket,
      name: "MVP em 60 dias",
      tagline: "Do zero ao primeiro app público",
      outcome: "App publicado + primeiros usuários beta",
      weeks: 8,
      moduleIds: modIds.slice(0, 5),
      gradient: "from-primary/25 via-primary/5 to-transparent",
    },
    {
      id: "clients",
      icon: Users,
      name: "Primeiros Clientes",
      tagline: "Posicionamento premium e vendas",
      outcome: "3 contratos pagos em 90 dias",
      weeks: 10,
      moduleIds: [modIds[0], modIds[1], modIds[3], modIds[6], modIds[7]].filter(Boolean),
      gradient: "from-amber-500/25 via-primary/5 to-transparent",
    },
    {
      id: "agency",
      icon: Building,
      name: "Agência de Elite",
      tagline: "Escalar delivery e recorrência",
      outcome: "R$ 100k/mês em MRR",
      weeks: 16,
      moduleIds: modIds,
      gradient: "from-emerald-500/20 via-primary/5 to-transparent",
    },
    {
      id: "master",
      icon: Compass,
      name: "Mestre Técnico",
      tagline: "Profundidade em agentes, MCPs e segurança",
      outcome: "Referência técnica na cohort",
      weeks: 12,
      moduleIds: [modIds[1], modIds[2], modIds[5], modIds[7]].filter(Boolean),
      gradient: "from-purple-500/20 via-primary/5 to-transparent",
    },
  ];

  const { isDone } = useProgress();

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="font-serif text-4xl">Trilhas guiadas</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Sequências curadas pelo concierge — cada trilha reordena os módulos para um objetivo específico.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {TRACKS.map((t) => {
          const Icon = t.icon;
          const mods = t.moduleIds.map((id) => course.modules.find((m) => m.id === id)!).filter(Boolean);
          const totalLessons = mods.reduce((n, m) => n + m.lessons.length, 0);
          const doneLessons = mods.reduce(
            (n, m) => n + m.lessons.filter((l) => isDone(m.id, l.id)).length,
            0,
          );
          const pct = totalLessons ? (doneLessons / totalLessons) * 100 : 0;
          const firstUnfinished = mods
            .flatMap((m) => m.lessons.map((l) => ({ m: m.id, l: l.id })))
            .find((x) => !isDone(x.m, x.l));

          return (
            <div key={t.id} className={`relative overflow-hidden rounded-2xl border border-primary/25 bg-gradient-to-br ${t.gradient} p-6`}>
              <div className="flex items-start gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-xl border border-primary/40 bg-background">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="font-serif text-2xl">{t.name}</h2>
                  <p className="text-sm text-muted-foreground">{t.tagline}</p>
                </div>
                <span className="rounded-full border border-primary/30 bg-background/40 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-primary">
                  {t.weeks} sem
                </span>
              </div>

              <div className="mt-5 rounded-lg border border-primary/20 bg-background/40 p-3">
                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Resultado esperado</div>
                <div className="mt-1 text-sm">{t.outcome}</div>
              </div>

              <div className="mt-4">
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-muted-foreground">{doneLessons}/{totalLessons} aulas</span>
                  <span className="text-primary">{Math.round(pct)}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-1">
                {mods.map((m) => (
                  <Link
                    key={m.id}
                    to="/modulo/$moduleId"
                    params={{ moduleId: m.id }}
                    className="rounded-md border border-primary/25 bg-background/50 px-2 py-1 text-[11px] hover:border-primary/60"
                  >
                    {String(m.number).padStart(2, "0")} · {m.title}
                  </Link>
                ))}
              </div>

              {firstUnfinished && (
                <Link
                  to="/aula/$moduleId/$lessonId"
                  params={{ moduleId: firstUnfinished.m, lessonId: firstUnfinished.l }}
                  className="mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
                >
                  Continuar trilha <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
