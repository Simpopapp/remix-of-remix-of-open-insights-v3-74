import { createFileRoute, Link } from "@tanstack/react-router";
import { useInbox, type InboxMessage } from "@/lib/inbox";
import { CheckCheck, Inbox, Trash2 } from "lucide-react";
import { renderMarkdown } from "@/lib/markdown";

export const Route = createFileRoute("/inbox")({
  head: () => ({
    meta: [
      { title: "Inbox — AI App Empire" },
      { name: "description", content: "Mensagens do concierge, avisos da cohort e conquistas desbloqueadas." },
    ],
  }),
  component: InboxPage,
});

const tagStyles: Record<InboxMessage["tag"], string> = {
  concierge: "bg-primary/15 text-primary border-primary/40",
  sistema: "bg-muted text-muted-foreground border-border",
  cohort: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  conquista: "bg-amber-500/15 text-amber-400 border-amber-500/30",
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "agora";
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return `${d}d`;
}

function InboxPage() {
  const { list, unread, markRead, markAll, clear } = useInbox();

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.28em] text-primary">Concierge</div>
          <h1 className="mt-2 font-serif text-4xl">Inbox</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {unread > 0 ? `${unread} não lida${unread > 1 ? "s" : ""}` : "Tudo em dia."}
          </p>
        </div>
        {unread > 0 && (
          <button
            onClick={markAll}
            className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-sm text-primary hover:bg-primary/20"
          >
            <CheckCheck className="h-4 w-4" /> Marcar todas
          </button>
        )}
      </div>

      <div className="mt-8 space-y-3">
        {list.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center">
            <Inbox className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-4 text-sm text-muted-foreground">Sem mensagens.</p>
          </div>
        )}
        {list.map((m) => {
          const body = (
            <div
              className="mt-2 text-sm text-muted-foreground leading-relaxed [&_strong]:text-foreground"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(m.body) }}
            />
          );
          return (
            <div
              key={m.id}
              onClick={() => !m.read && markRead(m.id)}
              className={
                "group rounded-2xl border p-5 transition cursor-pointer " +
                (m.read
                  ? "border-border bg-card/40"
                  : "border-primary/40 bg-primary/5 shadow-sm shadow-primary/10")
              }
            >
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-widest ${tagStyles[m.tag]}`}>
                    {m.tag}
                  </span>
                  <span className="text-xs text-muted-foreground">{m.from} · {timeAgo(m.at)}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    clear(m.id);
                  }}
                  aria-label="Descartar"
                  className="rounded-full p-1 text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-accent"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="mt-2 font-serif text-lg">{m.title}</div>
              {body}
              {m.href && (
                <Link
                  to={m.href}
                  className="mt-3 inline-flex text-xs uppercase tracking-widest text-primary hover:underline"
                >
                  Abrir →
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
