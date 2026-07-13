import { useEffect, useState } from "react";
import { X } from "lucide-react";

const SHORTCUTS: { keys: string; desc: string }[] = [
  { keys: "⌘ / Ctrl + K", desc: "Abrir busca global (aulas, notas, transcrições)" },
  { keys: "?", desc: "Mostrar este guia de atalhos" },
  { keys: "G depois D", desc: "Ir para o Dashboard" },
  { keys: "G depois F", desc: "Ir para modo Foco (Pomodoro)" },
  { keys: "G depois N", desc: "Ir para Notas" },
  { keys: "G depois P", desc: "Ir para Perfil" },
  { keys: "Espaço / K", desc: "Play / pausar vídeo" },
  { keys: "← / → · J / L", desc: "Retroceder / avançar 10s" },
  { keys: "M", desc: "Mudo" },
  { keys: "F", desc: "Tela cheia" },
];

export function ShortcutsOverlay() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let g = false;
    let gTimer: number | undefined;
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement)?.isContentEditable) return;
      if (e.key === "?" || (e.key === "/" && e.shiftKey)) {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key === "g" && !e.metaKey && !e.ctrlKey) {
        g = true;
        window.clearTimeout(gTimer);
        gTimer = window.setTimeout(() => (g = false), 900);
        return;
      }
      if (g) {
        g = false;
        const routes: Record<string, string> = {
          d: "/",
          f: "/foco",
          n: "/notas",
          p: "/perfil",
          r: "/ranking",
          c: "/comunidade",
          b: "/biblioteca",
        };
        const target = routes[e.key.toLowerCase()];
        if (target) {
          e.preventDefault();
          window.location.pathname = target;
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(gTimer);
    };
  }, []);

  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[80] grid place-items-center bg-background/70 backdrop-blur-sm p-4"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-primary/30 bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <div className="text-[10px] uppercase tracking-[0.24em] text-primary">Concierge</div>
            <div className="font-serif text-lg">Atalhos de teclado</div>
          </div>
          <button
            aria-label="Fechar"
            onClick={() => setOpen(false)}
            className="rounded-full p-1.5 text-muted-foreground hover:bg-accent"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <ul className="divide-y divide-border">
          {SHORTCUTS.map((s) => (
            <li key={s.keys} className="flex items-center justify-between gap-4 px-5 py-3 text-sm">
              <span className="text-muted-foreground">{s.desc}</span>
              <kbd className="rounded-md border border-border bg-background px-2 py-1 font-mono text-[11px] text-primary">
                {s.keys}
              </kbd>
            </li>
          ))}
        </ul>
        <div className="border-t border-border px-5 py-3 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          Aperte <kbd className="mx-1 rounded bg-background px-1.5 py-0.5 font-mono text-primary">?</kbd> a qualquer momento
        </div>
      </div>
    </div>
  );
}
