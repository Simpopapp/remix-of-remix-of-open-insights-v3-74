import { createFileRoute } from "@tanstack/react-router";
import { Calendar, MessageCircle, Users, Video } from "lucide-react";
import { HeroBanner } from "@/components/HeroBanner";
import heroComunidade from "@/assets/hero-comunidade.jpg";

export const Route = createFileRoute("/comunidade")({
  head: () => ({
    meta: [
      { title: "Comunidade — AI App Empire" },
      { name: "description", content: "Cohort privada, lives semanais e o círculo de builders do AI App Empire." },
    ],
  }),
  component: CommunityPage,
});

const upcoming = [
  {
    date: "Quarta · 20h",
    title: "Build session — MCP na prática",
    host: "Concierge",
    tag: "Live",
  },
  {
    date: "Sexta · 19h",
    title: "Office hours — dúvidas de billing",
    host: "Mesa Sênior",
    tag: "Q&A",
  },
  {
    date: "Sábado · 10h",
    title: "Demo day — alunos apresentam seus apps",
    host: "Cohort 01",
    tag: "Show",
  },
];

const members = [
  { name: "Rafael M.", role: "Founder · SaaS jurídico", initials: "RM" },
  { name: "Beatriz L.", role: "CTO · Fintech B2B", initials: "BL" },
  { name: "Diego S.", role: "Solo builder · Health AI", initials: "DS" },
  { name: "Marina C.", role: "Head of AI · Retail", initials: "MC" },
  { name: "Tiago R.", role: "Consultor · Agentic Ops", initials: "TR" },
  { name: "Ana P.", role: "PM · EdTech", initials: "AP" },
];

const channels = [
  { name: "#anúncios", desc: "Comunicados oficiais e drops de conteúdo.", count: 12 },
  { name: "#builds", desc: "Compartilhe o que está construindo.", count: 87 },
  { name: "#hiring", desc: "Vagas e projetos entre alunos.", count: 34 },
  { name: "#deals", desc: "Créditos e descontos exclusivos.", count: 21 },
];

function CommunityPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10 lg:py-14">
      <HeroBanner
        image={heroComunidade}
        eyebrow={<><Users className="inline h-3 w-3 mr-1" /> Círculo privado</>}
        title={<><span className="text-gold-gradient">Comunidade</span></>}
        subtitle="A cohort é o produto. Encontros semanais ao vivo, canais privados e uma mesa de builders sênior."
      />


      <section className="mt-10 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 lg:p-8">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-primary">
            <Calendar className="h-3 w-3" /> Próximos encontros
          </div>
          <div className="mt-6 divide-y divide-border">
            {upcoming.map((u) => (
              <div key={u.title} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-primary/15 text-primary">
                  <Video className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-primary font-mono">{u.date}</div>
                  <div className="font-medium truncate">{u.title}</div>
                  <div className="text-xs text-muted-foreground">com {u.host}</div>
                </div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground border border-border rounded-full px-2 py-1">
                  {u.tag}
                </div>
                <button className="rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-95">
                  Reservar
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-card p-6 lg:p-8">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-primary">
            <Users className="h-3 w-3" /> Cohort 01
          </div>
          <div className="mt-4 font-serif text-4xl">147</div>
          <div className="text-xs text-muted-foreground">membros ativos</div>
          <div className="mt-6 space-y-2 text-sm">
            <Stat label="Apps publicados" value="38" />
            <Stat label="Lives realizadas" value="12" />
            <Stat label="MRR combinado" value="R$ 412k" />
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-primary">
            <MessageCircle className="h-3 w-3" /> Canais
          </div>
          <ul className="mt-4 divide-y divide-border">
            {channels.map((c) => (
              <li key={c.name} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <div className="font-mono text-sm text-primary">{c.name}</div>
                <div className="flex-1 text-xs text-muted-foreground truncate">{c.desc}</div>
                <div className="text-xs tabular-nums text-muted-foreground">
                  {c.count} hoje
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-primary">
            <Users className="h-3 w-3" /> Mesa sênior
          </div>
          <ul className="mt-4 grid grid-cols-2 gap-3">
            {members.map((m) => (
              <li key={m.name} className="flex items-center gap-3 rounded-xl border border-border p-3">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-primary/15 text-primary font-mono text-xs">
                  {m.initials}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{m.name}</div>
                  <div className="text-[11px] text-muted-foreground truncate">{m.role}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono text-primary">{value}</span>
    </div>
  );
}
