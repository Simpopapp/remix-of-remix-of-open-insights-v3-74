import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Check, Copy, Search, Star } from "lucide-react";
import { prompts, promptCategories, type Prompt } from "@/lib/prompts-data";
import { usePromptFavs } from "@/lib/prompt-favs";
import { toast } from "sonner";

export const Route = createFileRoute("/prompts")({
  head: () => ({
    meta: [
      { title: "Biblioteca de Prompts | AI App Empire" },
      { name: "description", content: "Prompts de elite prontos para copiar e adaptar." },
    ],
  }),
  component: PromptsPage,
});

function PromptsPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<Prompt["category"] | "Todos" | "Favoritos">("Todos");
  const [copied, setCopied] = useState<string | null>(null);
  const { isFav, toggle: toggleFav } = usePromptFavs();

  const filtered = useMemo(() => {
    return prompts.filter((p) => {
      if (cat === "Favoritos") { if (!isFav(p.id)) return false; }
      else if (cat !== "Todos" && p.category !== cat) return false;
      if (q && !(p.title + p.useCase + p.body).toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [q, cat, isFav]);

  function copy(p: Prompt) {
    navigator.clipboard.writeText(p.body);
    setCopied(p.id);
    toast.success("Prompt copiado", { description: p.title });
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-10">
      <div className="text-[10px] uppercase tracking-[0.24em] text-primary/70">
        Arsenal do aluno
      </div>
      <h1 className="mt-2 font-serif text-3xl md:text-4xl">Biblioteca de prompts</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Prompts calibrados para os momentos exatos em que você mais trava. Copie, substitua as
        variáveis entre chaves e mande ver.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por título, uso ou conteúdo…"
            className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(["Todos", "Favoritos", ...promptCategories] as const).map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={
                "rounded-full border px-3 py-1 text-xs uppercase tracking-[0.15em] transition " +
                (cat === c
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/40")
              }
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {filtered.map((p) => (
          <article
            key={p.id}
            className="rounded-xl border border-border bg-card p-5 transition hover:border-primary/40"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-primary/70">
                  {p.category}
                </div>
                <h3 className="mt-1 font-serif text-lg">{p.title}</h3>
                <p className="text-xs text-muted-foreground">{p.useCase}</p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => toggleFav(p.id)}
                  aria-label={isFav(p.id) ? "Remover favorito" : "Favoritar"}
                  className={"rounded-md p-1.5 " + (isFav(p.id) ? "text-primary" : "text-muted-foreground hover:text-primary")}
                >
                  <Star className={"h-3.5 w-3.5 " + (isFav(p.id) ? "fill-current" : "")} />
                </button>
                <button
                  onClick={() => copy(p)}
                  className="inline-flex items-center gap-1 rounded-md border border-primary/40 bg-primary/10 px-2.5 py-1.5 text-xs text-primary hover:bg-primary/20"
                >
                  {copied === p.id ? (<><Check className="h-3.5 w-3.5" /> copiado</>) : (<><Copy className="h-3.5 w-3.5" /> copiar</>)}
                </button>
              </div>
            </div>

            <pre className="mt-4 whitespace-pre-wrap rounded-lg border border-border/60 bg-background/60 p-3 text-[11px] leading-relaxed text-muted-foreground font-mono max-h-52 overflow-y-auto">
              {p.body}
            </pre>

            <div className="mt-3 flex flex-wrap gap-1">
              {p.variables.map((v) => (
                <span
                  key={v}
                  className="rounded border border-primary/30 bg-primary/5 px-1.5 py-0.5 text-[10px] font-mono text-primary"
                >
                  {"{" + v + "}"}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>

      {!filtered.length && (
        <div className="mt-16 rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          Nenhum prompt bate com o filtro atual.
        </div>
      )}
    </div>
  );
}
