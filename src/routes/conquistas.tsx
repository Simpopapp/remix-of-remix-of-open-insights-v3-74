import { createFileRoute } from "@tanstack/react-router";
import { Award, Flame, Lock, Rocket, Sparkles, Trophy, Zap } from "lucide-react";
import { course, totalLessons } from "@/lib/course-data";
import { useProgress } from "@/lib/progress";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/conquistas")({
  head: () => ({
    meta: [
      { title: "Conquistas — AI App Empire" },
      { name: "description", content: "Selos, marcos e status conquistados no curso AI App Empire." },
    ],
  }),
  component: AchievementsPage,
});

function AchievementsPage() {
  const { isDone, completedCount } = useProgress();
  const pct = Math.round((completedCount / totalLessons) * 100);

  const modulesDone = course.modules.filter((m) =>
    m.lessons.every((l) => isDone(m.id, l.id)),
  ).length;

  const achievements = [
    {
      id: "first",
      icon: Sparkles,
      title: "Primeira aula",
      desc: "Você começou. Isso já te coloca à frente da maioria.",
      unlocked: completedCount >= 1,
      progress: Math.min(completedCount, 1),
      target: 1,
    },
    {
      id: "five",
      icon: Zap,
      title: "Momentum",
      desc: "5 aulas concluídas — o hábito de elite se forma.",
      unlocked: completedCount >= 5,
      progress: Math.min(completedCount, 5),
      target: 5,
    },
    {
      id: "module",
      icon: Rocket,
      title: "Primeiro módulo",
      desc: "Um módulo completo. Fundação do império de pé.",
      unlocked: modulesDone >= 1,
      progress: Math.min(modulesDone, 1),
      target: 1,
    },
    {
      id: "half",
      icon: Flame,
      title: "Meio caminho",
      desc: "50% do curso. O ponto onde amadores desistem.",
      unlocked: pct >= 50,
      progress: Math.min(pct, 50),
      target: 50,
    },
    {
      id: "all-modules",
      icon: Trophy,
      title: "Império completo",
      desc: "Todos os módulos concluídos. Aula por aula.",
      unlocked: modulesDone === course.modules.length,
      progress: modulesDone,
      target: course.modules.length,
    },
    {
      id: "emperor",
      icon: Award,
      title: "Imperador",
      desc: "100% do curso concluído. Selo verificável liberado.",
      unlocked: pct === 100,
      progress: pct,
      target: 100,
    },
  ];

  const unlocked = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 lg:py-14">
      <div className="text-xs uppercase tracking-[0.28em] text-primary">Vitrine</div>
      <h1 className="mt-2 font-serif text-4xl lg:text-5xl tracking-tight">
        Conquistas
      </h1>
      <p className="mt-3 text-muted-foreground max-w-xl">
        Selos de elite conquistados ao longo do curso. {unlocked} de{" "}
        {achievements.length} desbloqueados.
      </p>

      <div className="mt-8 max-w-md">
        <Progress value={(unlocked / achievements.length) * 100} className="h-1.5" />
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {achievements.map((a) => {
          const Icon = a.icon;
          return (
            <div
              key={a.id}
              className={
                "relative overflow-hidden rounded-2xl border p-6 transition " +
                (a.unlocked
                  ? "border-primary/50 bg-gradient-to-br from-primary/10 to-card"
                  : "border-border bg-card opacity-70")
              }
            >
              <div className="flex items-center justify-between">
                <div
                  className={
                    "grid h-11 w-11 place-items-center rounded-full " +
                    (a.unlocked
                      ? "bg-primary text-primary-foreground shadow-[0_0_30px_-8px_oklch(0.76_0.09_82/0.7)]"
                      : "bg-muted text-muted-foreground")
                  }
                >
                  {a.unlocked ? <Icon className="h-5 w-5" /> : <Lock className="h-4 w-4" />}
                </div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  {a.unlocked ? "Desbloqueado" : "Bloqueado"}
                </div>
              </div>
              <h3 className="mt-4 font-serif text-xl leading-tight">{a.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{a.desc}</p>
              <div className="mt-4 flex items-center gap-3">
                <Progress value={(a.progress / a.target) * 100} className="h-1 flex-1" />
                <span className="text-xs tabular-nums text-muted-foreground">
                  {a.progress}/{a.target}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
