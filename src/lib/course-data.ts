export type Lesson = {
  id: string;
  title: string;
  duration: string; // e.g. "12:30"
  description: string;
};

export type Module = {
  id: string;
  number: number;
  title: string;
  tagline: string;
  summary: string;
  lessons: Lesson[];
};

export const course = {
  title: "AI App Empire",
  subtitle:
    "O sistema operacional para criar, publicar e escalar aplicativos com Agentes de IA, Skills, Tools e MCPs.",
  instructor: "Concierge de Elite",
  modules: [
    {
      id: "fundacoes",
      number: 1,
      title: "Fundações do Império",
      tagline: "Mentalidade, mercado e a arquitetura por trás de um AI App de elite.",
      summary:
        "Antes de escrever uma linha de código, você entende o jogo: como aplicativos de IA geram receita recorrente, quais nichos pagam premium e por que 90% dos builders fracassam.",
      lessons: [
        { id: "welcome", title: "Boas-vindas ao Império", duration: "08:12", description: "O que esperar, como estudar, como extrair 10x." },
        { id: "landscape", title: "O mapa do mercado de AI Apps em 2026", duration: "22:04", description: "Categorias, players, oceanos azuis." },
        { id: "positioning", title: "Posicionamento premium", duration: "18:47", description: "Por que cobrar 10x mais e ser escolhido." },
        { id: "stack", title: "Sua stack de elite", duration: "14:20", description: "Modelos, orquestradores, deploy, billing." },
      ],
    },
    {
      id: "agentes",
      number: 2,
      title: "Agentes que Pensam",
      tagline: "Do prompt básico ao agente autônomo com memória, planejamento e ferramentas.",
      summary:
        "Você constrói agentes reais: sistema de memória, loops de planejamento, autoavaliação e handoff. Sai daqui com um agente rodando.",
      lessons: [
        { id: "anatomy", title: "Anatomia de um agente", duration: "16:55", description: "Percepção, plano, ação, reflexão." },
        { id: "memory", title: "Memória curta, longa e episódica", duration: "24:11", description: "Vetorial, KV, resumo hierárquico." },
        { id: "planning", title: "Loops de planejamento", duration: "19:38", description: "ReAct, Plan-and-Execute, Reflexion." },
        { id: "eval", title: "Avaliação e guardrails", duration: "21:02", description: "Como medir e travar o comportamento." },
      ],
    },
    {
      id: "skills-tools-mcp",
      number: 3,
      title: "Skills, Tools & MCPs",
      tagline: "A camada que transforma um chatbot em um app de verdade.",
      summary:
        "Skills modulares, Tools tipadas e integração MCP para plugar seu agente em qualquer sistema — Stripe, Notion, GitHub, seu banco.",
      lessons: [
        { id: "skills", title: "Skills como unidades de valor", duration: "17:44", description: "Contratos, versionamento, composição." },
        { id: "tools", title: "Tools tipadas e seguras", duration: "20:10", description: "Schemas, validação, retries." },
        { id: "mcp", title: "MCP na prática", duration: "26:33", description: "Servidor, cliente, transporte, produção." },
        { id: "compose", title: "Compondo um app real", duration: "29:18", description: "Do zero ao app publicado." },
      ],
    },
    {
      id: "publicar",
      number: 4,
      title: "Publicar & Escalar",
      tagline: "Landing, billing, analytics e o motor de aquisição.",
      summary:
        "Publicação em stores, cobrança recorrente, analytics de retenção e o playbook de lançamento que fez alunos baterem 6 dígitos.",
      lessons: [
        { id: "landing", title: "Landing que converte", duration: "18:22", description: "Estrutura, prova, oferta." },
        { id: "billing", title: "Billing recorrente sem dor", duration: "15:47", description: "Stripe, upgrades, dunning." },
        { id: "analytics", title: "Métricas que importam", duration: "17:05", description: "Activation, retention, expansion." },
        { id: "launch", title: "Playbook de lançamento", duration: "31:40", description: "60 dias, dia a dia." },
      ],
    },
  ] as Module[],
};

export function findModule(id: string): Module | undefined {
  return course.modules.find((m) => m.id === id);
}

export function findLesson(moduleId: string, lessonId: string) {
  const mod = findModule(moduleId);
  if (!mod) return undefined;
  const lesson = mod.lessons.find((l) => l.id === lessonId);
  if (!lesson) return undefined;
  const index = mod.lessons.indexOf(lesson);
  return {
    module: mod,
    lesson,
    prev: mod.lessons[index - 1],
    next: mod.lessons[index + 1],
  };
}

export const totalLessons = course.modules.reduce((n, m) => n + m.lessons.length, 0);
