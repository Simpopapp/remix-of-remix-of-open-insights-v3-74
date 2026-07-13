import { createFileRoute, Link } from "@tanstack/react-router";
import { Bookmark, Trash2, PlayCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { useMarkers } from "@/lib/markers";
import { course, findLesson } from "@/lib/course-data";
import { fmtTimestamp } from "@/lib/video-bus";

export const Route = createFileRoute("/marcadores")({
  head: () => ({
    meta: [
      { title: "Marcadores — AI App Empire" },
      { name: "description", content: "Todos os seus marcadores de tempo nas aulas, agrupados por aula." },
    ],
  }),
  component: MarkersPage,
});

function MarkersPage() {
  const { all, remove } = useMarkers();
  const [q, setQ] = useState("");

  const grouped = useMemo(() => {
    const filtered = q.trim()
      ? all.filter((m) => m.label.toLowerCase().includes(q.trim().toLowerCase()))
      : all;
    const groups = new Map<string, typeof all>();
    for (const m of filtered) {
      const key = `${m.moduleId}/${m.lessonId}`;
      const arr = groups.get(key) ?? [];
      arr.push(m);
      groups.set(key, arr);
    }
    return Array.from(groups.entries()).map(([key, items]) => {
      const [mid, lid] = key.split("/");
      const meta = findLesson(mid, lid);
      return { key, mid, lid, meta, items };
    });
  }, [all, q]);

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="flex items-center gap-3">
        <Bookmark className="h-5 w-5 text-primary" />
        <h1 className="font-serif text-3xl tracking-tight">Marcadores</h1>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        Momentos exatos das aulas que você marcou para revisitar depois.
      </p>

      <div className="mt-6 flex items-center gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por rótulo…"
          className="flex-1 rounded-full border border-border bg-card px-4 py-2 text-sm outline-none focus:border-primary/60"
        />
        <span className="text-xs text-muted-foreground tabular-nums">
          {all.length} {all.length === 1 ? "marcador" : "marcadores"}
        </span>
      </div>

      {all.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          Você ainda não criou marcadores. Numa aula, use{" "}
          <em className="text-foreground">Salvar marcador aqui</em> para fixar o momento atual.
          <div className="mt-6">
            <Link
              to="/modulo/$moduleId"
              params={{ moduleId: course.modules[0].id }}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:opacity-95"
            >
              Ir para o primeiro módulo
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          {grouped.map((g) => (
            <section key={g.key} className="rounded-2xl border border-border bg-card overflow-hidden">
              <header className="flex items-center justify-between gap-4 border-b border-border p-4">
                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-[0.24em] text-primary">
                    {g.meta?.module.title ?? "Módulo removido"}
                  </div>
                  <div className="mt-0.5 truncate font-medium">
                    {g.meta?.lesson.title ?? `${g.mid}/${g.lid}`}
                  </div>
                </div>
                {g.meta && (
                  <Link
                    to="/aula/$moduleId/$lessonId"
                    params={{ moduleId: g.mid, lessonId: g.lid }}
                    className="shrink-0 text-xs text-muted-foreground hover:text-primary"
                  >
                    Abrir aula →
                  </Link>
                )}
              </header>
              <ul className="divide-y divide-border">
                {g.items.map((m) => (
                  <li key={m.id} className="group flex items-center gap-3 p-4">
                    <Link
                      to="/aula/$moduleId/$lessonId"
                      params={{ moduleId: m.moduleId, lessonId: m.lessonId }}
                      search={{ t: m.t }}
                      className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-mono text-xs tabular-nums text-primary hover:bg-primary/20"
                    >
                      <PlayCircle className="h-3 w-3" />
                      {fmtTimestamp(m.t)}
                    </Link>
                    <span className="flex-1 truncate text-sm">{m.label || "Sem rótulo"}</span>
                    <span className="hidden sm:inline text-[11px] text-muted-foreground tabular-nums">
                      {new Date(m.createdAt).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </span>
                    <button
                      onClick={() => remove(m.id)}
                      aria-label="Remover marcador"
                      className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
