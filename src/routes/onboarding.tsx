import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { useProfile, GOALS, type Profile } from "@/lib/profile";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "Onboarding — AI App Empire" }] }),
  component: Onboarding,
});

const AVATARS = ["◆", "◈", "✦", "♠︎", "❖", "▲", "☾", "❀", "✧", "◇", "⚡", "🌸"];

function Onboarding() {
  const { profile, update } = useProfile();
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Profile>(profile);

  const steps = ["Identidade", "Objetivo", "Ritmo", "Confirmar"];

  const finish = () => {
    update({ ...draft, onboarded: true, createdAt: new Date().toISOString() });
    nav({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <div className="mb-8 flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-primary">
          <Sparkles className="h-3.5 w-3.5" /> AI App Empire · Concierge
        </div>

        <div className="mb-10 flex items-center gap-2">
          {steps.map((s, i) => (
            <div key={s} className="flex flex-1 items-center gap-2">
              <div
                className={
                  "h-1 flex-1 rounded-full " +
                  (i <= step ? "bg-primary" : "bg-muted")
                }
              />
              <span
                className={
                  "text-[10px] uppercase tracking-[0.18em] " +
                  (i === step ? "text-primary" : "text-muted-foreground")
                }
              >
                {s}
              </span>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-primary/25 bg-card/50 p-8 backdrop-blur">
          {step === 0 && (
            <div className="space-y-6">
              <div>
                <h1 className="font-serif text-3xl">Como te chamamos?</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Isso aparece no seu certificado, no ranking e no perfil público.
                </p>
              </div>
              <div className="space-y-3">
                <input
                  autoFocus
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  placeholder="Seu nome completo"
                  className="w-full rounded-md border border-input bg-background px-4 py-3 text-base outline-none focus:border-primary"
                />
                <input
                  value={draft.handle}
                  onChange={(e) => setDraft({ ...draft, handle: e.target.value.toLowerCase().replace(/\s+/g, "") })}
                  placeholder="handle (ex: joaov)"
                  className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <div className="mb-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">Avatar</div>
                <div className="flex flex-wrap gap-2">
                  {AVATARS.map((a) => (
                    <button
                      key={a}
                      onClick={() => setDraft({ ...draft, avatar: a })}
                      className={
                        "grid h-12 w-12 place-items-center rounded-lg border text-xl " +
                        (draft.avatar === a
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-input bg-background hover:border-primary/40")
                      }
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h1 className="font-serif text-3xl">Qual seu objetivo?</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Usamos isso pra sugerir a trilha certa e priorizar aulas.
                </p>
              </div>
              <div className="grid gap-3">
                {(Object.keys(GOALS) as Profile["goal"][]).map((g) => {
                  const info = GOALS[g];
                  const active = draft.goal === g;
                  return (
                    <button
                      key={g}
                      onClick={() => setDraft({ ...draft, goal: g })}
                      className={
                        "flex items-center gap-4 rounded-xl border p-4 text-left transition " +
                        (active
                          ? "border-primary bg-primary/10"
                          : "border-input bg-background hover:border-primary/40")
                      }
                    >
                      <div
                        className={
                          "h-5 w-5 rounded-full border-2 " +
                          (active ? "border-primary bg-primary" : "border-muted-foreground/40")
                        }
                      />
                      <div>
                        <div className="font-medium">{info.label}</div>
                        <div className="text-xs text-muted-foreground">{info.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h1 className="font-serif text-3xl">Seu ritmo semanal</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Quanto tempo você dedica por semana? Ajustamos as metas do concierge.
                </p>
              </div>
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-muted-foreground">Horas por semana</span>
                  <span className="font-serif text-2xl text-primary">{draft.weeklyHours}h</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={20}
                  value={draft.weeklyHours}
                  onChange={(e) => setDraft({ ...draft, weeklyHours: Number(e.target.value) })}
                  className="w-full accent-primary"
                />
                <div className="mt-1 flex justify-between text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  <span>Casual</span>
                  <span>Elite</span>
                </div>
              </div>
              <div>
                <div className="mb-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">Fuso</div>
                <select
                  value={draft.timezone}
                  onChange={(e) => setDraft({ ...draft, timezone: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm"
                >
                  <option>America/Sao_Paulo</option>
                  <option>America/New_York</option>
                  <option>Europe/Lisbon</option>
                  <option>Europe/London</option>
                  <option>Asia/Tokyo</option>
                </select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h1 className="font-serif text-3xl">Tudo pronto, {draft.name || "aluno"}.</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Confirma abaixo e o concierge desbloqueia sua área.
                </p>
              </div>
              <dl className="grid grid-cols-2 gap-4 rounded-xl border border-primary/25 bg-background/40 p-6">
                <div><dt className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Nome</dt><dd className="mt-1 font-serif text-lg">{draft.avatar} {draft.name}</dd></div>
                <div><dt className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Handle</dt><dd className="mt-1">@{draft.handle || "—"}</dd></div>
                <div><dt className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Objetivo</dt><dd className="mt-1 text-sm">{GOALS[draft.goal].label}</dd></div>
                <div><dt className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Ritmo</dt><dd className="mt-1 text-sm">{draft.weeklyHours}h / semana</dd></div>
              </dl>
            </div>
          )}

          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className="text-sm text-muted-foreground disabled:opacity-30"
            >
              Voltar
            </button>
            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={step === 0 && !draft.name.trim()}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-40"
              >
                Continuar <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={finish}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                <Check className="h-4 w-4" /> Entrar na plataforma
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
