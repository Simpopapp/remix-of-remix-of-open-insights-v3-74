export type Chapter = { time: string; title: string };
export type CodeSnippet = { lang: string; title: string; code: string };
export type Resource = { type: "PDF" | "Repo" | "Link" | "Template" | "Slides"; title: string; href?: string };
export type Exercise = {
  title: string;
  brief: string;
  deliverable: string;
  hints: string[];
  difficulty: "Fácil" | "Média" | "Difícil" | "Elite";
};

export type Lesson = {
  id: string;
  title: string;
  duration: string; // "mm:ss"
  description: string;
  keyPoints: string[];
  chapters: Chapter[];
  transcript: string;
  code?: CodeSnippet;
  resources: Resource[];
  exercise: Exercise;
};

export type Module = {
  id: string;
  number: number;
  title: string;
  tagline: string;
  summary: string;
  outcomes: string[];
  lessons: Lesson[];
};

// ---------- helpers to keep the file readable ----------
const L = (
  id: string,
  title: string,
  duration: string,
  description: string,
  extras: Omit<Lesson, "id" | "title" | "duration" | "description">,
): Lesson => ({ id, title, duration, description, ...extras });

// ============================================================
// CURRÍCULO COMPLETO — AI APP EMPIRE
// 8 módulos · 40 aulas · conteúdo real e executável
// ============================================================

