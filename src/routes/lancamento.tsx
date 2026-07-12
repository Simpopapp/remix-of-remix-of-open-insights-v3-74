import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { CheckCircle2, Circle, ExternalLink, RotateCcw, Rocket } from "lucide-react";
import { launchPlaybook, totalItems, useChecklist } from "@/lib/checklist";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/lancamento")({
  head: () => ({
    meta: [
      { title: "Playbook de Lançamento | AI App Empire" },
      { name: "description", content: "Do MVP à App Store e Play Store, sem improviso." },
    ],
  }),
  component: LaunchPage,
});

function LaunchPage() {
  const { state, toggle, reset } = useChecklist();
  const done = useMemo(() => Object.values(state).filter(Boolean).length, [state]);
  const total = totalItems();
  const pct = total ? Math.round((done / total) * 100) : 0;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.24em] text-primary/70">
            Playbook operacional
          </div>
          <h1 className="mt-2 font-serif text-3xl md:text-4xl">Lançamento do seu app de IA</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Do primeiro rascunho até estar publicado na App Store e Google Play, sem improviso.
            Marque conforme executa — seu progresso fica salvo.
          </p>
        </div>
        <div className="rounded-xl border border-primary/40 bg-primary/5 p-4 min-w-[200px]">
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Progresso
          </div>
          <div className="mt-1 font-serif text-4xl text-primary">{pct}%</div>
          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary/60"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            {done}/{total} itens
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="text-[10px] uppercase tracking-[0.2em] text-primary/70">
            Investimento total mínimo
          </div>
          <div className="mt-1 font-serif text-2xl">USD 124</div>
          <p className="mt-2 text-xs text-muted-foreground">
            Apple 99/ano + Google 25 vitalício. Domínio, infra e Stripe são separados.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="text-[10px] uppercase tracking-[0.2em] text-primary/70">Tempo alvo</div>
          <div className="mt-1 font-serif text-2xl">30–45 dias</div>
          <p className="mt-2 text-xs text-muted-foreground">
            Do commit inicial ao aprovado nas duas lojas, executando 25 min/dia.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="text-[10px] uppercase tracking-[0.2em] text-primary/70">
            Meta de primeira semana
          </div>
          <div className="mt-1 font-serif text-2xl">10 usuários pagos</div>
          <p className="mt-2 text-xs text-muted-foreground">
            Free trials não contam. Um cartão passou = validação.
          </p>
        </div>
      </div>

      <div className="mt-10 space-y-8">
        {launchPlaybook.map((sec, si) => {
          const secDone = sec.items.filter((i) => state[i.id]).length;
          return (
            <section key={sec.id}>
              <div className="flex items-baseline justify-between gap-3">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.24em] text-primary/70">
                    Etapa {si + 1}
                  </div>
                  <h2 className="mt-1 font-serif text-2xl">{sec.title}</h2>
                  <p className="text-sm text-muted-foreground">{sec.subtitle}</p>
                </div>
                <div className="text-xs text-muted-foreground">
                  {secDone}/{sec.items.length}
                </div>
              </div>

              <div className="mt-4 grid gap-3">
                {sec.items.map((item) => {
                  const done = !!state[item.id];
                  return (
                    <button
                      key={item.id}
                      onClick={() => toggle(item.id)}
                      className={
                        "group text-left rounded-xl border p-4 transition " +
                        (done
                          ? "border-primary/50 bg-primary/5"
                          : "border-border bg-card hover:border-primary/40")
                      }
                    >
                      <div className="flex gap-3">
                        {done ? (
                          <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary shrink-0" />
                        ) : (
                          <Circle className="mt-0.5 h-5 w-5 text-muted-foreground shrink-0" />
                        )}
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={
                                "font-medium " + (done ? "line-through text-muted-foreground" : "")
                              }
                            >
                              {item.title}
                            </span>
                            {item.cost && (
                              <span className="rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.15em] text-primary">
                                {item.cost}
                              </span>
                            )}
                            {item.time && (
                              <span className="rounded-full border border-border px-2 py-0.5 text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                                {item.time}
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">{item.detail}</p>
                          {item.link && (
                            <a
                              href={item.link.href}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="mt-2 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                            >
                              {item.link.label} <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      <div className="mt-12 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 to-transparent p-5">
        <div className="flex items-center gap-3">
          <Rocket className="h-5 w-5 text-primary" />
          <div>
            <div className="font-serif text-lg">Quando bater 100%, agende sua Live de Lançamento.</div>
            <div className="text-xs text-muted-foreground">
              Vagas da cohort para review final ao vivo com o Concierge.
            </div>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={reset} className="gap-2">
          <RotateCcw className="h-3.5 w-3.5" /> Resetar checklist
        </Button>
      </div>
    </div>
  );
}
