import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { NotebookPen, Search, Download, Tag, X } from "lucide-react";
import { course } from "@/lib/course-data";
import { extractTags } from "@/lib/tags";

const KEY = "aiae:notes:v1";

function read(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "{}");
  } catch {
    return {};
  }
}

export const Route = createFileRoute("/notas")({
  head: () => ({
    meta: [
      { title: "Minhas notas — AI App Empire" },
      {
        name: "description",
        content: "Todas as suas anotações do curso reunidas, com busca, tags e exportação em Markdown.",
      },
    ],
  }),
  component: NotasPage,
});

function NotasPage() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const onS = () => setTick((t) => t + 1);
    window.addEventListener("storage", onS);
    return () => window.removeEventListener("storage", onS);
  }, []);
  const notes = useSyncExternalStore(subscribeNotes, read, read);
  const [q, setQ] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  void tick;

  const entries = useMemo(() => {
    const rows: {
      moduleId: string;
      moduleNumber: number;
      moduleTitle: string;
      lessonId: string;
      lessonTitle: string;
      text: string;
      tags: string[];
    }[] = [];
    for (const m of course.modules) {
      for (const l of m.lessons) {
        const t = notes[`${m.id}/${l.id}`];
        if (t && t.trim().length)
          rows.push({
            moduleId: m.id,
            moduleNumber: m.number,
            moduleTitle: m.title,
            lessonId: l.id,
            lessonTitle: l.title,
            text: t,
            tags: extractTags(t),
          });
      }
    }
    return rows;
  }, [notes]);

  const tagCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of entries) for (const t of r.tags) map.set(t, (map.get(t) ?? 0) + 1);
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [entries]);

  const filtered = useMemo(() => {
    let list = entries;
    if (activeTag) list = list.filter((r) => r.tags.includes(activeTag));
    if (q.trim()) {
      const ql = q.toLowerCase();
      list = list.filter(
        (r) =>
          r.text.toLowerCase().includes(ql) ||
          r.lessonTitle.toLowerCase().includes(ql) ||
          r.moduleTitle.toLowerCase().includes(ql),
      );
    }
    return list;
  }, [entries, q, activeTag]);

  const exportMd = () => {
    const src = filtered.length ? filtered : entries;
    const md = src
      .map(
        (r) =>
          `## M${String(r.moduleNumber).padStart(2, "0")} — ${r.moduleTitle}\n### ${r.lessonTitle}\n${r.tags.length ? `\n_Tags: ${r.tags.map((t) => `#${t}`).join(" ")}_\n` : ""}\n${r.text}\n`,
      )
      .join("\n---\n\n");
    const blob = new Blob([`# Minhas notas — AI App Empire\n\n${md}`], {
      type: "text/markdown",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `notas-ai-app-empire.md`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 500);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10 lg:py-14">
      <div className="text-xs uppercase tracking-[0.28em] text-primary">Caderneta</div>
      <h1 className="mt-2 font-serif text-4xl lg:text-5xl tracking-tight">Minhas notas</h1>
      <p className="mt-3 text-muted-foreground max-w-xl">
        Tudo que você escreveu no curso, num só lugar. Use <code className="text-primary">#tag</code> nas
        notas pra organizar por tema — filtre e exporte pro seu segundo cérebro.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar em todas as notas…"
            className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm min-h-11"
          />
        </div>
        <button
          onClick={exportMd}
          disabled={entries.length === 0}
          className="inline-flex items-center justify-center gap-2 rounded-md border border-primary/40 bg-primary/10 px-4 py-2 text-sm text-primary hover:bg-primary/20 disabled:opacity-40 min-h-11"
        >
          <Download className="h-4 w-4" /> Exportar Markdown
        </button>
      </div>

      {tagCounts.length > 0 && (
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <Tag className="h-3.5 w-3.5 text-muted-foreground" />
          {tagCounts.map(([tag, count]) => {
            const on = activeTag === tag;
            return (
              <button
                key={tag}
                onClick={() => setActiveTag(on ? null : tag)}
                className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs transition ${
                  on
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
              >
                #{tag}
                <span className="opacity-60">{count}</span>
              </button>
            );
          })}
          {activeTag && (
            <button
              onClick={() => setActiveTag(null)}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3" /> limpar
            </button>
          )}
        </div>
      )}

      <div className="mt-8 space-y-4">
        {entries.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center">
            <NotebookPen className="h-8 w-8 text-muted-foreground mx-auto" />
            <p className="mt-4 text-sm text-muted-foreground">
              Você ainda não escreveu notas. Abra qualquer aula e vá até a aba
              <em> Notas</em> para começar sua caderneta.
            </p>
          </div>
        )}
        {filtered.map((r) => (
          <Link
            key={`${r.moduleId}/${r.lessonId}`}
            to="/aula/$moduleId/$lessonId"
            params={{ moduleId: r.moduleId, lessonId: r.lessonId }}
            className="block rounded-2xl border border-border bg-card p-5 hover:border-primary/50 transition"
          >
            <div className="text-[10px] uppercase tracking-widest text-primary">
              M{String(r.moduleNumber).padStart(2, "0")} · {r.moduleTitle}
            </div>
            <div className="mt-1 font-serif text-lg">{r.lessonTitle}</div>
            <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground line-clamp-6">
              {r.text}
            </p>
            {r.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {r.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-primary/30 bg-primary/5 px-2 py-0.5 text-[10px] uppercase tracking-wider text-primary"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </Link>
        ))}
        {entries.length > 0 && filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            Nenhuma nota bate com os filtros.
          </div>
        )}
      </div>
    </div>
  );
}
