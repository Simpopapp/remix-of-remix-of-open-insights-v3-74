// Exam state — persists best attempt. Single source of truth for /certificado.
import { useSyncExternalStore } from "react";

const KEY = "aiae:exam:v2";

export type ExamAttempt = {
  score: number;
  total: number;
  pct: number;
  passed: boolean;
  at: string; // ISO
  durationSec: number;
};

export type ExamState = {
  attempts: number;
  best?: ExamAttempt;
  last?: ExamAttempt;
};

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

let __raw: string | null | undefined;
let __val: ExamState = { attempts: 0 };

function read(): ExamState {
  if (typeof window === "undefined") return __val;
  let raw: string | null;
  try { raw = window.localStorage.getItem(KEY); } catch { return __val; }
  if (raw === __raw) return __val;
  __raw = raw;
  try { __val = raw ? (JSON.parse(raw) as ExamState) : { attempts: 0 }; }
  catch { __val = { attempts: 0 }; }
  return __val;
}
function write(v: ExamState) {
  if (typeof window === "undefined") return;
  const raw = JSON.stringify(v);
  window.localStorage.setItem(KEY, raw);
  __raw = raw;
  __val = v;
  notify();
}

export function saveExamAttempt(a: ExamAttempt): ExamState {
  const cur = read();
  const attempts = cur.attempts + 1;
  const best = !cur.best || a.pct > cur.best.pct ? a : cur.best;
  const next: ExamState = { attempts, best, last: a };
  write(next);
  return next;
}

export function useExam(): ExamState {
  return useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb); },
    read,
    read,
  );
}

export const EXAM_PASS_PCT = 70;
