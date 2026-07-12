import { createFileRoute } from "@tanstack/react-router";
import { useGamification, useLeaderboard } from "@/lib/gamification";
import { useProfile } from "@/lib/profile";
import { Crown, Flame, Trophy } from "lucide-react";

export const Route = createFileRoute("/ranking")({
  head: () => ({ meta: [{ title: "Ranking — AI App Empire" }] }),
  component: RankingPage,
});

function RankingPage() {
  const { profile } = useProfile();
  const { xp, streak } = useGamification();
  const { rows, myRank } = useLeaderboard(xp, streak.current, profile.name, profile.avatar);

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl">Ranking da Cohort</h1>
          <p className="text-sm text-muted-foreground">Semana em curso · atualiza em tempo real</p>
        </div>
        <div className="rounded-xl border border-primary/40 bg-primary/10 px-4 py-3 text-center">
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Sua posição</div>
          <div className="font-serif text-3xl text-primary">#{myRank}</div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-4">
        {rows.slice(0, 3).map((r, i) => (
          <div
            key={r.id}
            className={
              "rounded-2xl border p-6 text-center " +
              (i === 0
                ? "border-primary/60 bg-gradient-to-b from-primary/15 to-transparent"
                : "border-primary/25 bg-card/50")
            }
          >
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-primary/40 bg-background text-2xl">
              {r.avatar}
            </div>
            {i === 0 && <Crown className="mx-auto mt-2 h-5 w-5 text-primary" />}
            <div className="mt-2 truncate font-serif">{r.name}</div>
            <div className="text-xs text-muted-foreground">{r.country} @{r.handle}</div>
            <div className="mt-3 font-serif text-xl text-primary">{r.xp.toLocaleString("pt-BR")} XP</div>
            <div className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Flame className="h-3 w-3" /> {r.streak} dias
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-primary/25 bg-card/50">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-background/40 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Aluno</th>
              <th className="px-4 py-3 text-right">XP</th>
              <th className="px-4 py-3 text-right">Streak</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={r.id}
                className={
                  "border-b border-border/60 " +
                  (r.isMe ? "bg-primary/10" : "hover:bg-background/40")
                }
              >
                <td className="px-4 py-3 font-serif text-primary">
                  {i + 1}
                  {i === 0 && <Trophy className="ml-1 inline h-3.5 w-3.5" />}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="grid h-8 w-8 place-items-center rounded-full border border-primary/25 bg-background">
                      {r.avatar}
                    </div>
                    <div>
                      <div className={r.isMe ? "font-semibold text-primary" : ""}>{r.name} {r.isMe && "(você)"}</div>
                      <div className="text-xs text-muted-foreground">{r.country} @{r.handle}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-right font-serif">{r.xp.toLocaleString("pt-BR")}</td>
                <td className="px-4 py-3 text-right">
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <Flame className="h-3 w-3" /> {r.streak}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