export const course = {
  title: "AI App Empire",
  subtitle:
    "O sistema operacional para criar, publicar e escalar aplicativos com Agentes de IA, Skills, Tools e MCPs.",
  instructor: "Concierge de Elite",
  cohort: "Cohort 01 · 2026",
  modules: [
    // ─────────────────────────── MÓDULO 1 ───────────────────────────
    {
      id: "fundacoes",
      number: 1,
      title: "Fundações do Império",
      tagline: "Mentalidade, mercado e a arquitetura por trás de um AI App de elite.",
      summary:
        "Antes de escrever uma linha de código, você entende o jogo: como AI apps geram receita recorrente, quais nichos pagam premium e por que 90% dos builders travam no MVP.",
      outcomes: [
        "Mapear 3 nichos com CAC baixo e LTV alto",
        "Definir seu posicionamento premium em uma frase",
        "Escolher a stack técnica correta para seu contexto",
        "Estabelecer as métricas de sucesso do seu projeto",
      ],
      lessons: [
        L("welcome", "Boas-vindas ao Império", "08:12",
          "O que esperar do curso, como estudar em ritmo de elite e como extrair 10x de valor.", {
          keyPoints: [
            "Ritual de estudo: 3 blocos de 45min + 1 build session semanal",
            "Regra dos 24h: aplicou em 24h ou o conteúdo evapora",
            "Grupo da cohort é seu unfair advantage",
          ],
          chapters: [
            { time: "00:00", title: "Boas-vindas" },
            { time: "01:30", title: "Como o curso funciona" },
            { time: "03:45", title: "Ritual de estudo" },
            { time: "06:10", title: "Próximos passos" },
          ],
          transcript:
            "Bem-vindo ao AI App Empire. Este não é mais um curso de IA — é um sistema operacional para construir, publicar e escalar aplicativos com agentes. Nas próximas semanas você vai sair do estágio de 'brincando com prompts' para 'operando um produto que gera receita recorrente'. A promessa é simples: em 16 semanas, você terá pelo menos um AI app publicado, cobrando, e rodando com agentes reais em produção. Para isso funcionar, o ritual importa mais que a inspiração.",
          resources: [
            { type: "PDF", title: "Manual do aluno · 12 páginas" },
            { type: "Template", title: "Notion — trilha de 16 semanas" },
          ],
          exercise: {
            title: "Compromisso público",
            brief:
              "Escreva em uma frase o AI app que você quer ter publicado ao final da cohort e poste no canal #builds.",
            deliverable: "Post no canal #builds com sua meta.",
            hints: [
              "Seja específico: público, problema, formato",
              "Use o padrão: 'Estou construindo X para Y resolverem Z'",
            ],
            difficulty: "Fácil",
          },
        }),
        L("landscape", "O mapa do mercado de AI Apps em 2026", "22:04",
          "Categorias, players dominantes, oceanos azuis e onde o dinheiro realmente está.", {
          keyPoints: [
            "5 categorias com CAGR > 40% em 2026",
            "Verticais > Horizontais em ticket médio",
            "Agentes internos B2B pagam 10x mais que consumer",
          ],
          chapters: [
            { time: "00:00", title: "As 5 categorias que importam" },
            { time: "04:20", title: "Vertical vs horizontal" },
            { time: "10:15", title: "Oceanos azuis reais" },
            { time: "16:40", title: "Análise: 10 apps de 6 dígitos" },
          ],
          transcript:
            "O mercado de AI apps em 2026 tem cinco categorias que realmente movimentam capital: agentes verticais B2B, copilotos de operação, apps de criação de conteúdo premium, plataformas de automação com humano no loop e ferramentas de dev. Vamos abrir cada uma com dados reais: MRR médio, CAC, LTV e as barreiras de entrada. Você vai ver por que apps horizontais viraram commodity e por que verticais ainda pagam prêmio de 10x.",
          resources: [
            { type: "Slides", title: "Deck — mapa do mercado" },
            { type: "PDF", title: "Planilha — 50 apps analisados" },
          ],
          exercise: {
            title: "Análise de nicho",
            brief:
              "Escolha 3 nichos verticais e preencha o quadro: dor, willingness to pay, competição, sua vantagem.",
            deliverable: "Planilha com 3 nichos ranqueados.",
            hints: [
              "Comece pelo nicho onde você já tem network",
              "Willingness to pay > tamanho de mercado no início",
            ],
            difficulty: "Média",
          },
        }),
        L("positioning", "Posicionamento premium", "18:47",
          "Por que cobrar 10x mais, como ancorar valor e ser a escolha óbvia do seu ICP.", {
          keyPoints: [
            "Preço define percepção antes do produto",
            "Ancoragem: sempre mostre um plano acima",
            "ICP < 200 pessoas > mercado inteiro",
          ],
          chapters: [
            { time: "00:00", title: "A economia do prêmio" },
            { time: "05:00", title: "Framework de posicionamento" },
            { time: "11:30", title: "3 estudos de caso" },
          ],
          transcript:
            "Posicionamento premium não é sobre features — é sobre para quem você diz não. O framework é simples: escolha um ICP menor que 200 pessoas nomeáveis, resolva uma dor que custa mais de 5 mil dólares por mês para elas, e cobre um preço que reflita esse valor. Vamos passar por três casos reais: um agente de compliance jurídico ($2k/mês), um copiloto para founders ($497/mês) e um app de research ($197/mês).",
          resources: [
            { type: "Template", title: "One-pager de posicionamento" },
          ],
          exercise: {
            title: "Sua frase de posicionamento",
            brief:
              "Preencha: 'Eu ajudo [ICP] a [resultado] através de [mecanismo], diferente de [alternativa].'",
            deliverable: "Frase colada no canal #builds.",
            hints: ["ICP mais específico ganha", "Mecanismo é o seu unfair advantage"],
            difficulty: "Média",
          },
        }),
        L("stack", "Sua stack de elite", "14:20",
          "Modelos, orquestradores, deploy, billing — o kit mínimo para operar em 2026.", {
          keyPoints: [
            "Modelo primário + fallback + local",
            "Orquestração > framework hype",
            "Edge deploy é padrão, não opcional",
          ],
          chapters: [
            { time: "00:00", title: "Camadas da stack" },
            { time: "04:10", title: "Modelos: primário, fallback, local" },
            { time: "08:30", title: "Deploy e billing" },
          ],
          transcript:
            "Uma stack de elite tem 6 camadas: modelo (Claude/GPT/Gemini + fallback), orquestração (código próprio > frameworks pesados), memória (Postgres + pgvector), execução de tools (com timeout e retries), deploy (edge por padrão) e billing (Stripe do dia 1). Tudo o que sai desse escopo é distração no primeiro ano.",
          code: {
            lang: "ts",
            title: "Cliente com fallback multi-modelo",
            code: `import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";

const anthropic = new Anthropic();
const openai = new OpenAI();

export async function llm(prompt: string) {
  try {
    const r = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });
    return r.content[0].type === "text" ? r.content[0].text : "";
  } catch (err) {
    console.warn("primary failed, falling back", err);
    const r = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
    });
    return r.choices[0].message.content ?? "";
  }
}`,
          },
          resources: [
            { type: "Repo", title: "Boilerplate — stack mínima" },
            { type: "PDF", title: "Checklist de decisões técnicas" },
          ],
          exercise: {
            title: "Sua stack em uma página",
            brief:
              "Documente cada camada com a escolha, alternativa considerada e o porquê.",
            deliverable: "Doc de 1 página no repositório.",
            hints: ["Decisões viram ADRs", "Fallback é obrigatório, não bônus"],
            difficulty: "Média",
          },
        }),
        L("mindset", "Mentalidade de operador", "12:35",
          "Como pensar como quem opera receita, não como quem faz side project.", {
          keyPoints: [
            "Métrica única semanal > checklist infinita",
            "Envie diariamente, mesmo o feio",
            "Cliente > código bonito",
          ],
          chapters: [
            { time: "00:00", title: "Operador vs artesão" },
            { time: "04:00", title: "Ritmo diário" },
            { time: "08:20", title: "Anti-padrões" },
          ],
          transcript:
            "A diferença entre um builder que fatura e um que fica no MVP eterno é uma coisa só: ritmo de envio. Operadores enviam algo todo dia — landing, feature, e-mail, ligação. Artesãos polem por semanas e nunca cobram. Vamos definir seu ritmo diário de operador.",
          resources: [
            { type: "Template", title: "Diário do operador (Notion)" },
          ],
          exercise: {
            title: "Ritmo diário",
            brief:
              "Defina sua métrica única da próxima semana e o envio mínimo diário.",
            deliverable: "Post no #builds com a métrica + envio.",
            hints: ["Escolha algo mensurável em número", "Envio < 30 min"],
            difficulty: "Fácil",
          },
        }),
      ],
    },

    // ─────────────────────────── MÓDULO 2 ───────────────────────────
    {
      id: "agentes",
      number: 2,
      title: "Agentes que Pensam",
      tagline: "Do prompt básico ao agente autônomo com memória, planejamento e ferramentas.",
      summary:
        "Você constrói agentes reais: sistema de memória, loops de planejamento, autoavaliação, handoff. Ao final, um agente executável rodando no seu terminal.",
      outcomes: [
        "Implementar um loop ReAct do zero",
        "Projetar memória curta, longa e episódica",
        "Definir guardrails de segurança e custo",
        "Avaliar seu agente com métricas objetivas",
      ],
      lessons: [
        L("anatomy", "Anatomia de um agente", "16:55",
          "Percepção, plano, ação, reflexão — os 4 loops que todo agente sério tem.", {
          keyPoints: [
            "Todo agente é um while() com contexto crescente",
            "Reflexão é onde a inteligência aparece",
            "Sem stop conditions, você quebra o cartão",
          ],
          chapters: [
            { time: "00:00", title: "O loop mínimo" },
            { time: "05:20", title: "Percepção e plano" },
            { time: "10:00", title: "Ação e reflexão" },
            { time: "13:30", title: "Stop conditions" },
          ],
          transcript:
            "Um agente é um loop de quatro passos: percebe o estado do mundo, planeja o próximo passo, executa uma ação através de uma tool, e reflete sobre o resultado antes de repetir. A diferença entre um agente amador e um agente de elite está no passo 4: reflexão explícita, com auto-crítica escrita antes da próxima ação.",
          code: {
            lang: "ts",
            title: "Loop de agente mínimo",
            code: `export async function runAgent(goal: string, maxSteps = 8) {
  const history: string[] = [\`GOAL: \${goal}\`];
  for (let step = 0; step < maxSteps; step++) {
    const plan = await llm(\`Contexto:\\n\${history.join("\\n")}\\n\\nProponha próxima ação.\`);
    history.push(\`PLAN: \${plan}\`);
    const action = await parseAction(plan);
    if (action.type === "done") return action.output;
    const result = await execute(action);
    history.push(\`RESULT: \${result}\`);
    const critique = await llm(\`Critique este resultado em 1 frase:\\n\${result}\`);
    history.push(\`CRITIQUE: \${critique}\`);
  }
  throw new Error("Max steps exceeded");
}`,
          },
          resources: [
            { type: "Repo", title: "agent-minimal · TypeScript" },
            { type: "PDF", title: "Diagrama dos 4 loops" },
          ],
          exercise: {
            title: "Seu primeiro loop",
            brief: "Implemente o loop com uma tool fake (echo) e teste com 3 goals.",
            deliverable: "Repo no GitHub + gist com output dos 3 runs.",
            hints: ["Comece SEM reflexão, depois adicione", "Log cada passo"],
            difficulty: "Média",
          },
        }),
        L("memory", "Memória curta, longa e episódica", "24:11",
          "Vetorial, KV, resumo hierárquico — como não estourar contexto nem esquecer o cliente.", {
          keyPoints: [
            "3 camadas: working, semantic, episodic",
            "Resumo hierárquico > truncamento",
            "pgvector cobre 90% dos casos",
          ],
          chapters: [
            { time: "00:00", title: "Por que memória importa" },
            { time: "06:00", title: "Working memory" },
            { time: "12:30", title: "Memória semântica (vetores)" },
            { time: "18:40", title: "Memória episódica" },
          ],
          transcript:
            "Agentes esquecem. E quando esquecem o cliente, você perde receita. A solução é ter três camadas: working memory (últimos N turnos, sempre no prompt), memória semântica (embeddings dos fatos importantes, buscados por similaridade), e memória episódica (resumos de sessões passadas com timestamps). Vamos implementar as três com Postgres e pgvector.",
          code: {
            lang: "sql",
            title: "Schema mínimo com pgvector",
            code: `create extension if not exists vector;

create table memories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  kind text not null check (kind in ('working','semantic','episodic')),
  content text not null,
  embedding vector(1536),
  created_at timestamptz default now()
);

create index on memories using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);`,
          },
          resources: [
            { type: "Repo", title: "memory-lab · exemplos" },
          ],
          exercise: {
            title: "Agente com memória",
            brief: "Adicione as 3 camadas ao seu agente da aula anterior.",
            deliverable: "Repo atualizado + demo de 5 turnos.",
            hints: ["Comece com working, depois semantic", "Resumo automático a cada 10 turnos"],
            difficulty: "Difícil",
          },
        }),
        L("planning", "Loops de planejamento", "19:38",
          "ReAct, Plan-and-Execute, Reflexion — qual usar quando.", {
          keyPoints: [
            "ReAct: rápido, para tools simples",
            "Plan-and-Execute: para goals complexos",
            "Reflexion: quando qualidade > custo",
          ],
          chapters: [
            { time: "00:00", title: "As 3 famílias" },
            { time: "05:00", title: "ReAct passo a passo" },
            { time: "11:00", title: "Plan-and-Execute" },
            { time: "15:30", title: "Reflexion" },
          ],
          transcript:
            "Planejamento é o que separa um chatbot de um agente. Três padrões dominam: ReAct para reasoning entrelaçado com ações, Plan-and-Execute para tarefas longas que se beneficiam de um plano global, e Reflexion para tarefas onde a qualidade da resposta importa mais que latência.",
          resources: [{ type: "PDF", title: "Cheatsheet dos 3 padrões" }],
          exercise: {
            title: "Comparação empírica",
            brief: "Rode a mesma tarefa nos 3 padrões e compare custo, tempo e qualidade.",
            deliverable: "Tabela com métricas + análise.",
            hints: ["Use a mesma tool", "Meça tokens explicitamente"],
            difficulty: "Difícil",
          },
        }),
        L("eval", "Avaliação e guardrails", "21:02",
          "Como medir seu agente com métricas objetivas e travar comportamentos perigosos.", {
          keyPoints: [
            "Golden set > eyeballing",
            "Guardrails em 3 camadas: input, tool, output",
            "Custo por task é métrica de negócio",
          ],
          chapters: [
            { time: "00:00", title: "Métricas que importam" },
            { time: "06:30", title: "Construindo seu golden set" },
            { time: "13:00", title: "Guardrails práticos" },
          ],
          transcript:
            "Você não pode melhorar o que não mede. Todo agente sério tem um golden set de 20-100 casos com respostas esperadas, rodado no CI a cada mudança. Vamos construir o seu do zero e ligar em CI com falha automática quando a taxa cai.",
          code: {
            lang: "ts",
            title: "Guardrail de tool com timeout",
            code: `export async function safeExec<T>(fn: () => Promise<T>, ms = 15000): Promise<T> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  try {
    return await Promise.race([
      fn(),
      new Promise<never>((_, rej) =>
        ctrl.signal.addEventListener("abort", () => rej(new Error("timeout")))
      ),
    ]);
  } finally {
    clearTimeout(timer);
  }
}`,
          },
          resources: [
            { type: "Template", title: "Planilha de golden set" },
            { type: "Repo", title: "agent-eval · runner" },
          ],
          exercise: {
            title: "Golden set + CI",
            brief: "Crie 20 casos e um script que rode e reporte a taxa de acerto.",
            deliverable: "Repo com CI verde + tabela de resultados.",
            hints: ["Casos difíceis primeiro", "Compare 2 modelos"],
            difficulty: "Elite",
          },
        }),
        L("handoff", "Handoff e orquestração multi-agente", "17:44",
          "Quando dividir em múltiplos agentes e como coordenar sem virar caos.", {
          keyPoints: [
            "1 agente sempre que possível",
            "Handoff só com contrato tipado",
            "Supervisor + workers > mesh caótico",
          ],
          chapters: [
            { time: "00:00", title: "Quando dividir?" },
            { time: "05:40", title: "Padrão supervisor" },
            { time: "12:00", title: "Contratos entre agentes" },
          ],
          transcript:
            "A tentação de criar 8 agentes coordenando entre si é enorme e quase sempre errada. A regra: comece com um agente e só divida quando um workflow específico exigir contexto ou skill radicalmente diferente. Quando dividir, use o padrão supervisor.",
          resources: [{ type: "Repo", title: "multi-agent-supervisor" }],
          exercise: {
            title: "Supervisor + 2 workers",
            brief: "Construa um supervisor que delega para 2 workers especializados.",
            deliverable: "Repo + demo em vídeo (2 min).",
            hints: ["Contrato zod entre eles", "Log da conversa completa"],
            difficulty: "Elite",
          },
        }),
      ],
    },

    // ─────────────────────────── MÓDULO 3 ───────────────────────────
    {
      id: "skills-tools-mcp",
      number: 3,
      title: "Skills, Tools & MCPs",
      tagline: "A camada que transforma um chatbot em um app de verdade.",
      summary:
        "Skills modulares, tools tipadas e integração MCP para plugar seu agente em qualquer sistema — Stripe, Notion, GitHub, seu banco.",
      outcomes: [
        "Projetar skills componíveis com contrato",
        "Implementar tools tipadas com Zod",
        "Rodar um servidor MCP em produção",
        "Compor um app real end-to-end",
      ],
      lessons: [
        L("skills", "Skills como unidades de valor", "17:44",
          "Contratos, versionamento, composição — skills que você reusa em 10 apps.", {
          keyPoints: [
            "Skill = input + output + side effect declarado",
            "Versione como API pública",
            "Composição > herança",
          ],
          chapters: [
            { time: "00:00", title: "O que é uma skill" },
            { time: "05:30", title: "Contrato de skill" },
            { time: "11:00", title: "Composição" },
          ],
          transcript:
            "Uma skill é a menor unidade reutilizável do seu agente. Ela tem um contrato explícito: o que recebe, o que retorna, quais side effects causa. Skills bem projetadas viram seu ativo — você reusa entre projetos e evolui isoladamente.",
          code: {
            lang: "ts",
            title: "Contrato de skill",
            code: `import { z } from "zod";

export const summarizeSkill = {
  name: "summarize",
  version: "1.2.0",
  input: z.object({ text: z.string().min(50), maxWords: z.number().default(120) }),
  output: z.object({ summary: z.string(), bullets: z.array(z.string()) }),
  sideEffects: [] as const,
  run: async (input: { text: string; maxWords: number }) => {
    const raw = await llm(\`Resuma em até \${input.maxWords} palavras:\\n\${input.text}\`);
    return { summary: raw, bullets: raw.split("\\n").filter(Boolean) };
  },
};`,
          },
          resources: [{ type: "Repo", title: "skills-kit · 20 skills prontas" }],
          exercise: {
            title: "3 skills reusáveis",
            brief: "Implemente 3 skills com contrato Zod + testes.",
            deliverable: "Repo com testes verdes.",
            hints: ["Comece pelas mais chatas de reescrever", "Documente side effects"],
            difficulty: "Média",
          },
        }),
        L("tools", "Tools tipadas e seguras", "20:10",
          "Schemas, validação, retries, timeouts — tools que não quebram em produção.", {
          keyPoints: [
            "Schema define, código executa",
            "Retries com backoff exponencial",
            "Timeout obrigatório",
          ],
          chapters: [
            { time: "00:00", title: "Anatomia de uma tool" },
            { time: "06:00", title: "Schema com Zod" },
            { time: "12:00", title: "Retries e circuit breaker" },
          ],
          transcript:
            "Tools são a interface entre o agente e o mundo. Cada tool precisa de schema tipado, validação de entrada, timeout, retry com backoff e log estruturado. Sem isso, você depura no cliente.",
          code: {
            lang: "ts",
            title: "Tool com retry",
            code: `export async function withRetry<T>(fn: () => Promise<T>, tries = 3): Promise<T> {
  let last: unknown;
  for (let i = 0; i < tries; i++) {
    try { return await fn(); }
    catch (e) { last = e; await new Promise(r => setTimeout(r, 2 ** i * 400)); }
  }
  throw last;
}`,
          },
          resources: [{ type: "Repo", title: "tools-lab" }],
          exercise: {
            title: "Tool de produção",
            brief: "Escreva uma tool que chama API externa com retry, timeout e log.",
            deliverable: "Código + teste de falha simulada.",
            hints: ["Simule 500 com msw", "Mede latência p95"],
            difficulty: "Difícil",
          },
        }),
        L("mcp", "MCP na prática", "26:33",
          "Model Context Protocol: servidor, cliente, transporte, uso em produção.", {
          keyPoints: [
            "MCP = USB-C para IA",
            "Servidor stateless > stateful",
            "Auth acontece no transporte",
          ],
          chapters: [
            { time: "00:00", title: "Por que MCP" },
            { time: "06:00", title: "Servidor MCP" },
            { time: "14:00", title: "Cliente e transporte" },
            { time: "21:00", title: "Deploy" },
          ],
          transcript:
            "MCP é o protocolo que padroniza como agentes se conectam a ferramentas e dados. Em vez de escrever adapters, você expõe suas tools em um servidor MCP e qualquer cliente compatível consome. Vamos rodar um servidor real do zero.",
          code: {
            lang: "ts",
            title: "MCP server mínimo",
            code: `import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

const server = new McpServer({ name: "empire-mcp", version: "0.1.0" });

server.tool(
  "search_customer",
  { email: z.string().email() },
  async ({ email }) => {
    const c = await db.customer.findUnique({ where: { email } });
    return { content: [{ type: "text", text: JSON.stringify(c) }] };
  }
);

await server.start();`,
          },
          resources: [{ type: "Repo", title: "mcp-empire · servidor + cliente" }],
          exercise: {
            title: "Seu MCP server",
            brief: "Exponha 3 tools reais do seu domínio via MCP.",
            deliverable: "Repo + vídeo de 2 min conectando via Claude Desktop.",
            hints: ["Auth via header", "Log de todas as chamadas"],
            difficulty: "Elite",
          },
        }),
        L("compose", "Compondo um app real", "29:18",
          "Do zero ao app publicado: juntando skills, tools e MCPs em produto.", {
          keyPoints: [
            "Domain-first > tech-first",
            "1 fluxo end-to-end antes de N",
            "Cobrança do dia 1",
          ],
          chapters: [
            { time: "00:00", title: "Escopo do app" },
            { time: "07:00", title: "Arquitetura" },
            { time: "16:00", title: "Live coding" },
            { time: "25:00", title: "Deploy" },
          ],
          transcript:
            "Vamos construir juntos um app real: um assistente de research que recebe uma pergunta, planeja, busca em várias fontes via MCP, sintetiza e entrega um relatório. Do repo vazio ao deploy em produção em 30 minutos.",
          resources: [
            { type: "Repo", title: "research-agent · projeto completo" },
            { type: "Slides", title: "Arquitetura em 6 slides" },
          ],
          exercise: {
            title: "Seu app v0",
            brief: "Escolha um fluxo do seu app e leve-o end-to-end até deploy.",
            deliverable: "URL público + repo.",
            hints: ["Um fluxo, ponta a ponta", "Cobra R$ 1 pra validar Stripe"],
            difficulty: "Elite",
          },
        }),
        L("integrations", "Integrações que importam", "18:20",
          "Stripe, Slack, Notion, GitHub — as 4 integrações que 90% dos AI apps precisam.", {
          keyPoints: [
            "Stripe: cobre 95% do billing",
            "Slack: canal do agente falar",
            "Notion/Linear: onde o time vive",
          ],
          chapters: [
            { time: "00:00", title: "As 4 essenciais" },
            { time: "05:00", title: "Padrão de auth" },
            { time: "12:00", title: "Webhooks seguros" },
          ],
          transcript:
            "Existem quatro integrações que aparecem em quase todo AI app B2B: Stripe (dinheiro), Slack (comunicação), Notion ou Linear (trabalho) e GitHub (código). Vamos ver o padrão de auth e webhook para cada uma.",
          resources: [{ type: "Repo", title: "integrations-starter" }],
          exercise: {
            title: "Uma integração completa",
            brief: "Implemente uma integração com auth + webhook verificado + retry.",
            deliverable: "PR no repo starter + doc.",
            hints: ["Comece pelo webhook", "Verifica assinatura!"],
            difficulty: "Difícil",
          },
        }),
      ],
    },

    // ─────────────────────────── MÓDULO 4 ───────────────────────────
    {
      id: "ux",
      number: 4,
      title: "UX de Produtos com IA",
      tagline: "Design de interfaces onde o agente é o produto — e não um chatbot no canto.",
      summary:
        "IA muda tudo em UX: streaming, incerteza, falha graceful, human-in-the-loop. Você aprende o vocabulário visual e os padrões que fazem seu app parecer premium.",
      outcomes: [
        "Aplicar 8 padrões de UX específicos para IA",
        "Projetar streaming, loading e erro com elegância",
        "Desenhar o loop human-in-the-loop",
        "Testar com 5 usuários antes de escalar",
      ],
      lessons: [
        L("patterns", "8 padrões de UX para IA", "19:30",
          "Streaming, sugestões, retry, edit-in-place — o vocabulário visual da IA moderna.", {
          keyPoints: [
            "Streaming tokens > loader",
            "Ações sugeridas > campo em branco",
            "Undo é mandatório",
          ],
          chapters: [
            { time: "00:00", title: "Os 8 padrões" },
            { time: "08:00", title: "Streaming" },
            { time: "14:00", title: "Sugestões e undo" },
          ],
          transcript:
            "IA quebra padrões clássicos de UX: latência é maior, output é probabilístico, falha é comum. Os 8 padrões que compensam isso: streaming, chunk progressivo, ações sugeridas, edit-in-place, undo, explicabilidade, confiança visível e handoff pro humano.",
          resources: [{ type: "PDF", title: "Cheatsheet dos 8 padrões" }],
          exercise: {
            title: "Auditoria dos 8",
            brief: "Analise seu app (ou um concorrente) e diga quais padrões faltam.",
            deliverable: "Doc com print + análise.",
            hints: ["Foco no fluxo principal", "1 padrão por vez"],
            difficulty: "Média",
          },
        }),
        L("streaming", "Streaming que parece mágica", "16:12",
          "Como implementar streaming visual de qualidade sem drama técnico.", {
          keyPoints: [
            "SSE > websocket para 90% dos casos",
            "Frame budget: <100ms por chunk",
            "Cursor pulsante > spinner",
          ],
          chapters: [
            { time: "00:00", title: "Streaming: server e client" },
            { time: "07:00", title: "Renderização suave" },
            { time: "12:00", title: "Erros no meio do stream" },
          ],
          transcript:
            "Streaming é o detalhe que faz seu app parecer 10x mais premium. A técnica é boring: SSE do servidor, ReadableStream no cliente, renderização progressiva com throttle de 16ms. O que importa é o cuidado com erros no meio do stream e retry sem perder o que já veio.",
          code: {
            lang: "ts",
            title: "SSE handler",
            code: `export async function* streamLLM(prompt: string) {
  const res = await fetch("/api/llm", { method: "POST", body: JSON.stringify({ prompt }) });
  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    yield decoder.decode(value);
  }
}`,
          },
          resources: [{ type: "Repo", title: "sse-starter-tanstack" }],
          exercise: {
            title: "Streaming end-to-end",
            brief: "Substitua um loading spinner do seu app por streaming real.",
            deliverable: "Vídeo antes/depois + código.",
            hints: ["Cursor pulsante", "Throttle 16ms"],
            difficulty: "Difícil",
          },
        }),
        L("errors", "Falha graceful e retry", "13:45",
          "IA falha. Ponto. Como transformar falha em oportunidade de confiança.", {
          keyPoints: [
            "Erros nunca são silenciosos",
            "Retry óbvio > refresh cego",
            "Copywriting do erro importa",
          ],
          chapters: [
            { time: "00:00", title: "Taxonomia de erros" },
            { time: "05:00", title: "UI de retry" },
            { time: "10:00", title: "Copy do erro" },
          ],
          transcript:
            "Todo AI app vai falhar. A pergunta é: seu usuário sai frustrado ou impressionado com como você lida? Vamos ver a taxonomia de erros (LLM timeout, tool falhou, output inválido, quota) e a UI + copy para cada um.",
          resources: [{ type: "Template", title: "Copy pack — mensagens de erro" }],
          exercise: {
            title: "5 erros, 5 respostas",
            brief: "Mapeie 5 tipos de erro no seu app e desenhe UI + copy.",
            deliverable: "Figma ou storybook.",
            hints: ["Erros do LLM primeiro", "Sempre ofereça próxima ação"],
            difficulty: "Média",
          },
        }),
        L("hitl", "Human in the loop", "20:00",
          "Quando pedir confirmação, quando não, e como fazer isso sem irritar.", {
          keyPoints: [
            "Confirme só o irreversível",
            "Batch aprovações",
            "Explicabilidade > confirmação",
          ],
          chapters: [
            { time: "00:00", title: "Quando pedir humano?" },
            { time: "07:00", title: "UI de aprovação" },
            { time: "14:00", title: "Auditoria e histórico" },
          ],
          transcript:
            "Human-in-the-loop mal feito destrói o produto. A regra: peça confirmação só para ações irreversíveis ou de alto custo. Para o resto, mostre o que foi feito e ofereça undo. Sempre com trilha de auditoria.",
          resources: [{ type: "Repo", title: "hitl-patterns" }],
          exercise: {
            title: "1 ação com HITL",
            brief: "Implemente um fluxo com aprovação + auditoria no seu app.",
            deliverable: "Vídeo do fluxo + link do log.",
            hints: ["Aprovação in-context, não em outra tela", "Sempre com preview"],
            difficulty: "Difícil",
          },
        }),
        L("testing", "Teste com 5 usuários", "15:22",
          "O método brutal de validação em 3 dias sem gastar em research.", {
          keyPoints: [
            "5 usuários pegam 85% dos problemas",
            "Grave tudo, decida depois",
            "1 pergunta por sessão",
          ],
          chapters: [
            { time: "00:00", title: "Método dos 5" },
            { time: "06:00", title: "Roteiro" },
            { time: "12:00", title: "Análise" },
          ],
          transcript:
            "Você não precisa de research pesado. 5 usuários certos, 30 minutos cada, gravados. Vamos passar pelo roteiro exato, como recrutar e como analisar em uma tarde.",
          resources: [
            { type: "Template", title: "Roteiro de teste com 5" },
            { type: "PDF", title: "Recrutamento sem budget" },
          ],
          exercise: {
            title: "Sua rodada de 5",
            brief: "Recrute e teste com 5 usuários reais em 7 dias.",
            deliverable: "5 gravações + doc de insights.",
            hints: ["Recrute na sua rede primeiro", "Grave o áudio, mínimo"],
            difficulty: "Elite",
          },
        }),
      ],
    },

    // ─────────────────────────── MÓDULO 5 ───────────────────────────
    {
      id: "publicar",
      number: 5,
      title: "Publicar & Escalar",
      tagline: "Landing, billing, analytics e o motor de aquisição.",
      summary:
        "Publicação em stores, cobrança recorrente, analytics de retenção e o playbook de lançamento que fez alunos baterem 6 dígitos.",
      outcomes: [
        "Construir uma landing com conversão > 4%",
        "Implementar billing recorrente sem dor",
        "Instrumentar métricas AAARRR",
        "Executar um lançamento de 60 dias",
      ],
      lessons: [
        L("landing", "Landing que converte", "18:22",
          "Estrutura, prova, oferta — o esqueleto de uma landing que converte > 4%.", {
          keyPoints: [
            "Hero > tudo",
            "Prova social específica > genérica",
            "CTA único por seção",
          ],
          chapters: [
            { time: "00:00", title: "Esqueleto ideal" },
            { time: "06:30", title: "Hero" },
            { time: "13:00", title: "Prova e oferta" },
          ],
          transcript:
            "Uma landing premium tem 8 seções e não uma a mais: hero, dor, solução, prova, features, oferta, FAQ, CTA final. Vamos ver o padrão exato com exemplos que convertem acima de 4%.",
          resources: [{ type: "Template", title: "Landing premium (React)" }],
          exercise: {
            title: "Sua landing v1",
            brief: "Construa a landing do seu app com as 8 seções.",
            deliverable: "URL público + print da conversão em 7 dias.",
            hints: ["Hero em 5s", "1 CTA por seção"],
            difficulty: "Difícil",
          },
        }),
        L("billing", "Billing recorrente sem dor", "15:47",
          "Stripe, upgrades, dunning — configuração de billing que não te acorda de madrugada.", {
          keyPoints: [
            "Stripe Checkout > tudo no primeiro ano",
            "Portal do cliente é obrigatório",
            "Dunning automático evita 30% de churn",
          ],
          chapters: [
            { time: "00:00", title: "Setup Stripe" },
            { time: "06:00", title: "Portal do cliente" },
            { time: "11:00", title: "Dunning" },
          ],
          transcript:
            "Não construa billing. Use Stripe Checkout, Portal e Billing. Vamos configurar do zero: produtos, preços, webhook seguro, portal para o cliente gerenciar e dunning automático.",
          code: {
            lang: "ts",
            title: "Verificação de webhook Stripe",
            code: `import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET!);

export async function handleWebhook(req: Request) {
  const sig = req.headers.get("stripe-signature")!;
  const body = await req.text();
  const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  switch (event.type) {
    case "checkout.session.completed": /* ativar */ break;
    case "customer.subscription.deleted": /* revogar */ break;
  }
  return new Response("ok");
}`,
          },
          resources: [{ type: "Repo", title: "stripe-starter · webhook seguro" }],
          exercise: {
            title: "Billing end-to-end",
            brief: "Configure Stripe do zero: checkout, webhook, portal, dunning.",
            deliverable: "Cobrança real de R$ 1 processada.",
            hints: ["Comece em test mode", "Portal do cliente antes do CS"],
            difficulty: "Difícil",
          },
        }),
        L("analytics", "Métricas que importam", "17:05",
          "AAARRR: Awareness, Activation, Retention, Revenue, Referral — e nenhum vanity metric.", {
          keyPoints: [
            "Activation é a métrica #1",
            "Retention cohort > número solto",
            "Instrumente do dia 1",
          ],
          chapters: [
            { time: "00:00", title: "AAARRR" },
            { time: "07:00", title: "Definindo activation" },
            { time: "13:00", title: "Cohort de retenção" },
          ],
          transcript:
            "Ignore MAU. Ignore signups. As métricas que importam são: activation rate (chegou ao aha), retention cohort (voltou na semana 4?), MRR e net revenue retention. Vamos instrumentar cada uma.",
          resources: [{ type: "Template", title: "Dashboard AAARRR (Metabase)" }],
          exercise: {
            title: "Seu dashboard",
            brief: "Monte um dashboard com os 5 números que você olha diário.",
            deliverable: "Print do dashboard + doc dos 5 números.",
            hints: ["Menos > mais", "Um único activation event"],
            difficulty: "Média",
          },
        }),
        L("launch", "Playbook de lançamento", "31:40",
          "60 dias, dia a dia — o playbook exato que fez alunos baterem 6 dígitos.", {
          keyPoints: [
            "Pré-lançamento vale mais que o dia D",
            "Lista > redes",
            "Escassez real, não fake",
          ],
          chapters: [
            { time: "00:00", title: "Visão dos 60 dias" },
            { time: "10:00", title: "Fase 1: audiência" },
            { time: "20:00", title: "Fase 2: lançamento" },
            { time: "28:00", title: "Fase 3: sustentação" },
          ],
          transcript:
            "Um lançamento sério dura 60 dias em 3 fases. Fase 1 (30d): construir audiência com conteúdo específico. Fase 2 (7d): abrir carrinho com escassez real e prova. Fase 3 (23d): sustentar com onboarding e comunidade. Vamos ao dia a dia.",
          resources: [
            { type: "PDF", title: "Calendário 60 dias" },
            { type: "Template", title: "Pack de e-mails de lançamento" },
          ],
          exercise: {
            title: "Seu calendário de 60d",
            brief: "Monte o calendário do seu lançamento com data e canais.",
            deliverable: "Calendário compartilhado + primeira semana executada.",
            hints: ["Data fixa no calendário público", "Compromisso na cohort"],
            difficulty: "Elite",
          },
        }),
        L("stores", "Publicar em iOS, Android e Web", "19:44",
          "Custos reais, prazos e o checklist para não ser rejeitado.", {
          keyPoints: [
            "Web primeiro, sempre",
            "Apple: $99/ano + review criterioso",
            "Google: $25 uma vez + review menos rigoroso",
          ],
          chapters: [
            { time: "00:00", title: "Web-first" },
            { time: "05:00", title: "iOS: setup e review" },
            { time: "12:00", title: "Android e outras stores" },
          ],
          transcript:
            "Publicar em stores é 20% técnico e 80% burocrático. Vamos ao checklist: contas, certificados, ícones, screenshots, política de privacidade e os motivos mais comuns de rejeição em apps de IA.",
          resources: [{ type: "PDF", title: "Checklist de publicação — 4 stores" }],
          exercise: {
            title: "Web publicada",
            brief: "Publique a versão web do seu app com domínio próprio.",
            deliverable: "URL + certificado válido.",
            hints: ["HTTPS obrigatório", "PWA installable já vale"],
            difficulty: "Média",
          },
        }),
      ],
    },

    // ─────────────────────────── MÓDULO 6 ───────────────────────────
    {
      id: "seguranca",
      number: 6,
      title: "Segurança & Compliance",
      tagline: "PII, LGPD, prompt injection — para operar em ambientes sérios.",
      summary:
        "AI apps profissionais precisam de segurança séria: proteção contra prompt injection, tratamento de PII, LGPD, logs auditáveis e SOC2 ready.",
      outcomes: [
        "Bloquear os 5 vetores comuns de prompt injection",
        "Mapear e tratar PII em conformidade com LGPD",
        "Implementar logs auditáveis",
        "Preparar o mínimo para SOC2 Tipo 1",
      ],
      lessons: [
        L("injection", "Prompt injection na prática", "22:10",
          "Os 5 vetores mais comuns e como bloquear cada um.", {
          keyPoints: [
            "Nunca confie em input do usuário",
            "Separação de canais > filtros",
            "Least privilege em tools",
          ],
          chapters: [
            { time: "00:00", title: "Os 5 vetores" },
            { time: "08:00", title: "Defesas por camada" },
            { time: "16:00", title: "Live: quebrando um agente" },
          ],
          transcript:
            "Prompt injection é a nova SQL injection. Vamos quebrar juntos um agente naif e depois blindar em três camadas: input sanitization, separação estrutural de canais, e least privilege nas tools que ele pode chamar.",
          code: {
            lang: "ts",
            title: "Separação estrutural de canais",
            code: `const messages = [
  { role: "system", content: SYSTEM_RULES },
  { role: "user", content: "Analise o texto entre <untrusted> tags." },
  { role: "user", content: \`<untrusted>\${userInput}</untrusted>\` },
];
// tools never expose the untrusted content back to the model unquoted`,
          },
          resources: [{ type: "PDF", title: "OWASP LLM Top 10 · resumido" }],
          exercise: {
            title: "Red team no seu app",
            brief: "Tente 5 ataques de injection no seu agente e documente defesas.",
            deliverable: "Relatório com ataque, resultado, defesa.",
            hints: ["Ataque 1: ignore instructions", "Ataque 5: exfil via tool"],
            difficulty: "Elite",
          },
        }),
        L("pii", "PII e LGPD para AI apps", "19:00",
          "O que é PII, o que fazer com ela e como evitar multa.", {
          keyPoints: [
            "Minimize coleta desde o schema",
            "Redação antes do LLM",
            "DPA com todos os providers",
          ],
          chapters: [
            { time: "00:00", title: "O que a LGPD diz" },
            { time: "06:00", title: "Redação antes do LLM" },
            { time: "13:00", title: "DPA e providers" },
          ],
          transcript:
            "Se seu app toca PII, você tem responsabilidades. Vamos ao mínimo prático: como minimizar coleta, como redigir PII antes de enviar ao LLM, como manter DPA com providers e o que responder quando o cliente pede LGPD.",
          resources: [
            { type: "Template", title: "Política de privacidade base" },
            { type: "PDF", title: "Checklist LGPD para AI apps" },
          ],
          exercise: {
            title: "Auditoria de PII",
            brief: "Mapeie todo dado pessoal do seu app e sua justificativa.",
            deliverable: "Planilha com fluxo de PII.",
            hints: ["Comece pelo schema do banco", "Verifica logs também"],
            difficulty: "Difícil",
          },
        }),
        L("logs", "Logs auditáveis", "16:40",
          "Como logar decisões do agente sem virar pesadelo de custo ou compliance.", {
          keyPoints: [
            "Log estruturado do dia 1",
            "Trace ID no contexto do agente",
            "Retenção curta + agregados longos",
          ],
          chapters: [
            { time: "00:00", title: "O que logar" },
            { time: "06:00", title: "Trace de agente" },
            { time: "12:00", title: "Retenção e custo" },
          ],
          transcript:
            "Sem log estruturado, você depura no cliente. Com log demais, você quebra em custo e viola LGPD. O caminho do meio: log estruturado com trace ID por sessão, retenção de 30 dias em detalhes e agregados por 1 ano.",
          resources: [{ type: "Repo", title: "trace-lite · tracer minimal" }],
          exercise: {
            title: "Tracing no seu agente",
            brief: "Adicione trace ID e log estruturado em todas as chamadas.",
            deliverable: "Dashboard com um trace completo.",
            hints: ["Um ID por sessão do usuário", "JSON logs, não string"],
            difficulty: "Difícil",
          },
        }),
        L("soc2", "SOC2 mínimo viável", "17:30",
          "O que você precisa hoje para não travar deal enterprise amanhã.", {
          keyPoints: [
            "MFA obrigatório em tudo",
            "Onboarding/offboarding documentado",
            "Vendor list mantida",
          ],
          chapters: [
            { time: "00:00", title: "Por que agora" },
            { time: "05:30", title: "Controles mínimos" },
            { time: "12:00", title: "Ferramentas" },
          ],
          transcript:
            "SOC2 parece monstro, mas o Tipo 1 é acessível. Vamos ao checklist mínimo que já destrava 80% dos deals: MFA em tudo, políticas escritas, log de acessos, backup, incident response e vendor management.",
          resources: [{ type: "PDF", title: "Checklist SOC2 Tipo 1" }],
          exercise: {
            title: "Diagnóstico SOC2",
            brief: "Preencha o checklist e liste os 5 gaps mais críticos.",
            deliverable: "Doc com plano de ação de 90 dias.",
            hints: ["MFA primeiro", "Documentação vale mais que ferramenta"],
            difficulty: "Média",
          },
        }),
      ],
    },

    // ─────────────────────────── MÓDULO 7 ───────────────────────────
    {
      id: "growth",
      number: 7,
      title: "Growth de Elite",
      tagline: "Conteúdo, SEO, parcerias e outbound — o motor de aquisição sem paid.",
      summary:
        "Como crescer sem depender de mídia paga: conteúdo estratégico, SEO programático, parcerias e outbound cirúrgico.",
      outcomes: [
        "Publicar 1 peça de autoridade por semana",
        "Construir SEO programático com IA",
        "Fechar 3 parcerias estratégicas",
        "Rodar outbound com 5%+ de reply rate",
      ],
      lessons: [
        L("content", "Conteúdo de autoridade", "18:15",
          "1 peça central por semana + 5 derivativos — o sistema de conteúdo do operador.", {
          keyPoints: [
            "1 peça pillar > 20 posts genéricos",
            "Distribua em 5 canais",
            "Escreva pro seu ICP, não pra Google",
          ],
          chapters: [
            { time: "00:00", title: "Peça pillar" },
            { time: "07:00", title: "Sistema de derivativos" },
            { time: "13:00", title: "Distribuição" },
          ],
          transcript:
            "Você não precisa postar todo dia. Precisa de 1 peça pillar por semana (case, framework, opinião forte) e 5 derivativos (LinkedIn, X, e-mail, vídeo curto, podcast). Vamos ao sistema.",
          resources: [{ type: "Template", title: "Sistema pillar → 5 derivativos" }],
          exercise: {
            title: "1 pillar essa semana",
            brief: "Publique 1 peça pillar sobre um framework do seu domínio.",
            deliverable: "Link + prints dos derivativos.",
            hints: ["Opinião forte > neutralidade", "Case real > teoria"],
            difficulty: "Média",
          },
        }),
        L("seo", "SEO programático com IA", "22:40",
          "Como criar 1.000+ páginas úteis (não spam) com IA e ranquear.", {
          keyPoints: [
            "Cluster de intenção > keyword solta",
            "Utilidade > extensão",
            "Sitemap e schema do dia 1",
          ],
          chapters: [
            { time: "00:00", title: "O que é programático" },
            { time: "08:00", title: "Pipeline com IA" },
            { time: "16:00", title: "Sinal para o Google" },
          ],
          transcript:
            "SEO programático deu certo em 2024 e ainda dá — se você entrega utilidade real. Vamos construir juntos um pipeline: identifica cluster, gera 100 páginas com IA + revisão, indexa progressivamente, monitora e podae as fracas.",
          resources: [{ type: "Repo", title: "seo-programatico · pipeline" }],
          exercise: {
            title: "Piloto de 20 páginas",
            brief: "Publique 20 páginas úteis em um cluster e monitore 30 dias.",
            deliverable: "URLs + planilha de tráfego.",
            hints: ["Cluster estreito", "Revisão humana obrigatória"],
            difficulty: "Elite",
          },
        }),
        L("partnerships", "Parcerias estratégicas", "17:00",
          "Como fechar parceria com quem já tem sua audiência sem parecer desespero.", {
          keyPoints: [
            "Ofereça valor antes de pedir",
            "Um pitch, um assunto, uma pergunta",
            "Formalize com 1 parágrafo",
          ],
          chapters: [
            { time: "00:00", title: "Quem procurar" },
            { time: "06:00", title: "Pitch em 3 linhas" },
            { time: "12:00", title: "Formalização" },
          ],
          transcript:
            "Parceria boa não é troca — é sobreposição de audiência com valor mútuo. Vamos ao mapa de quem procurar, o pitch em 3 linhas e o modelo de acordo em 1 parágrafo.",
          resources: [{ type: "Template", title: "Pitch de parceria + acordo" }],
          exercise: {
            title: "3 pitches enviados",
            brief: "Identifique 3 parceiros ideais e envie o pitch.",
            deliverable: "Prints dos e-mails + respostas.",
            hints: ["Warm intro se possível", "Especificidade vende"],
            difficulty: "Difícil",
          },
        }),
        L("outbound", "Outbound cirúrgico", "20:20",
          "50 e-mails por semana, 5% de reply — o padrão do outbound que funciona.", {
          keyPoints: [
            "Lista pequena e qualificada",
            "Personalização em 1 linha, não parágrafo",
            "Follow-up é onde mora o resultado",
          ],
          chapters: [
            { time: "00:00", title: "Lista antes do e-mail" },
            { time: "07:00", title: "Copy que gera reply" },
            { time: "14:00", title: "Follow-up sequência" },
          ],
          transcript:
            "Outbound bom é lista curta, copy afiado, follow-up disciplinado. Vamos ao processo: construção de lista com sinais, copy em 3 partes (why you, why now, ask pequeno) e sequência de 4 follow-ups.",
          resources: [{ type: "Template", title: "Sequência de outbound (Instantly)" }],
          exercise: {
            title: "50 e-mails na semana",
            brief: "Envie 50 e-mails personalizados e reporte reply rate.",
            deliverable: "Planilha com métricas + análise.",
            hints: ["Envie em 5 dias", "Personalize a primeira linha"],
            difficulty: "Difícil",
          },
        }),
      ],
    },

    // ─────────────────────────── MÓDULO 8 ───────────────────────────
    {
      id: "escala",
      number: 8,
      title: "Escala & Operação",
      tagline: "De 10 para 10 mil usuários sem quebrar produto, custo ou pessoas.",
      summary:
        "A partir de $10k MRR você troca de problema. Este módulo cobre o playbook de escala: custo de IA, suporte com IA, contratação, e o primeiro exit.",
      outcomes: [
        "Reduzir custo de IA em 40%+ sem perder qualidade",
        "Automatizar 70% do suporte com agentes",
        "Contratar a primeira pessoa correta",
        "Entender opções de exit desde cedo",
      ],
      lessons: [
        L("cost", "Cost engineering em LLMs", "23:30",
          "Como cortar 40% do custo mantendo qualidade — sem trocar de modelo.", {
          keyPoints: [
            "Cache semântico agressivo",
            "Roteamento por complexidade",
            "Batch quando possível",
          ],
          chapters: [
            { time: "00:00", title: "Mapa do custo" },
            { time: "08:00", title: "Cache semântico" },
            { time: "15:00", title: "Roteamento de modelo" },
          ],
          transcript:
            "Custo de IA cresce com o produto — se você não instrumentar, quebra a margem. Vamos ao mapa: onde o custo mora, cache semântico (não literal), roteamento por complexidade e batch. Meta: -40% sem perder qualidade.",
          code: {
            lang: "ts",
            title: "Cache semântico simples",
            code: `import { hash } from "./util";
const cache = new Map<string, string>();

export async function cachedLLM(prompt: string) {
  const embed = await embedding(prompt);
  for (const [k, v] of cache) {
    const [pastEmbed, past] = JSON.parse(k);
    if (cosine(pastEmbed, embed) > 0.95) return v;
  }
  const out = await llm(prompt);
  cache.set(JSON.stringify([embed, prompt]), out);
  return out;
}`,
          },
          resources: [{ type: "Repo", title: "cost-lab" }],
          exercise: {
            title: "-20% em 7 dias",
            brief: "Instrumente custo por rota e reduza 20% em 1 semana.",
            deliverable: "Dashboard antes/depois.",
            hints: ["Cache primeiro", "Roteamento por prompt length"],
            difficulty: "Elite",
          },
        }),
        L("support", "Suporte com agentes", "18:50",
          "Como automatizar 70% do suporte sem irritar cliente pagante.", {
          keyPoints: [
            "Deflect > deflect malfeito",
            "Handoff pro humano deve ser <30s",
            "Base de conhecimento é o ativo",
          ],
          chapters: [
            { time: "00:00", title: "Deflect certo" },
            { time: "07:00", title: "Handoff sem fricção" },
            { time: "13:00", title: "Métricas" },
          ],
          transcript:
            "Suporte com agente que irrita é pior que sem agente. Vamos ao padrão: agente resolve o comum, escala rápido pro humano no complexo, base de conhecimento cresce a cada ticket.",
          resources: [{ type: "Template", title: "Base de conhecimento estruturada" }],
          exercise: {
            title: "Piloto de 30 dias",
            brief: "Coloque um agente no primeiro nível e meça CSAT.",
            deliverable: "Relatório de 30 dias.",
            hints: ["Handoff em 1 clique", "CSAT semanal"],
            difficulty: "Difícil",
          },
        }),
        L("hiring", "Primeira contratação", "20:15",
          "Quando, quem e como — o guia da primeira contratação sem se arrepender.", {
          keyPoints: [
            "Contrate quando doer não contratar",
            "Generalista sênior > especialista júnior",
            "Trial pago obrigatório",
          ],
          chapters: [
            { time: "00:00", title: "Sinal de contratar" },
            { time: "07:00", title: "Perfil ideal" },
            { time: "14:00", title: "Processo em 3 etapas" },
          ],
          transcript:
            "Primeira contratação é a decisão que mais move o negócio. Vamos ao sinal (quando dói não ter), o perfil ideal (sempre generalista sênior) e o processo em 3 etapas com trial pago.",
          resources: [{ type: "Template", title: "Processo seletivo em 3 etapas" }],
          exercise: {
            title: "Job spec",
            brief: "Escreva a job spec da primeira contratação.",
            deliverable: "Doc de 1 página.",
            hints: ["Outcomes, não tasks", "Trial de 2 semanas pago"],
            difficulty: "Média",
          },
        }),
        L("exit", "Opções de exit desde cedo", "24:00",
          "Aquisição, ARR sale, private equity — o mapa antes de você precisar dele.", {
          keyPoints: [
            "Optionality > venda cedo",
            "Métricas certas dobram o múltiplo",
            "Relacionamento com potenciais buyers é ativo",
          ],
          chapters: [
            { time: "00:00", title: "Mapa de exits" },
            { time: "08:00", title: "Como se prepara" },
            { time: "16:00", title: "Erros comuns" },
          ],
          transcript:
            "Você não precisa vender — mas precisa ter a opção. Vamos ao mapa: aquisição estratégica, ARR sale (múltiplo 3-8x), private equity a partir de $2M ARR. E como se preparar sem virar refém.",
          resources: [{ type: "PDF", title: "Data room mínimo" }],
          exercise: {
            title: "Data room v0",
            brief: "Monte o data room mínimo (mesmo sem intenção de vender).",
            deliverable: "Pasta compartilhada com 12 docs.",
            hints: ["Ativos, contratos, métricas", "Atualize trimestral"],
            difficulty: "Elite",
          },
        }),
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

export const totalLessons = course.modules.reduce(
  (n, m) => n + m.lessons.length,
  0,
);

export const totalExercises = course.modules.reduce(
  (n, m) => n + m.lessons.filter((l) => l.exercise).length,
  0,
);

export function allLessons() {
  return course.modules.flatMap((m) =>
    m.lessons.map((l) => ({ module: m, lesson: l })),
  );
}
