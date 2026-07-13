import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, LifeBuoy, Search } from "lucide-react";

export const Route = createFileRoute("/ajuda")({
  head: () => ({
    meta: [
      { title: "Ajuda — AI App Empire" },
      { name: "description", content: "Central de ajuda: dúvidas, atalhos e suporte do concierge." },
    ],
  }),
  component: HelpPage,
});

type QA = { q: string; a: string; tag: string };

const FAQ: QA[] = [
  { tag: "Começando", q: "Como uso a plataforma pela primeira vez?", a: "Complete o onboarding, defina sua meta semanal e comece pela Trilha recomendada no dashboard. O ⌘K abre a paleta de comandos com tudo." },
  { tag: "Progresso", q: "Como marco uma aula como concluída?", a: "Ao terminar o vídeo, clique em 'Marcar como concluída' no rodapé da aula, ou use o checkbox na lista do módulo. Sua ofensiva conta a partir daí." },
  { tag: "Ofensiva", q: "O que acontece se eu perder um dia?", a: "Você tem 2 Streak Freezes automáticos por semana. Se ambos foram usados, a ofensiva zera — mas os XP acumulados ficam." },
  { tag: "Vídeo", q: "Posso continuar de onde parei?", a: "Sim. O player salva a posição a cada 5 segundos. O card 'Continuar assistindo' no dashboard te leva direto. Use K/Espaço para play/pause em qualquer tela via MiniPlayer." },
  { tag: "Notas", q: "Como funcionam as notas com timestamp?", a: "Aperte 'N' durante a aula para inserir o timestamp atual. Clicar no timestamp em qualquer nota salta para aquele ponto do vídeo." },
  { tag: "Exportar", q: "Consigo baixar meu progresso?", a: "Sim, em Perfil → Exportar dados. Gera um JSON com notas, progresso, marcadores e destaques. Também importa de volta." },
  { tag: "Comunidade", q: "Como falo com outros alunos?", a: "A aba Comunidade tem os canais organizados por módulo. Regras: sem spoiler de projeto final, sem venda de serviço." },
  { tag: "Certificado", q: "Quando recebo o certificado?", a: "Após concluir 100% das aulas + aprovar na Prova Final (>= 80%). O certificado sai em /certificado com QR de verificação." },
  { tag: "Suporte", q: "Preciso falar com um humano.", a: "Use o Concierge Chat no canto inferior direito. Resposta em até 12h úteis. Para urgências, marque como 🚨 no primeiro caractere." },
];

function HelpPage() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<number | null>(0);
  const filtered = FAQ.filter(
    (f) => !q || (f.q + f.a + f.tag).toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary">
        <LifeBuoy className="h-3.5 w-3.5" /> Central de ajuda
      </div>
      <h1 className="font-serif text-3xl sm:text-4xl mt-2">Como podemos te destravar?</h1>
      <p className="text-sm text-muted-foreground mt-2">
        Perguntas frequentes, atalhos e o caminho mais curto para o Concierge.
      </p>

      <div className="mt-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar dúvida…"
          className="w-full rounded-lg border border-border bg-card pl-9 pr-3 py-2.5 text-sm outline-none focus:border-primary/60"
        />
      </div>

      <div className="mt-6 space-y-2">
        {filtered.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={i} className="rounded-lg border border-border bg-card">
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left"
              >
                <span className="text-[10px] uppercase tracking-widest text-primary/80 rounded bg-primary/10 border border-primary/20 px-1.5 py-0.5">
                  {f.tag}
                </span>
                <span className="text-sm font-medium flex-1">{f.q}</span>
                <ChevronDown className={"h-4 w-4 text-muted-foreground transition " + (isOpen ? "rotate-180" : "")} />
              </button>
              {isOpen && (
                <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">{f.a}</div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-sm text-muted-foreground text-center py-10">
            Nada encontrado. Tente outra palavra ou abra o Concierge.
          </div>
        )}
      </div>
    </div>
  );
}
