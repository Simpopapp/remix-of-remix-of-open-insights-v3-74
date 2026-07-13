import { useCallback, useSyncExternalStore } from "react";

const KEY = "aiae:agenda:v1";

export type AgendaBlock = {
  id: string;
  day: number; // 0..6 (Sun..Sat)
  start: string; // "HH:MM"
  end: string; // "HH:MM"
  title: string;
  moduleId?: string;
  lessonId?: string;
  color?: string;
  done?: boolean;
};

type State = { blocks: AgendaBlock[] };
const DEFAULT: State = {
  blocks: [
    { id: "b1", day: 1, start: "07:00", end: "08:00", title: "Ritual matinal — Módulo 1", color: "gold" },
    { id: "b2", day: 2, start: "20:00", end: "21:30", title: "Deep work — Agentes", color: "gold" },
    { id: "b3", day: 4, start: "07:00", end: "08:00", title: "Exercícios + revisão", color: "muted" },
    { id: "b4", day: 6, start: "10:00", end: "12:00", title: "Mentoria semanal ao vivo", color: "gold" },
  ],
};

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

let __cachedRaw: string | null | undefined;
let __cachedValue: any = DEFAULT;
function read(): State {
  if (typeof window === "undefined") return DEFAULT;
  let raw: string | null;
  try { raw = window.localStorage.getItem(KEY); } catch { return __cachedValue; }
  if (raw === __cachedRaw) return __cachedValue;
  __cachedRaw = raw;
  try { __cachedValue = JSON.parse(raw); } catch { __cachedValue = DEFAULT; }
  return __cachedValue;
}
function __invalidateCache(raw: string | null, value: any) { __cachedRaw = raw; __cachedValue = value; }
function write(s: State) {
  if (typeof window === "undefined") return;
  const __raw = JSON.stringify(s);
  window.localStorage.setItem(KEY, __raw);
  __invalidateCache(__raw, s);
  notify();
}

export function useAgenda() {
  const state = useSyncExternalStore((cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    }, read, read);

  const add = useCallback((b: Omit<AgendaBlock, "id">) => {
    const cur = read();
    const nb: AgendaBlock = { ...b, id: crypto.randomUUID() };
    write({ blocks: [...cur.blocks, nb] });
    return nb;
  }, []);
  const update = useCallback((id: string, patch: Partial<AgendaBlock>) => {
    const cur = read();
    write({ blocks: cur.blocks.map((b) => (b.id === id ? { ...b, ...patch } : b)) });
  }, []);
  const remove = useCallback((id: string) => {
    const cur = read();
    write({ blocks: cur.blocks.filter((b) => b.id !== id) });
  }, []);
  const toggleDone = useCallback((id: string) => {
    const cur = read();
    write({ blocks: cur.blocks.map((b) => (b.id === id ? { ...b, done: !b.done } : b)) });
  }, []);

  return { blocks: state.blocks, add, update, remove, toggleDone };
}

export const DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
export const DAYS_FULL = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

export function minutesOf(hhmm: string) {
  const [h, m] = hhmm.split(":").map((n) => parseInt(n, 10));
  return (h || 0) * 60 + (m || 0);
}
