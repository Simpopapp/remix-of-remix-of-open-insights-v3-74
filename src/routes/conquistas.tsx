import { createFileRoute } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useBadges, tierColor, type BadgeTier } from "@/lib/badges";

export const Route = createFileRoute("/conquistas")({
  head: () => ({
    meta: [
      { title: "Conquistas — AI App Empire" },
      { name: "description", content: "Selos, marcos e status conquistados no curso AI App Empire." },
    ],
  }),
  component: AchievementsPage,
});

const categoryLabel: Record<string, string> = {
  progresso: "Progresso",
  hábito: "Hábito",
  prática: "Prática",
  curadoria: "Curadoria",
  elite: "Elite",
};

const tierLabel: Record<BadgeTier, string> = {
  bronze: "Bronze",
  silver: "Prata",
  gold: "Ouro",
  legend: "Lenda",
};

function AchievementsPage() {
  const { badges, unlocked, total, byCategory } = useBadges();
  const pct = Math.round((unlocked / total) * 100);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 lg:py-14">
      <div className="text-xs uppercase tracking-[0.28em] text-primary">Vitrine</div>
      <h1 className="mt-2 font-serif text-4xl lg:text-5xl tracking-tight">Conquistas</h1>
      <p className="mt-3 text-muted-foreground max-w-xl">
        {unlocked} de {total} selos desbloqueados · {pct}% da coleção.
      </p>

      <div className="mt-6 max-w-md">
        <Progress value={pct} className="h-1.5" />
      </div>

      {Object.entries(byCategory).map(([cat, list]) => (
        <section key={cat} className="mt-10">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="font-serif text-2xl tracking-tight">{categoryLabel[cat] ?? cat}</h2>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">
              {list.filter((b) => b.unlocked).length}/{list.length}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((a) => {
              const Icon = a.icon;
              return (
                <div
                  key={a.id}
                  className={
                    "relative overflow-hidden rounded-2xl border p-6 transition bg-gradient-to-br " +
                    (a.unlocked ? tierColor[a.tier] : "border-border bg-card opacity-60")
                  }
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={
                        "grid h-11 w-11 place-items-center rounded-full " +
                        (a.unlocked ? "bg-primary/20 text-primary shadow-[0_0_30px_-8px_oklch(0.76_0.09_82/0.7)]" : "bg-muted text-muted-foreground")
                      }
                    >
                      {a.unlocked ? <Icon className="h-5 w-5" /> : <Lock className="h-4 w-4" />}
                    </div>
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                      {tierLabel[a.tier]}
                    </div>
                  </div>
                  <h3 className="mt-4 font-serif text-xl leading-tight text-foreground">{a.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{a.desc}</p>
                  <div className="mt-4 flex items-center gap-3">
                    <Progress value={Math.min(100, (a.progress / a.target) * 100)} className="h-1 flex-1" />
                    <span className="text-xs tabular-nums text-muted-foreground">
                      {Math.min(a.progress, a.target)}/{a.target}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
