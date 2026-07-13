import { useCallback, useEffect, useSyncExternalStore } from "react";

const KEY = "aiae:profile:v1";

export type Profile = {
  name: string;
  handle: string;
  avatar: string; // emoji or initial
  goal: "launch-mvp" | "acquire-clients" | "scale-agency" | "explore";
  weeklyHours: number;
  timezone: string;
  onboarded: boolean;
  createdAt: string;
};

const DEFAULT: Profile = {
  name: "",
  handle: "",
  avatar: "◆",
  goal: "explore",
  weeklyHours: 5,
  timezone: "America/Sao_Paulo",
  onboarded: false,
  createdAt: new Date().toISOString(),
};

const listeners = new Set<() => void>();

let cachedRaw: string | null | undefined;
let cachedProfile: Profile = DEFAULT;

function read(): Profile {
  if (typeof window === "undefined") return DEFAULT;
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(KEY);
  } catch {
    return cachedProfile;
  }
  if (raw === cachedRaw) return cachedProfile;
  cachedRaw = raw;
  try {
    cachedProfile = raw ? ({ ...DEFAULT, ...JSON.parse(raw) } as Profile) : DEFAULT;
  } catch {
    cachedProfile = DEFAULT;
  }
  return cachedProfile;
}

function write(p: Profile) {
  if (typeof window === "undefined") return;
  const raw = JSON.stringify(p);
  window.localStorage.setItem(KEY, raw);
  cachedRaw = raw;
  cachedProfile = p;
  listeners.forEach((l) => l());
}

export function useProfile() {
  const profile = useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    read,
    () => DEFAULT,
  );

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) listeners.forEach((l) => l());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const update = useCallback((patch: Partial<Profile>) => {
    write({ ...read(), ...patch });
  }, []);

  const reset = useCallback(() => {
    if (typeof window !== "undefined") window.localStorage.removeItem(KEY);
    cachedRaw = null;
    cachedProfile = DEFAULT;
    listeners.forEach((l) => l());
  }, []);

  return { profile, update, reset };
}

export const GOALS: Record<Profile["goal"], { label: string; desc: string }> = {
  "launch-mvp": { label: "Lançar meu MVP em 60 dias", desc: "Do zero à primeira versão pública." },
  "acquire-clients": { label: "Conquistar clientes pagando", desc: "Posicionamento + primeiros contratos." },
  "scale-agency": { label: "Escalar minha agência/estúdio", desc: "Operação, delivery e recorrência." },
  explore: { label: "Explorar e absorver", desc: "Sem pressa — dominar os fundamentos." },
};
