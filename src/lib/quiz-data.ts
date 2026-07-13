import { useSyncExternalStore } from "react";
import { course } from "./course-data";

export type QuizQuestion = {
  q: string;
  options: string[];
  correct: number;
  explain: string;
};

export type ModuleQuiz = {
  moduleId: string;
  title: string;
  passScore: number; // 0..1
  questions: QuizQuestion[];
};

// Bank of 5 questions per module — real, opinionated, PRD-aligned
const bank: Record<string, QuizQuestion[]> = {
  fundacoes: [
    {
      q: "Qual é a diferença central entre um Agent e um Workflow linear?",
      options: [
        "Agent usa mais tokens",
        "Agent decide o próximo passo dinamicamente com base no estado",
        "Workflow é sempre mais rápido",
        "Não há diferença prática",
      ],
      correct: 1,
      explain: "Agent = loop de decisão com ferramentas. Workflow = grafo fixo de passos.",
    },
    {
      q: "Skills e Tools se diferenciam principalmente por…",
      options: [
        "Skills são pacotes de instruções + arquivos; Tools são funções invocáveis",
        "Skills são pagas, Tools são grátis",
        "Não existe distinção formal",
        "Skills rodam no cliente e Tools no servidor",
      ],
      correct: 0,
      explain: "Skill empacota contexto + assets. Tool é uma função com schema.",
    },
    {
      q: "MCP serve para…",
      options: [
        "Compilar prompts em C++",
        "Padronizar como agentes conectam a fontes externas de contexto e ações",
        "Substituir REST",
        "Rodar modelos localmente",
      ],
      correct: 1,
      explain: "Model Context Protocol = interface padrão entre agentes e o mundo.",
    },
    {
      q: "Qual é o risco #1 de agent loops sem guarda?",
      options: ["Latência alta", "Custo explodir e loops infinitos", "UI feia", "SEO ruim"],
      correct: 1,
      explain: "Sem step-limit, budget e circuit-breaker, um agent pode custar milhares.",
    },
    {
      q: "O que caracteriza um 'app de elite' segundo o curso?",
      options: [
        "Interface bonita",
        "Ter agents, tools próprias, telemetria e pricing pensado desde dia 1",
        "Usar GPT-4",
        "Rodar em edge",
      ],
      correct: 1,
      explain: "Produto premium = arquitetura + monetização desde o início.",
    },
  ],
  arquitetura: [
    {
      q: "Onde deve rodar a chave de API do modelo?",
      options: ["No cliente", "Sempre no servidor", "Depende", "No git"],
      correct: 1,
      explain: "Nunca exponha a chave — proxy pelo backend.",
    },
    {
      q: "Streaming SSE serve para…",
      options: [
        "Fazer download de PDFs",
        "Entregar tokens conforme o modelo gera",
        "Autenticação",
        "Cache",
      ],
      correct: 1,
      explain: "SSE mantém canal aberto e faz tokens aparecerem em tempo real.",
    },
    {
      q: "Rate limiting deve ser feito em qual camada?",
      options: ["Apenas frontend", "Apenas modelo", "Edge/Gateway + por usuário", "Cron"],
      correct: 2,
      explain: "Edge por IP + por user_id no backend previne abuso.",
    },
    {
      q: "Vector DB é essencial quando…",
      options: [
        "Sempre",
        "Você tem conhecimento privado maior que a janela do modelo",
        "Nunca",
        "Só para chatbot",
      ],
      correct: 1,
      explain: "Se o contexto cabe no prompt, você não precisa de RAG.",
    },
    {
      q: "Idempotência em tool calls importa porque…",
      options: [
        "Deixa mais rápido",
        "Agents fazem retry — chamar 2x não pode duplicar ação",
        "Melhora SEO",
        "Não importa",
      ],
      correct: 1,
      explain: "Chave de idempotência evita cobrar duas vezes, enviar 2 emails, etc.",
    },
  ],
};

// generic fallback for modules without curated bank
function genericBank(mid: string, title: string): QuizQuestion[] {
  return [
    {
      q: `Qual o principal outcome do módulo "${title}"?`,
      options: [
        "Assistir vídeos",
        "Aplicar em um projeto real e destravar a próxima etapa",
        "Fazer anotações",
        "Ganhar XP",
      ],
      correct: 1,
      explain: "O curso é orientado a entregas, não a consumo passivo.",
    },
    {
      q: "Qual prática é sempre recomendada ao terminar uma aula?",
      options: [
        "Pular exercício",
        "Registrar o insight e completar o exercício",
        "Ir direto pra próxima",
        "Deletar as notas",
      ],
      correct: 1,
      explain: "Insight + entrega = retenção real.",
    },
    {
      q: "O que separa aluno mediano de aluno de elite?",
      options: ["Modelo pago", "Consistência + entrega pública", "Ferramenta", "Sorte"],
      correct: 1,
      explain: "Ritual + shipping semanal.",
    },
    {
      q: "Como usar o Concierge no chat de forma eficiente?",
      options: [
        "Perguntas vagas",
        "Contexto + objetivo + restrição",
        "Copiar erro sem explicar",
        "Nenhuma",
      ],
      correct: 1,
      explain: "Prompt de elite = contexto + goal + constraint.",
    },
    {
      q: `Ao dominar "${title}", o próximo passo natural é…`,
      options: [
        "Voltar ao módulo 1",
        "Aplicar no seu produto e publicar update",
        "Comprar outro curso",
        "Nada",
      ],
      correct: 1,
      explain: "Shipping fecha o ciclo.",
    },
  ];
}

export const quizzes: ModuleQuiz[] = course.modules.map((m) => ({
  moduleId: m.id,
  title: `Quiz — ${m.title}`,
  passScore: 0.7,
  questions: bank[m.id] ?? genericBank(m.id, m.title),
}));

export function getQuiz(moduleId: string) {
  return quizzes.find((q) => q.moduleId === moduleId);
}

// ---------- state ----------
type QuizResult = { score: number; total: number; passedAt: string };
type QuizState = Record<string, QuizResult>;
const KEY = "aiae:quiz-results:v1";

let __cachedRaw: string | null | undefined;
let __cachedValue: any = {};
function read(): QuizState {
  if (typeof window === "undefined") return __cachedValue;
  let raw: string | null;
  try { raw = window.localStorage.getItem(KEY); } catch { return __cachedValue; }
  if (raw === __cachedRaw) return __cachedValue;
  __cachedRaw = raw;
  try { __cachedValue = JSON.parse(raw ?? "{}"); } catch { __cachedValue = {}; }
  return __cachedValue;
}
function __invalidateCache(raw: string | null, value: any) { __cachedRaw = raw; __cachedValue = value; }
const listeners = new Set<() => void>();
function emit() {
  listeners.forEach((l) => l());
}
function subscribe(l: () => void) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}
function snapshot() {
  return read();
}

export function useQuizResults() {
  const state = useSyncExternalStore(subscribe, snapshot, snapshot));
  return {
    results: state,
    get(mid: string) {
      return state[mid];
    },
    save(mid: string, score: number, total: number) {
      const s = read();
      const prev = s[mid];
      const next: QuizResult = { score, total, passedAt: new Date().toISOString() };
      // keep best score
      if (!prev || score > prev.score) s[mid] = next;
      localStorage.setItem(KEY, JSON.stringify(s));
      emit();
    },
    reset(mid: string) {
      const s = read();
      delete s[mid];
      localStorage.setItem(KEY, JSON.stringify(s));
      emit();
    },
  };
}
