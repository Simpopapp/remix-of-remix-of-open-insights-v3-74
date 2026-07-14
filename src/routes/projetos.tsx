import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Heart, Plus, TrendingUp, Trash2, Users, X } from "lucide-react";
import { projects, type ShowcaseProject } from "@/lib/showcase-data";
import { useUserProjects } from "@/lib/user-projects";
import { HeroBanner } from "@/components/HeroBanner";
import heroProjetos from "@/assets/hero-projetos.jpg";
import { toast } from "sonner";
import { fireConfetti } from "@/lib/confetti";

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
  const [open, setOpen] = useState(false);
  const { list: mine, add, remove } = useUserProjects();

  const all = useMemo<ShowcaseProject[]>(() => {
    const mineAsShow: ShowcaseProject[] = mine.map((p) => ({
      id: p.id,
      name: p.name,
      tagline: p.tagline,
      author: "Você",
      avatar: "★",
      category: "SaaS",
      stage: p.stage,
      mrr: 0,
      users: 0,
      likes: 0,
      stack: p.stack,
      story: p.story ?? "",
      cover: "from-primary/30 to-primary/10",
    }));
    return [...mineAsShow, ...projects];
  }, [mine]);

  const filtered = useMemo(
    () => (stage === "Todos" ? all : all.filter((p) => p.stage === stage)),
    [stage, all],
  );

  const totalMRR = projects.reduce((a, p) => a + p.mrr, 0);
  const shipping = projects.filter((p) => p.mrr > 0).length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-10 space-y-8">
      <HeroBanner
        image={heroProjetos}
        eyebrow="Cohort 01"
        title={<>Vitrine de projetos</>}
        subtitle="O que os outros alunos estão construindo agora. Publique o seu — cada projeto na vitrine conta pro seu certificado."
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
            <div className="rounded-xl border border-border bg-card px-4 py-2">
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">seus projetos</div>
              <div className="font-serif text-2xl">{mine.length}</div>
            </div>
          </div>
        }
      />

      <div className="mt-6 flex flex-wrap items-center gap-2">
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
        <button
          onClick={() => setOpen(true)}
          className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary-foreground hover:opacity-90"
        >
          <Plus className="h-3.5 w-3.5" /> Publicar projeto
        </button>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => {
          const isLiked = liked[p.id];
          const isMine = mine.some((m) => m.id === p.id);
          return (
            <article
              key={p.id}
              className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition hover:border-primary/40"
            >
              <div className={`relative h-28 bg-gradient-to-br ${p.cover} flex items-end p-4`}>
                <span className="absolute top-3 right-3 rounded-full border border-white/20 bg-black/40 px-2 py-0.5 text-[10px] uppercase tracking-[0.15em] text-white backdrop-blur">
                  {p.stage}
                </span>
                {isMine && (
                  <span className="absolute top-3 left-3 rounded-full bg-primary px-2 py-0.5 text-[10px] uppercase tracking-[0.15em] text-primary-foreground">
                    seu
                  </span>
                )}
                <div>
                  <div className="font-serif text-xl leading-none">{p.name}</div>
                  <div className="mt-1 text-xs text-white/80">{p.category}</div>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-4">
                <p className="text-sm text-muted-foreground">{p.tagline}</p>
                {p.story && <p className="mt-3 text-xs italic text-muted-foreground/80">"{p.story}"</p>}

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
                    {!isMine && (
                      <>
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
                          className={"inline-flex items-center gap-1 transition " + (isLiked ? "text-primary" : "hover:text-foreground")}
                        >
                          <Heart className={"h-3 w-3 " + (isLiked ? "fill-current" : "")} />
                          {p.likes + (isLiked ? 1 : 0)}
                        </button>
                      </>
                    )}
                    {isMine && (
                      <button
                        onClick={() => { remove(p.id); toast.success("Projeto removido"); }}
                        className="inline-flex items-center gap-1 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" /> remover
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {open && (
        <SubmitModal
          onClose={() => setOpen(false)}
          onSubmit={(data) => {
            add(data);
            setOpen(false);
            fireConfetti("burst");
            toast.success("Projeto publicado", { description: "Isso conta pro seu certificado." });
          }}
        />
      )}
    </div>
  );
}

function SubmitModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (data: { name: string; tagline: string; stage: ShowcaseProject["stage"]; stack: string[]; link?: string; story?: string }) => void;
}) {
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [stage, setStage] = useState<ShowcaseProject["stage"]>("MVP");
  const [stack, setStack] = useState("");
  const [link, setLink] = useState("");
  const [story, setStory] = useState("");

  const canSubmit = name.trim().length >= 2 && tagline.trim().length >= 4;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl border border-primary/40 bg-card p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.28em] text-primary">Publicar</div>
            <h2 className="font-serif text-2xl">Novo projeto</h2>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
        </div>

        <div className="mt-6 space-y-4 text-sm">
          <label className="block">
            <span className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">Nome do projeto *</span>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-2" placeholder="Ex: Veredito.ai" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">Tagline *</span>
            <input value={tagline} onChange={(e) => setTagline(e.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-2" placeholder="O que ele faz, em uma linha" />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">Estágio</span>
              <select value={stage} onChange={(e) => setStage(e.target.value as ShowcaseProject["stage"])} className="w-full rounded-md border border-input bg-background px-3 py-2">
                {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">Stack (vírgulas)</span>
              <input value={stack} onChange={(e) => setStack(e.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-2" placeholder="Agents, MCP, Postgres" />
            </label>
          </div>
          <label className="block">
            <span className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">Link (opcional)</span>
            <input value={link} onChange={(e) => setLink(e.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-2" placeholder="https://" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">História curta (opcional)</span>
            <textarea value={story} onChange={(e) => setStory(e.target.value)} rows={3} className="w-full rounded-md border border-input bg-background px-3 py-2" placeholder="Como você chegou aqui em poucas frases." />
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-md border border-input px-4 py-2 text-sm hover:bg-accent">Cancelar</button>
          <button
            disabled={!canSubmit}
            onClick={() => onSubmit({
              name: name.trim(),
              tagline: tagline.trim(),
              stage,
              stack: stack.split(",").map((s) => s.trim()).filter(Boolean),
              link: link.trim() || undefined,
              story: story.trim() || undefined,
            })}
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-40"
          >
            Publicar
          </button>
        </div>
      </div>
    </div>
  );
}
