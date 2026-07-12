import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CheckCircle2, XCircle, Award, RotateCcw } from "lucide-react";

export const Route = createFileRoute("/prova")({
  head: () => ({ meta: [{ title: "Prova Final — AI App Empire" }] }),
  component: ProvaPage,
});

type Q = { q: string; options: string[]; correct: number; explain: string };

const QUESTIONS: Q[] = [
  { q: "Qual é a principal diferença entre um Agente e um Chatbot?", options: [
    "Agente responde mais rápido",
    "Agente executa ações via tools/skills e mantém estado",
    "Chatbot só funciona em texto",
    "Agente usa modelos maiores",
  ], correct: 1, explain: "Agentes decidem ações e executam ferramentas — chatbots respondem." },
  { q: "MCP (Model Context Protocol) serve principalmente para:", options: [
    "Comprimir prompts",
    "Padronizar acesso a ferramentas e dados entre modelos e apps",
    "Treinar novos modelos",
    "Hospedar embeddings",
  ], correct: 1, explain: "MCP é um protocolo aberto para integrar ferramentas externas ao modelo." },
  { q: "Ao lançar um app com IA, o primeiro guardrail é:", options: [
    "Cache de respostas",
    "Rate limit + validação de input",
    "Logs em Grafana",
    "SEO técnico",
  ], correct: 1, explain: "Sem rate limit e validação você perde dinheiro em segundos." },
  { q: "Sobre custo de tokens, o mais eficaz é:", options: [
    "Sempre usar o modelo mais barato",
    "Sumarizar histórico + roteamento por complexidade",
    "Desativar streaming",
    "Cache client-side",
  ], correct: 1, explain: "Roteamento e compressão de contexto dão os maiores ganhos." },
  { q: "Retrieval-Augmented Generation (RAG) reduz alucinação porque:", options: [
    "Aumenta a temperatura",
    "Ancora a resposta em documentos relevantes recuperados",
    "Usa fine-tuning",
    "Elimina o system prompt",
  ], correct: 1, explain: "RAG injeta contexto factual no prompt." },
  { q: "Fine-tuning é recomendado quando:", options: [
    "Você precisa de novos conhecimentos factuais",
    "Precisa de estilo/formato consistente e latência menor",
    "Quer barato e rápido",
    "Está prototipando",
  ], correct: 1, explain: "Fine-tuning ensina estilo — RAG ensina fatos." },
  { q: "No modelo de precificação premium, o ideal é cobrar por:", options: [
    "Tokens consumidos",
    "Resultado entregue (outcome) + assinatura",
    "Hora trabalhada",
    "Licença perpétua",
  ], correct: 1, explain: "Outcome-based captura valor e escala margem." },
  { q: "Sobre publicação nas app stores, é FALSO:", options: [
    "Apple exige revisão manual",
    "Google Play tem taxa única de US$25",
    "Você pode publicar sem conta de developer",
    "PWAs podem ser instaladas sem store",
  ], correct: 2, explain: "Publicar em store SEMPRE exige conta de developer." },
  { q: "Evals servem para:", options: [
    "Medir latência apenas",
    "Testar qualidade das saídas do agente de forma reprodutível",
    "Substituir logs",
    "Reduzir custo de treinamento",
  ], correct: 1, explain: "Evals são testes de qualidade — obrigatórios em produção." },
  { q: "Estratégia de growth mais durável para SaaS de IA:", options: [
    "Anúncios pagos em massa",
    "Loop de produto + conteúdo técnico + comunidade",
    "Descontos agressivos",
    "Cold email diário",
  ], correct: 1, explain: "Loops de produto compostos batem paid ads a longo prazo." },
];

