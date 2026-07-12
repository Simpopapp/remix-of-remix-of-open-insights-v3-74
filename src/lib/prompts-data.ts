export type Prompt = {
  id: string;
  title: string;
  category: "Agent" | "Copy" | "Análise" | "Debug" | "Estratégia" | "Produto";
  useCase: string;
  body: string;
  variables: string[];
};

export const prompts: Prompt[] = [
  {
    id: "agent-system",
    title: "System prompt de Agent de elite",
    category: "Agent",
    useCase: "Base para qualquer agent com tools próprias e budget de passos.",
    variables: ["ROLE", "OBJECTIVE", "TOOLS", "GUARDRAILS"],
    body: `Você é {ROLE}. Sua missão: {OBJECTIVE}.

Ferramentas disponíveis: {TOOLS}

Regras não-negociáveis:
- Pense em português, responda em português.
- Máximo 8 passos antes de entregar um resultado ou pedir ajuda.
- NUNCA invente dados. Se faltar contexto, chame a tool 'ask_user'.
- {GUARDRAILS}

Formato final: JSON estrito com campos {result, confidence, next_action}.`,
  },
  {
    id: "prd-lite",
    title: "PRD lite em 10 minutos",
    category: "Produto",
    useCase: "Transformar uma ideia em documento executável.",
    variables: ["IDEIA", "PERSONA"],
    body: `Transforme a ideia abaixo em um PRD de 1 página seguindo esta estrutura exata:

1. Problema (1 frase, sem jargão)
2. Persona ({PERSONA}) e job-to-be-done
3. Insight não-óbvio (o que ninguém está vendo)
4. Solução em 3 bullets
5. Escopo do MVP (o que ENTRA e o que FICA DE FORA)
6. Métrica de sucesso da semana 1
7. Riscos (2) e como mitigar

Ideia: {IDEIA}

Seja brutal: se algo é fluffy, remova.`,
  },
  {
    id: "landing-hero",
    title: "Copy de hero premium",
    category: "Copy",
    useCase: "Escrever hero de landing em 3 variações testáveis.",
    variables: ["PRODUTO", "PROMESSA", "OBJEÇÃO_PRINCIPAL"],
    body: `Escreva 3 variações de hero para {PRODUTO}.

Promessa central: {PROMESSA}
Objeção que precisa ser derrubada: {OBJEÇÃO_PRINCIPAL}

Cada variação com:
- Headline (max 8 palavras, verbo no início ou promessa numérica)
- Sub-headline (uma frase, sem "seu/sua" repetido)
- CTA (2-3 palavras, ação concreta)

Vozes: (a) editorial, (b) técnico, (c) provocador. Nada genérico. Nada "revolucione".`,
  },
  {
    id: "debug-agent",
    title: "Debug de agent que trava",
    category: "Debug",
    useCase: "Diagnóstico de agent em loop ou custo alto.",
    variables: ["LOG", "COMPORTAMENTO_ESPERADO"],
    body: `Você é engenheiro sênior de agents. Analise o log abaixo e responda:

1. Em qual passo o agent começou a divergir?
2. Qual tool foi chamada errado ou faltou?
3. Qual mudança no system prompt corrige em 1 linha?
4. Qual guardrail deveria existir?

Log:
{LOG}

Comportamento esperado: {COMPORTAMENTO_ESPERADO}

Formato: bullets curtos, sem explicação teórica.`,
  },
  {
    id: "growth-loop",
    title: "Growth loop em 5 passos",
    category: "Estratégia",
    useCase: "Desenhar loop de aquisição defensável.",
    variables: ["PRODUTO", "USUÁRIO_INICIAL"],
    body: `Desenhe um growth loop para {PRODUTO} partindo de {USUÁRIO_INICIAL}.

Estrutura exata:
- Trigger (o que faz usuário voltar)
- Ação (o que ele faz)
- Output (o que o produto gera dessa ação)
- Recompensa (o que ele leva)
- Investimento (o que fica no produto que puxa o próximo)

No final: 1 métrica única de saúde desse loop.`,
  },
  {
    id: "cohort-analysis",
    title: "Análise de cohort com dados brutos",
    category: "Análise",
    useCase: "Interpretar CSV de retenção sem viés.",
    variables: ["CSV"],
    body: `Recebi este CSV de cohort semanal. Faça análise executiva:

{CSV}

Entregue:
1. D1/D7/D30 por cohort
2. Qual cohort quebrou o padrão (e hipótese do porquê)
3. Métrica em risco
4. 1 experimento pra rodar essa semana
5. 1 coisa que NÃO devo mudar

Sem gráficos, só números e conclusões.`,
  },
  {
    id: "moat",
    title: "Mapa de moat técnico",
    category: "Estratégia",
    useCase: "Mostrar onde está a defensibilidade do seu app.",
    variables: ["PRODUTO", "CONCORRENTE"],
    body: `Compare {PRODUTO} com {CONCORRENTE}. Mapeie 5 possíveis moats:

1. Dados proprietários
2. Rede/comunidade
3. Fluxo de trabalho (workflow lock-in)
4. Custo de switching
5. Marca/distribuição

Para cada: nota 0-10 hoje, 0-10 em 12 meses se executar bem, ação #1 dessa semana.`,
  },
  {
    id: "pricing",
    title: "Pricing de 3 planos",
    category: "Produto",
    useCase: "Estruturar pricing tier em 15 min.",
    variables: ["PRODUTO", "VALOR_ENTREGUE", "CUSTO_MARGINAL"],
    body: `Proponha pricing de 3 tiers para {PRODUTO}.

Valor entregue por uso: {VALOR_ENTREGUE}
Custo marginal por usuário: {CUSTO_MARGINAL}

Para cada tier:
- Nome (memorável, nada tipo "Basic/Pro/Enterprise")
- Preço mensal + anual (com desconto anual claro)
- Limite duro (o que trava)
- 3 features exclusivas
- Anchor (por que o segundo tier é o "óbvio")

Justifique margem em 1 linha.`,
  },
];

export const promptCategories: Prompt["category"][] = [
  "Agent",
  "Copy",
  "Análise",
  "Debug",
  "Estratégia",
  "Produto",
];
