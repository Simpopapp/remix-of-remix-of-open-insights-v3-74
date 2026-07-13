import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Coffee, Pause, Play, RotateCcw, SkipForward, Timer } from "lucide-react";
import { pingActivity } from "@/lib/activity";
import { addWatchSeconds } from "@/lib/gamification";
import { addFocusMinutes } from "@/lib/quests";
import { notify as notifyBrowser } from "@/lib/notifications";

export const Route = createFileRoute("/foco")({
  head: () => ({
    meta: [
      { title: "Modo Foco — AI App Empire" },
      { name: "description", content: "Sessões Pomodoro para deep work em construção de agentes." },
    ],
  }),
  component: FocoPage,
});

type Phase = "focus" | "short" | "long";
const DURATIONS: Record<Phase, number> = { focus: 25 * 60, short: 5 * 60, long: 15 * 60 };
const LABELS: Record<Phase, string> = { focus: "Foco profundo", short: "Pausa curta", long: "Pausa longa" };
const LOG_KEY = "aiae:focus-log:v1";

type LogEntry = { at: string; minutes: number; kind: Phase };
function readLog(): LogEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(LOG_KEY) ?? "[]");
  } catch {
    return [];
  }
}
function writeLog(l: LogEntry[]) {
  window.localStorage.setItem(LOG_KEY, JSON.stringify(l.slice(-60)));
}

function beep() {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.value = 660;
    o.connect(g);
    g.connect(ctx.destination);
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.8);
    o.start();
    o.stop(ctx.currentTime + 0.85);
  } catch {
    /* ignore */
  }
}

