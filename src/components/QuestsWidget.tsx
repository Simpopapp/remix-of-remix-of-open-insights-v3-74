import { Link } from "@tanstack/react-router";
import { Bell, Check, Sparkles, Target } from "lucide-react";
import { useQuests, claimQuest } from "@/lib/quests";
import { notificationsPermission, requestNotifications } from "@/lib/notifications";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function QuestsWidget() {
  const quests = useQuests();
  const [perm, setPerm] = useState<string>("default");

  useEffect(() => {
    setPerm(notificationsPermission());
  }, []);

  const doneCount = quests.filter((q) => q.done).length;

  async function enableNotifs() {
    const r = await requestNotifications();
    setPerm(r);
    if (r === "granted") toast.success("Notificações ativadas");
    else if (r === "denied") toast.error("Permissão negada");
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-primary">
          <Target className="h-3 w-3" /> Quests de hoje
        </div>
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
          {doneCount}/{quests.length} concluídas
        </div>
      </div>

      <ul className="mt-5 space-y-3">
        {quests.map((q) => {
          const pct = Math.round((q.progress / q.target) * 100);
          return (
            <li key={q.id} className="rounded-lg border border-border bg-background/40 p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-sm">
                    {q.done ? (
                      <Check className="h-3.5 w-3.5 shrink-0 text-primary" />
                    ) : (
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
                    )}
                    <span className={q.claimed ? "text-muted-foreground line-through" : ""}>{q.title}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted/40">
                      <div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-[10px] tabular-nums text-muted-foreground">
                      {q.progress}/{q.target}
                    </span>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  {q.claimed ? (
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Feito</span>
                  ) : q.done ? (
                    <button
                      onClick={() => {
                        claimQuest(q.id);
                        toast.success(`+${q.xp} XP · ${q.title}`, { icon: "✦" });
                      }}
                      className="rounded-full bg-primary px-3 py-1 text-[11px] font-semibold text-primary-foreground hover:opacity-90"
                    >
                      +{q.xp} XP
                    </button>
                  ) : (
                    <span className="text-[10px] uppercase tracking-widest text-primary/70">+{q.xp} XP</span>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4 text-xs">
        <Link to="/foco" className="inline-flex items-center gap-1 text-primary hover:underline">
          <Sparkles className="h-3 w-3" /> Ir pro Modo Foco
        </Link>
        {perm === "granted" ? (
          <span className="inline-flex items-center gap-1 text-muted-foreground">
            <Bell className="h-3 w-3" /> Notificações ativas
          </span>
        ) : perm === "unsupported" ? null : (
          <button
            onClick={enableNotifs}
            className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 hover:border-primary/60"
          >
            <Bell className="h-3 w-3" /> Ativar notificações
          </button>
        )}
      </div>
    </div>
  );
}
