import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useNavigate } from "@tanstack/react-router";
import { Award, BookOpen, Home, Layers, Library, PlayCircle, Rocket, Target, Trophy, Users, Wand2 } from "lucide-react";
import { useEffect, useState } from "react";
import { course } from "@/lib/course-data";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (fn: () => void) => {
    setOpen(false);
    fn();
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="hidden sm:inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground hover:border-primary/50 hover:text-foreground transition"
      >
        <span>Buscar aulas, módulos…</span>
        <kbd className="rounded bg-background/80 border border-border px-1.5 py-0.5 text-[10px] font-mono">⌘K</kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Buscar aulas, módulos, seções…" />
        <CommandList>
          <CommandEmpty>Nada encontrado.</CommandEmpty>
          <CommandGroup heading="Navegação">
            <CommandItem onSelect={() => go(() => navigate({ to: "/" }))}>
              <Home className="mr-2 h-4 w-4" /> Dashboard
            </CommandItem>
            <CommandItem onSelect={() => go(() => navigate({ to: "/conquistas" }))}>
              <Trophy className="mr-2 h-4 w-4" /> Conquistas
            </CommandItem>
            <CommandItem onSelect={() => go(() => navigate({ to: "/exercicios" }))}>
              <Target className="mr-2 h-4 w-4" /> Exercícios
            </CommandItem>
            <CommandItem onSelect={() => go(() => navigate({ to: "/favoritos" }))}>
              <Award className="mr-2 h-4 w-4" /> Favoritos
            </CommandItem>
            <CommandItem onSelect={() => go(() => navigate({ to: "/comunidade" }))}>
              <Users className="mr-2 h-4 w-4" /> Comunidade
            </CommandItem>
            <CommandItem onSelect={() => go(() => navigate({ to: "/biblioteca" }))}>
              <Library className="mr-2 h-4 w-4" /> Biblioteca
            </CommandItem>
            <CommandItem onSelect={() => go(() => navigate({ to: "/prompts" }))}>
              <Wand2 className="mr-2 h-4 w-4" /> Prompts
            </CommandItem>
            <CommandItem onSelect={() => go(() => navigate({ to: "/projetos" }))}>
              <Layers className="mr-2 h-4 w-4" /> Projetos da Cohort
            </CommandItem>
            <CommandItem onSelect={() => go(() => navigate({ to: "/lancamento" }))}>
              <Rocket className="mr-2 h-4 w-4" /> Playbook de Lançamento
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Módulos">
            {course.modules.map((m) => (
              <CommandItem
                key={m.id}
                value={`modulo ${m.number} ${m.title} ${m.tagline}`}
                onSelect={() => go(() => navigate({ to: "/modulo/$moduleId", params: { moduleId: m.id } }))}
              >
                <BookOpen className="mr-2 h-4 w-4" />
                <span className="mr-2 font-mono text-primary text-xs">
                  M{String(m.number).padStart(2, "0")}
                </span>
                {m.title}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Aulas">
            {course.modules.flatMap((m) =>
              m.lessons.map((l) => (
                <CommandItem
                  key={`${m.id}/${l.id}`}
                  value={`aula ${l.title} ${l.description} ${m.title}`}
                  onSelect={() =>
                    go(() =>
                      navigate({
                        to: "/aula/$moduleId/$lessonId",
                        params: { moduleId: m.id, lessonId: l.id },
                      }),
                    )
                  }
                >
                  <PlayCircle className="mr-2 h-4 w-4" />
                  <span className="truncate">{l.title}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{m.title}</span>
                </CommandItem>
              )),
            )}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
