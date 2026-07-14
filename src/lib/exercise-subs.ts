// Exercise submissions — metadata companion to user-state's exercises map.
// The count/toggle stays in useExercises; here we store text + link + submittedAt.
import { useCallback, useSyncExternalStore } from "react";
import { pingActivity } from "./activity";
import { pushInbox } from "./inbox";

const KEY = "aiae:exercise-subs:v1";

export type Submission = {
  text: string;
  link?: string;
  at: string; // ISO
};

type Map = Record<string, Submission>;

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

let __raw: string | null | undefined;
let __val: Map = {};

function read(): Map {
  if (typeof window === "undefined") return __val;
  let raw: string | null;
  try { raw = window.localStorage.getItem(KEY); } catch { return __val; }
  if (raw === __raw) return __val;
  __raw = raw;
  try { __val = raw ? (JSON.parse(raw) as Map) : {}; } catch { __val = {}; }
  return __val;
}
function write(v: Map) {
  if (typeof window === "undefined") return;
  const raw = JSON.stringify(v);
  window.localStorage.setItem(KEY, raw);
  __raw = raw;
  __val = v;
  notify();
}

export function useSubmissions() {
  const map = useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb); },
    read,
    read,
  );
  const get = useCallback((k: string) => read()[k], []);
  const submit = useCallback((k: string, text: string, link?: string, lessonTitle?: string) => {
    const cur = { ...read() };
    const isNew = !cur[k];
    cur[k] = { text, link, at: new Date().toISOString() };
    write(cur);
    if (isNew) {
      pingActivity("exercise");
      pushInbox({
        from: "Sistema",
        title: `Exercício entregue`,
        body: lessonTitle ? `Sua entrega de "${lessonTitle}" foi registrada.` : "Sua entrega foi registrada.",
        tag: "sistema",
      });
    }
  }, []);
  const remove = useCallback((k: string) => {
    const cur = { ...read() };
    delete cur[k];
    write(cur);
  }, []);
  return { map, get, submit, remove, count: Object.keys(map).length };
}

export function readSubmissionsCount(): number {
  return Object.keys(read()).length;
}