function ProvaPage() {
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = useMemo(
    () => QUESTIONS.reduce((n, q, i) => n + (answers[i] === q.correct ? 1 : 0), 0),
    [answers],
  );
  const pct = (score / QUESTIONS.length) * 100;
  const passed = pct >= 70;

  const reset = () => {
    setAnswers({});
    setSubmitted(false);
    setCurrent(0);
    setStarted(false);
  };

  if (!started) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-primary/40 bg-primary/10">
          <Award className="h-8 w-8 text-primary" />
        </div>
        <h1 className="mt-6 font-serif text-4xl">Prova Final</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          10 perguntas · 70% para aprovação · gera certificado ao passar.
        </p>
        <div className="mt-8 rounded-2xl border border-primary/25 bg-card/50 p-6 text-left text-sm">
          <ul className="space-y-2 text-muted-foreground">
            <li>• Sem tempo máximo — pense com calma.</li>
            <li>• Cada resposta mostra explicação após submeter.</li>
            <li>• Você pode refazer quantas vezes quiser.</li>
            <li>• Aprovando, seu nome é gravado no certificado premium.</li>
          </ul>
        </div>
        <button
          onClick={() => setStarted(true)}
          className="mt-8 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          Começar prova
        </button>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className={`rounded-2xl border p-8 text-center ${passed ? "border-primary/60 bg-primary/10" : "border-destructive/40 bg-destructive/5"}`}>
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Resultado</div>
          <div className="mt-2 font-serif text-6xl">{score}/{QUESTIONS.length}</div>
          <div className="mt-1 text-lg">{Math.round(pct)}%</div>
          <div className="mt-4 text-sm">
            {passed ? "🎉 Aprovado! Seu certificado está liberado." : "Ainda não passou — 70% é o mínimo. Revise e tente de novo."}
          </div>
          <div className="mt-6 flex justify-center gap-3">
            {passed && (
              <Link
                to="/certificado"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                <Award className="h-4 w-4" /> Gerar certificado
              </Link>
            )}
            <button onClick={reset} className="inline-flex items-center gap-2 rounded-md border border-input px-5 py-2.5 text-sm hover:bg-accent">
              <RotateCcw className="h-4 w-4" /> Refazer
            </button>
          </div>
        </div>

        <div className="mt-10 space-y-4">
          {QUESTIONS.map((q, i) => {
            const ok = answers[i] === q.correct;
            return (
              <div key={i} className="rounded-xl border border-border bg-card/50 p-5">
                <div className="flex items-start gap-3">
                  {ok ? <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" /> : <XCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-destructive" />}
                  <div className="flex-1">
                    <div className="font-medium">{i + 1}. {q.q}</div>
                    <div className="mt-2 text-sm">
                      <span className="text-muted-foreground">Sua resposta: </span>
                      <span className={ok ? "text-primary" : "text-destructive"}>{q.options[answers[i]] ?? "—"}</span>
                    </div>
                    {!ok && (
                      <div className="mt-1 text-sm text-primary">
                        Correta: {q.options[q.correct]}
                      </div>
                    )}
                    <div className="mt-2 text-xs text-muted-foreground italic">{q.explain}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const q = QUESTIONS[current];
  const answered = current in answers;
  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Questão {current + 1} de {QUESTIONS.length}
        </div>
        <div className="h-1 w-40 overflow-hidden rounded-full bg-muted">
          <div className="h-full bg-primary" style={{ width: `${((current + 1) / QUESTIONS.length) * 100}%` }} />
        </div>
      </div>

      <div className="rounded-2xl border border-primary/25 bg-card/50 p-8">
        <h2 className="font-serif text-2xl">{q.q}</h2>
        <div className="mt-6 space-y-2">
          {q.options.map((opt, i) => {
            const selected = answers[current] === i;
            return (
              <button
                key={i}
                onClick={() => setAnswers({ ...answers, [current]: i })}
                className={
                  "block w-full rounded-lg border p-4 text-left text-sm transition " +
                  (selected
                    ? "border-primary bg-primary/10"
                    : "border-input bg-background hover:border-primary/40")
                }
              >
                <span className="mr-2 font-serif text-primary">{String.fromCharCode(65 + i)}.</span> {opt}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        <button
          onClick={() => setCurrent(Math.max(0, current - 1))}
          disabled={current === 0}
          className="text-sm text-muted-foreground disabled:opacity-30"
        >
          Anterior
        </button>
        {current < QUESTIONS.length - 1 ? (
          <button
            onClick={() => setCurrent(current + 1)}
            disabled={!answered}
            className="rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-40"
          >
            Próxima
          </button>
        ) : (
          <button
            onClick={() => setSubmitted(true)}
            disabled={Object.keys(answers).length < QUESTIONS.length}
            className="rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-40"
          >
            Finalizar prova
          </button>
        )}
      </div>
    </div>
  );
}
