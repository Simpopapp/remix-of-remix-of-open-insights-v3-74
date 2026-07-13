import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { useProfile, GOALS } from "@/lib/profile";
import { useGamification } from "@/lib/gamification";
import { useProgress } from "@/lib/progress";
import { useExercises } from "@/lib/user-state";
import { course } from "@/lib/course-data";
import { downloadDump, importDump, wipeAll } from "@/lib/storage";
import { Download, RefreshCw, Trash2, Upload } from "lucide-react";

export const Route = createFileRoute("/perfil")({
  head: () => ({ meta: [{ title: "Perfil — AI App Empire" }] }),
  component: PerfilPage,
});

function PerfilPage() {
  const { profile, update, reset } = useProfile();
  const { xp, level, levelProgress, rank, streak, watch } = useGamification();
  const { completedCount } = useProgress();
  const { count: exDone } = useExercises();
  const totalLessons = course.modules.reduce((n, m) => n + m.lessons.length, 0);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="font-serif text-4xl">Perfil</h1>
      <p className="text-sm text-muted-foreground">Sua identidade dentro da cohort.</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="rounded-2xl border border-primary/25 bg-card/50 p-6 text-center">
          <div className="mx-auto grid h-24 w-24 place-items-center rounded-full border border-primary/40 bg-primary/10 text-4xl">
            {profile.avatar}
          </div>
          <div className="mt-4 font-serif text-2xl">{profile.name || "Sem nome"}</div>
          <div className="text-xs text-muted-foreground">@{profile.handle || "—"}</div>
          <div className="mt-4 rounded-md border border-primary/25 bg-background/40 py-2 text-xs uppercase tracking-[0.2em] text-primary">
            {rank}
          </div>
          <div className="mt-6 space-y-3 text-left">
            <Stat label="Nível" value={String(level)} />
            <Stat label="XP" value={xp.toLocaleString("pt-BR")} />
            <Stat label="Streak" value={`${streak.current} dias`} />
            <Stat label="Melhor streak" value={`${streak.best}`} />
            <Stat label="Assistido" value={`${Math.floor(watch / 60)} min`} />
          </div>
          <button
            onClick={() => {
              if (confirm("Resetar seu perfil?")) reset();
            }}
            className="mt-6 inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-destructive"
          >
            <RefreshCw className="h-3 w-3" /> Refazer onboarding
          </button>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-primary/25 bg-card/50 p-6">
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Progresso do nível {level}</div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full bg-primary" style={{ width: `${levelProgress * 100}%` }} />
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              {Math.round(levelProgress * 100)}% até o nível {level + 1}
            </div>
          </div>

          <div className="rounded-2xl border border-primary/25 bg-card/50 p-6">
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Editar dados</div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Field label="Nome">
                <input
                  value={profile.name}
                  onChange={(e) => update({ name: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </Field>
              <Field label="Handle">
                <input
                  value={profile.handle}
                  onChange={(e) => update({ handle: e.target.value.toLowerCase().replace(/\s+/g, "") })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </Field>
              <Field label="Objetivo">
                <select
                  value={profile.goal}
                  onChange={(e) => update({ goal: e.target.value as never })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {Object.entries(GOALS).map(([k, v]) => (
                    <option key={k} value={k}>{v.label}</option>
                  ))}
                </select>
              </Field>
              <Field label="Horas / semana">
                <input
                  type="number"
                  min={1}
                  max={40}
                  value={profile.weeklyHours}
                  onChange={(e) => update({ weeklyHours: Number(e.target.value) })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </Field>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <BigStat n={`${completedCount}/${totalLessons}`} label="Aulas" />
            <BigStat n={String(exDone)} label="Exercícios" />
            <BigStat n={`${Math.floor(watch / 3600)}h`} label="Assistido" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-serif text-lg text-primary">{value}</span>
    </div>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
function BigStat({ n, label }: { n: string; label: string }) {
  return (
    <div className="rounded-xl border border-primary/25 bg-card/50 p-4 text-center">
      <div className="font-serif text-2xl text-primary">{n}</div>
      <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
    </div>
  );
}
