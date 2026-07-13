import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen, Check, Download, FileCode2, FileText, Search, Wrench } from "lucide-react";
import { toast } from "sonner";
import { HeroBanner } from "@/components/HeroBanner";
import { downloadTextFile, slugify } from "@/lib/download";
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

function buildFile(i: Item): { name: string; body: string; mime: string } {
  const ext = i.type === "Repo" ? "md" : i.type === "Template" && i.size.includes("TypeScript") ? "ts" : i.type === "Template" && i.size.includes("React") ? "tsx" : "md";
  const header = `# ${i.title}\n\n> ${i.desc}\n> Tipo: ${i.type} · ${i.size}\n> Baixado em ${new Date().toLocaleString("pt-BR")}\n\n---\n\n`;
  const bodyByType: Record<Item["type"], string> = {
    Playbook: `## Sumário\n\n1. Fundamento\n2. Semana 1 — Descoberta\n3. Semana 2 — Protótipo\n4. Semana 3 — Beta pago\n5. Semana 4 — Lançamento\n6. Métricas & retenção\n\n## Como usar\n\nAbra o playbook completo dentro da plataforma. Este arquivo é seu offline pack — mantenha-o versionado ao lado do seu projeto.\n`,
    Prompt: `## Prompts\n\n\`\`\`\n[SISTEMA]\nVocê é um agente ...\n\n[USUÁRIO]\n{{input}}\n\`\`\`\n\nVer coleção completa em /prompts.\n`,
    Template: `// Cole em seu repositório e ajuste os TODOs.\n// Documentação completa dentro do curso.\n\nexport const template = "AI App Empire — ${i.title}";\n`,
    Checklist: `## Checklist\n\n- [ ] Item 1\n- [ ] Item 2\n- [ ] Item 3\n- [ ] Item 4\n\nMarque cada item conforme executa. Fonte da verdade dentro da plataforma.\n`,
    Repo: `## Repositório de referência\n\nEste é um stub. Abra o repositório completo dentro da plataforma para clonar via git.\n`,
  };
  return {
    name: `${slugify(i.title)}.${ext}`,
    body: header + bodyByType[i.type],
    mime: ext === "ts" || ext === "tsx" ? "text/plain" : "text/markdown",
  };
}

function LibraryPage() {
  const [q, setQ] = useState("");
  const [type, setType] = useState<Item["type"] | "Tudo">("Tudo");
  const [downloaded, setDownloaded] = useState<Set<string>>(new Set());

  const filtered = items.filter((i) => {
    if (type !== "Tudo" && i.type !== type) return false;
    if (q && !`${i.title} ${i.desc}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  const types: (Item["type"] | "Tudo")[] = ["Tudo", "Playbook", "Template", "Prompt", "Checklist", "Repo"];

  const onDownload = (i: Item) => {
    const f = buildFile(i);
    downloadTextFile(f.name, f.body, f.mime);
    setDownloaded((prev) => new Set(prev).add(i.id));
    toast.success("Download iniciado", { description: f.name });
  };

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
                onClick={() => onDownload(i)}
                aria-label={`Baixar ${i.title}`}
                title="Baixar"
                className="grid h-9 w-9 place-items-center rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition"
              >
                {downloaded.has(i.id) ? <Check className="h-4 w-4" /> : <Download className="h-4 w-4" />}
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
