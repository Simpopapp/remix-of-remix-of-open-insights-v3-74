import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  Sparkles,
  Clock,
  Target,
  User,
  Rocket,
  Briefcase,
  Building2,
  Compass,
  Command,
  ChevronLeft,
  Shuffle,
} from "lucide-react";
import { useProfile, GOALS, type Profile } from "@/lib/profile";
import { fireConfetti } from "@/lib/confetti";
import heroOnboarding from "@/assets/hero-onboarding.jpg";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Ritual de entrada — AI App Empire" },
      {
        name: "description",
        content:
          "Quatro portas curtas antes de entrar na sua área. Identidade, objetivo, ritmo e confirmação.",
      },
    ],
  }),
  component: Onboarding,
});

const AVATARS = [
  "◆", "◈", "✦", "♠︎", "❖", "▲", "☾", "❀",
  "✧", "◇", "⚡", "☀︎", "☽", "❋", "✺", "◉",
];

const HANDLE_ADJ = ["neo", "lux", "vera", "ars", "nova", "atlas", "oro", "prime"];

const GOAL_META: Record<
  Profile["goal"],
  { icon: typeof Rocket; hint: string; pace: string }
> = {
  "launch-mvp": { icon: Rocket, hint: "Foco em execução ", pace: "≈ 8h / semana ideal" },
  "acquire-clients": { icon: Briefcase, hint: "Vendas + posicionamento", pace: "≈ 6h / semana ideal" },
  "scale-agency": { icon: Building2, hint: "Operação e delivery", pace: "≈ 10h / semana ideal" },
  explore: { icon: Compass, hint: "Curiosidade sem pressa", pace: "≈ 3h / semana ideal" },
};

const STEP_META = [
  {
    key: "Prólogo",
    icon: Sparkles,
    kicker: "Prólogo",
    title: "Bem-vindo à Empire.",
    sub: "Um ritual curto de quatro portas. No fim, sua área — trilha, ritmo e certificado — abre no seu nome.",
    epigraph: "“O luxo verdadeiro é a atenção ao detalhe.” — Concierge",
  },
  {
    key: "Identidade",
    icon: User,
    kicker: "Ato I",
    title: "Como te chamamos?",
    sub: "Aparece no seu certificado, no ranking e no seu perfil público.",
    epigraph: "Um nome é o primeiro traço da assinatura.",
  },
  {
    key: "Objetivo",
    icon: Target,
    kicker: "Ato II",
    title: "Qual é o objetivo?",
    sub: "O concierge usa isso pra priorizar aulas, projetos e desafios.",
    epigraph: "Sem alvo, toda flecha é justa — e nenhuma acerta.",
  },
  {
    key: "Ritmo",
    icon: Clock,
    kicker: "Ato III",
    title: "Seu ritmo semanal",
    sub: "Não é promessa — é o compasso que a sua semana aguenta hoje.",
    epigraph: "Constância vence intensidade. Sempre.",
  },
  {
    key: "Confirmar",
    icon: Check,
    kicker: "Última porta",
    title: "",
    sub: "Confira o resumo. Ao entrar, o concierge desbloqueia sua área.",
    epigraph: "O que se assina, se cumpre.",
  },
];

