import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type ReactNode } from "react";
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
import { SIGILS, Sigil, DEFAULT_SIGIL_ID, isSigilId } from "@/components/Sigil";

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

/* ─────────────────────────── Sigil avatars ───────────────────────────
   Cada sigil é um SVG desenhado à mão em traço fino, com halo dourado.
   Substitui os glifos unicode toscos por marcas gráficas coerentes.
*/

type Sigil = { id: string; name: string; draw: (stroke: string) => ReactNode };

const SIGILS: Sigil[] = [
  {
    id: "obelisk",
    name: "Obelisco",
    draw: (s) => (
      <>
        <path d="M20 6 L28 32 L12 32 Z" fill="none" stroke={s} strokeWidth="1.2" />
        <path d="M14 26 H26" stroke={s} strokeWidth="0.8" />
        <circle cx="20" cy="20" r="1.2" fill={s} />
      </>
    ),
  },
  {
    id: "sun",
    name: "Sol",
    draw: (s) => (
      <>
        <circle cx="20" cy="20" r="6" fill="none" stroke={s} strokeWidth="1.2" />
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2;
          const x1 = 20 + Math.cos(a) * 9;
          const y1 = 20 + Math.sin(a) * 9;
          const x2 = 20 + Math.cos(a) * 13;
          const y2 = 20 + Math.sin(a) * 13;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={s} strokeWidth="0.9" />;
        })}
      </>
    ),
  },
  {
    id: "moon",
    name: "Crescente",
    draw: (s) => (
      <>
        <path
          d="M26 10 A11 11 0 1 0 26 30 A9 9 0 1 1 26 10 Z"
          fill="none"
          stroke={s}
          strokeWidth="1.2"
        />
        <circle cx="28" cy="14" r="0.9" fill={s} />
      </>
    ),
  },
  {
    id: "diamond",
    name: "Diamante",
    draw: (s) => (
      <>
        <path d="M20 6 L32 20 L20 34 L8 20 Z" fill="none" stroke={s} strokeWidth="1.2" />
        <path d="M8 20 H32 M20 6 V34" stroke={s} strokeWidth="0.6" opacity="0.55" />
      </>
    ),
  },
  {
    id: "compass",
    name: "Rosa",
    draw: (s) => (
      <>
        <circle cx="20" cy="20" r="11" fill="none" stroke={s} strokeWidth="1" />
        <path d="M20 8 L22 20 L20 32 L18 20 Z" fill={s} opacity="0.85" />
        <path d="M8 20 L20 22 L32 20 L20 18 Z" fill="none" stroke={s} strokeWidth="0.9" />
      </>
    ),
  },
  {
    id: "laurel",
    name: "Laurel",
    draw: (s) => (
      <>
        <path d="M20 8 V32" stroke={s} strokeWidth="1.2" />
        {[12, 16, 20, 24, 28].map((y, i) => (
          <g key={i}>
            <path
              d={`M20 ${y} Q${13 - i * 0.3} ${y + 2} ${15} ${y + 5}`}
              fill="none"
              stroke={s}
              strokeWidth="0.9"
            />
            <path
              d={`M20 ${y} Q${27 + i * 0.3} ${y + 2} ${25} ${y + 5}`}
              fill="none"
              stroke={s}
              strokeWidth="0.9"
            />
          </g>
        ))}
      </>
    ),
  },
  {
    id: "orbit",
    name: "Órbita",
    draw: (s) => (
      <>
        <ellipse cx="20" cy="20" rx="13" ry="5" fill="none" stroke={s} strokeWidth="1" transform="rotate(-25 20 20)" />
        <ellipse cx="20" cy="20" rx="13" ry="5" fill="none" stroke={s} strokeWidth="1" transform="rotate(25 20 20)" />
        <circle cx="20" cy="20" r="2.2" fill={s} />
      </>
    ),
  },
  {
    id: "prism",
    name: "Prisma",
    draw: (s) => (
      <>
        <path d="M20 6 L34 32 L6 32 Z" fill="none" stroke={s} strokeWidth="1.2" />
        <path d="M20 6 L20 32" stroke={s} strokeWidth="0.7" opacity="0.6" />
        <path d="M6 32 L20 20 L34 32" stroke={s} strokeWidth="0.7" opacity="0.6" fill="none" />
      </>
    ),
  },
  {
    id: "arch",
    name: "Arco",
    draw: (s) => (
      <>
        <path d="M8 32 V18 A12 12 0 0 1 32 18 V32" fill="none" stroke={s} strokeWidth="1.2" />
        <path d="M8 32 H32" stroke={s} strokeWidth="1.2" />
        <path d="M20 32 V20" stroke={s} strokeWidth="0.8" />
      </>
    ),
  },
  {
    id: "star",
    name: "Estrela",
    draw: (s) => (
      <>
        <path
          d="M20 6 L23 16 L33 16 L25 22 L28 32 L20 26 L12 32 L15 22 L7 16 L17 16 Z"
          fill="none"
          stroke={s}
          strokeWidth="1.2"
        />
      </>
    ),
  },
  {
    id: "key",
    name: "Chave",
    draw: (s) => (
      <>
        <circle cx="14" cy="20" r="6" fill="none" stroke={s} strokeWidth="1.2" />
        <path d="M20 20 H34 M30 20 V25 M26 20 V24" stroke={s} strokeWidth="1.2" />
      </>
    ),
  },
  {
    id: "phoenix",
    name: "Ave",
    draw: (s) => (
      <>
        <path
          d="M6 24 Q14 14 20 20 Q26 14 34 24 Q28 22 20 26 Q12 22 6 24 Z"
          fill="none"
          stroke={s}
          strokeWidth="1.1"
        />
        <path d="M20 26 V32" stroke={s} strokeWidth="1" />
        <circle cx="20" cy="20" r="1" fill={s} />
      </>
    ),
  },
];

