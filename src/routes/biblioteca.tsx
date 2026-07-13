import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen, Download, FileCode2, FileText, Search, Wrench } from "lucide-react";
import { HeroBanner } from "@/components/HeroBanner";
import heroBiblioteca from "@/assets/hero-biblioteca.jpg";


export const Route = createFileRoute("/biblioteca")({
  head: () => ({
    meta: [
      { title: "Biblioteca — AI App Empire" },
      { name: "description", content: "Playbooks, templates, prompts e checklists do curso AI App Empire." },
    ],
  }),
  component: LibraryPage,
});

type Item = {
  id: string;
  title: string;
  type: "Playbook" | "Template" | "Prompt" | "Checklist" | "Repo";
  desc: string;
  size: string;
};

const items: Item[] = [
  { id: "p1", title: "Playbook de lançamento em 60 dias", type: "Playbook", desc: "Dia a dia para publicar e vender seu app.", size: "PDF · 42p" },
  { id: "p2", title: "Prompt library — agentes de produção", type: "Prompt", desc: "60+ prompts testados em produção.", size: "MD · 18kb" },
  { id: "p3", title: "Template MCP Server", type: "Template", desc: "Servidor MCP tipado com testes.", size: "TypeScript" },
  { id: "p4", title: "Checklist de segurança para agentes", type: "Checklist", desc: "Guardrails, permissões, logs.", size: "MD · 4kb" },
  { id: "p5", title: "Repo — Agente com memória vetorial", type: "Repo", desc: "Exemplo executável com Postgres + pgvector.", size: "GitHub" },
  { id: "p6", title: "Template de landing high-ticket", type: "Template", desc: "Landing focada em conversão premium.", size: "React" },
  { id: "p7", title: "Playbook de pricing recorrente", type: "Playbook", desc: "Como precificar 10x acima do mercado.", size: "PDF · 28p" },
  { id: "p8", title: "Checklist de publicação nas stores", type: "Checklist", desc: "iOS + Android + Web sem retrabalho.", size: "MD · 6kb" },
];

const iconFor = (t: Item["type"]) => {
  switch (t) {
    case "Playbook": return BookOpen;
    case "Prompt": return FileText;
    case "Template": return Wrench;
    case "Checklist": return FileText;
    case "Repo": return FileCode2;
  }
};

function LibraryPage() {
  const [q, setQ] = useState("");
  const [type, setType] = useState<Item["type"] | "Tudo">("Tudo");

  const filtered = items.filter((i) => {
    if (type !== "Tudo" && i.type !== type) return false;
    if (q && !`${i.title} ${i.desc}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  const types: (Item["type"] | "Tudo")[] = ["Tudo", "Playbook", "Template", "Prompt", "Checklist", "Repo"];

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 lg:py-14 space-y-8">
      <HeroBanner
        image={heroBiblioteca}
        eyebrow="Arsenal"
        title={<>Biblioteca</>}
        subtitle="Playbooks, templates, prompts e repositórios. Tudo pronto para você colar e executar hoje."
      />



      <div className="mt-8 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar recursos…"
            className="w-full rounded-full border border-border bg-card pl-10 pr-4 py-2.5 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={
                "rounded-full border px-3 py-1.5 text-xs uppercase tracking-widest transition " +
                (type === t
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground")
              }
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {filtered.map((i) => {
          const Icon = iconFor(i.type);
          return (
            <div
              key={i.id}
              className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 hover:border-primary/50 transition"
            >
              <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/15 text-primary shrink-0">
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-widest text-primary">
                    {i.type}
                  </span>
                  <span className="text-[10px] text-muted-foreground">· {i.size}</span>
                </div>
                <div className="mt-1 font-medium">{i.title}</div>
                <div className="text-sm text-muted-foreground">{i.desc}</div>
              </div>
              <button
                aria-label="Baixar"
                className="grid h-9 w-9 place-items-center rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition"
              >
                <Download className="h-4 w-4" />
              </button>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground text-sm">
            Nada encontrado. Tente outro termo.
          </div>
        )}
      </div>
    </div>
  );
}
