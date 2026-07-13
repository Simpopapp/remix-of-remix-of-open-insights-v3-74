import { useActivity } from "@/lib/activity";

const WEEKS = 12;
const DAYS = WEEKS * 7;

function level(total: number) {
  if (total === 0) return 0;
  if (total < 2) return 1;
  if (total < 5) return 2;
  if (total < 10) return 3;
  return 4;
}
const cellClass = [
  "bg-muted/40",
  "bg-primary/20",
  "bg-primary/40",
  "bg-primary/70",
  "bg-primary",
];

export function ActivityHeatmap() {
  const { days, totalEvents, activeDays } = useActivity(DAYS);
  // Pivot into 7 rows (weekdays) × WEEKS cols
  const rows: (typeof days)[] = Array.from({ length: 7 }, () => []);
  days.forEach((d) => {
    const dow = new Date(d.date + "T00:00:00").getDay();
    rows[dow].push(d);
  });
  // Pad shorter rows at the beginning
  const maxLen = Math.max(...rows.map((r) => r.length));
  rows.forEach((r) => {
    while (r.length < maxLen) r.unshift({ date: "", total: 0, kinds: {} });
  });

  return (
    <div className="rounded-2xl border border-primary/25 bg-card/50 p-5">
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.24em] text-primary">
            Ritual dos últimos {WEEKS} sábados
          </div>
          <div className="mt-1 font-serif text-lg">
            {activeDays} dias ativos · {totalEvents} interações
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1 text-[10px] text-muted-foreground">
          menos
          {cellClass.map((c, i) => (
            <span key={i} className={`h-2.5 w-2.5 rounded-sm ${c}`} />
          ))}
          mais
        </div>
      </div>
      <div className="mt-4 overflow-x-auto">
        <div className="inline-flex flex-col gap-1">
          {rows.map((row, ri) => (
            <div key={ri} className="flex gap-1">
              {row.map((d, ci) => (
                <span
                  key={ci}
                  title={d.date ? `${d.date} · ${d.total} interações` : ""}
                  className={`h-3 w-3 rounded-sm ${cellClass[level(d.total)]}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
