import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useGamification } from "./gamification";

const KEY = "aiae:lastLevel:v1";

export function LevelUpWatcher() {
  const { level, rank, xp } = useGamification();
  const bootstrapped = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = Number(window.localStorage.getItem(KEY) ?? "0");
    if (!bootstrapped.current) {
      bootstrapped.current = true;
      if (!stored) window.localStorage.setItem(KEY, String(level));
      return;
    }
    if (level > stored) {
      window.localStorage.setItem(KEY, String(level));
      toast.success(`Level ${level} desbloqueado`, {
        description: `Novo rank: ${rank} • ${xp.toLocaleString("pt-BR")} XP`,
        duration: 6000,
      });
    } else if (level < stored) {
      window.localStorage.setItem(KEY, String(level));
    }
  }, [level, rank, xp]);

  return null;
}
