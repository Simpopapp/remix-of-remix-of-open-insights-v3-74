import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, XCircle, Award, RotateCcw, Timer } from "lucide-react";
import { EXAM_PASS_PCT, saveExamAttempt, useExam } from "@/lib/exam";
import { pushInbox } from "@/lib/inbox";
import { fireConfetti } from "@/lib/confetti";
import { toast } from "sonner";

export const Route = createFileRoute("/prova")({
  head: () => ({ meta: [{ title: "Prova Final — AI App Empire" }] }),
  component: ProvaPage,
});

type Q = { q: string; options: string[]; correct: number; explain: string };

const POOL: Q[] = [
  { q: "Qual é a principal diferença entre um Agente e um Chatbot?", options: ["Agente responde mais rápido", "Agente executa ações via tools/skills e mantém estado", "Chatbot só funciona em texto", "Agente usa modelos maiores"], correct: 1, explain: "Agentes decidem ações e executam ferramentas — chatbots respondem." },
  { q: "MCP (Model Context Protocol) serve principalmente para:", options: ["Comprimir prompts", "Padronizar acesso a ferramentas e dados entre modelos e apps", "Treinar novos modelos", "Hospedar embeddings"], correct: 1, explain: "MCP é um protocolo aberto para integrar ferramentas externas ao modelo." },
  { q: "Ao lançar um app com IA, o primeiro guardrail é:", options: ["Cache de respostas", "Rate limit + validação de input", "Logs em Grafana", "SEO técnico"], correct: 1, explain: "Sem rate limit e validação você perde dinheiro em segundos." },
  { q: "Sobre custo de tokens, o mais eficaz é:", options: ["Sempre usar o modelo mais barato", "Sumarizar histórico + roteamento por complexidade", "Desativar streaming", "Cache client-side"], correct: 1, explain: "Roteamento e compressão de contexto dão os maiores ganhos." },
  { q: "RAG reduz alucinação porque:", options: ["Aumenta a temperatura", "Ancora a resposta em documentos relevantes recuperados", "Usa fine-tuning", "Elimina o system prompt"], correct: 1, explain: "RAG injeta contexto factual no prompt." },
  { q: "Fine-tuning é recomendado quando:", options: ["Você precisa de novos conhecimentos factuais", "Precisa de estilo/formato consistente e latência menor", "Quer barato e rápido", "Está prototipando"], correct: 1, explain: "Fine-tuning ensina estilo — RAG ensina fatos." },
  { q: "No modelo de precificação premium, o ideal é cobrar por:", options: ["Tokens consumidos", "Resultado entregue (outcome) + assinatura", "Hora trabalhada", "Licença perpétua"], correct: 1, explain: "Outcome-based captura valor e escala margem." },
  { q: "Sobre publicação nas app stores, é FALSO:", options: ["Apple exige revisão manual", "Google Play tem taxa única de US$25", "Você pode publicar sem conta de developer", "PWAs podem ser instaladas sem store"], correct: 2, explain: "Publicar em store SEMPRE exige conta de developer." },
  { q: "Evals servem para:", options: ["Medir latência apenas", "Testar qualidade das saídas do agente de forma reprodutível", "Substituir logs", "Reduzir custo de treinamento"], correct: 1, explain: "Evals são testes de qualidade — obrigatórios em produção." },
  { q: "Estratégia de growth mais durável para SaaS de IA:", options: ["Anúncios pagos em massa", "Loop de produto + conteúdo técnico + comunidade", "Descontos agressivos", "Cold email diário"], correct: 1, explain: "Loops de produto compostos batem paid ads a longo prazo." },
  { q: "Um 'system prompt' bem projetado deve:", options: ["Ser o mais curto possível", "Definir papel, restrições, formato e exemplos", "Repetir o pedido do usuário", "Conter chaves de API"], correct: 1, explain: "System prompt é contrato: papel + restrições + formato + few-shots." },
  { q: "Streaming de tokens serve para:", options: ["Reduzir custo de inferência", "Reduzir a latência percebida pelo usuário", "Aumentar acurácia", "Contornar rate limits"], correct: 1, explain: "Streaming não reduz custo, mas melhora percepção de velocidade." },
  { q: "Vector databases são usados principalmente para:", options: ["Guardar logs", "Busca semântica por similaridade de embeddings", "Cache de respostas", "Autenticação"], correct: 1, explain: "Vector DBs indexam embeddings para recuperação semântica." },
  { q: "Sobre observabilidade de LLM apps, é essencial:", options: ["Só medir uptime", "Traços por request com prompts, respostas, tokens e custo", "Só medir CPU/memória", "Screenshots"], correct: 1, explain: "Você precisa ver o prompt inteiro que gerou o problema." },
  { q: "Guardrails de output devem validar:", options: ["Apenas gramática", "Schema/JSON, PII, toxicidade e política do produto", "Só o tamanho", "Cor da fonte"], correct: 1, explain: "Validação estrutural + segurança é o mínimo." },
  { q: "Function calling permite ao modelo:", options: ["Executar código Python arbitrário no seu server", "Escolher e chamar funções tipadas expostas pelo app", "Trocar de modelo", "Editar seus arquivos"], correct: 1, explain: "O modelo escolhe qual função chamar com quais argumentos JSON." },
  { q: "Para reduzir custo em produção, a alavanca mais forte é:", options: ["Trocar de linguagem", "Roteamento + cache semântico + compressão de contexto", "Comprar mais GPU", "Aumentar temperature"], correct: 1, explain: "Cache semântico + roteamento por complexidade cortam ~50-80%." },
  { q: "Um agente multi-step deve ter no mínimo:", options: ["Loop de raciocínio, tools tipadas e limite de passos", "Um único prompt gigante", "Fine-tune próprio", "GPU dedicada"], correct: 0, explain: "Loop + tools + step limit é o esqueleto mínimo." },
  { q: "Sobre PII em prompts, o certo é:", options: ["Enviar sempre — o modelo esquece", "Mascarar/tokenizar antes de enviar e reidratar depois", "Criptografar o prompt inteiro em base64", "Ignorar — não é problema seu"], correct: 1, explain: "Mask-in / rehydrate-out é o padrão de indústria." },
  { q: "Um bom eval de agente inclui:", options: ["Apenas asserts de string", "Casos gold, rubrics com LLM-as-judge, regressão contínua", "Testes manuais só", "Nada — é subjetivo"], correct: 1, explain: "Combinação de determinístico + LLM-judge é o estado da arte." },
  { q: "Para lançar um SaaS de IA em 60 dias, priorize:", options: ["3 features perfeitas", "1 workflow que resolve 1 dor + billing + observabilidade", "10 integrações", "Landing page linda"], correct: 1, explain: "Wedge estreito + monetização + telemetria — o resto vem." },
  { q: "Retenção em SaaS de IA depende principalmente de:", options: ["Preço baixo", "Aha-moment rápido + hábito recorrente + valor mensurável", "Suporte 24/7", "Design bonito"], correct: 1, explain: "Sem hábito, o usuário esquece e churn dispara." },
  { q: "Skills / Tools em um agente são:", options: ["Prompts extras", "Funções tipadas com schema que o modelo pode invocar", "Arquivos estáticos", "Modelos menores"], correct: 1, explain: "Cada skill é uma função tipada + descrição semântica." },
  { q: "Latência ruim em app de agente geralmente vem de:", options: ["Fonte errada no CSS", "Chains sequenciais que poderiam paralelizar + modelos grandes desnecessários", "Cor do botão", "Ordem dos imports"], correct: 1, explain: "Paralelizar tool calls + router para modelo menor resolve a maioria." },
  { q: "Sobre versionamento de prompts:", options: ["Nunca versione", "Trate prompts como código: versione, teste e faça rollback", "Guarde só o último", "Deixe hardcoded no cliente"], correct: 1, explain: "Prompt é código de produção — versione, teste, revise." },
];