function Onboarding() {
  const { profile, update } = useProfile();
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Profile>(() => ({
    ...profile,
    timezone:
      profile.timezone ||
      (typeof Intl !== "undefined"
        ? Intl.DateTimeFormat().resolvedOptions().timeZone
        : "America/Sao_Paulo"),
  }));

  const meta = STEP_META[step];
  const StepIcon = meta.icon;
  const totalSteps = STEP_META.length;

  const canAdvance = useMemo(() => {
    if (step === 1) return draft.name.trim().length > 1;
    return true;
  }, [step, draft.name]);

  const finish = () => {
    update({ ...draft, onboarded: true, createdAt: new Date().toISOString() });
    fireConfetti();
    setTimeout(() => nav({ to: "/" }), 350);
  };

  const advance = () => {
    if (step === totalSteps - 1) return finish();
    if (canAdvance) setStep((s) => Math.min(totalSteps - 1, s + 1));
  };
  const back = () => setStep((s) => Math.max(0, s - 1));

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      const isTyping =
        el && (el.tagName === "TEXTAREA" || (el.tagName === "INPUT" && (el as HTMLInputElement).type !== "range"));
      if (e.key === "Enter" && !e.shiftKey) {
        if (isTyping && (el as HTMLInputElement).type !== "text") return;
        e.preventDefault();
        advance();
      } else if (e.key === "ArrowLeft" && (e.metaKey || e.altKey)) {
        e.preventDefault();
        back();
      } else if (e.key === "ArrowRight" && (e.metaKey || e.altKey)) {
        e.preventDefault();
        advance();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const suggestHandle = () => {
    const base = (draft.name || "aluno").toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 8) || "aluno";
    const adj = HANDLE_ADJ[Math.floor(Math.random() * HANDLE_ADJ.length)];
    setDraft({ ...draft, handle: `${base}.${adj}` });
  };

  const progressPct = ((step + 1) / totalSteps) * 100;

  return (
    <div className="relative min-h-dvh overflow-hidden bg-background">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[620px] w-[620px] -translate-x-1/2 rounded-full bg-primary/25 blur-[160px] animate-[pulse_8s_ease-in-out_infinite]" />
        <div className="absolute bottom-[-200px] right-[-160px] h-[520px] w-[520px] rounded-full bg-primary/15 blur-[140px]" />
        <div className="absolute top-[30%] left-[-120px] h-[320px] w-[320px] rounded-full bg-primary/10 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
          style={{
            backgroundImage:
              "radial-gradient(oklch(0.98 0.03 90 / 0.5) 1px, transparent 1px)",
            backgroundSize: "3px 3px",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(oklch(0.76 0.09 82 / 0.4) 1px, transparent 1px), linear-gradient(90deg, oklch(0.76 0.09 82 / 0.4) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      <div className="mx-auto grid min-h-dvh max-w-7xl grid-cols-1 lg:grid-cols-[520px_1fr]">
        {/* Left: editorial art */}
        <aside className="relative hidden overflow-hidden border-r border-border/50 lg:block">
          <img
            src={heroOnboarding}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-70 scale-105 transition-transform duration-[8000ms]"
            style={{ transform: `scale(${1.05 + step * 0.015})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/20 to-background/90" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-background/70" />

          <div className="relative flex h-full flex-col justify-between p-10">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.32em] text-primary">
                <Sparkles className="h-3.5 w-3.5" /> AI App Empire
              </div>
              <div className="rounded-full border border-primary/30 bg-background/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-primary/80 backdrop-blur">
                Concierge
              </div>
            </div>

            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.32em] text-primary/80">
                {meta.kicker}
              </div>
              <h2 className="mt-4 font-serif text-4xl leading-[1.05] tracking-tight">
                Antes de entrar,
                <br />
                <span className="italic text-primary">um breve ritual.</span>
              </h2>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
                Cinco portas curtas. Cada uma calibra o que a plataforma faz por você.
              </p>

              <ol className="mt-8 space-y-3 text-sm">
                {STEP_META.map((s, i) => (
                  <li
                    key={s.key}
                    className={
                      "flex items-center gap-3 transition-all duration-500 " +
                      (i === step
                        ? "text-foreground translate-x-1"
                        : i < step
                        ? "text-primary/80"
                        : "text-muted-foreground/50")
                    }
                  >
                    <span
                      className={
                        "grid h-7 w-7 place-items-center rounded-full border font-mono text-[11px] tabular-nums transition-all " +
                        (i === step
                          ? "border-primary bg-primary/15 text-primary shadow-[0_0_24px_-4px_oklch(0.76_0.09_82/0.8)] scale-110"
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
                    {i === step && (
                      <span className="ml-auto h-1 w-1 animate-pulse rounded-full bg-primary" />
                    )}
                  </li>
                ))}
              </ol>

              <blockquote className="mt-10 border-l-2 border-primary/50 pl-4 font-serif text-sm italic leading-relaxed text-muted-foreground/90">
                {meta.epigraph}
              </blockquote>
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.28em] text-muted-foreground/70">
              <span>MMXXVI · Cohort 01</span>
              <span className="inline-flex items-center gap-1.5">
                <Command className="h-3 w-3" /> Enter avança
              </span>
            </div>
          </div>
        </aside>

        {/* Right: form */}
        <main className="relative flex items-center justify-center p-6 lg:p-14">
          <div className="w-full max-w-xl">
            {/* Mobile mini-hero */}
            <div className="mb-6 flex items-center justify-between lg:hidden">
              <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.32em] text-primary">
                <Sparkles className="h-3 w-3" /> Concierge
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                {step + 1} / {totalSteps}
              </div>
            </div>

            {/* Progress rail */}
            <div className="mb-3 flex items-center gap-1.5">
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
                        "h-full rounded-full transition-all duration-700 " +
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
            <div className="mb-10 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
              <span>{meta.kicker}</span>
              <span className="tabular-nums">{Math.round(progressPct)}%</span>
            </div>

            {/* Card */}
            <div
              key={step}
              className="relative animate-fade-in rounded-3xl border border-border/70 bg-card/60 p-8 shadow-[0_40px_120px_-40px_oklch(0.76_0.09_82/0.35)] backdrop-blur-xl lg:p-10"
            >
              <span className="pointer-events-none absolute left-4 top-4 h-4 w-4 border-l border-t border-primary/50" />
              <span className="pointer-events-none absolute right-4 top-4 h-4 w-4 border-r border-t border-primary/50" />
              <span className="pointer-events-none absolute bottom-4 left-4 h-4 w-4 border-b border-l border-primary/50" />
              <span className="pointer-events-none absolute bottom-4 right-4 h-4 w-4 border-b border-r border-primary/50" />

              <div className="mb-6 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl border border-primary/40 bg-primary/10 text-primary shadow-[0_0_24px_-8px_oklch(0.76_0.09_82/0.8)]">
                  <StepIcon className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-[0.28em] text-primary/80">
                    {meta.kicker} · {step + 1} de {totalSteps}
                  </div>
                  <h1 className="mt-0.5 font-serif text-3xl leading-tight tracking-tight lg:text-4xl">
                    {step === totalSteps - 1
                      ? `Tudo pronto, ${draft.name || "aluno"}.`
                      : meta.title}
                  </h1>
                </div>
              </div>
              <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
                {meta.sub}
              </p>

              {step === 0 && <PrologueStep onStart={() => setStep(1)} />}

              {step === 1 && (
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
                  <Field
                    label="Handle público"
                    action={
                      <button
                        type="button"
                        onClick={suggestHandle}
                        className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.22em] text-primary/80 hover:text-primary"
                      >
                        <Shuffle className="h-3 w-3" /> sugerir
                      </button>
                    }
                  >
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-sm text-muted-foreground">
                        @
                      </span>
                      <input
                        value={draft.handle}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            handle: e.target.value.toLowerCase().replace(/\s+/g, ""),
                          })
                        }
                        placeholder="joaov"
                        className="w-full rounded-xl border border-border bg-background/50 pl-8 pr-4 py-3 font-mono text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </Field>
                  <Field label="Avatar">
                    <div className="grid grid-cols-8 gap-2">
                      {AVATARS.map((a) => (
                        <button
                          key={a}
                          type="button"
                          onClick={() => setDraft({ ...draft, avatar: a })}
                          className={
                            "group relative grid h-11 place-items-center rounded-xl border text-lg transition-all duration-200 " +
                            (draft.avatar === a
                              ? "border-primary bg-primary/15 text-primary shadow-[0_0_28px_-8px_oklch(0.76_0.09_82/0.9)] scale-110"
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

              {step === 2 && (
                <div className="grid gap-3">
                  {(Object.keys(GOALS) as Profile["goal"][]).map((g) => {
                    const info = GOALS[g];
                    const extra = GOAL_META[g];
                    const Icon = extra.icon;
                    const active = draft.goal === g;
                    return (
                      <button
                        key={g}
                        type="button"
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
                            "grid h-11 w-11 shrink-0 place-items-center rounded-xl border transition " +
                            (active
                              ? "border-primary bg-primary/20 text-primary"
                              : "border-border bg-background/60 text-muted-foreground group-hover:text-foreground")
                          }
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <div className="font-serif text-lg leading-tight tracking-tight">
                              {info.label}
                            </div>
                            {active && (
                              <Check className="h-4 w-4 text-primary" />
                            )}
                          </div>
                          <div className="mt-1 text-sm leading-relaxed text-muted-foreground">
                            {info.desc}
                          </div>
                          <div className="mt-2 flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-primary/70">
                            <span>{extra.hint}</span>
                            <span className="opacity-40">·</span>
                            <span>{extra.pace}</span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {step === 3 && (
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
                    <WeekPreview hours={draft.weeklyHours} />
                    <div className="mt-6 grid grid-cols-4 gap-2">
                      {[3, 6, 10, 15].map((h) => (
                        <button
                          key={h}
                          type="button"
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
                      {[
                        draft.timezone,
                        "America/Sao_Paulo",
                        "America/New_York",
                        "America/Los_Angeles",
                        "Europe/Lisbon",
                        "Europe/London",
                        "Europe/Berlin",
                        "Asia/Tokyo",
                        "Asia/Dubai",
                      ]
                        .filter((v, i, a) => v && a.indexOf(v) === i)
                        .map((tz) => (
                          <option key={tz} value={tz}>
                            {tz}
                          </option>
                        ))}
                    </select>
                  </Field>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6">
                  <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-background/30 to-background/50 p-6">
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
                    <div className="flex items-center gap-4">
                      <div className="grid h-16 w-16 place-items-center rounded-2xl border border-primary/40 bg-background/60 font-serif text-3xl text-primary shadow-[0_0_40px_-10px_oklch(0.76_0.09_82/0.8)]">
                        {draft.avatar}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate font-serif text-2xl leading-tight tracking-tight">
                          {draft.name || "—"}
                        </div>
                        <div className="truncate font-mono text-xs text-muted-foreground">
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
                    <div className="mt-6 rounded-xl border border-primary/25 bg-background/40 p-4">
                      <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-primary/80">
                        Primeiro passo do concierge
                      </div>
                      <p className="mt-2 font-serif text-base leading-snug">
                        {GOAL_META[draft.goal].hint}. Vou abrir sua trilha com{" "}
                        <span className="text-primary">
                          {Math.max(1, Math.round(draft.weeklyHours / 2))} aulas
                        </span>{" "}
                        na primeira semana.
                      </p>
                    </div>
                  </div>
                  <p className="text-center text-xs text-muted-foreground">
                    Você pode ajustar tudo depois em{" "}
                    <span className="text-primary">/perfil</span>.
                  </p>
                </div>
              )}

              <div className="mt-10 flex items-center justify-between border-t border-border/60 pt-6">
                <button
                  type="button"
                  onClick={back}
                  disabled={step === 0}
                  className="inline-flex items-center gap-1 text-xs font-mono uppercase tracking-[0.24em] text-muted-foreground transition hover:text-foreground disabled:opacity-20"
                >
                  <ChevronLeft className="h-3.5 w-3.5" /> Voltar
                </button>
                {step < totalSteps - 1 ? (
                  <button
                    type="button"
                    onClick={advance}
                    disabled={!canAdvance}
                    className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground shadow-[0_10px_40px_-10px_oklch(0.76_0.09_82/0.8)] transition hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                    <span className="relative">
                      {step === 0 ? "Começar ritual" : "Continuar"}
                    </span>
                    <ArrowRight className="relative h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </button>
                ) : (
                  <button
                    type="button"
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

            <div className="mt-6 flex items-center justify-center gap-4 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground/70">
              <span className="inline-flex items-center gap-1.5">
                <kbd className="rounded border border-border bg-background/60 px-1.5 py-0.5">Enter</kbd>
                avança
              </span>
              <span className="inline-flex items-center gap-1.5">
                <kbd className="rounded border border-border bg-background/60 px-1.5 py-0.5">⌘</kbd>
                <kbd className="rounded border border-border bg-background/60 px-1.5 py-0.5">←</kbd>
                voltar
              </span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function PrologueStep({ onStart }: { onStart: () => void }) {
  const items = [
    { k: "01", t: "Identidade", d: "Nome, handle e avatar do seu perfil." },
    { k: "02", t: "Objetivo", d: "Trilha e desafios calibrados ao seu foco." },
    { k: "03", t: "Ritmo", d: "Meta semanal que o concierge vai cobrar." },
    { k: "04", t: "Confirmação", d: "Resumo e entrada na plataforma." },
  ];
  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((i) => (
          <div
            key={i.k}
            className="group relative overflow-hidden rounded-2xl border border-border bg-background/40 p-4 transition hover:border-primary/50 hover:-translate-y-0.5"
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-primary">
              {i.k}
            </div>
            <div className="mt-1 font-serif text-lg tracking-tight">{i.t}</div>
            <div className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {i.d}
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-primary/25 bg-primary/5 p-4 text-xs leading-relaxed text-muted-foreground">
        <span className="text-primary">Leva menos de um minuto.</span> Nada é
        permanente — ajusta depois em <span className="text-primary">/perfil</span>.
      </div>
      <button
        type="button"
        onClick={onStart}
        className="hidden"
        aria-hidden
      />
    </div>
  );
}

function WeekPreview({ hours }: { hours: number }) {
  const dayLabels = ["S", "T", "Q", "Q", "S", "S", "D"];
  // distribute hours across 7 days as filled dots (each dot = ~30min, capped 6/day)
  const perDay = Math.max(1, Math.round(hours / 7));
  const spread = Array.from({ length: 7 }, (_, i) => {
    const bias = [1, 1, 1, 1, 1, 0.6, 0.6][i];
    return Math.min(6, Math.max(0, Math.round(perDay * bias * 2)));
  });
  return (
    <div className="mt-6 rounded-xl border border-border/70 bg-background/40 p-4">
      <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
        Distribuição sugerida
      </div>
      <div className="flex items-end justify-between gap-2">
        {dayLabels.map((d, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
            <div className="flex flex-col-reverse gap-1">
              {Array.from({ length: 6 }).map((_, j) => (
                <span
                  key={j}
                  className={
                    "h-1.5 w-4 rounded-sm transition-all " +
                    (j < spread[i]
                      ? "bg-primary shadow-[0_0_8px_-2px_oklch(0.76_0.09_82/0.9)]"
                      : "bg-border/60")
                  }
                />
              ))}
            </div>
            <span className="font-mono text-[10px] text-muted-foreground">{d}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Field({
  label,
  action,
  children,
}: {
  label: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-[10px] font-mono uppercase tracking-[0.28em] text-muted-foreground">
          {label}
        </div>
        {action}
      </div>
      {children}
    </label>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-[10px] font-mono uppercase tracking-[0.28em] text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 truncate font-serif text-base leading-tight">{value}</dd>
    </div>
  );
}
