// Curated glossary of AI-app / agentic-dev vocabulary used across the course.
// Kept intentionally opinionated and Portuguese-first — this is a study aid,
// not a Wikipedia mirror.

export type GlossaryEntry = {
  term: string;
  category:
    | "Fundamentos"
    | "Agentes"
    | "MCP"
    | "LLM"
    | "Engenharia"
    | "Produto"
    | "Deploy"
    | "Negócio";
  short: string;
  long: string;
  aliases?: string[];
  seeAlso?: string[];
};

export const glossary: GlossaryEntry[] = [
  {
    term: "Agente",
    category: "Agentes",
    short: "LLM com objetivo, ferramentas e loop de decisão.",
    long:
      "Um agente é um LLM colocado dentro de um ciclo (perceber → decidir → agir → observar) com acesso a ferramentas. Diferente de um chatbot, o agente persegue um objetivo declarado e pode encadear várias chamadas até concluí-lo.",
    aliases: ["AI agent", "agentic system"],
    seeAlso: ["Ferramenta", "Loop ReAct", "Planner"],
  },
  {
    term: "MCP",
    category: "MCP",
    short: "Model Context Protocol — padrão para conectar LLMs a ferramentas e dados.",
    long:
      "O Model Context Protocol define um contrato JSON-RPC entre um cliente (host que roda o LLM) e servidores que expõem ferramentas, recursos e prompts. É o USB-C dos agentes: escreve-se o servidor uma vez e qualquer host compatível consegue usá-lo.",
    aliases: ["Model Context Protocol"],
    seeAlso: ["Ferramenta", "Servidor MCP", "Host MCP"],
  },
  {
    term: "Servidor MCP",
    category: "MCP",
    short: "Processo que publica ferramentas, recursos e prompts via MCP.",
    long:
      "Roda localmente (stdio) ou remoto (SSE/HTTP). Define capacidades declarativas que o host descobre no handshake. Idealmente sem estado de sessão além do necessário.",
    seeAlso: ["MCP", "Host MCP"],
  },
  {
    term: "Host MCP",
    category: "MCP",
    short: "Aplicação que hospeda o LLM e conecta em servidores MCP.",
    long:
      "Claude Desktop, Cursor, seu app customizado. É quem apresenta as ferramentas ao modelo e roteia as tool calls para os servidores certos.",
    seeAlso: ["MCP", "Servidor MCP"],
  },
  {
    term: "Ferramenta",
    category: "Agentes",
    short: "Função tipada que o LLM pode chamar durante uma resposta.",
    long:
      "Definida por nome, descrição em linguagem natural e JSON Schema dos parâmetros. A descrição é o prompt que faz o modelo escolher — capriche.",
    aliases: ["Tool", "Function"],
  },
  {
    term: "Tool Calling",
    category: "LLM",
    short: "Mecanismo do modelo pra pedir a execução de uma função.",
    long:
      "O LLM emite um bloco estruturado com nome da ferramenta e argumentos JSON. O seu código executa, devolve o resultado, e o modelo continua a resposta.",
    aliases: ["Function calling"],
  },
  {
    term: "Loop ReAct",
    category: "Agentes",
    short: "Reason + Act: intercala raciocínio verbal e ações no ambiente.",
    long:
      "Padrão clássico onde o agente escreve seu 'thought', escolhe uma ação, observa o resultado, e repete até uma condição de parada.",
    seeAlso: ["Agente", "Planner"],
  },
  {
    term: "Planner",
    category: "Agentes",
    short: "Componente que decompõe um objetivo em passos executáveis.",
    long:
      "Pode ser outro LLM, uma cadeia estruturada, ou uma máquina de estados. Reduz alucinação em tarefas longas ao separar 'o quê' de 'como'.",
  },
  {
    term: "RAG",
    category: "LLM",
    short: "Retrieval-Augmented Generation — injetar contexto recuperado no prompt.",
    long:
      "Busca vetorial (ou BM25/híbrido) traz trechos relevantes, o LLM responde citando esses trechos. Combate o corte de conhecimento e reduz alucinação em bases proprietárias.",
    aliases: ["Retrieval Augmented Generation"],
    seeAlso: ["Embedding", "Vector DB"],
  },
  {
    term: "Embedding",
    category: "LLM",
    short: "Vetor denso que representa semanticamente um trecho.",
    long:
      "Textos semelhantes ficam perto no espaço. Base para busca semântica, clustering e recomendação. Modelos comuns: text-embedding-3, voyage, nomic.",
  },
  {
    term: "Vector DB",
    category: "Engenharia",
    short: "Banco otimizado para busca por similaridade em embeddings.",
    long:
      "pgvector, Qdrant, Pinecone, Weaviate. Escolha por operabilidade, filtros e custo por milhão de vetores, não por hype.",
  },
  {
    term: "Context Window",
    category: "LLM",
    short: "Tamanho máximo de tokens que o modelo considera de uma vez.",
    long:
      "Cresceu de 4k para 200k-2M, mas atenção não é gratuita: recall no meio degrada e custo escala linear. Não confunda janela grande com memória boa.",
    aliases: ["Janela de contexto"],
  },
  {
    term: "Token",
    category: "LLM",
    short: "Unidade sub-palavra que o modelo enxerga.",
    long:
      "1 token ≈ 4 caracteres em inglês, ≈ 3 em português. É a unidade cobrada. Otimizar prompt é otimizar tokens.",
  },
  {
    term: "Temperatura",
    category: "LLM",
    short: "Escala de aleatoriedade da amostragem.",
    long:
      "0 = mais determinístico, 1+ = mais criativo. Para tool calling e extração estruturada, use 0 ou 0.2. Para brainstorm, 0.7-1.",
  },
  {
    term: "System Prompt",
    category: "Engenharia",
    short: "Instrução persistente que define papel, regras e estilo.",
    long:
      "Escreva como um contrato: quem você é, o que pode/não pode, formato de saída, e ferramentas disponíveis. Versione como código.",
  },
  {
    term: "Few-shot",
    category: "Engenharia",
    short: "Exemplos dentro do prompt guiando o formato desejado.",
    long:
      "Poderosíssimo pra formatação estruturada e edge cases. 2-5 exemplos bem escolhidos batem 50 mal escolhidos.",
  },
  {
    term: "Chain-of-Thought",
    category: "Engenharia",
    short: "Pedir ao modelo que raciocine passo a passo antes de responder.",
    long:
      "Aumenta acurácia em problemas multi-passo, ao custo de latência e tokens. Modelos reasoning fazem isso implicitamente.",
    aliases: ["CoT"],
  },
  {
    term: "Structured Output",
    category: "Engenharia",
    short: "Forçar o LLM a devolver JSON válido conforme schema.",
    long:
      "Via response_format, function calling, ou grammar-constrained decoding. Elimina parsing frágil e ganha type-safety.",
    aliases: ["JSON mode"],
  },
  {
    term: "Guardrails",
    category: "Engenharia",
    short: "Camadas de validação de entrada e saída do LLM.",
    long:
      "Regex, classificadores, LLM-as-judge, filtros de PII. Trate o modelo como código não confiável: entrada validada, saída sanitizada.",
  },
  {
    term: "Evals",
    category: "Engenharia",
    short: "Testes automatizados para saídas de LLM.",
    long:
      "Datasets rotulados + métricas (exact match, LLM-judge, rubricas). Sem evals você não tem engenharia, tem vibes.",
  },
  {
    term: "Alucinação",
    category: "LLM",
    short: "Resposta plausível porém factualmente incorreta.",
    long:
      "Sintoma de generalização sem grounding. Combate: RAG bem feito, structured output, evals, temperatura baixa, cite-your-sources.",
  },
  {
    term: "Prompt Injection",
    category: "Engenharia",
    short: "Entrada maliciosa que sequestra o comportamento do agente.",
    long:
      "Instruções escondidas em documentos, sites, e-mails, ou tool outputs. Defesa: separar canais (sistema/usuário/dados), sanitizar HTML, princípio do menor privilégio nas ferramentas.",
  },
  {
    term: "Streaming",
    category: "Engenharia",
    short: "Enviar tokens ao cliente conforme são gerados.",
    long:
      "SSE ou WebSocket. Reduz TTFB percebido e permite cancelar cedo. Cuidado com structured output parcial — precisa parser incremental.",
  },
  {
    term: "Latência",
    category: "Engenharia",
    short: "Tempo entre requisição e resposta útil.",
    long:
      "Meça TTFB (primeiro token) e TTLT (última resposta). Otimize com streaming, modelos menores em pipeline, cache semântico e prefetch.",
  },
  {
    term: "Cache Semântico",
    category: "Engenharia",
    short: "Reaproveitar respostas para prompts semanticamente similares.",
    long:
      "Chave = embedding do prompt + versão do system. Corte de custo de 30-70% em atendimento repetitivo.",
  },
  {
    term: "Fine-tuning",
    category: "LLM",
    short: "Ajustar pesos de um modelo em dados próprios.",
    long:
      "Bom para estilo, formato e domínio linguístico específico. Ruim como banco de fatos — use RAG. LoRA/QLoRA baratearam muito.",
  },
  {
    term: "LoRA",
    category: "LLM",
    short: "Low-Rank Adaptation — fine-tuning barato e portável.",
    long:
      "Treina matrizes pequenas de adaptação sem tocar nos pesos base. Pode-se plugar/desplugar adapters em tempo de inferência.",
  },
  {
    term: "Distillation",
    category: "LLM",
    short: "Treinar modelo menor imitando um maior.",
    long:
      "Reduz custo e latência preservando comportamento em um escopo. Base do 'aluno LLM' para tarefas específicas.",
  },
  {
    term: "Inference Provider",
    category: "Deploy",
    short: "Serviço que hospeda o modelo e cobra por token.",
    long:
      "OpenAI, Anthropic, Google, Groq, Together, Fireworks. Compare por custo, latência (P95), rate limits, e disponibilidade de modelos.",
  },
  {
    term: "Rate Limit",
    category: "Deploy",
    short: "Teto de req/min ou tokens/min imposto pelo provider.",
    long:
      "Implemente retry com backoff exponencial + jitter. Multiplex entre providers via gateway pra sobreviver a picos.",
  },
  {
    term: "Idempotência",
    category: "Engenharia",
    short: "Mesma requisição, mesmo efeito, quantas vezes for.",
    long:
      "Essencial em ferramentas que criam recursos (cobranças, e-mails). Use idempotency keys e verifique antes de agir.",
  },
  {
    term: "Webhook",
    category: "Engenharia",
    short: "Endpoint público que recebe eventos de terceiros.",
    long:
      "Verifique assinatura HMAC, responda 2xx rápido e processe assíncrono. Nunca confie no payload sem validar.",
  },
  {
    term: "Edge Function",
    category: "Deploy",
    short: "Código serverless rodando perto do usuário.",
    long:
      "Ótimo pra baixa latência, streaming e endpoints públicos. Restrição: runtime enxuto, sem Node completo, sem processo longo.",
  },
  {
    term: "Serverless",
    category: "Deploy",
    short: "Compute sob demanda, cobrado por execução.",
    long:
      "Zero-ops, mas cold starts, timeouts curtos e limites de payload. Perfeito pra tráfego irregular; caro pra base constante.",
  },
  {
    term: "Cold Start",
    category: "Deploy",
    short: "Latência extra na primeira invocação de uma função ociosa.",
    long:
      "Reduza mantendo bundle pequeno, evitando dependências pesadas em runtime, e usando keep-warm ou provisioned concurrency.",
  },
  {
    term: "Observabilidade",
    category: "Engenharia",
    short: "Enxergar o que aconteceu em produção via logs, métricas e traces.",
    long:
      "Pra agentes: registre prompt, resposta, ferramentas chamadas, tokens, latência e custo por requisição. Sem trace, você não debuga.",
  },
  {
    term: "Trace",
    category: "Engenharia",
    short: "Linha do tempo hierárquica de uma requisição.",
    long:
      "Cada span = LLM call, tool call, DB query. Ferramentas: Langfuse, Helicone, LangSmith, OpenTelemetry.",
  },
  {
    term: "Feature Flag",
    category: "Produto",
    short: "Chave que liga/desliga funcionalidade em runtime.",
    long:
      "Permite rollout gradual, A/B test e kill switch sem redeploy. Essencial pra soltar prompt novo sem quebrar todo mundo.",
  },
  {
    term: "A/B Test",
    category: "Produto",
    short: "Comparar duas variações em usuários reais.",
    long:
      "Defina métrica primária antes. Rode até significância estatística, não até 'parecer melhor'. Vale ouro pra ajustar prompts.",
  },
  {
    term: "LTV",
    category: "Negócio",
    short: "Lifetime Value — receita esperada por cliente.",
    long:
      "Ticket médio × frequência × retenção. Norte para decidir quanto gastar em aquisição.",
  },
  {
    term: "CAC",
    category: "Negócio",
    short: "Customer Acquisition Cost — quanto custa trazer um cliente.",
    long:
      "Marketing + vendas ÷ novos clientes no período. Saúde: LTV/CAC ≥ 3, payback ≤ 12 meses.",
  },
  {
    term: "MRR",
    category: "Negócio",
    short: "Monthly Recurring Revenue — receita recorrente mensal.",
    long:
      "Métrica-mãe de SaaS. Decomposta em novo, expansão, churn e reativação.",
  },
  {
    term: "Churn",
    category: "Negócio",
    short: "% de clientes ou receita que sai no período.",
    long:
      "Logo churn conta cabeças, revenue churn conta dinheiro. Negative churn = expansão > perda.",
  },
  {
    term: "Onboarding",
    category: "Produto",
    short: "Trajeto do novo usuário até o 'aha moment'.",
    long:
      "Meça time-to-value. Reduza passos, mostre resultado antes de pedir configuração completa.",
  },
  {
    term: "Aha Moment",
    category: "Produto",
    short: "Momento em que o usuário percebe o valor real do produto.",
    long:
      "Instrumente-o como evento. Correlacione com retenção D7/D30 pra saber se está subindo ou caindo.",
  },
  {
    term: "PMF",
    category: "Produto",
    short: "Product-Market Fit — o produto puxa o mercado.",
    long:
      "Sinais: retenção estabilizada, NPS alto, crescimento orgânico, gente reclamando quando cai. Antes disso, iteração; depois, escala.",
  },
  {
    term: "Waitlist",
    category: "Produto",
    short: "Fila pra entrar no produto antes do release.",
    long:
      "Cria escassez, coleta sinal de demanda e permite onboarding controlado. Sempre com data prometida e transparência do lugar na fila.",
  },
  {
    term: "Lovable Cloud",
    category: "Deploy",
    short: "Backend integrado do Lovable (Postgres, Auth, Storage, Functions).",
    long:
      "Zero-setup. Provisiona banco, RLS, storage e edge functions no mesmo projeto. Use pra tudo que precisa persistir ou rodar server-side.",
  },
  {
    term: "RLS",
    category: "Engenharia",
    short: "Row-Level Security — políticas por linha no Postgres.",
    long:
      "Autoriza acesso baseado em auth.uid() e roles. Combinado com Data API elimina backend CRUD trivial.",
  },
  {
    term: "Supabase",
    category: "Deploy",
    short: "Plataforma open-source de backend baseada em Postgres.",
    long:
      "Base do Lovable Cloud. Fornece auth, storage, realtime, edge functions e Data API (PostgREST).",
  },
  {
    term: "Server Function",
    category: "Engenharia",
    short: "RPC tipado do cliente para o servidor.",
    long:
      "createServerFn no TanStack Start. Roda no edge, valida entrada (Zod), executa lógica e devolve tipado. Não usa REST manual.",
  },
  {
    term: "TanStack Start",
    category: "Deploy",
    short: "Framework React full-stack com SSR e server functions.",
    long:
      "Vite 7 + React 19. Roteamento file-based, loaders, e RPC. Compilado pra Cloudflare Workers.",
  },
  {
    term: "shadcn/ui",
    category: "Produto",
    short: "Coleção de componentes React copiáveis, sem lock-in.",
    long:
      "Você possui o código. Estilizado com Tailwind e variantes. Base do design system deste curso.",
  },
  {
    term: "Design Token",
    category: "Produto",
    short: "Variável semântica de cor, tipografia, espaçamento.",
    long:
      "Definida em styles.css. Componentes leem tokens, nunca hex hardcoded. Base para temas e dark mode.",
  },
  {
    term: "Stripe",
    category: "Negócio",
    short: "Provedor de pagamentos com API-first.",
    long:
      "Assinaturas, checkout hospedado, portal do cliente, webhooks. Padrão de fato pra cobrar em SaaS.",
  },
  {
    term: "Resend",
    category: "Engenharia",
    short: "API moderna pra enviar e-mail transacional.",
    long:
      "Templates React, domínio verificado por DNS, webhooks de entrega/abertura. Alternativa clean ao SendGrid.",
  },
  {
    term: "PostHog",
    category: "Produto",
    short: "Analytics de produto self-hostable ou cloud.",
    long:
      "Eventos, funis, retenção, feature flags, session replay. Base pra decidir com dado, não achismo.",
  },
  {
    term: "OpenAPI",
    category: "Engenharia",
    short: "Especificação padrão pra descrever APIs REST.",
    long:
      "Gera SDK, docs e mocks. Bom ponto de partida pra expor tools do seu agente ao mundo.",
  },
  {
    term: "JSON Schema",
    category: "Engenharia",
    short: "Linguagem pra descrever forma de objetos JSON.",
    long:
      "Base do tool calling. Descreva bem os campos — o LLM lê como se fosse doc.",
  },
  {
    term: "Zod",
    category: "Engenharia",
    short: "Validador de schemas TypeScript-first.",
    long:
      "Usado em toda entrada de server function. Type inference + parse em uma linha.",
  },
  {
    term: "Playwright",
    category: "Engenharia",
    short: "Automação de browser headless multi-navegador.",
    long:
      "Use pra E2E, scraping controlado e verificação visual de UI. Substituto moderno do Selenium.",
  },
];

export const glossaryCategories = Array.from(
  new Set(glossary.map((g) => g.category)),
);
