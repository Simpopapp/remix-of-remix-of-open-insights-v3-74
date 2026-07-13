import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { NotebookPen, Search, Download } from "lucide-react";
import { course } from "@/lib/course-data";

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
        content: "Todas as suas anotações do curso reunidas, com busca e exportação em Markdown.",
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
  const notes = useSyncExternalStore(
    (cb) => {
      window.addEventListener("storage", cb);
      return () => window.removeEventListener("storage", cb);
    },
    read,
    () => ({}) as Record<string, string>,
  );
  const [q, setQ] = useState("");
  void tick;

  const entries = useMemo(() => {
    const rows: {
      moduleId: string;
      moduleNumber: number;
      moduleTitle: string;
      lessonId: string;
      lessonTitle: string;
      text: string;
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
          });
      }
    }
    return rows;
  }, [notes]);

  const filtered = q.trim()
    ? entries.filter(
        (r) =>
          r.text.toLowerCase().includes(q.toLowerCase()) ||
          r.lessonTitle.toLowerCase().includes(q.toLowerCase()) ||
          r.moduleTitle.toLowerCase().includes(q.toLowerCase()),
      )
    : entries;

  const exportMd = () => {
    const md = entries
      .map(
        (r) =>
          `## M${String(r.moduleNumber).padStart(2, "0")} — ${r.moduleTitle}\n### ${r.lessonTitle}\n\n${r.text}\n`,
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
        Tudo que você escreveu ao longo do curso, num só lugar. Busca full-text e export
        Markdown pra levar pro seu segundo cérebro.
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
          </Link>
        ))}
        {entries.length > 0 && filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            Nenhuma nota bate com "{q}".
          </div>
        )}
      </div>
    </div>
  );
}
