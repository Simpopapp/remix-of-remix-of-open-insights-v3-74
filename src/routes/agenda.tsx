import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CalendarDays, Plus, Trash2, Check, Clock, Sparkles } from "lucide-react";
import { useAgenda, DAYS, DAYS_FULL, minutesOf, type AgendaBlock } from "@/lib/agenda";
import { course } from "@/lib/course-data";

export const Route = createFileRoute("/agenda")({
  head: () => ({
    meta: [
      { title: "Agenda — AI App Empire" },
      { name: "description", content: "Planeje sua semana de estudo com blocos de deep work, rituais e mentorias." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AgendaPage,
});

const HOURS = Array.from({ length: 18 }, (_, i) => i + 6); // 6h..23h

function AgendaPage() {
  const { blocks, add, remove, toggleDone } = useAgenda();
  const [draft, setDraft] = useState<{ day: number; start: string; end: string; title: string; moduleId?: string }>({
    day: new Date().getDay(),
    start: "20:00",
    end: "21:00",
    title: "",
  });

  const byDay = useMemo(() => {
    const map: Record<number, AgendaBlock[]> = {};
    for (let i = 0; i < 7; i++) map[i] = [];
    blocks.forEach((b) => map[b.day]?.push(b));
    Object.values(map).forEach((arr) => arr.sort((a, b) => minutesOf(a.start) - minutesOf(b.start)));
    return map;
  }, [blocks]);

  const totalMin = useMemo(
    () => blocks.reduce((acc, b) => acc + Math.max(0, minutesOf(b.end) - minutesOf(b.start)), 0),
    [blocks],
  );

  const today = new Date().getDay();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.title.trim()) return;
    add({ ...draft, title: draft.title.trim(), color: "gold" });
    setDraft({ ...draft, title: "" });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-10 space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5 text-primary" />
            Ritual semanal
          </div>
          <h1 className="mt-2 font-serif text-4xl sm:text-5xl">Agenda de estudo</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-xl">
            Blocos protegidos de deep work. Todo elite reserva o horário antes do horário reservar você.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card/50 px-4 py-3 text-right">
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Semana</div>
          <div className="font-serif text-2xl text-primary">{Math.floor(totalMin / 60)}h {totalMin % 60}m</div>
          <div className="text-[11px] text-muted-foreground">{blocks.length} blocos • recomendado 8h+</div>
        </div>
      </header>

      <form onSubmit={submit} className="rounded-2xl border border-border bg-card/40 p-4 sm:p-5 grid gap-3 sm:grid-cols-[1fr_auto_auto_auto_auto_auto]">
        <input
          value={draft.title}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          placeholder="Título do bloco (ex: Deep work — Módulo 3)"
          className="min-w-0 rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
        <select
          value={draft.day}
          onChange={(e) => setDraft({ ...draft, day: Number(e.target.value) })}
          className="rounded-md border border-input bg-background px-2 py-2 text-sm"
        >
          {DAYS_FULL.map((d, i) => (
            <option key={i} value={i}>{d}</option>
          ))}
        </select>
        <input type="time" value={draft.start} onChange={(e) => setDraft({ ...draft, start: e.target.value })} className="rounded-md border border-input bg-background px-2 py-2 text-sm" />
        <input type="time" value={draft.end} onChange={(e) => setDraft({ ...draft, end: e.target.value })} className="rounded-md border border-input bg-background px-2 py-2 text-sm" />
        <select
          value={draft.moduleId ?? ""}
          onChange={(e) => setDraft({ ...draft, moduleId: e.target.value || undefined })}
          className="rounded-md border border-input bg-background px-2 py-2 text-sm max-w-[160px]"
        >
          <option value="">Sem módulo</option>
          {course.modules.map((m) => (
            <option key={m.id} value={m.id}>{String(m.number).padStart(2, "0")} · {m.title}</option>
          ))}
        </select>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> Adicionar
        </button>
      </form>

      {/* Weekly grid — desktop */}
      <div className="hidden lg:block rounded-2xl border border-border bg-card/30 overflow-hidden">
        <div className="grid grid-cols-[64px_repeat(7,1fr)]">
          <div className="border-b border-border px-2 py-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">h</div>
          {DAYS.map((d, i) => (
            <div
              key={i}
              className={
                "border-b border-l border-border px-3 py-2 text-xs " +
                (i === today ? "text-primary font-semibold" : "text-muted-foreground")
              }
            >
              {d}
            </div>
          ))}
          {HOURS.map((h) => (
            <div key={h} className="contents">
              <div className="border-b border-border px-2 py-2 text-[10px] tabular-nums text-muted-foreground">
                {String(h).padStart(2, "0")}:00
              </div>
              {DAYS.map((_, di) => {
                const items = byDay[di].filter((b) => {
                  const s = Math.floor(minutesOf(b.start) / 60);
                  return s === h;
                });
                return (
                  <div key={di} className="relative border-b border-l border-border min-h-[52px] p-1">
                    {items.map((b) => {
                      const spanMin = Math.max(30, minutesOf(b.end) - minutesOf(b.start));
                      const heightPx = Math.min(180, (spanMin / 60) * 52 - 6);
                      return (
                        <div
                          key={b.id}
                          style={{ height: heightPx }}
                          className={
                            "group rounded-md border px-2 py-1 text-[11px] leading-tight overflow-hidden " +
                            (b.done
                              ? "border-border/60 bg-muted/30 line-through text-muted-foreground"
                              : "border-primary/40 bg-primary/10 text-foreground")
                          }
                        >
                          <div className="flex items-start justify-between gap-1">
                            <span className="font-medium truncate">{b.title}</span>
                            <div className="flex items-center opacity-0 group-hover:opacity-100 transition">
                              <button aria-label="Concluir" onClick={() => toggleDone(b.id)} className="p-0.5 text-primary hover:text-primary/80">
                                <Check className="h-3 w-3" />
                              </button>
                              <button aria-label="Remover" onClick={() => remove(b.id)} className="p-0.5 text-destructive/70 hover:text-destructive">
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                          <div className="text-[10px] text-muted-foreground tabular-nums">
                            {b.start}–{b.end}
                          </div>
                          {b.moduleId && (
                            <Link
                              to="/modulo/$moduleId"
                              params={{ moduleId: b.moduleId }}
                              className="text-[10px] text-primary hover:underline"
                            >
                              abrir módulo →
                            </Link>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile / tablet: agrupado por dia */}
      <div className="lg:hidden space-y-4">
        {DAYS_FULL.map((day, i) => (
          <section
            key={i}
            className={
              "rounded-2xl border p-4 " +
              (i === today ? "border-primary/50 bg-primary/5" : "border-border bg-card/30")
            }
          >
            <header className="flex items-center justify-between">
              <h2 className="font-serif text-xl">{day}</h2>
              {i === today && (
                <span className="text-[10px] uppercase tracking-[0.2em] text-primary">Hoje</span>
              )}
            </header>
            {byDay[i].length === 0 ? (
              <p className="mt-2 text-xs text-muted-foreground">Nenhum bloco. Reserve seu deep work.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {byDay[i].map((b) => (
                  <li
                    key={b.id}
                    className={
                      "rounded-lg border px-3 py-2 flex items-start gap-3 " +
                      (b.done
                        ? "border-border/60 bg-muted/20 text-muted-foreground"
                        : "border-primary/30 bg-primary/5")
                    }
                  >
                    <button
                      aria-label="Concluir"
                      onClick={() => toggleDone(b.id)}
                      className={
                        "mt-0.5 h-4 w-4 rounded-sm border grid place-items-center shrink-0 " +
                        (b.done ? "bg-primary border-primary text-primary-foreground" : "border-border")
                      }
                    >
                      {b.done && <Check className="h-3 w-3" />}
                    </button>
                    <div className="min-w-0 flex-1">
                      <div className={"text-sm font-medium " + (b.done ? "line-through" : "")}>{b.title}</div>
                      <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground tabular-nums">
                        <Clock className="h-3 w-3" /> {b.start}–{b.end}
                      </div>
                      {b.moduleId && (
                        <Link
                          to="/modulo/$moduleId"
                          params={{ moduleId: b.moduleId }}
                          className="text-[11px] text-primary hover:underline"
                        >
                          abrir módulo →
                        </Link>
                      )}
                    </div>
                    <button aria-label="Remover" onClick={() => remove(b.id)} className="text-destructive/70 hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5 flex items-start gap-3">
        <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <div className="text-sm text-muted-foreground">
          <strong className="text-foreground">Ritual do Concierge:</strong> defina 3 blocos fixos por semana antes de negociar novos. Regularidade &gt; intensidade — a curva composta é feita de segundas-feiras.
        </div>
      </div>
    </div>
  );
}