const SAMPLE_SIZE = 15;
const TIMER_SEC = 20 * 60;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function ProvaPage() {
  const exam = useExam();
  const [started, setStarted] = useState(false);
  const [questions, setQuestions] = useState<Q[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [remaining, setRemaining] = useState(TIMER_SEC);
  const startedAt = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const score = useMemo(
    () => questions.reduce((n, q, i) => n + (answers[i] === q.correct ? 1 : 0), 0),
    [answers, questions],
  );
  const pct = questions.length ? (score / questions.length) * 100 : 0;
  const passed = pct >= EXAM_PASS_PCT;

  const finalize = () => {
    if (submitted) return;
    setSubmitted(true);
    if (timerRef.current) clearInterval(timerRef.current);
    const durationSec = Math.round((Date.now() - startedAt.current) / 1000);
    const attempt = {
      score,
      total: questions.length,
      pct: Math.round(pct * 10) / 10,
      passed,
      at: new Date().toISOString(),
      durationSec,
    };
    saveExamAttempt(attempt);
    if (passed) {
      fireConfetti("epic");
      toast.success(`Prova aprovada — ${Math.round(pct)}%`, { description: "Certificado desbloqueado." });
      pushInbox({
        from: "Sistema",
        title: "Prova final aprovada",
        body: `Você acertou ${score}/${questions.length} (${Math.round(pct)}%). Requisito da prova para o certificado: liberado.`,
        tag: "conquista",
        href: "/certificado",
      });
    } else {
      toast.error(`Não passou dessa vez — ${Math.round(pct)}%`, { description: `Mínimo ${EXAM_PASS_PCT}%.` });
    }
  };

  useEffect(() => {
    if (!started || submitted) return;
    startedAt.current = Date.now();
    setRemaining(TIMER_SEC);
    timerRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          finalize();
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);

  const start = () => {
    setQuestions(shuffle(POOL).slice(0, SAMPLE_SIZE));
    setAnswers({});
    setCurrent(0);
    setSubmitted(false);
    setStarted(true);
  };
  const reset = () => {
    setStarted(false);
    setSubmitted(false);
    setAnswers({});
    setCurrent(0);
  };

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");

  if (!started) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-primary/40 bg-primary/10">
          <Award className="h-8 w-8 text-primary" />
        </div>
        <h1 className="mt-6 font-serif text-4xl">Prova Final</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {SAMPLE_SIZE} perguntas sorteadas · {EXAM_PASS_PCT}% para aprovação · timer de {TIMER_SEC / 60} min.
        </p>

        {exam.best && (
          <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-primary/40 bg-primary/5 px-4 py-2 text-sm">
            <span className="text-muted-foreground">Melhor tentativa:</span>
            <span className={"font-semibold " + (exam.best.passed ? "text-primary" : "text-destructive")}>
              {Math.round(exam.best.pct)}% ({exam.best.score}/{exam.best.total})
            </span>
            <span className="text-xs text-muted-foreground">· {exam.attempts} tentativa(s)</span>
          </div>
        )}

        <div className="mt-8 rounded-2xl border border-primary/25 bg-card/50 p-6 text-left text-sm">
          <ul className="space-y-2 text-muted-foreground">
            <li>• {POOL.length} questões no pool — cada tentativa sorteia {SAMPLE_SIZE}.</li>
            <li>• Timer de {TIMER_SEC / 60} minutos — ao zerar, sua prova é submetida.</li>
            <li>• A melhor tentativa é gravada e conta pro certificado.</li>
            <li>• Aprovando com {EXAM_PASS_PCT}%, o requisito da prova fica verde.</li>
          </ul>
        </div>
        <button
          onClick={start}
          className="mt-8 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          {exam.best ? "Refazer prova" : "Começar prova"}
        </button>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className={`rounded-2xl border p-8 text-center ${passed ? "border-primary/60 bg-primary/10" : "border-destructive/40 bg-destructive/5"}`}>
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Resultado</div>
          <div className="mt-2 font-serif text-6xl">{score}/{questions.length}</div>
          <div className="mt-1 text-lg">{Math.round(pct)}%</div>
          <div className="mt-4 text-sm">
            {passed ? "🎉 Aprovado! Requisito da prova liberado no certificado." : `Ainda não passou — ${EXAM_PASS_PCT}% é o mínimo. Sua melhor tentativa fica gravada.`}
          </div>
          <div className="mt-6 flex justify-center gap-3">
            {passed && (
              <Link
                to="/certificado"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                <Award className="h-4 w-4" /> Ver certificado
              </Link>
            )}
            <button onClick={reset} className="inline-flex items-center gap-2 rounded-md border border-input px-5 py-2.5 text-sm hover:bg-accent">
              <RotateCcw className="h-4 w-4" /> Refazer
            </button>
          </div>
        </div>

        <div className="mt-10 space-y-4">
          {questions.map((q, i) => {
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
                    {!ok && <div className="mt-1 text-sm text-primary">Correta: {q.options[q.correct]}</div>}
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

  const q = questions[current];
  const answered = current in answers;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Questão {current + 1} de {questions.length} · {answeredCount} respondidas
        </div>
        <div className={"inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs tabular-nums " + (remaining < 60 ? "border-destructive/60 text-destructive animate-pulse" : "border-primary/40 text-primary")}>
          <Timer className="h-3 w-3" /> {mm}:{ss}
        </div>
      </div>
      <div className="mb-6 h-1 overflow-hidden rounded-full bg-muted">
        <div className="h-full bg-primary" style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
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
                  (selected ? "border-primary bg-primary/10" : "border-input bg-background hover:border-primary/40")
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
        {current < questions.length - 1 ? (
          <button
            onClick={() => setCurrent(current + 1)}
            disabled={!answered}
            className="rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-40"
          >
            Próxima
          </button>
        ) : (
          <button
            onClick={finalize}
            disabled={answeredCount < questions.length}
            className="rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-40"
          >
            Finalizar prova
          </button>
        )}
      </div>
    </div>
  );
}
