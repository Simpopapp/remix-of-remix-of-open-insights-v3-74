import { createFileRoute } from "@tanstack/react-router";
import { Keyboard } from "lucide-react";

export const Route = createFileRoute("/atalhos")({
  head: () => ({
    meta: [
      { title: "Atalhos de teclado — AI App Empire" },
      { name: "description", content: "Todos os atalhos de teclado da área do aluno." },
    ],
  }),
  component: AtalhosPage,
});

// SINGLE SOURCE OF TRUTH — every shortcut listed here is actually wired up.
// Global player: src/lib/global-shortcuts.ts
// Command palette: src/components/CommandPalette.tsx
// Shortcuts overlay: src/components/ShortcutsOverlay.tsx
const groups: { title: string; items: { keys: string[]; desc: string }[] }[] = [
  {
    title: "Global",
    items: [
      { keys: ["⌘", "K"], desc: "Abrir Command Palette / busca global" },
      { keys: ["Ctrl", "K"], desc: "Abrir Command Palette (Windows/Linux)" },
      { keys: ["?"], desc: "Abrir/fechar este overlay de atalhos" },
    ],
  },
  {
    title: "Player de vídeo",
    items: [
      { keys: ["Espaço"], desc: "Play / pause" },
      { keys: ["K"], desc: "Play / pause" },
      { keys: ["→"], desc: "Avançar 10s" },
      { keys: ["L"], desc: "Avançar 10s" },
      { keys: ["←"], desc: "Voltar 10s" },
      { keys: ["J"], desc: "Voltar 10s" },
      { keys: [","], desc: "Diminuir velocidade" },
      { keys: ["."], desc: "Aumentar velocidade" },
      { keys: ["F"], desc: "Tela cheia" },
    ],
  },
];

function AtalhosPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10 lg:py-14">
      <div className="text-xs uppercase tracking-[0.28em] text-primary">Referência</div>
      <div className="mt-2 flex items-center gap-3">
        <Keyboard className="h-6 w-6 text-primary" />
        <h1 className="font-serif text-4xl lg:text-5xl tracking-tight">Atalhos de teclado</h1>
      </div>
      <p className="mt-3 max-w-xl text-muted-foreground">
        Cada atalho listado aqui está efetivamente implementado. Sem promessas
        vazias — o que aparece funciona.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {groups.map((g) => (
          <section key={g.title} className="rounded-2xl border border-border bg-card p-6">
            <div className="text-xs uppercase tracking-[0.24em] text-primary">{g.title}</div>
            <ul className="mt-4 divide-y divide-border">
              {g.items.map((it, i) => (
                <li key={i} className="flex items-center justify-between gap-4 py-2.5">
                  <span className="text-sm text-muted-foreground">{it.desc}</span>
                  <span className="flex items-center gap-1 shrink-0">
                    {it.keys.map((k, j) => (
                      <kbd
                        key={j}
                        className="inline-grid min-w-6 h-6 place-items-center rounded border border-border bg-muted/40 px-1.5 text-[11px] font-mono text-foreground"
                      >
                        {k}
                      </kbd>
                    ))}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <p className="mt-8 text-xs text-muted-foreground">
        Não digitamos atalhos em campos de texto — foque fora de inputs para
        acioná-los.
      </p>
    </div>
  );
}
