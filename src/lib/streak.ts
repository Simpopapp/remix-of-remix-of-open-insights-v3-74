import { useMemo } from "react";
import { useActivity } from "./activity";

export function useStreak() {
  const { days } = useActivity(84);
  return useMemo(() => {
    // days is ordered oldest -> newest
    let current = 0;
    for (let i = days.length - 1; i >= 0; i--) {
      if (days[i].total > 0) current++;
      else break;
    }
    let longest = 0;
    let run = 0;
    for (const d of days) {
      if (d.total > 0) {
        run++;
        if (run > longest) longest = run;
      } else run = 0;
    }
    const activeDays = days.filter((d) => d.total > 0).length;
    return { current, longest, activeDays };
  }, [days]);
}
