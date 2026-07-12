import { useEffect, useRef, useState } from "react";
import { MessageSquareText, Send, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type Msg = { role: "user" | "concierge"; text: string; ts: number };

const KEY = "aiae:concierge-chat:v1";

const OPENINGS = [
  "Bem-vindo. Sou seu Concierge. Em que eu direciono você hoje?",
  "Diga o objetivo desta sessão e eu proponho o caminho mais curto.",
  "Você tem 25 minutos. Onde eu invisto sua atenção?",
];

const QUICK = [
  "Como estruturar meu primeiro agent com tools próprias?",
  "Estou travado no exercício da aula atual — me guie.",
  "Revise minha ideia de produto em 3 perguntas.",
  "O que devo publicar essa semana pra ganhar tração?",
];

// Deterministic, opinionated concierge replies — no backend, real feel.
function reply(input: string): string {
  const s = input.toLowerCase();
  if (/(agent|agente|tool)/.test(s))
    return "Fundação: um agent = loop de decisão + tools + guard-rails.\n\nCaminho:\n1. Defina UMA missão (uma frase, verbo forte).\n2. Liste 3 tools reais que ele precisa — nada de 'search web' genérico.\n3. Escreva o system prompt já com step-limit (8) e budget (0.5 USD/run).\n4. Rode 10 casos reais antes de qualquer UI.\n\nVá pro Módulo 2 · Aula 3 se quiser o snippet base pronto.";
  if (/(trav|preso|não sei|nao sei|ajuda no exercício)/.test(s))
    return "Regra do desbloqueio em 90s:\n\n1. Descreva em 1 frase o que você TENTOU (não o que quer).\n2. Cole o output real (erro, print, resposta esquisita).\n3. Diga qual seria o resultado 'certo' em 1 frase.\n\nMe manda esses 3 e eu volto com o diagnóstico específico. Sem eles eu só chuto.";
  if (/(ideia|produto|validar|nicho)/.test(s))
    return "Três perguntas cirúrgicas:\n\n1. Quem exatamente sofre com esse problema HOJE, com nome e sobrenome? (se não sabe, ainda é hobby)\n2. Quanto essa pessoa já gasta tentando resolver? (se é zero, a dor é fraca)\n3. Qual a promessa em 8 palavras? Se não cabe, ainda está fofo demais.\n\nResponde os 3, eu volto com um PRD lite.";
  if (/(publicar|lançar|lancar|tração|tracao|marketing)/.test(s))
    return "Semana de lançamento em 4 movimentos:\n\n· Segunda: 1 thread longa (X ou LinkedIn) contando o 'por quê' — não o 'o quê'.\n· Terça: DM manual para 20 pessoas-âncora do seu nicho.\n· Quarta: vídeo curto de 45s mostrando o produto em uso real.\n· Sexta: changelog público + email para waitlist.\n\nAbre o playbook completo em /lancamento.";
  if (/(pricing|preço|preco|cobrar|monetizar)/.test(s))
    return "Regras não-negociáveis:\n\n· Cobre desde o dia 1. 'Free' sem tier pago é pesquisa de mercado, não empresa.\n· 3 tiers: âncora barato, plano óbvio no meio, tier premium que parece caro (é ele que sustenta a percepção).\n· Nunca cobre menos que seu custo marginal x 4.\n\nUse o prompt 'Pricing de 3 planos' em /prompts.";
  if (/(motivação|motivacao|desist|cansad)/.test(s))
    return "Consistência é vantagem injusta.\n\nRegra: 25 min por dia > 4h no fim de semana.\nMétrica única: 1 commit ou 1 entrega visível por dia.\nSe travar: reduza escopo pela metade, entregue mesmo assim, publique.\n\nSeu streak importa mais que sua velocidade.";
  return "Recebido. Para eu ser útil de verdade, me passa:\n\n1. Onde você está no curso (módulo/aula).\n2. O que você quer construir esta semana.\n3. Qual é o obstáculo real (não o sintoma).\n\nCom esses 3, eu monto seu próximo movimento.";
}

export function ConciergeChat() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setMsgs(JSON.parse(raw));
      else
        setMsgs([
          {
            role: "concierge",
            text: OPENINGS[Math.floor(Math.random() * OPENINGS.length)],
            ts: Date.now(),
          },
        ]);
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(msgs.slice(-40)));
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs]);

  function send(text: string) {
    const t = text.trim();
    if (!t) return;
    setMsgs((m) => [...m, { role: "user", text: t, ts: Date.now() }]);
    setInput("");
    setTyping(true);
    setTimeout(
      () => {
        setMsgs((m) => [...m, { role: "concierge", text: reply(t), ts: Date.now() }]);
        setTyping(false);
      },
      500 + Math.random() * 700,
    );
  }

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-40 group flex items-center gap-2 rounded-full border border-primary/40 bg-background/90 px-4 py-2.5 shadow-lg shadow-primary/20 backdrop-blur hover:border-primary transition"
        >
          <span className="grid h-6 w-6 place-items-center rounded-full bg-primary/15">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
          </span>
          <span className="text-xs uppercase tracking-[0.18em]">Concierge</span>
        </button>
      )}

      {open && (
        <div className="fixed bottom-5 right-5 z-40 flex h-[560px] w-[min(400px,calc(100vw-2.5rem))] flex-col rounded-2xl border border-primary/30 bg-background/95 shadow-2xl shadow-primary/20 backdrop-blur">
          <div className="flex items-center gap-3 border-b border-border px-4 py-3">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-primary/15 border border-primary/40">
              <Sparkles className="h-4 w-4 text-primary" />
            </span>
            <div className="leading-tight">
              <div className="font-serif text-sm">Midnight Concierge</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                sempre à disposição
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="ml-auto rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {msgs.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user"
                    ? "ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-primary/15 border border-primary/30 px-3 py-2 text-sm"
                    : "mr-auto max-w-[85%] rounded-2xl rounded-bl-sm bg-muted/40 border border-border/50 px-3 py-2 text-sm whitespace-pre-line"
                }
              >
                {m.text}
              </div>
            ))}
            {typing && (
              <div className="mr-auto max-w-[85%] rounded-2xl rounded-bl-sm bg-muted/40 border border-border/50 px-3 py-2 text-sm text-muted-foreground">
                <span className="inline-flex gap-1">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary [animation-delay:300ms]" />
                </span>
              </div>
            )}
            {msgs.length <= 1 && (
              <div className="pt-1 space-y-1.5">
                {QUICK.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="w-full text-left rounded-lg border border-border/50 bg-card/40 px-3 py-2 text-xs text-muted-foreground hover:border-primary/50 hover:text-foreground transition"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-border p-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Pergunte ao Concierge…"
                className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
              <Button type="submit" size="sm" className="gap-1">
                <Send className="h-3.5 w-3.5" />
              </Button>
            </form>
            <div className="mt-2 flex items-center gap-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              <MessageSquareText className="h-3 w-3" /> respostas do curso — sem chamadas externas
            </div>
          </div>
        </div>
      )}
    </>
  );
}
