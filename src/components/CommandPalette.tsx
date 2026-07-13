import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useNavigate } from "@tanstack/react-router";
import { Award, Bell, BookOpen, CalendarDays, FileText, Highlighter, Home, Layers, Library, LineChart, Map, NotebookPen, PlayCircle, Rocket, Search, Target, Timer, Trophy, Users, Wand2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { course } from "@/lib/course-data";
import { buildIndex, resetIndex, searchContent, snippet } from "@/lib/search-index";

const SECTION_LABEL: Record<string, string> = {
  aula: "Aula",
  transcricao: "Transcrição",
  capitulos: "Capítulo",
  exercicio: "Exercício",
  nota: "Nota",
};

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      resetIndex();
      buildIndex();
    }
  }, [open]);

  const contentHits = useMemo(() => (q.trim().length >= 2 ? searchContent(q, 12) : []), [q]);

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
        aria-label="Abrir busca"
        className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-2 sm:px-3 py-1.5 text-xs text-muted-foreground hover:border-primary/50 hover:text-foreground transition min-h-9"
      >
        <Search className="h-3.5 w-3.5 sm:hidden" />
        <span className="hidden sm:inline">Buscar aulas, módulos…</span>
        <kbd className="hidden sm:inline rounded bg-background/80 border border-border px-1.5 py-0.5 text-[10px] font-mono">⌘K</kbd>
      </button>


      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Buscar aulas, transcrições, notas…" value={q} onValueChange={setQ} />
        <CommandList>
          <CommandEmpty>Nada encontrado.</CommandEmpty>
          {contentHits.length > 0 && (
            <CommandGroup heading="Conteúdo">
              {contentHits.map((h) => (
                <CommandItem
                  key={h.id}
                  value={`${h.id} ${h.body.slice(0, 60)}`}
                  onSelect={() =>
                    go(() =>
                      navigate({
                        to: "/aula/$moduleId/$lessonId",
                        params: { moduleId: h.moduleId, lessonId: h.lessonId },
                        search: h.t ? { t: h.t } : undefined,
                      }),
                    )
                  }
                >
                  <FileText className="mr-2 mt-0.5 h-4 w-4 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="rounded bg-primary/15 px-1.5 py-0.5 font-mono uppercase tracking-wider text-primary text-[10px]">
                        {SECTION_LABEL[h.section]}
                      </span>
                      <span className="truncate text-foreground">{h.lessonTitle}</span>
                    </div>
                    <div className="mt-0.5 truncate text-[11px] text-muted-foreground">
                      {snippet(h.body, q)}
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          <CommandGroup heading="Navegação">
            <CommandItem onSelect={() => go(() => navigate({ to: "/" }))}>
              <Home className="mr-2 h-4 w-4" /> Dashboard
            </CommandItem>
            <CommandItem onSelect={() => go(() => navigate({ to: "/revisao" }))}>
              <LineChart className="mr-2 h-4 w-4" /> Revisão semanal
            </CommandItem>
            <CommandItem onSelect={() => go(() => navigate({ to: "/mapa" }))}>
              <Map className="mr-2 h-4 w-4" /> Mapa do curso
            </CommandItem>
            <CommandItem onSelect={() => go(() => navigate({ to: "/agenda" }))}>
              <CalendarDays className="mr-2 h-4 w-4" /> Agenda
            </CommandItem>
            <CommandItem onSelect={() => go(() => navigate({ to: "/foco" }))}>
              <Timer className="mr-2 h-4 w-4" /> Modo Foco
            </CommandItem>
            <CommandItem onSelect={() => go(() => navigate({ to: "/inbox" }))}>
              <Bell className="mr-2 h-4 w-4" /> Inbox
            </CommandItem>
            <CommandItem onSelect={() => go(() => navigate({ to: "/notas" }))}>
              <NotebookPen className="mr-2 h-4 w-4" /> Minhas notas
            </CommandItem>
            <CommandItem onSelect={() => go(() => navigate({ to: "/conquistas" }))}>
              <Trophy className="mr-2 h-4 w-4" /> Conquistas
            </CommandItem>
            <CommandItem onSelect={() => go(() => navigate({ to: "/exercicios" }))}>
              <Target className="mr-2 h-4 w-4" /> Exercícios
            </CommandItem>
            <CommandItem onSelect={() => go(() => navigate({ to: "/favoritos" }))}>
              <Highlighter className="mr-2 h-4 w-4" /> Favoritos
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
            <CommandItem onSelect={() => go(() => navigate({ to: "/perfil" }))}>
              <Award className="mr-2 h-4 w-4" /> Perfil
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
