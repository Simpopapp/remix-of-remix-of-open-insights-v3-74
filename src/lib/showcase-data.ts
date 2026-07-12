export type ShowcaseProject = {
  id: string;
  name: string;
  tagline: string;
  author: string;
  avatar: string;
  category: "SaaS" | "Agência" | "Consumer" | "Ferramenta" | "Vertical";
  stage: "Ideia" | "MVP" | "Live" | "Pagando" | "Escalando";
  mrr: number;
  users: number;
  likes: number;
  stack: string[];
  story: string;
  cover: string; // gradient class
};

export const projects: ShowcaseProject[] = [
  {
    id: "veredito-ai",
    name: "Veredito.ai",
    tagline: "Copiloto jurídico para escritórios boutique",
    author: "Marina L.",
    avatar: "M",
    category: "Vertical",
    stage: "Pagando",
    mrr: 8400,
    users: 47,
    likes: 132,
    stack: ["Agents", "MCP Docs", "Postgres", "Stripe"],
    story:
      "Comecei na semana 3 do curso. Vendi para o primeiro escritório antes de existir código, entreguei em 21 dias.",
    cover: "from-amber-500/30 to-primary/20",
  },
  {
    id: "atelier",
    name: "Atelier Concierge",
    tagline: "Agente de personal shopping para lojas de luxo",
    author: "Bruno K.",
    avatar: "B",
    category: "Vertical",
    stage: "Live",
    mrr: 2100,
    users: 12,
    likes: 88,
    stack: ["Agent", "Skills", "Shopify MCP"],
    story: "Piloto com 3 lojas em SP. Cada loja paga R$700/mês. Contrato anual.",
    cover: "from-purple-500/25 to-primary/20",
  },
  {
    id: "cortex-cro",
    name: "Cortex CRO",
    tagline: "Agente que roda experimentos de conversão sozinho",
    author: "Ana R.",
    avatar: "A",
    category: "SaaS",
    stage: "Escalando",
    mrr: 21400,
    users: 118,
    likes: 267,
    stack: ["Multi-agent", "PostHog MCP", "Edge"],
    story: "MRR 21.4k em 5 meses. Churn <3%. Contratando 2 devs.",
    cover: "from-emerald-500/25 to-primary/20",
  },
  {
    id: "olho-clinica",
    name: "Olho Clínica",
    tagline: "Prontuário conversacional para oftalmologistas",
    author: "Dr. Felipe S.",
    avatar: "F",
    category: "Vertical",
    stage: "MVP",
    mrr: 0,
    users: 4,
    likes: 41,
    stack: ["Whisper", "Agent", "HL7 tool"],
    story: "4 clínicas em piloto. Lançamento comercial na semana 10.",
    cover: "from-cyan-500/25 to-primary/20",
  },
  {
    id: "notario",
    name: "Notário",
    tagline: "Automação de cartórios com agents de OCR + validação",
    author: "Ricardo P.",
    avatar: "R",
    category: "Agência",
    stage: "Pagando",
    mrr: 15200,
    users: 6,
    likes: 94,
    stack: ["OCR", "Agent chain", "n8n MCP"],
    story: "6 cartórios. Contrato de setup 15k + 2.5k/mês recorrente.",
    cover: "from-rose-500/25 to-primary/20",
  },
  {
    id: "mise",
    name: "Mise",
    tagline: "Sous chef de IA para restaurantes de fine dining",
    author: "Camila F.",
    avatar: "C",
    category: "Consumer",
    stage: "Live",
    mrr: 3800,
    users: 22,
    likes: 156,
    stack: ["Voice", "Agent", "Custom tool"],
    story: "Rodando em 4 restaurantes 1-estrela. Contrato anual.",
    cover: "from-orange-500/25 to-primary/20",
  },
];
