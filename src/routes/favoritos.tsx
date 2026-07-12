import { createFileRoute, Link } from "@tanstack/react-router";
import { Bookmark, PlayCircle } from "lucide-react";
import { course } from "@/lib/course-data";
import { useBookmarks, lessonKey } from "@/lib/user-state";

export const Route = createFileRoute("/favoritos")({
  head: () => ({
    meta: [
      { title: "Favoritos — AI App Empire" },
      { name: "description", content: "Suas aulas favoritadas do curso AI App Empire." },
    ],
  }),
  component: FavoritesPage,
});

function FavoritesPage() {
  const { has, count } = useBookmarks();
  const rows = course.modules.flatMap((m) =>
    m.lessons
      .filter((l) => has(lessonKey(m.id, l.id)))
      .map((l) => ({ mod: m, lesson: l })),
  );

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 lg:py-14">
      <div className="text-xs uppercase tracking-[0.28em] text-primary">Guardadas</div>
      <h1 className="mt-2 font-serif text-4xl lg:text-5xl tracking-tight">
        Favoritos
      </h1>
      <p className="mt-3 text-muted-foreground max-w-xl">
        Aulas que você marcou para voltar. {count} salva{count === 1 ? "" : "s"}.
      </p>

      <div className="mt-10 space-y-3">
        {rows.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center">
            <Bookmark className="h-8 w-8 text-muted-foreground mx-auto" />
            <p className="mt-4 text-sm text-muted-foreground">
              Você ainda não favoritou nenhuma aula. Toque no ícone de bookmark
              dentro de uma aula para salvá-la aqui.
            </p>
          </div>
        )}
        {rows.map(({ mod, lesson }) => (
          <Link
            key={`${mod.id}/${lesson.id}`}
            to="/aula/$moduleId/$lessonId"
            params={{ moduleId: mod.id, lessonId: lesson.id }}
            className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 hover:border-primary/50 transition"
          >
            <div className="grid h-11 w-11 place-items-center rounded-full bg-primary/15 text-primary shrink-0">
              <PlayCircle className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] uppercase tracking-widest text-primary">
                M{String(mod.number).padStart(2, "0")} · {mod.title}
              </div>
              <div className="mt-1 font-medium truncate">{lesson.title}</div>
              <div className="text-sm text-muted-foreground line-clamp-1">
                {lesson.description}
              </div>
            </div>
            <div className="text-xs font-mono text-muted-foreground">{lesson.duration}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
