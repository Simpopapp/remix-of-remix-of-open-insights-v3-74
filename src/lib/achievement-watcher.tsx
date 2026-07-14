// Watches badge unlocks and fires toast + confetti + inbox once per badge.
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useBadges } from "./badges";
import { pushInbox } from "./inbox";
import { fireConfetti } from "./confetti";

const KEY = "aiae:badges-seen:v1";

function readSeen(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try { return new Set(JSON.parse(window.localStorage.getItem(KEY) ?? "[]")); }
  catch { return new Set(); }
}
function writeSeen(s: Set<string>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify([...s]));
}

export function AchievementWatcher() {
  const { badges } = useBadges();
  const bootstrapped = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = readSeen();
    const unlockedIds = badges.filter((b) => b.unlocked).map((b) => b.id);

    if (!bootstrapped.current) {
      // Seed seen with current unlocks so we only fire on future changes.
      bootstrapped.current = true;
      const next = new Set([...seen, ...unlockedIds]);
      writeSeen(next);
      return;
    }

    const fresh = unlockedIds.filter((id) => !seen.has(id));
    if (fresh.length === 0) return;

    const next = new Set(seen);
    for (const id of fresh) {
      next.add(id);
      const b = badges.find((x) => x.id === id);
      if (!b) continue;
      toast.success(`Selo conquistado: ${b.title}`, { description: b.desc, duration: 6000 });
      pushInbox({
        from: "Sistema",
        title: `Selo conquistado — ${b.title}`,
        body: b.desc,
        tag: "conquista",
        href: "/conquistas",
      });
    }
    writeSeen(next);

    // Confetti for legend tier, subtle burst for others.
    const anyLegend = fresh.some((id) => badges.find((b) => b.id === id)?.tier === "legend");
    fireConfetti(anyLegend ? "epic" : "soft");
  }, [badges]);

  return null;
}
