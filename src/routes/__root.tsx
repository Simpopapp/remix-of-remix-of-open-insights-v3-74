import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Bell, Flame } from "lucide-react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { StudentSidebar } from "@/components/StudentSidebar";
import { CommandPalette } from "@/components/CommandPalette";
import { ConciergeChat } from "@/components/ConciergeChat";
import { ShortcutsOverlay } from "@/components/ShortcutsOverlay";
import { ThemeToggle } from "@/components/ThemeToggle";
import { MiniPlayer } from "@/components/MiniPlayer";
import { OfflineBanner } from "@/components/OfflineBanner";

import { Toaster } from "@/components/ui/sonner";
import { LevelUpWatcher } from "@/lib/level-toast";
import { AchievementWatcher } from "@/lib/achievement-watcher";
import { useTheme } from "@/lib/theme";
import { useProfile } from "@/lib/profile";
import { useGamification } from "@/lib/gamification";
import { useInbox } from "@/lib/inbox";
import { useAutoFreeze } from "@/lib/auto-freeze";
import { useGlobalPlaybackShortcuts } from "@/lib/global-shortcuts";

function NotFoundComponent() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-7xl">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Página não encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Essa aula ou módulo não existe (ainda).
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            Voltar ao dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight">Algo travou</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Tenta recarregar ou volta pro dashboard.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            Tentar de novo
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium transition hover:bg-accent"
          >
            Ir pro dashboard
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "AI App Empire — Área do aluno" },
      {
        name: "description",
        content:
          "Área do aluno do AI App Empire: módulos, aulas e progresso do curso de agentes de IA de elite.",
      },
      { name: "author", content: "AI App Empire" },
      { property: "og:title", content: "AI App Empire — Área do aluno" },
      {
        property: "og:description",
        content:
          "Módulos, aulas e progresso do curso premium de aplicativos com Agentes de IA, Skills, Tools e MCPs.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <AppShell />
      </SidebarProvider>
    </QueryClientProvider>
  );
}

function AppShell() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { profile } = useProfile();
  const { xp, level, streak } = useGamification();
  const { unread } = useInbox();
  const { resolved } = useTheme();
  const nav = useRouter();
  useAutoFreeze();
  useGlobalPlaybackShortcuts();

  useEffect(() => {
    // Clean up legacy storage keys retired in v2.
    import("@/lib/storage").then((m) => m.migrateStorage());
  }, []);

  useEffect(() => {
    if (!profile.onboarded && pathname !== "/onboarding") {
      nav.navigate({ to: "/onboarding" });
    }
  }, [profile.onboarded, pathname, nav]);

  if (pathname === "/onboarding") {
    return <Outlet />;
  }

  return (
    <div className="min-h-dvh flex w-full bg-background text-foreground">
      <div className="ambient-scene" aria-hidden />
      <div className="grain-overlay" aria-hidden />
      <a href="#main-content" className="skip-link">Pular para o conteúdo</a>
      <StudentSidebar />
      <div data-app-shell className="flex-1 flex flex-col min-w-0">
        <header className="h-14 flex items-center gap-2 sm:gap-3 border-b border-border/60 px-3 sm:px-4 sticky top-0 z-30 backdrop-blur-xl bg-background/60 supports-[backdrop-filter]:bg-background/40">
          <SidebarTrigger />
          <div className="hidden sm:flex items-center gap-2 eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_12px_2px_oklch(0.76_0.09_82/0.6)]" />
            <span className="text-gold-gradient font-medium">Concierge de Elite</span>
          </div>
          <div className="ml-auto flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="hidden md:flex items-center gap-3 text-xs">
              <span className="inline-flex items-center gap-1 text-primary">
                <Flame className="h-3 w-3" /> {streak.current}d
              </span>
              <span className="inline-flex items-center gap-1 text-muted-foreground">
                Lv <span className="font-serif text-primary">{level}</span>
              </span>
              <span className="text-muted-foreground tabular-nums">{xp.toLocaleString("pt-BR")} XP</span>
            </div>
            <span className="md:hidden inline-flex items-center gap-1 text-[11px] text-primary">
              <Flame className="h-3 w-3" /> {streak.current}
            </span>
            <CommandPalette />
            <ThemeToggle />
            <Link
              to="/inbox"
              aria-label={`Inbox${unread ? ` (${unread} não lidas)` : ""}`}
              className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border text-muted-foreground hover:border-primary/60 hover:text-primary"
            >
              <Bell className="h-4 w-4" />
              {unread > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                  {unread > 9 ? "9+" : unread}
                </span>
              )}
            </Link>
            <Link
              to="/perfil"
              aria-label="Abrir perfil"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-primary/40 bg-primary/10 text-sm hover:border-primary"
            >
              <span suppressHydrationWarning>{profile.avatar}</span>
            </Link>
          </div>
        </header>
        <main id="main-content" className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
      <ConciergeChat />
      <ShortcutsOverlay />
      <LevelUpWatcher />
      <AchievementWatcher />
      <MiniPlayer />
      <OfflineBanner />
      <Toaster position="top-right" theme={resolved} />

    </div>
  );
}
