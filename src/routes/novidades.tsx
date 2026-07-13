import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/novidades")({
  head: () => ({
    meta: [
      { title: "Novidades — AI App Empire" },
      { name: "description", content: "Changelog da plataforma: o que mudou, o que chegou, o que vem." },
    ],
  }),
  component: WhatsNew,
});

type Entry = { date: string; tag: "Novo" | "Melhoria" | "Correção"; title: string; body: string };

const ENTRIES: Entry[] = [
  { date: "13 jul 2026", tag: "Novo", title: "Central de Ajuda", body: "FAQ pesquisável com atalho direto para o Concierge." },
  { date: "13 jul 2026", tag: "Correção", title: "Estabilidade do dashboard", body: "Removido loop de re-render em stores de localStorage — a tela inicial agora carrega direto." },
  { date: "12 jul 2026", tag: "Novo", title: "Marcadores por timestamp", body: "Salve momentos exatos das aulas e volte com um clique. Página dedicada em /marcadores." },
  { date: "12 jul 2026", tag: "Melhoria", title: "MiniPlayer + atalhos globais", body: "Espaço/K, setas e J/L funcionam mesmo fora da tela da aula, com o vídeo tocando em picture-in-picture." },
  { date: "11 jul 2026", tag: "Novo", title: "Sistema de Badges dinâmicas", body: "60+ conquistas rastreadas automaticamente. Confetti nas milestone." },
  { date: "11 jul 2026", tag: "Novo", title: "Revisão semanal", body: "Resumo dos últimos 7 dias com XP, aulas, notas, destaques e tempo em foco." },
  { date: "10 jul 2026", tag: "Novo", title: "Modo Foco (Pomodoro)", body: "Timer 25/5 integrado à sua atividade, contando para a meta semanal." },
  { date: "10 jul 2026", tag: "Novo", title: "Notebook unificado", body: "Todas as notas em /notas com busca, tags e export Markdown." },
  { date: "9 jul 2026", tag: "Novo", title: "Command Palette (⌘K)", body: "Navegue, busque aulas, abra ferramentas — tudo pelo teclado." },
];

const tagStyles: Record<Entry["tag"], string> = {
  Novo: "bg-primary/15 text-primary border-primary/30",
  Melhoria: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
  Correção: "bg-amber-500/10 text-amber-300 border-amber-500/30",
};

function WhatsNew() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary">
        <Sparkles className="h-3.5 w-3.5" /> Changelog
      </div>
      <h1 className="font-serif text-3xl sm:text-4xl mt-2">Novidades da plataforma</h1>
      <p className="text-sm text-muted-foreground mt-2">
        Tudo o que mudou por aqui, em ordem cronológica reversa.
      </p>

      <ol className="mt-8 relative border-l border-border/60 pl-6 space-y-6">
        {ENTRIES.map((e, i) => (
          <li key={i} className="relative">
            <span className="absolute -left-[29px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_0_4px_hsl(var(--background))]" />
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] uppercase tracking-widest text-muted-foreground">{e.date}</span>
              <span className={"text-[10px] uppercase tracking-widest border rounded px-1.5 py-0.5 " + tagStyles[e.tag]}>
                {e.tag}
              </span>
            </div>
            <h3 className="mt-1 font-medium">{e.title}</h3>
            <p className="text-sm text-muted-foreground mt-0.5">{e.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
