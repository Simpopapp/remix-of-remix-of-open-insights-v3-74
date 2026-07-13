import { useSyncExternalStore, useEffect } from "react";

export type Theme = "light" | "dark" | "system";
const KEY = "aiae:theme";
const listeners = new Set<() => void>();

function read(): Theme {
  if (typeof window === "undefined") return "dark";
  const v = localStorage.getItem(KEY);
  return v === "light" || v === "dark" || v === "system" ? v : "dark";
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => e.key === KEY && cb();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot(): Theme {
  return read();
}
function getServer(): Theme {
  return "dark";
}

export function setTheme(t: Theme) {
  localStorage.setItem(KEY, t);
  apply(t);
  listeners.forEach((l) => l());
}

function resolve(t: Theme): "light" | "dark" {
  if (t !== "system") return t;
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function apply(t: Theme) {
  if (typeof document === "undefined") return;
  const resolved = resolve(t);
  document.documentElement.classList.toggle("light", resolved === "light");
  document.documentElement.classList.toggle("dark", resolved === "dark");
  document.documentElement.style.colorScheme = resolved;
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServer);
  useEffect(() => {
    apply(theme);
    if (theme === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: light)");
      const onChange = () => apply("system");
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    }
  }, [theme]);
  return { theme, resolved: resolve(theme), setTheme };
}
