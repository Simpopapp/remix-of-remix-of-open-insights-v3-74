import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme, type Theme } from "@/lib/theme";

const ORDER: Theme[] = ["dark", "light", "system"];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const Icon = theme === "light" ? Sun : theme === "system" ? Monitor : Moon;
  const label =
    theme === "light" ? "Tema: claro" : theme === "system" ? "Tema: sistema" : "Tema: escuro";
  const next = () => {
    const i = ORDER.indexOf(theme);
    setTheme(ORDER[(i + 1) % ORDER.length]);
  };
  return (
    <button
      onClick={next}
      aria-label={label}
      title={label}
      className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border text-muted-foreground hover:border-primary/60 hover:text-primary transition"
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
