import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Check, Sparkles, Clock, Target, User } from "lucide-react";
import { useProfile, GOALS, type Profile } from "@/lib/profile";
import heroOnboarding from "@/assets/hero-onboarding.jpg";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "Onboarding — AI App Empire" }] }),
  component: Onboarding,
});

const AVATARS = ["◆", "◈", "✦", "♠︎", "❖", "▲", "☾", "❀", "✧", "◇", "⚡", "🌸"];

const STEP_META = [
  { key: "Identidade", icon: User, kicker: "Ato I", title: "Como te chamamos?", sub: "Isso aparece no seu certificado, ranking e perfil público." },
  { key: "Objetivo", icon: Target, kicker: "Ato II", title: "Qual seu objetivo?", sub: "Usamos pra sugerir a trilha certa e priorizar aulas." },
  { key: "Ritmo", icon: Clock, kicker: "Ato III", title: "Seu ritmo semanal", sub: "Quanto tempo você dedica? Ajustamos as metas do concierge." },
  { key: "Confirmar", icon: Check, kicker: "Última porta", title: "", sub: "Confirma abaixo e o concierge desbloqueia sua área." },
];

function Onboarding() {
  const { profile, update } = useProfile();
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Profile>(profile);

  const meta = STEP_META[step];
  const StepIcon = meta.icon;

  const finish = () => {
    update({ ...draft, onboarded: true, createdAt: new Date().toISOString() });
    nav({ to: "/" });
  };

  const canAdvance = step === 0 ? draft.name.trim().length > 1 : true;

  return (
    <div className="relative min-h-dvh overflow-hidden bg-background">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-primary/25 blur-[140px]" />
        <div className="absolute bottom-[-160px] right-[-160px] h-[420px] w-[420px] rounded-full bg-primary/15 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
          style={{
            backgroundImage:
              "radial-gradient(oklch(0.98 0.03 90 / 0.4) 1px, transparent 1px)",
            backgroundSize: "3px 3px",
          }}
        />
      </div>

      <div className="mx-auto grid min-h-dvh max-w-7xl grid-cols-1 lg:grid-cols-[520px_1fr]">
        {/* Left: editorial art */}
        <aside className="relative hidden overflow-hidden border-r border-border/50 lg:block">
          <img
            src={heroOnboarding}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/20 to-background/90" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-background/70" />

          <div className="relative flex h-full flex-col justify-between p-10">
            <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.32em] text-primary">
              <Sparkles className="h-3.5 w-3.5" /> AI App Empire · Concierge
            </div>

            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.32em] text-primary/80">
                Bem-vindo
              </div>
              <h2 className="mt-4 font-serif text-4xl leading-[1.05] tracking-tight">
                Antes de entrar,
                <br />
                <span className="italic text-primary">um breve ritual.</span>
              </h2>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
                Quatro portas curtas. No fim delas, sua área personalizada
                — trilha, ritmo e certificado no seu nome.
              </p>

              <ol className="mt-8 space-y-3 text-sm">
                {STEP_META.map((s, i) => (
                  <li
                    key={s.key}
                    className={
                      "flex items-center gap-3 transition " +
                      (i === step
                        ? "text-foreground"
                        : i < step
                        ? "text-primary/80"
                        : "text-muted-foreground/60")
                    }
                  >
                    <span
                      className={
                        "grid h-7 w-7 place-items-center rounded-full border font-mono text-[11px] tabular-nums " +
                        (i === step
                          ? "border-primary bg-primary/15 text-primary shadow-[0_0_24px_-6px_oklch(0.76_0.09_82/0.6)]"
                          : i < step
                          ? "border-primary/40 bg-primary/10 text-primary"
                          : "border-border")
                      }
                    >
                      {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
                    </span>
                    <span className="font-mono text-[11px] uppercase tracking-[0.24em]">
                      {s.key}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="text-[10px] font-mono uppercase tracking-[0.28em] text-muted-foreground/70">
              MMXXVI · Concierge Editorial
            </div>
          </div>
        </aside>

        {/* Right: form */}
        <main className="relative flex items-center justify-center p-6 lg:p-14">
          <div className="w-full max-w-xl">
            {/* Mobile mini-hero */}
            <div className="mb-6 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.32em] text-primary lg:hidden">
              <Sparkles className="h-3 w-3" /> Concierge
            </div>

            {/* Progress rail */}
            <div className="mb-10 flex items-center gap-1.5">
              {STEP_META.map((s, i) => (
                <div key={s.key} className="flex-1">
                  <div
                    className={
                      "h-[3px] w-full overflow-hidden rounded-full " +
                      (i <= step ? "bg-primary/20" : "bg-border/60")
                    }
                  >
                    <div
                      className={
                        "h-full rounded-full transition-all duration-500 " +
                        (i < step
                          ? "w-full bg-primary"
                          : i === step
                          ? "w-1/2 bg-primary shadow-[0_0_16px_-2px_oklch(0.76_0.09_82/0.9)]"
                          : "w-0 bg-transparent")
                      }
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Card */}
            <div
              key={step}
              className="relative animate-fade-in rounded-3xl border border-border/70 bg-card/60 p-8 shadow-[0_40px_120px_-40px_oklch(0.76_0.09_82/0.35)] backdrop-blur-xl lg:p-10"
            >
              {/* corner ornaments */}
              <span className="pointer-events-none absolute left-4 top-4 h-4 w-4 border-l border-t border-primary/50" />
              <span className="pointer-events-none absolute right-4 top-4 h-4 w-4 border-r border-t border-primary/50" />
              <span className="pointer-events-none absolute bottom-4 left-4 h-4 w-4 border-b border-l border-primary/50" />
              <span className="pointer-events-none absolute bottom-4 right-4 h-4 w-4 border-b border-r border-primary/50" />

              <div className="mb-6 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl border border-primary/40 bg-primary/10 text-primary">
                  <StepIcon className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-[0.28em] text-primary/80">
                    {meta.kicker} · {step + 1} de 4
                  </div>
                  <h1 className="mt-0.5 font-serif text-3xl leading-tight tracking-tight lg:text-4xl">
                    {step === 3 ? `Tudo pronto, ${draft.name || "aluno"}.` : meta.title}
                  </h1>
                </div>
              </div>
              <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
                {meta.sub}
              </p>

              {step === 0 && (
                <div className="space-y-5">
                  <Field label="Nome completo">
                    <input
                      autoFocus
                      value={draft.name}
                      onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                      placeholder="Ex: João Vitor"
                      className="w-full rounded-xl border border-border bg-background/50 px-4 py-3.5 font-serif text-lg tracking-tight placeholder:font-sans placeholder:text-sm placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </Field>
                  <Field label="Handle público">
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-sm text-muted-foreground">@</span>
                      <input
                        value={draft.handle}
                        onChange={(e) =>
                          setDraft({ ...draft, handle: e.target.value.toLowerCase().replace(/\s+/g, "") })
                        }
                        placeholder="joaov"
                        className="w-full rounded-xl border border-border bg-background/50 pl-8 pr-4 py-3 font-mono text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </Field>
                  <Field label="Avatar">
                    <div className="grid grid-cols-6 gap-2">
                      {AVATARS.map((a) => (
                        <button
                          key={a}
                          onClick={() => setDraft({ ...draft, avatar: a })}
                          className={
                            "group relative grid h-12 place-items-center rounded-xl border text-xl transition-all duration-200 " +
                            (draft.avatar === a
                              ? "border-primary bg-primary/15 text-primary shadow-[0_0_28px_-8px_oklch(0.76_0.09_82/0.9)] scale-105"
                              : "border-border bg-background/40 hover:border-primary/50 hover:-translate-y-0.5")
                          }
                        >
                          {a}
                        </button>
                      ))}
                    </div>
                  </Field>
                </div>
              )}

              {step === 1 && (
                <div className="grid gap-3">
                  {(Object.keys(GOALS) as Profile["goal"][]).map((g) => {
                    const info = GOALS[g];
                    const active = draft.goal === g;
                    return (
                      <button
                        key={g}
                        onClick={() => setDraft({ ...draft, goal: g })}
                        className={
                          "group relative flex items-start gap-4 overflow-hidden rounded-2xl border p-5 text-left transition-all duration-200 " +
                          (active
                            ? "border-primary bg-primary/10 shadow-[0_0_40px_-16px_oklch(0.76_0.09_82/0.8)]"
                            : "border-border bg-background/40 hover:border-primary/50 hover:-translate-y-0.5")
                        }
                      >
                        {active && (
                          <span className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-primary/0 via-primary to-primary/0" />
                        )}
                        <div
                          className={
                            "mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition " +
                            (active
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-muted-foreground/40")
                          }
                        >
                          {active && <Check className="h-3.5 w-3.5" />}
                        </div>
                        <div className="min-w-0">
                          <div className="font-serif text-lg leading-tight tracking-tight">
                            {info.label}
                          </div>
                          <div className="mt-1 text-sm leading-relaxed text-muted-foreground">
                            {info.desc}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {step === 2 && (
                <div className="space-y-8">
                  <div>
                    <div className="mb-4 flex items-baseline justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-[0.28em] text-muted-foreground">
                        Horas por semana
                      </span>
                      <span className="font-serif text-5xl tracking-tight text-primary tabular-nums">
                        {draft.weeklyHours}
                        <span className="ml-1 text-lg text-primary/60">h</span>
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={20}
                      value={draft.weeklyHours}
                      onChange={(e) =>
                        setDraft({ ...draft, weeklyHours: Number(e.target.value) })
                      }
                      className="w-full accent-primary"
                    />
                    <div className="mt-2 flex justify-between text-[10px] font-mono uppercase tracking-[0.28em] text-muted-foreground">
                      <span>Casual · 1h</span>
                      <span>Elite · 20h</span>
                    </div>
                    <div className="mt-6 grid grid-cols-4 gap-2">
                      {[3, 6, 10, 15].map((h) => (
                        <button
                          key={h}
                          onClick={() => setDraft({ ...draft, weeklyHours: h })}
                          className={
                            "rounded-lg border px-3 py-2 text-xs font-mono transition " +
                            (draft.weeklyHours === h
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground")
                          }
                        >
                          {h}h
                        </button>
                      ))}
                    </div>
                  </div>
                  <Field label="Fuso horário">
                    <select
                      value={draft.timezone}
                      onChange={(e) => setDraft({ ...draft, timezone: e.target.value })}
                      className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option>America/Sao_Paulo</option>
                      <option>America/New_York</option>
                      <option>Europe/Lisbon</option>
                      <option>Europe/London</option>
                      <option>Asia/Tokyo</option>
                    </select>
                  </Field>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-background/30 to-background/50 p-6">
                    <div className="flex items-center gap-4">
                      <div className="grid h-16 w-16 place-items-center rounded-2xl border border-primary/40 bg-background/60 font-serif text-3xl text-primary shadow-[0_0_40px_-10px_oklch(0.76_0.09_82/0.8)]">
                        {draft.avatar}
                      </div>
                      <div>
                        <div className="font-serif text-2xl leading-tight tracking-tight">
                          {draft.name || "—"}
                        </div>
                        <div className="font-mono text-xs text-muted-foreground">
                          @{draft.handle || "sem-handle"}
                        </div>
                      </div>
                    </div>
                    <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-border/60 pt-5">
                      <SummaryItem label="Objetivo" value={GOALS[draft.goal].label} />
                      <SummaryItem label="Ritmo" value={`${draft.weeklyHours}h / semana`} />
                      <SummaryItem label="Fuso" value={draft.timezone} />
                      <SummaryItem label="Cohort" value="01 · MMXXVI" />
                    </dl>
                  </div>
                  <p className="text-center text-xs text-muted-foreground">
                    Você pode ajustar tudo depois em <span className="text-primary">/perfil</span>.
                  </p>
                </div>
              )}

              <div className="mt-10 flex items-center justify-between border-t border-border/60 pt-6">
                <button
                  onClick={() => setStep(Math.max(0, step - 1))}
                  disabled={step === 0}
                  className="text-xs font-mono uppercase tracking-[0.24em] text-muted-foreground transition hover:text-foreground disabled:opacity-20"
                >
                  ← Voltar
                </button>
                {step < 3 ? (
                  <button
                    onClick={() => setStep(step + 1)}
                    disabled={!canAdvance}
                    className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground shadow-[0_10px_40px_-10px_oklch(0.76_0.09_82/0.8)] transition hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                    <span className="relative">Continuar</span>
                    <ArrowRight className="relative h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </button>
                ) : (
                  <button
                    onClick={finish}
                    className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground shadow-[0_10px_40px_-10px_oklch(0.76_0.09_82/0.9)] transition hover:opacity-95"
                  >
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                    <Check className="relative h-4 w-4" />
                    <span className="relative">Entrar na plataforma</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-2 text-[10px] font-mono uppercase tracking-[0.28em] text-muted-foreground">
        {label}
      </div>
      {children}
    </label>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] font-mono uppercase tracking-[0.28em] text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 font-serif text-base leading-tight">{value}</dd>
    </div>
  );
}
