import { useSyncExternalStore } from "react";

export type ChecklistItem = {
  id: string;
  title: string;
  detail: string;
  cost?: string;
  time?: string;
  link?: { label: string; href: string };
};

export type ChecklistSection = {
  id: string;
  title: string;
  subtitle: string;
  items: ChecklistItem[];
};

export const launchPlaybook: ChecklistSection[] = [
  {
    id: "pre",
    title: "Pré-lançamento",
    subtitle: "Validação e nome antes de gastar 1 real.",
    items: [
      {
        id: "problem",
        title: "1 problema, 1 persona, 1 promessa",
        detail:
          "Escreva em uma frase: para quem, qual dor, qual promessa. Se não cabe em uma frase, ainda não está pronto.",
      },
      {
        id: "name",
        title: "Nome + domínio + handle disponíveis",
        detail: "Domínio .com/.ai + @handle no Instagram + X + TikTok reservados no mesmo dia.",
        link: { label: "Namechk", href: "https://namechk.com" },
      },
      {
        id: "brand",
        title: "Identidade visual mínima",
        detail: "Logo (mesmo que em texto), 1 cor primária, 1 tipografia. Nada de esperar designer.",
      },
      {
        id: "landing",
        title: "Landing de captura no ar",
        detail: "Antes do produto: página com promessa + waitlist + prova social falsificável (contadores reais).",
      },
    ],
  },
  {
    id: "product",
    title: "Produto",
    subtitle: "MVP que resolve UMA coisa muito bem.",
    items: [
      {
        id: "mvp",
        title: "Corte o escopo em 3",
        detail:
          "Liste tudo que você acha que precisa. Corte metade. Corte de novo. É isso que vai ao ar na semana 4.",
      },
      {
        id: "agent",
        title: "Agent + Tools próprias",
        detail:
          "Não é um wrapper de GPT. Ferramenta customizada + dados do próprio usuário = defensibilidade.",
      },
      {
        id: "billing",
        title: "Pricing e billing desde o dia 1",
        detail:
          "Stripe integrado antes do primeiro usuário. Plano free com limite duro + 1 pago. Sem 'depois eu monetizo'.",
      },
      {
        id: "telemetry",
        title: "Telemetria + logs por request",
        detail:
          "Todo call de modelo logado com custo, latência e user_id. Sem isso você voa cego.",
      },
    ],
  },
  {
    id: "apple",
    title: "Publicação — Apple App Store",
    subtitle: "Enterprise-grade: 99 USD/ano + review humano.",
    items: [
      {
        id: "adp",
        title: "Apple Developer Program",
        detail:
          "Conta individual ou empresa (D-U-N-S necessário para empresa). Pagamento anual.",
        cost: "99 USD/ano",
        time: "24–48h aprovação",
        link: { label: "developer.apple.com", href: "https://developer.apple.com/programs/" },
      },
      {
        id: "mac",
        title: "Mac + Xcode",
        detail: "Não tem Mac? MacinCloud/AWS Mac1 (~$1/h). Xcode + simuladores obrigatórios.",
      },
      {
        id: "assets",
        title: "Assets de listagem",
        detail:
          "Ícone 1024, screenshots 6.7\" e 5.5\", texto marketing, política de privacidade em URL pública, categoria, keywords.",
      },
      {
        id: "review",
        title: "Guidelines + revisão humana",
        detail:
          "IA: exigem sinalização de conteúdo user-generated + moderação. Reviews demoram 1–7 dias.",
        link: {
          label: "App Review Guidelines",
          href: "https://developer.apple.com/app-store/review/guidelines/",
        },
      },
      {
        id: "iap",
        title: "In-App Purchase se cobrar dentro do app",
        detail: "Apple leva 15–30%. Web checkout externo pode fugir disso (regras 3.1.3 recentes).",
      },
    ],
  },
  {
    id: "google",
    title: "Publicação — Google Play",
    subtitle: "Barato, rápido, mas policy strict em IA.",
    items: [
      {
        id: "gdp",
        title: "Google Play Console",
        detail: "Pagamento único vitalício. Verificação de identidade obrigatória.",
        cost: "25 USD (uma vez)",
        time: "1–3h aprovação da conta",
        link: { label: "play.google.com/console", href: "https://play.google.com/console" },
      },
      {
        id: "build",
        title: "AAB (Android App Bundle)",
        detail: "APK não é mais aceito para novos apps. Assinar com Play App Signing.",
      },
      {
        id: "listing",
        title: "Store listing",
        detail:
          "Ícone 512, feature graphic 1024x500, screenshots, classificação etária (IARC), política de privacidade.",
      },
      {
        id: "aipolicy",
        title: "Generative AI Policy",
        detail:
          "Precisa reportar como IA é usada + moderação de output + botão de report in-app. Reprovações comuns.",
        link: {
          label: "Policy AI",
          href: "https://support.google.com/googleplay/android-developer/answer/13985936",
        },
      },
    ],
  },
  {
    id: "launch",
    title: "Dia do lançamento",
    subtitle: "Execução coordenada em 48h.",
    items: [
      {
        id: "warmup",
        title: "Warm-up 7 dias antes",
        detail: "3 posts teaser + DM pra 20 pessoas-âncora + email pra waitlist.",
      },
      {
        id: "ph",
        title: "Product Hunt (opcional)",
        detail: "Agendar 00:01 PST (5h Brasília). Hunter forte. Assets prontos.",
        link: { label: "producthunt.com", href: "https://www.producthunt.com" },
      },
      {
        id: "content",
        title: "Conteúdo do dia",
        detail: "1 thread longa (X/LinkedIn) + 1 vídeo curto + 1 landing atualizada com social proof.",
      },
      {
        id: "support",
        title: "Suporte ao vivo por 8h",
        detail: "Discord/Intercom com você respondendo. Bugs de dia 1 viram case público.",
      },
    ],
  },
  {
    id: "post",
    title: "Pós-lançamento",
    subtitle: "Semana 1 define retenção.",
    items: [
      {
        id: "cohort",
        title: "Cohort semanal de retenção",
        detail: "Painel Mixpanel/PostHog. Meta D7 mínima: 25% para SaaS de IA sério.",
      },
      {
        id: "interview",
        title: "5 entrevistas com usuário",
        detail: "Ligue pra 5 pagantes na primeira semana. Não survey — ligação.",
      },
      {
        id: "iterate",
        title: "1 update público por semana",
        detail: "Changelog visível. Ritmo alto = confiança alta.",
      },
    ],
  },
];

// ---------- state ----------
type ChecklistState = Record<string, boolean>;
const KEY = "aiae:launch-checklist:v1";

let __cachedRaw: string | null | undefined;
let __cachedValue: any = {};
function read(): ChecklistState {
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
const emit = () => listeners.forEach((l) => l());
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};

export function useChecklist() {
  const state = useSyncExternalStore(subscribe, read, read));
  return {
    state,
    toggle(id: string) {
      const s = read();
      s[id] = !s[id];
      localStorage.setItem(KEY, JSON.stringify(s));
      emit();
    },
    reset() {
      localStorage.removeItem(KEY);
      emit();
    },
  };
}

export function totalItems() {
  return launchPlaybook.reduce((a, s) => a + s.items.length, 0);
}