function FocoPage() {
  const [phase, setPhase] = useState<Phase>("focus");
  const [remaining, setRemaining] = useState(DURATIONS.focus);
  const [running, setRunning] = useState(false);
  const [cycles, setCycles] = useState(0);
  const [log, setLog] = useState<LogEntry[]>(() => readLog());
  const [intent, setIntent] = useState("");
  const startedAt = useRef<number | null>(null);

  useEffect(() => {
    setRemaining(DURATIONS[phase]);
  }, [phase]);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          window.clearInterval(id);
          finishPhase();
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, phase]);

  function finishPhase() {
    setRunning(false);
    beep();
    const minutes = Math.round((DURATIONS[phase] - remaining + 1) / 60);
    if (phase === "focus" && minutes > 0) {
      const entry: LogEntry = { at: new Date().toISOString(), minutes, kind: "focus" };
      const next = [...log, entry];
      setLog(next);
      writeLog(next);
      pingActivity("focus");
      addWatchSeconds(minutes * 60);
      addFocusMinutes(minutes);
      notifyBrowser("Sessão de foco concluída", `+${minutes} min. Hora da pausa.`);
    } else if (phase !== "focus") {
      notifyBrowser("Pausa terminada", "Volta pro deep work.");
    }
    if (phase === "focus") {
      const nextCycles = cycles + 1;
      setCycles(nextCycles);
      setPhase(nextCycles % 4 === 0 ? "long" : "short");
    } else {
      setPhase("focus");
    }
  }

  function toggle() {
    if (!running) startedAt.current = Date.now();
    setRunning((v) => !v);
  }
  function reset() {
    setRunning(false);
    setRemaining(DURATIONS[phase]);
  }
  function skip() {
    finishPhase();
  }

  const pct = 1 - remaining / DURATIONS[phase];
  const mm = Math.floor(remaining / 60);
  const ss = remaining % 60;

  const todayMinutes = useMemo(() => {
    const t = new Date().toISOString().slice(0, 10);
    return log.filter((l) => l.at.slice(0, 10) === t).reduce((a, l) => a + l.minutes, 0);
  }, [log]);
  const totalMinutes = useMemo(() => log.reduce((a, l) => a + l.minutes, 0), [log]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const original = document.title;
    if (running) {
      document.title = `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")} · ${LABELS[phase]}`;
    }
    return () => {
      document.title = original;
    };
  }, [running, mm, ss, phase]);

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-primary">
        <Timer className="h-3 w-3" /> Modo Foco
      </div>
      <h1 className="mt-2 font-serif text-4xl">Deep work do construtor</h1>
      <p className="mt-2 max-w-xl text-sm text-muted-foreground">
        25 min de foco, 5 min de pausa, repetir 4x, então 15 min de pausa longa. Cada sessão soma minutos ao seu ritual.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card p-8">
          <div className="flex flex-wrap gap-2">
            {(Object.keys(DURATIONS) as Phase[]).map((p) => (
              <button
                key={p}
                onClick={() => {
                  setPhase(p);
                  setRunning(false);
                }}
                className={
                  "rounded-full border px-3 py-1 text-xs uppercase tracking-widest transition " +
                  (p === phase
                    ? "border-primary bg-primary/15 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/50")
                }
              >
                {p === "focus" ? (
                  <span className="inline-flex items-center gap-1"><Timer className="h-3 w-3" /> {LABELS[p]}</span>
                ) : (
                  <span className="inline-flex items-center gap-1"><Coffee className="h-3 w-3" /> {LABELS[p]}</span>
                )}
              </button>
            ))}
          </div>

          <div className="relative mx-auto mt-8 grid aspect-square max-w-[320px] place-items-center">
            <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
              <circle cx="50" cy="50" r="45" strokeWidth="4" className="fill-none stroke-muted/40" />
              <circle
                cx="50"
                cy="50"
                r="45"
                strokeWidth="4"
                strokeLinecap="round"
                className="fill-none stroke-primary transition-all"
                strokeDasharray={2 * Math.PI * 45}
                strokeDashoffset={2 * Math.PI * 45 * (1 - pct)}
              />
            </svg>
            <div className="absolute text-center">
              <div className="font-serif text-6xl tabular-nums">
                {String(mm).padStart(2, "0")}
                <span className="text-primary">:</span>
                {String(ss).padStart(2, "0")}
              </div>
              <div className="mt-1 text-xs uppercase tracking-[0.28em] text-muted-foreground">
                {LABELS[phase]}
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={toggle}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg hover:opacity-90"
            >
              {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {running ? "Pausar" : "Iniciar"}
            </button>
            <button onClick={reset} className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-3 text-sm hover:border-primary/60">
              <RotateCcw className="h-4 w-4" /> Resetar
            </button>
            <button onClick={skip} className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-3 text-sm hover:border-primary/60">
              <SkipForward className="h-4 w-4" /> Pular
            </button>
          </div>

          <label className="mt-6 block">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Intenção desta sessão</span>
            <input
              value={intent}
              onChange={(e) => setIntent(e.target.value)}
              placeholder="ex: fechar exercício M03 + subir agente no Cloud Run"
              className="mt-1 w-full rounded-md border border-input bg-background/60 px-3 py-2 text-sm"
            />
          </label>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <Stat label="Hoje" value={`${todayMinutes} min`} />
            <Stat label="Ciclos" value={String(cycles)} />
            <Stat label="Total" value={`${totalMinutes} min`} />
          </div>

          <div className="rounded-2xl border border-primary/25 bg-card/50 p-5">
            <div className="text-xs uppercase tracking-[0.24em] text-primary">Últimas sessões</div>
            {log.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">
                Ainda não há sessões. Aperte Iniciar e entre em ritual.
              </p>
            ) : (
              <ul className="mt-3 divide-y divide-border text-sm">
                {[...log].reverse().slice(0, 8).map((l, i) => {
                  const d = new Date(l.at);
                  return (
                    <li key={i} className="flex items-center justify-between py-2">
                      <span className="text-muted-foreground">
                        {d.toLocaleDateString("pt-BR")} · {d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      <span className="font-mono tabular-nums text-primary">+{l.minutes} min</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-card/40 p-5 text-sm text-muted-foreground leading-relaxed">
            <div className="text-[10px] uppercase tracking-widest text-primary mb-2">Protocolo Concierge</div>
            Feche abas e notificações. Escreva a intenção antes de iniciar. Se pensamentos aparecerem, anote em uma folha e volte. Sessão só conta se você chegar ao fim.
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-primary/25 bg-card/50 p-4 text-center">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-1 font-serif text-xl">{value}</div>
    </div>
  );
}
