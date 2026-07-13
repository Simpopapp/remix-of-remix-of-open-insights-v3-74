import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useStreak } from "./streak";
import { useActivity } from "./activity";

const KEY = "aiae:auto-freeze:v1";

/**
 * Auto-applies a streak freeze to yesterday if:
 *  - yesterday had zero activity
 *  - the day before had activity (breaking streak worth saving)
 *  - the user has freezes available
 * Runs once per session.
 */
export function useAutoFreeze() {
  const { days } = useActivity(84);
  const { freezesLeft, applyFreeze } = useStreak();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    if (typeof window === "undefined") return;
    if (days.length < 3 || freezesLeft <= 0) return;

    const today = days[days.length - 1];
    const yesterday = days[days.length - 2];
    const dayBefore = days[days.length - 3];
    if (!yesterday || !dayBefore) return;

    // Already handled this session
    const flag = window.sessionStorage.getItem(KEY);
    if (flag === yesterday.date) return;

    // Only auto-freeze if yesterday was missed AND there was momentum before
    if (yesterday.total === 0 && dayBefore.total > 0 && today.total > 0) {
      const ok = applyFreeze(yesterday.date);
      if (ok) {
        window.sessionStorage.setItem(KEY, yesterday.date);
        toast.success("Freeze de streak aplicado", {
          description: `Salvamos ${yesterday.date} pra proteger sua sequência. ${freezesLeft - 1} freeze(s) restantes.`,
        });
      }
    } else {
      window.sessionStorage.setItem(KEY, yesterday.date);
    }
    ran.current = true;
  }, [days, freezesLeft, applyFreeze]);
}
