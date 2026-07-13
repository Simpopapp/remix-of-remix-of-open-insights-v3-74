import { useCallback, useEffect, useMemo, useSyncExternalStore } from "react";

const KEY = "aiae:inbox:v1";

export type InboxMessage = {
  id: string;
  at: string; // ISO
  from: string;
  title: string;
  body: string;
  tag: "concierge" | "sistema" | "cohort" | "conquista";
  read?: boolean;
  href?: string;
};

const SEED: InboxMessage[] = [
  {
    id: "welcome",
    at: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    from: "Concierge",
    title: "Bem-vindo ao AI App Empire",
    body: "Este é o seu inbox. Aqui você recebe avisos do concierge, atualizações de cohort e conquistas. Sugestão: comece pela **Aula 01 do Módulo 01**.",
    tag: "concierge",
  },
  {
    id: "live-thu",
    at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    from: "Concierge",
    title: "Live de arquitetura — Quinta 20h",
    body: "Vamos dissecar 3 arquiteturas de agentes que rodam em produção. Traga suas dúvidas.",
    tag: "cohort",
    href: "/comunidade",
  },
  {
    id: "playbook",
    at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    from: "Sistema",
    title: "Playbook de lançamento atualizado",
    body: "Adicionamos 4 novos itens ao Playbook: preço-âncora, waitlist reversa, order bump e teardown de LP.",
    tag: "sistema",
    href: "/lancamento",
  },
  {
    id: "showcase",
    at: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
    from: "Cohort",
    title: "3 novos projetos na Vitrine",
    body: "Marina, Diego e Sophie subiram projetos essa semana. Vale a inspiração — abra a Vitrine.",
    tag: "cohort",
    href: "/projetos",
  },
];

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

let cachedRaw: string | null | undefined;
let cachedList: InboxMessage[] = SEED;

function read(): InboxMessage[] {
  if (typeof window === "undefined") return SEED;
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(KEY);
    if (!raw) {
      raw = JSON.stringify(SEED);
      window.localStorage.setItem(KEY, raw);
    }
  } catch {
    return cachedList;
  }
  if (raw === cachedRaw) return cachedList;
  cachedRaw = raw;
  try {
    cachedList = JSON.parse(raw) as InboxMessage[];
  } catch {
    cachedList = SEED;
  }
  return cachedList;
}
function write(v: InboxMessage[]) {
  if (typeof window === "undefined") return;
  const raw = JSON.stringify(v);
  window.localStorage.setItem(KEY, raw);
  cachedRaw = raw;
  cachedList = v;
  notify();
}

export function pushInbox(msg: Omit<InboxMessage, "id" | "at"> & { id?: string }) {
  const cur = read();
  const id = msg.id ?? `m-${Date.now()}`;
  if (cur.find((m) => m.id === id)) return;
  write([{ ...msg, id, at: new Date().toISOString() }, ...cur]);
}

export function useInbox() {
  const list = useSyncExternalStore((cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    }, read, read);
  useEffect(() => {
    const onS = (e: StorageEvent) => {
      if (e.key === KEY) notify();
    };
    window.addEventListener("storage", onS);
    return () => window.removeEventListener("storage", onS);
  }, []);

  const unread = useMemo(() => list.filter((m) => !m.read).length, [list]);

  const markRead = useCallback((id: string) => {
    write(read().map((m) => (m.id === id ? { ...m, read: true } : m)));
  }, []);
  const markAll = useCallback(() => {
    write(read().map((m) => ({ ...m, read: true })));
  }, []);
  const clear = useCallback((id: string) => {
    write(read().filter((m) => m.id !== id));
  }, []);

  return { list, unread, markRead, markAll, clear };
}
