import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { BookMarked, Search, X } from "lucide-react";
import { glossary, glossaryCategories, type GlossaryEntry } from "@/lib/glossary-data";

export const Route = createFileRoute("/glossario")({
  head: () => ({
    meta: [
      { title: "Glossário — AI App Empire" },
      {
        name: "description",
        content:
          "Dicionário curado dos termos de IA, agentes, MCP, engenharia e produto usados no curso.",
      },
    ],
  }),
  component: GlossarioPage,
});

function GlossarioPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string | null>(null);
  const [open, setOpen] = useState<GlossaryEntry | null>(null);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return glossary
      .filter((g) => (cat ? g.category === cat : true))
      .filter((g) => {
        if (!query) return true;
        const hay = [g.term, g.short, g.long, ...(g.aliases ?? [])]
          .join(" ")
          .toLowerCase();
        return hay.includes(query);
      })
      .sort((a, b) => a.term.localeCompare(b.term, "pt-BR"));
  }, [q, cat]);

  const grouped = useMemo(() => {
    const map = new Map<string, GlossaryEntry[]>();
    for (const e of filtered) {
      const key = e.term[0].toUpperCase();
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(e);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10 lg:py-14">
      <div className="text-xs uppercase tracking-[0.28em] text-primary">Vocabulário do ofício</div>
      <h1 className="mt-2 font-serif text-4xl lg:text-5xl tracking-tight">Glossário</h1>
      <p className="mt-3 text-muted-foreground max-w-2xl">
        Os {glossary.length} termos que você vai ouvir no curso, explicados de forma direta.
        Toque em um card pra abrir a definição completa e ver termos relacionados.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar termo, alias ou definição…"
            className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm min-h-11"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => setCat(null)}
          className={
            "rounded-full border px-3 py-1 text-xs transition " +
            (cat === null
              ? "border-primary bg-primary/15 text-primary"
              : "border-border text-muted-foreground hover:text-foreground")
          }
        >
          Todos ({glossary.length})
        </button>
        {glossaryCategories.map((c) => {
          const count = glossary.filter((g) => g.category === c).length;
          const active = cat === c;
          return (
            <button
              key={c}
              onClick={() => setCat(active ? null : c)}
              className={
                "rounded-full border px-3 py-1 text-xs transition " +
                (active
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground")
              }
            >
              {c} ({count})
            </button>
          );
        })}
      </div>

      <div className="mt-8 space-y-10">
        {grouped.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center">
            <BookMarked className="h-8 w-8 text-muted-foreground mx-auto" />
            <p className="mt-4 text-sm text-muted-foreground">
              Nenhum termo bate com "{q}".
            </p>
          </div>
        )}
        {grouped.map(([letter, items]) => (
          <section key={letter}>
            <div className="mb-3 flex items-baseline gap-3 border-b border-border pb-2">
              <div className="font-serif text-3xl text-primary">{letter}</div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">
                {items.length} {items.length === 1 ? "termo" : "termos"}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {items.map((e) => (
                <button
                  key={e.term}
                  onClick={() => setOpen(e)}
                  className="text-left rounded-xl border border-border bg-card p-4 hover:border-primary/50 transition"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <div className="font-serif text-lg">{e.term}</div>
                    <div className="text-[10px] uppercase tracking-widest text-primary shrink-0">
                      {e.category}
                    </div>
                  </div>
                  <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">
                    {e.short}
                  </p>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setOpen(null)}
          className="fixed inset-0 z-50 grid place-items-center bg-black/70 backdrop-blur-sm p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-lg w-full rounded-2xl border border-primary/40 bg-background p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-primary">
                  {open.category}
                </div>
                <div className="mt-1 font-serif text-2xl">{open.term}</div>
                {open.aliases && open.aliases.length > 0 && (
                  <div className="mt-1 text-xs text-muted-foreground">
                    também: {open.aliases.join(" · ")}
                  </div>
                )}
              </div>
              <button
                onClick={() => setOpen(null)}
                aria-label="Fechar"
                className="rounded-md p-1 hover:bg-accent"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-4 text-sm leading-relaxed">{open.long}</p>
            {open.seeAlso && open.seeAlso.length > 0 && (
              <div className="mt-5 border-t border-border pt-4">
                <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                  Veja também
                </div>
                <div className="flex flex-wrap gap-2">
                  {open.seeAlso.map((t) => {
                    const found = glossary.find(
                      (g) => g.term.toLowerCase() === t.toLowerCase(),
                    );
                    if (!found)
                      return (
                        <span
                          key={t}
                          className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground"
                        >
                          {t}
                        </span>
                      );
                    return (
                      <button
                        key={t}
                        onClick={() => setOpen(found)}
                        className="rounded-full border border-primary/40 bg-primary/10 px-2.5 py-1 text-xs text-primary hover:bg-primary/20"
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