function Sigil({ id, active }: { id: string; active: boolean }) {
  const s = SIGILS.find((x) => x.id === id) ?? SIGILS[0];
  return (
    <svg viewBox="0 0 40 40" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id={`grad-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(0.92 0.08 82)" />
          <stop offset="55%" stopColor="oklch(0.78 0.11 78)" />
          <stop offset="100%" stopColor="oklch(0.62 0.09 78)" />
        </linearGradient>
        <radialGradient id={`halo-${id}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="oklch(0.76 0.09 82 / 0.35)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      {active && <circle cx="20" cy="20" r="19" fill={`url(#halo-${id})`} />}
      <g strokeLinecap="round" strokeLinejoin="round">
        {s.draw(`url(#grad-${id})`)}
      </g>
    </svg>
  );
}

/* ─────────────────────────── Config ─────────────────────────── */

const HANDLE_ADJ = ["neo", "lux", "vera", "ars", "nova", "atlas", "oro", "prime"];

const GOAL_META: Record<
  Profile["goal"],
  { icon: typeof Rocket; hint: string; pace: string }
> = {
  "launch-mvp": { icon: Rocket, hint: "Foco em execução", pace: "≈ 8h / semana" },
  "acquire-clients": { icon: Briefcase, hint: "Vendas + posicionamento", pace: "≈ 6h / semana" },
  "scale-agency": { icon: Building2, hint: "Operação e delivery", pace: "≈ 10h / semana" },
  explore: { icon: Compass, hint: "Curiosidade sem pressa", pace: "≈ 3h / semana" },
};

const STEP_META = [
  {
    key: "Identidade",
    icon: User,
    kicker: "Ato I",
    title: "Como te chamamos?",
    sub: "Aparece no seu certificado, no ranking e no perfil público.",
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

/* ─────────────────────────── Component ─────────────────────────── */

function Onboarding() {
  const { profile, update } = useProfile();
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Profile>(() => ({
    ...profile,
    avatar: SIGILS.some((s) => s.id === profile.avatar) ? profile.avatar : "diamond",
    timezone:
      profile.timezone ||
      (typeof Intl !== "undefined"
        ? Intl.DateTimeFormat().resolvedOptions().timeZone
        : "America/Sao_Paulo"),
  }));

  const meta = STEP_META[step];
  const StepIcon = meta.icon;
  const totalSteps = STEP_META.length;

  const blockReason = useMemo(() => {
    if (step === 0 && draft.name.trim().length < 2) return "Informe seu nome para continuar";
    return null;
  }, [step, draft.name]);
  const canAdvance = !blockReason;

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
  const currentSigil = SIGILS.find((s) => s.id === draft.avatar) ?? SIGILS[0];

  return (
    <div className="relative min-h-dvh overflow-hidden bg-background text-foreground">
      {/* Ambient — top-left key light, deep vignette, subtle vertical beam */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-[30%] -left-[15%] h-[900px] w-[900px] rounded-full bg-primary/[0.14] blur-[180px]" />
        <div className="absolute -bottom-[25%] -right-[10%] h-[700px] w-[700px] rounded-full bg-[oklch(0.35_0.14_290/0.22)] blur-[180px]" />
        <div
          className="absolute inset-y-0 left-[38%] w-[2px] opacity-40"
          style={{
            background:
              "linear-gradient(to bottom, transparent, oklch(0.76 0.09 82 / 0.5), transparent)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, transparent 40%, oklch(0.08 0.02 280 / 0.85) 100%)",
          }}
        />
      </div>

      <div className="mx-auto grid min-h-dvh max-w-[1400px] grid-cols-1 lg:grid-cols-[minmax(0,540px)_1fr]">
        {/* Left: editorial art */}
        <aside className="relative hidden overflow-hidden lg:block">
          <img
            src={heroOnboarding}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out"
            style={{ transform: `scale(${1.08 + step * 0.02}) translateY(${step * -6}px)`, filter: "saturate(1.05) contrast(1.05)" }}
          />
          {/* Deep vignette + gold rim from right */}
          <div className="absolute inset-0 bg-[linear-gradient(115deg,oklch(0.08_0.02_280/0.55)_0%,transparent_45%,oklch(0.08_0.02_280/0.9)_100%)]" />
          <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-primary/50 to-transparent" />
          {/* Corner ornaments */}
          <span className="pointer-events-none absolute left-8 top-8 h-6 w-6 border-l border-t border-primary/60" />
          <span className="pointer-events-none absolute right-8 top-8 h-6 w-6 border-r border-t border-primary/60" />
          <span className="pointer-events-none absolute bottom-8 left-8 h-6 w-6 border-b border-l border-primary/60" />
          <span className="pointer-events-none absolute bottom-8 right-8 h-6 w-6 border-b border-r border-primary/60" />

          <div className="relative flex h-full flex-col justify-between p-12">
            <header className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.36em] text-primary">
                <span className="h-1 w-6 bg-primary" />
                AI App Empire
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-primary/70">
                Cohort 01 · MMXXVI
              </div>
            </header>

            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.36em] text-primary/80">
                {meta.kicker} — {String(step + 1).padStart(2, "0")} / {String(totalSteps).padStart(2, "0")}
              </div>
              <h2 className="mt-5 font-serif text-[3.2rem] leading-[0.98] tracking-[-0.02em]">
                Antes de entrar,
                <br />
                <span className="italic text-gold-gradient">um breve ritual.</span>
              </h2>
              <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
                Quatro portas. Cada uma calibra o que a plataforma faz por você.
              </p>

              <ol className="mt-10 space-y-2">
                {STEP_META.map((s, i) => {
                  const state = i === step ? "active" : i < step ? "done" : "todo";
                  return (
                    <li
                      key={s.key}
                      className={
                        "group flex items-center gap-4 rounded-lg py-2 pl-2 pr-3 transition-all duration-500 " +
                        (state === "active"
                          ? "bg-primary/[0.06] text-foreground"
                          : state === "done"
                          ? "text-primary/80"
                          : "text-muted-foreground/45")
                      }
                    >
                      <span
                        className={
                          "grid h-8 w-8 place-items-center rounded-full font-mono text-[11px] tabular-nums transition-all " +
                          (state === "active"
                            ? "bg-primary text-primary-foreground shadow-[0_0_0_4px_oklch(0.76_0.09_82/0.18),0_10px_30px_-8px_oklch(0.76_0.09_82/0.7)]"
                            : state === "done"
                            ? "border border-primary/40 bg-primary/10 text-primary"
                            : "border border-border")
                        }
                      >
                        {state === "done" ? <Check className="h-3.5 w-3.5" /> : String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="font-mono text-[11px] uppercase tracking-[0.28em]">{s.key}</div>
                      </div>
                      <span
                        className={
                          "h-px transition-all duration-500 " +
                          (state === "active" ? "w-8 bg-primary" : "w-3 bg-border")
                        }
                      />
                    </li>
                  );
                })}
              </ol>

              <blockquote className="mt-10 border-l border-primary/60 pl-5 font-serif text-[15px] italic leading-relaxed text-muted-foreground/90">
                {meta.epigraph}
              </blockquote>
            </div>

            <footer className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.32em] text-muted-foreground/60">
              <span>Nº {String(step + 1).padStart(3, "0")} / 004</span>
              <span className="inline-flex items-center gap-1.5">
                <Command className="h-3 w-3" /> Enter avança
              </span>
            </footer>
          </div>
        </aside>

        {/* Right: form */}
        <main className="relative flex items-center justify-center px-6 py-10 lg:p-16">
          <div className="w-full max-w-[560px]">
            {/* Mobile mini-hero */}
            <div className="mb-8 flex items-center justify-between lg:hidden">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.32em] text-primary">
                <Sparkles className="h-3 w-3" /> Concierge
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground tabular-nums">
                {String(step + 1).padStart(2, "0")} / {String(totalSteps).padStart(2, "0")}
              </div>
            </div>

            {/* Progress rail — hairline gold */}
            <div className="mb-2 flex items-center gap-2">
              {STEP_META.map((s, i) => (
                <div key={s.key} className="h-px flex-1 overflow-hidden bg-border/50">
                  <div
                    className={
                      "h-full transition-all duration-700 " +
                      (i < step
                        ? "w-full bg-primary"
                        : i === step
                        ? "w-1/2 bg-primary shadow-[0_0_10px_1px_oklch(0.76_0.09_82/0.9)]"
                        : "w-0")
                    }
                  />
                </div>
              ))}
            </div>
            <div className="mb-12 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
              <span>{meta.kicker}</span>
              <span className="tabular-nums">{String(Math.round(progressPct)).padStart(3, " ")}%</span>
            </div>

            {/* Header — editorial */}
            <div key={`h-${step}`} className="mb-10 animate-fade-in">
              <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.32em] text-primary/85">
                <StepIcon className="h-3.5 w-3.5" />
                <span>{meta.kicker}</span>
                <span className="h-px w-6 bg-primary/50" />
                <span className="text-muted-foreground">{String(step + 1).padStart(2, "0")} de {String(totalSteps).padStart(2, "0")}</span>
              </div>
              <h1 className="mt-4 font-serif text-[2.75rem] leading-[1.02] tracking-[-0.02em] lg:text-[3.25rem]">
                {step === totalSteps - 1 ? (
                  <>
                    Tudo pronto,
                    <br />
                    <span className="italic text-gold-gradient">{draft.name || "aluno"}.</span>
                  </>
                ) : (
                  meta.title
                )}
              </h1>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground">
                {meta.sub}
              </p>
            </div>

            {/* Body (no card chrome — editorial breathing) */}
            <div key={`b-${step}`} className="animate-fade-in">
              {step === 0 && (
                <div className="space-y-8">
                  <Field label="Nome completo">
                    <input
                      autoFocus
                      value={draft.name}
                      onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                      placeholder="Ex: João Vitor"
                      className="w-full border-0 border-b border-border bg-transparent px-0 py-3 font-serif text-2xl tracking-tight placeholder:font-sans placeholder:text-base placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none focus:ring-0"
                    />
                  </Field>
                  <Field
                    label="Handle público"
                    action={
                      <button
                        type="button"
                        onClick={suggestHandle}
                        className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.24em] text-primary/80 hover:text-primary"
                      >
                        <Shuffle className="h-3 w-3" /> sugerir
                      </button>
                    }
                  >
                    <div className="relative">
                      <span className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 font-mono text-base text-muted-foreground">
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
                        className="w-full border-0 border-b border-border bg-transparent pl-5 pr-0 py-3 font-mono text-base tracking-tight placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none focus:ring-0"
                      />
                    </div>
                  </Field>

                  <Field label={`Sigilo · ${currentSigil.name}`}>
                    <div className="grid grid-cols-6 gap-3">
                      {SIGILS.map((sig) => {
                        const active = draft.avatar === sig.id;
                        return (
                          <button
                            key={sig.id}
                            type="button"
                            title={sig.name}
                            onClick={() => setDraft({ ...draft, avatar: sig.id })}
                            className={
                              "group relative aspect-square rounded-xl p-2 transition-all duration-300 " +
                              (active
                                ? "bg-[radial-gradient(circle_at_30%_25%,oklch(0.76_0.09_82/0.28),transparent_70%)] ring-1 ring-primary/70 shadow-[0_10px_40px_-12px_oklch(0.76_0.09_82/0.8),inset_0_1px_0_oklch(1_0_0/0.08)]"
                                : "ring-1 ring-border/60 hover:ring-primary/40 hover:-translate-y-0.5 hover:bg-[radial-gradient(circle_at_30%_25%,oklch(0.76_0.09_82/0.1),transparent_70%)]")
                            }
                          >
                            <Sigil id={sig.id} active={active} />
                            {active && (
                              <>
                                <span className="pointer-events-none absolute -top-px left-2 h-px w-3 bg-primary" />
                                <span className="pointer-events-none absolute -bottom-px right-2 h-px w-3 bg-primary" />
                              </>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </Field>
                </div>
              )}

              {step === 1 && (
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
                          "group relative flex items-center gap-5 overflow-hidden rounded-2xl p-5 pl-6 text-left transition-all duration-300 " +
                          (active
                            ? "bg-[linear-gradient(105deg,oklch(0.76_0.09_82/0.14),transparent_60%)] ring-1 ring-primary/60 shadow-[0_20px_60px_-24px_oklch(0.76_0.09_82/0.7)]"
                            : "ring-1 ring-border/60 hover:ring-primary/40 hover:-translate-y-0.5 hover:bg-[linear-gradient(105deg,oklch(1_0_0/0.02),transparent_60%)]")
                        }
                      >
                        <span
                          className={
                            "absolute inset-y-4 left-0 w-[3px] rounded-r-full transition-all " +
                            (active ? "bg-primary shadow-[0_0_16px_oklch(0.76_0.09_82/0.9)]" : "bg-transparent")
                          }
                        />
                        <div
                          className={
                            "relative grid h-14 w-14 shrink-0 place-items-center rounded-full transition-all " +
                            (active
                              ? "bg-[radial-gradient(circle_at_30%_25%,oklch(0.88_0.08_82),oklch(0.62_0.1_78))] text-[oklch(0.14_0.02_280)] shadow-[0_10px_30px_-6px_oklch(0.76_0.09_82/0.8),inset_0_1px_0_oklch(1_0_0/0.4)]"
                              : "ring-1 ring-border bg-background/50 text-muted-foreground group-hover:text-foreground")
                          }
                        >
                          <Icon className="h-5 w-5" strokeWidth={1.6} />
                          {active && (
                            <span className="absolute -inset-1 rounded-full ring-1 ring-primary/40" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <div className="font-serif text-[1.35rem] leading-tight tracking-tight">
                              {info.label}
                            </div>
                          </div>
                          <div className="mt-1 text-sm leading-relaxed text-muted-foreground">
                            {info.desc}
                          </div>
                          <div className="mt-2.5 flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.24em] text-primary/70">
                            <span>{extra.hint}</span>
                            <span className="h-px w-3 bg-primary/40" />
                            <span>{extra.pace}</span>
                          </div>
                        </div>
                        {active && (
                          <Check className="h-5 w-5 shrink-0 text-primary" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {step === 2 && (
                <div className="space-y-10">
                  <div>
                    <div className="mb-5 flex items-baseline justify-between">
                      <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
                        Horas por semana
                      </span>
                      <span className="font-serif text-[4rem] leading-none tracking-[-0.03em] text-gold-gradient tabular-nums">
                        {draft.weeklyHours}
                        <span className="ml-1 font-serif text-xl text-primary/60">h</span>
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={20}
                      value={draft.weeklyHours}
                      onChange={(e) => setDraft({ ...draft, weeklyHours: Number(e.target.value) })}
                      className="w-full accent-primary"
                    />
                    <div className="mt-2 flex justify-between font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
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
                            "rounded-lg py-2.5 font-mono text-xs tabular-nums transition " +
                            (draft.weeklyHours === h
                              ? "bg-primary/12 text-primary ring-1 ring-primary/50"
                              : "ring-1 ring-border/60 text-muted-foreground hover:text-foreground hover:ring-primary/40")
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
                      style={{ colorScheme: "dark" }}
                      className="w-full border-0 border-b border-border bg-transparent px-0 py-3 font-mono text-sm focus:border-primary focus:outline-none focus:ring-0"
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
                          <option
                            key={tz}
                            value={tz}
                            style={{
                              background: "oklch(0.14 0.02 280)",
                              color: "oklch(0.95 0.01 90)",
                            }}
                          >
                            {tz}
                          </option>
                        ))}
                    </select>
                  </Field>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="relative overflow-hidden rounded-2xl p-8 ring-1 ring-primary/30 bg-[linear-gradient(155deg,oklch(0.76_0.09_82/0.12)_0%,transparent_45%,oklch(0.35_0.14_290/0.14)_100%)] shadow-[0_40px_100px_-40px_oklch(0.76_0.09_82/0.5),inset_0_1px_0_oklch(1_0_0/0.06)]">
                    {/* gold top rule */}
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/80 to-transparent" />
                    <span className="pointer-events-none absolute left-3 top-3 h-3 w-3 border-l border-t border-primary/60" />
                    <span className="pointer-events-none absolute right-3 top-3 h-3 w-3 border-r border-t border-primary/60" />
                    <span className="pointer-events-none absolute bottom-3 left-3 h-3 w-3 border-b border-l border-primary/60" />
                    <span className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 border-b border-r border-primary/60" />

                    <div className="flex items-center gap-5">
                      <div className="relative grid h-20 w-20 shrink-0 place-items-center rounded-2xl p-3 ring-1 ring-primary/50 bg-[radial-gradient(circle_at_30%_25%,oklch(0.22_0.02_275),oklch(0.14_0.02_280))] shadow-[0_20px_60px_-20px_oklch(0.76_0.09_82/0.7),inset_0_1px_0_oklch(1_0_0/0.08)]">
                        <Sigil id={draft.avatar} active />
                      </div>
                      <div className="min-w-0">
                        <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-primary/80">
                          Membro admitido
                        </div>
                        <div className="mt-1 truncate font-serif text-[2rem] leading-tight tracking-tight">
                          {draft.name || "—"}
                        </div>
                        <div className="truncate font-mono text-xs text-muted-foreground">
                          @{draft.handle || "sem-handle"}
                        </div>
                      </div>
                    </div>
                    <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-primary/20 pt-6">
                      <SummaryItem label="Objetivo" value={GOALS[draft.goal].label} />
                      <SummaryItem label="Ritmo" value={`${draft.weeklyHours}h / semana`} />
                      <SummaryItem label="Fuso" value={draft.timezone} />
                      <SummaryItem label="Cohort" value="01 · MMXXVI" />
                    </dl>
                    <div className="mt-6 border-t border-primary/20 pt-5">
                      <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-primary/80">
                        Primeiro passo do concierge
                      </div>
                      <p className="mt-2 font-serif text-lg leading-snug">
                        {GOAL_META[draft.goal].hint}. Abrindo sua trilha com{" "}
                        <span className="text-gold-gradient">
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

              {/* Actions */}
              <div className="mt-14 flex items-center justify-between">
                <button
                  type="button"
                  onClick={back}
                  disabled={step === 0}
                  className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground transition hover:text-foreground disabled:opacity-20"
                >
                  <ChevronLeft className="h-3.5 w-3.5" /> Voltar
                </button>
                {step < totalSteps - 1 ? (
                  <div className="flex flex-col items-end gap-2">
                    {blockReason && (
                      <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary/80">
                        {blockReason}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={advance}
                      aria-disabled={!canAdvance}
                      title={blockReason ?? "Continuar"}
                      className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full px-8 py-3.5 text-sm font-semibold text-primary-foreground transition aria-disabled:cursor-not-allowed aria-disabled:opacity-50 aria-disabled:grayscale"
                      style={{
                        background:
                          "linear-gradient(135deg, oklch(0.88 0.08 82), oklch(0.72 0.11 78) 55%, oklch(0.6 0.09 78))",
                        boxShadow:
                          "0 20px 50px -14px oklch(0.76 0.09 82 / 0.7), inset 0 1px 0 oklch(1 0 0 / 0.35), inset 0 -1px 0 oklch(0 0 0 / 0.15)",
                      }}
                    >
                      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                      <span className="relative">Continuar</span>
                      <ArrowRight className="relative h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={finish}
                    className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full px-8 py-3.5 text-sm font-semibold text-primary-foreground transition"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.88 0.08 82), oklch(0.72 0.11 78) 55%, oklch(0.6 0.09 78))",
                      boxShadow:
                        "0 20px 60px -14px oklch(0.76 0.09 82 / 0.8), inset 0 1px 0 oklch(1 0 0 / 0.35), inset 0 -1px 0 oklch(0 0 0 / 0.15)",
                    }}
                  >
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                    <Check className="relative h-4 w-4" />
                    <span className="relative">Entrar na plataforma</span>
                  </button>
                )}
              </div>

              <div className="mt-8 flex items-center justify-center gap-5 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground/60">
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
          </div>
        </main>
      </div>
    </div>
  );
}

function WeekPreview({ hours }: { hours: number }) {
  const dayLabels = ["S", "T", "Q", "Q", "S", "S", "D"];
  const perDay = hours / 7;
  const bars = Array.from({ length: 7 }, (_, i) => {
    const bias = [1.1, 1, 1, 1.05, 1, 0.7, 0.55][i];
    return Math.min(1, (perDay * bias) / 3); // 0..1 filled ratio (3h = full)
  });
  return (
    <div className="mt-7">
      <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
        Distribuição sugerida
      </div>
      <div className="flex items-end justify-between gap-2 border-b border-border/50 pb-2">
        {bars.map((f, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-2">
            <div className="relative h-20 w-full overflow-hidden rounded-t">
              <div
                className="absolute inset-x-0 bottom-0 transition-all duration-500"
                style={{
                  height: `${Math.max(6, f * 100)}%`,
                  background:
                    "linear-gradient(to top, oklch(0.62 0.1 78 / 0.9), oklch(0.86 0.08 82 / 0.6))",
                  boxShadow: "inset 0 1px 0 oklch(1 0 0 / 0.15), 0 -6px 20px -6px oklch(0.76 0.09 82 / 0.5)",
                }}
              />
              <div className="absolute inset-x-0 bottom-0 h-px bg-primary/70" style={{ bottom: `${Math.max(6, f * 100)}%` }} />
            </div>
            <span className="font-mono text-[10px] text-muted-foreground">{dayLabels[i]}</span>
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
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-2 flex items-center justify-between">
        <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
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
      <dt className="font-mono text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1.5 truncate font-serif text-[1.05rem] leading-tight">{value}</dd>
    </div>
  );
}
