import { useCallback, useSyncExternalStore } from "react";
import { pushInbox } from "./inbox";

const KEY = "aiae:reservations:v1";

export type Reservation = {
  id: string;
  title: string;
  when: string;
  href?: string;
  at: string; // ISO reserved-at
};

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

let cachedRaw: string | null | undefined;
let cachedList: Reservation[] = [];

function read(): Reservation[] {
  if (typeof window === "undefined") return cachedList;
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(KEY);
  } catch {
    return cachedList;
  }
  if (raw === cachedRaw) return cachedList;
  cachedRaw = raw;
  try {
    cachedList = raw ? (JSON.parse(raw) as Reservation[]) : [];
  } catch {
    cachedList = [];
  }
  return cachedList;
}

function write(v: Reservation[]) {
  if (typeof window === "undefined") return;
  const raw = JSON.stringify(v);
  window.localStorage.setItem(KEY, raw);
  cachedRaw = raw;
  cachedList = v;
  notify();
}

export function useReservations() {
  const list = useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    read,
    read,
  );

  const isReserved = useCallback(
    (id: string) => list.some((r) => r.id === id),
    [list],
  );

  const toggle = useCallback(
    (payload: Omit<Reservation, "at">) => {
      const cur = read();
      const existing = cur.find((r) => r.id === payload.id);
      if (existing) {
        write(cur.filter((r) => r.id !== payload.id));
        return { reserved: false };
      }
      const reservation: Reservation = { ...payload, at: new Date().toISOString() };
      write([reservation, ...cur]);
      // Persistent confirmation lands in the inbox
      pushInbox({
        id: `res-${payload.id}`,
        from: "Concierge",
        title: `Assento reservado — ${payload.title}`,
        body: `Você reservou seu lugar para **${payload.title}** (${payload.when}). Chegaremos com o link 30 minutos antes.`,
        tag: "concierge",
        href: payload.href ?? "/comunidade",
      });
      return { reserved: true };
    },
    [],
  );

  return { list, isReserved, toggle };
}
