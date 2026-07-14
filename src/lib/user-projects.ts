// User-submitted projects for the Vitrine. Counts toward certificate.
import { useCallback, useSyncExternalStore } from "react";
import { pushInbox } from "./inbox";

const KEY = "aiae:user-projects:v1";

export type UserProject = {
  id: string;
  name: string;
  tagline: string;
  stage: "Ideia" | "MVP" | "Live" | "Pagando" | "Escalando";
  stack: string[];
  link?: string;
  story?: string;
  at: string;
};

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

let __raw: string | null | undefined;
let __val: UserProject[] = [];

function read(): UserProject[] {
  if (typeof window === "undefined") return __val;
  let raw: string | null;
  try { raw = window.localStorage.getItem(KEY); } catch { return __val; }
  if (raw === __raw) return __val;
  __raw = raw;
  try { __val = raw ? (JSON.parse(raw) as UserProject[]) : []; } catch { __val = []; }
  return __val;
}
function write(v: UserProject[]) {
  if (typeof window === "undefined") return;
  const raw = JSON.stringify(v);
  window.localStorage.setItem(KEY, raw);
  __raw = raw;
  __val = v;
  notify();
}

export function useUserProjects() {
  const list = useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb); },
    read,
    read,
  );
  const add = useCallback((p: Omit<UserProject, "id" | "at">) => {
    const item: UserProject = { ...p, id: `up-${Date.now().toString(36)}`, at: new Date().toISOString() };
    write([item, ...read()]);
    pushInbox({
      from: "Sistema",
      title: "Projeto publicado na vitrine",
      body: `"${item.name}" está no ar. Isso conta pro seu certificado.`,
      tag: "conquista",
      href: "/projetos",
    });
    return item;
  }, []);
  const remove = useCallback((id: string) => write(read().filter((p) => p.id !== id)), []);
  return { list, add, remove, count: list.length };
}

export function readUserProjectsCount(): number {
  return read().length;
}
