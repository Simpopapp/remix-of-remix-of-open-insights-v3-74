// Daily quests — client-side, resets each day. Progress derived from other stores + a tiny counter.
import { useEffect, useSyncExternalStore } from "react";
import { useProgress } from "./progress";
import { useExercises } from "./user-state";

const KEY = "aiae:quests:v1";

type QuestState = {
  day: string; // YYYY-MM-DD
  claimed: string[]; // quest ids claimed today
  lessonsAtStart: number;
  exercisesAtStart: number;
  focusMinutes: number;
  notesWritten: number;
};

function today() {
  return new Date().toISOString().slice(0, 10);
}

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

function makeDefault(): QuestState {
  return { day: today(), claimed: [], lessonsAtStart: 0, exercisesAtStart: 0, focusMinutes: 0, notesWritten: 0 };
}

let __rawCache: string | null | undefined;
let __valueCache: QuestState = makeDefault();
let __dayCache: string = __valueCache.day;

function read(): QuestState {
  if (typeof window === "undefined") return __valueCache;
  const t = today();
  let raw: string | null;
  try { raw = window.localStorage.getItem(KEY); } catch { return __valueCache; }
  if (raw === __rawCache && __dayCache === t) return __valueCache;
  __rawCache = raw;
  __dayCache = t;
  try {
    const parsed = raw ? JSON.parse(raw) : null;
    if (!parsed || parsed.day !== t) __valueCache = makeDefault();
    else __valueCache = parsed as QuestState;
  } catch {
    __valueCache = makeDefault();
  }
  return __valueCache;
}
function write(s: QuestState) {
  if (typeof window === "undefined") return;
  const raw = JSON.stringify(s);
  window.localStorage.setItem(KEY, raw);
  __rawCache = raw;
  __valueCache = s;
  __dayCache = s.day;
  notify();
}

function ensureBaseline(lessons: number, exercises: number) {
  const cur = read();
  if (cur.day !== today() || (cur.lessonsAtStart === 0 && cur.exercisesAtStart === 0 && cur.claimed.length === 0)) {
    // First read of the day: capture baseline so quests reflect today's deltas.
    const fresh: QuestState = {
      day: today(),
      claimed: [],
      lessonsAtStart: lessons,
      exercisesAtStart: exercises,
      focusMinutes: 0,
      notesWritten: 0,
    };
    write(fresh);
    return fresh;
  }
  return cur;
}

export function addFocusMinutes(min: number) {
  const s = read();
  write({ ...s, focusMinutes: s.focusMinutes + Math.max(0, Math.round(min)) });
}
export function addNoteWritten() {
  const s = read();
  write({ ...s, notesWritten: s.notesWritten + 1 });
}
export function claimQuest(id: string) {
  const s = read();
  if (s.claimed.includes(id)) return;
  write({ ...s, claimed: [...s.claimed, id] });
}

export type Quest = {
  id: string;
  title: string;
  target: number;
  progress: number;
  xp: number;
  claimed: boolean;
  done: boolean;
};

export function useQuests(): Quest[] {
  const { completedCount } = useProgress();
  const { count: exercisesDone } = useExercises();

  const state = useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => {
        listeners.delete(cb);
      };
    },
    read,
    read,
  );

  useEffect(() => {
    ensureBaseline(completedCount, exercisesDone);
  }, [completedCount, exercisesDone]);

  const lessonsToday = Math.max(0, completedCount - state.lessonsAtStart);
  const exercisesToday = Math.max(0, exercisesDone - state.exercisesAtStart);

  const quests: Omit<Quest, "claimed" | "done">[] = [
    { id: "lesson-1", title: "Concluir 1 aula", target: 1, progress: Math.min(1, lessonsToday), xp: 50 },
    { id: "focus-25", title: "25 min de foco profundo", target: 25, progress: Math.min(25, state.focusMinutes), xp: 80 },
    { id: "exercise-1", title: "Registrar 1 exercício", target: 1, progress: Math.min(1, exercisesToday), xp: 60 },
    { id: "note-1", title: "Escrever 1 nota de aula", target: 1, progress: Math.min(1, state.notesWritten), xp: 40 },
  ];

  return quests.map((q) => ({
    ...q,
    claimed: state.claimed.includes(q.id),
    done: q.progress >= q.target,
  }));
}
