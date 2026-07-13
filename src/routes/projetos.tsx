import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Heart, TrendingUp, Users } from "lucide-react";
import { projects, type ShowcaseProject } from "@/lib/showcase-data";
import { HeroBanner } from "@/components/HeroBanner";
import heroProjetos from "@/assets/hero-projetos.jpg";


export const Route = createFileRoute("/projetos")({
  head: () => ({
    meta: [
      { title: "Projetos da Cohort | AI App Empire" },
      { name: "description", content: "O que os alunos estão construindo." },
    ],
  }),
  component: ProjectsPage,
});

const STAGES: ShowcaseProject["stage"][] = ["Ideia", "MVP", "Live", "Pagando", "Escalando"];

function ProjectsPage() {
  const [stage, setStage] = useState<ShowcaseProject["stage"] | "Todos">("Todos");
  const [liked, setLiked] = useState<Record<string, boolean>>({});

  const filtered = useMemo(
    () => (stage === "Todos" ? projects : projects.filter((p) => p.stage === stage)),
    [stage],
  );

  const totalMRR = projects.reduce((a, p) => a + p.mrr, 0);
  const shipping = projects.filter((p) => p.mrr > 0).length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-10 space-y-8">
      <HeroBanner
        image={heroProjetos}
        eyebrow="Cohort 01"
        title={<>Vitrine de projetos</>}
        subtitle="O que os outros alunos estão construindo agora. Inspire-se, dê like, mande DM. Publique o seu quando estiver no ar."
        meta={
          <div className="flex flex-wrap gap-3">
            <div className="rounded-xl border border-primary/40 bg-primary/5 px-4 py-2">
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">MRR agregado</div>
              <div className="font-serif text-2xl text-primary">R$ {totalMRR.toLocaleString("pt-BR")}</div>
            </div>
            <div className="rounded-xl border border-border bg-card px-4 py-2">
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">apps pagando</div>
              <div className="font-serif text-2xl">{shipping}</div>
            </div>
          </div>
        }
      />



      <div className="mt-6 flex flex-wrap gap-2">
        {(["Todos", ...STAGES] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStage(s)}
            className={
              "rounded-full border px-3 py-1 text-xs uppercase tracking-[0.15em] transition " +
              (stage === s
                ? "border-primary bg-primary/15 text-primary"
                : "border-border text-muted-foreground hover:border-primary/40")
            }
          >
            {s}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => {
          const isLiked = liked[p.id];
          return (
            <article
              key={p.id}
              className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition hover:border-primary/40"
            >
              <div
                className={`relative h-28 bg-gradient-to-br ${p.cover} flex items-end p-4`}
              >
                <span className="absolute top-3 right-3 rounded-full border border-white/20 bg-black/40 px-2 py-0.5 text-[10px] uppercase tracking-[0.15em] text-white backdrop-blur">
                  {p.stage}
                </span>
                <div>
                  <div className="font-serif text-xl leading-none">{p.name}</div>
                  <div className="mt-1 text-xs text-white/80">{p.category}</div>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-4">
                <p className="text-sm text-muted-foreground">{p.tagline}</p>
                <p className="mt-3 text-xs italic text-muted-foreground/80">"{p.story}"</p>

                <div className="mt-4 flex flex-wrap gap-1">
                  {p.stack.map((s) => (
                    <span
                      key={s}
                      className="rounded border border-border px-1.5 py-0.5 text-[10px] uppercase tracking-[0.12em] text-muted-foreground"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <div className="mt-auto pt-4 flex items-center justify-between text-xs text-muted-foreground border-t border-border/60">
                  <div className="flex items-center gap-3">
                    <span className="grid h-7 w-7 place-items-center rounded-full border border-primary/40 bg-primary/10 text-[11px] text-primary">
                      {p.avatar}
                    </span>
                    <span>{p.author}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1">
                      <Users className="h-3 w-3" /> {p.users}
                    </span>
                    {p.mrr > 0 && (
                      <span className="inline-flex items-center gap-1 text-primary">
                        <TrendingUp className="h-3 w-3" /> R${(p.mrr / 1000).toFixed(1)}k
                      </span>
                    )}
                    <button
                      onClick={() => setLiked((l) => ({ ...l, [p.id]: !l[p.id] }))}
                      className={
                        "inline-flex items-center gap-1 transition " +
                        (isLiked ? "text-primary" : "hover:text-foreground")
                      }
                    >
                      <Heart className={"h-3 w-3 " + (isLiked ? "fill-current" : "")} />
                      {p.likes + (isLiked ? 1 : 0)}
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
