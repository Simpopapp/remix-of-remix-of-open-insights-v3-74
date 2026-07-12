import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CheckCircle2, Circle, PlayCircle } from "lucide-react";
import { findModule, course } from "@/lib/course-data";
import { useProgress } from "@/lib/progress";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/modulo/$moduleId")({
  loader: ({ params }) => {
    const mod = findModule(params.moduleId);
    if (!mod) throw notFound();
    return { mod };
  },
  head: ({ loaderData }) =>
    loaderData
      ? {
          meta: [
            { title: `${loaderData.mod.title} — AI App Empire` },
            { name: "description", content: loaderData.mod.tagline },
          ],
        }
      : { meta: [{ title: "Módulo não encontrado" }, { name: "robots", content: "noindex" }] },
  component: ModulePage,
  notFoundComponent: () => (
    <div className="p-10 text-center text-muted-foreground">Módulo não encontrado.</div>
  ),
  errorComponent: ({ error }) => (
    <div className="p-10 text-center text-destructive">{error.message}</div>
  ),
});

function ModulePage() {
  const { mod } = Route.useLoaderData();
  const { isDone, toggle } = useProgress();
  const done = mod.lessons.filter((l) => isDone(mod.id, l.id)).length;
  const pct = Math.round((done / mod.lessons.length) * 100);
  const nextModule = course.modules[course.modules.indexOf(mod) + 1];

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 lg:py-14">
      <Link to="/" className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground">
        ← Dashboard
      </Link>

      <div className="mt-6 text-xs font-mono text-primary">
        Módulo {String(mod.number).padStart(2, "0")}
      </div>
      <h1 className="mt-2 font-serif text-4xl lg:text-5xl tracking-tight leading-tight">
        {mod.title}
      </h1>
      <p className="mt-4 text-lg text-muted-foreground max-w-2xl">{mod.tagline}</p>
      <p className="mt-4 text-sm text-muted-foreground max-w-2xl">{mod.summary}</p>

      <div className="mt-8 flex items-center gap-4">
        <Progress value={pct} className="h-1.5 flex-1 max-w-xs" />
        <span className="text-sm tabular-nums text-muted-foreground">
          {done}/{mod.lessons.length} aulas · {pct}%
        </span>
      </div>

      <ol className="mt-10 divide-y divide-border rounded-xl border border-border bg-card overflow-hidden">
        {mod.lessons.map((l, i) => {
          const complete = isDone(mod.id, l.id);
          return (
            <li key={l.id} className="group flex items-center gap-4 p-4 hover:bg-accent/40 transition">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  toggle(mod.id, l.id);
                }}
                aria-label={complete ? "Marcar como não concluída" : "Marcar como concluída"}
                className="shrink-0"
              >
                {complete ? (
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground/60 group-hover:text-foreground" />
                )}
              </button>
              <div className="w-8 text-xs font-mono text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </div>
              <Link
                to="/aula/$moduleId/$lessonId"
                params={{ moduleId: mod.id, lessonId: l.id }}
                className="flex-1 min-w-0"
              >
                <div className="font-medium truncate">{l.title}</div>
                <div className="text-xs text-muted-foreground truncate">{l.description}</div>
              </Link>
              <div className="text-xs tabular-nums text-muted-foreground">{l.duration}</div>
              <Link
                to="/aula/$moduleId/$lessonId"
                params={{ moduleId: mod.id, lessonId: l.id }}
                className="ml-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition"
              >
                <PlayCircle className="h-4 w-4" />
              </Link>
            </li>
          );
        })}
      </ol>

      {nextModule && (
        <Link
          to="/modulo/$moduleId"
          params={{ moduleId: nextModule.id }}
          className="mt-8 block rounded-xl border border-border bg-card p-5 hover:border-primary/50 transition"
        >
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Próximo módulo</div>
          <div className="mt-1 font-serif text-xl">{nextModule.title}</div>
        </Link>
      )}
    </div>
  );
}
