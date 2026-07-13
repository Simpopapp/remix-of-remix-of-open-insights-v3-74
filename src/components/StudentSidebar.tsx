import { Link, useRouterState } from "@tanstack/react-router";
import { Award, Bell, BookMarked, Bookmark, BookOpen, CalendarDays, Compass, Home, Library, LineChart, Map, NotebookPen, Rocket, Route as RouteIcon, ScrollText, Sparkles, Target, Timer, Trophy, User, Users, Wand2, Layers } from "lucide-react";
import { useInbox } from "@/lib/inbox";
import { course } from "@/lib/course-data";
import { useProgress } from "@/lib/progress";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

export function StudentSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { isDone } = useProgress();
  const { unread } = useInbox();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-4 py-5 border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-primary/15 border border-primary/40 grid place-items-center">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div className="leading-tight">
            <div className="font-serif text-base tracking-tight">AI App Empire</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Área do aluno
            </div>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/"}>
                  <Link to="/">
                    <Home />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/inbox"}>
                  <Link to="/inbox">
                    <Bell />
                    <span>Inbox</span>
                    {unread > 0 && (
                      <span className="ml-auto grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                        {unread > 9 ? "9+" : unread}
                      </span>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/conquistas"}>
                  <Link to="/conquistas">
                    <Trophy />
                    <span>Conquistas</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/exercicios"}>
                  <Link to="/exercicios">
                    <Target />
                    <span>Exercícios</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/favoritos"}>
                  <Link to="/favoritos">
                    <Bookmark />
                    <span>Favoritos</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/notas"}>
                  <Link to="/notas">
                    <NotebookPen />
                    <span>Notas</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/foco"}>
                  <Link to="/foco">
                    <Timer />
                    <span>Modo Foco</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/agenda"}>
                  <Link to="/agenda">
                    <CalendarDays />
                    <span>Agenda</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/revisao"}>
                  <Link to="/revisao">
                    <LineChart />
                    <span>Revisão semanal</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/trilhas"}>
                  <Link to="/trilhas">
                    <RouteIcon />
                    <span>Trilhas</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/mapa"}>
                  <Link to="/mapa">
                    <Map />
                    <span>Mapa do curso</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/ranking"}>
                  <Link to="/ranking">
                    <Compass />
                    <span>Ranking</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/comunidade"}>
                  <Link to="/comunidade">
                    <Users />
                    <span>Comunidade</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/biblioteca"}>
                  <Link to="/biblioteca">
                    <Library />
                    <span>Biblioteca</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/glossario"}>
                  <Link to="/glossario">
                    <BookMarked />
                    <span>Glossário</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/prompts"}>
                  <Link to="/prompts">
                    <Wand2 />
                    <span>Prompts</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/projetos"}>
                  <Link to="/projetos">
                    <Layers />
                    <span>Projetos</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/lancamento"}>
                  <Link to="/lancamento">
                    <Rocket />
                    <span>Lançamento</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/prova"}>
                  <Link to="/prova">
                    <ScrollText />
                    <span>Prova Final</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/certificado"}>
                  <Link to="/certificado">
                    <Award />
                    <span>Certificado</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/perfil"}>
                  <Link to="/perfil">
                    <User />
                    <span>Perfil</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Módulos</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {course.modules.map((m) => {
                const active = pathname.startsWith(`/modulo/${m.id}`);
                return (
                  <SidebarMenuItem key={m.id}>
                    <SidebarMenuButton asChild isActive={active}>
                      <Link
                        to="/modulo/$moduleId"
                        params={{ moduleId: m.id }}
                        className="gap-2"
                      >
                        <BookOpen />
                        <span className="truncate">
                          <span className="text-primary mr-1">{String(m.number).padStart(2, "0")}</span>
                          {m.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                    {active && (
                      <SidebarMenuSub>
                        {m.lessons.map((l) => {
                          const done = isDone(m.id, l.id);
                          const lessonActive = pathname === `/aula/${m.id}/${l.id}`;
                          return (
                            <SidebarMenuSubItem key={l.id}>
                              <SidebarMenuSubButton asChild isActive={lessonActive}>
                                <Link
                                  to="/aula/$moduleId/$lessonId"
                                  params={{ moduleId: m.id, lessonId: l.id }}
                                >
                                  <span
                                    className={
                                      "h-1.5 w-1.5 rounded-full " +
                                      (done ? "bg-primary" : "bg-muted-foreground/40")
                                    }
                                  />
                                  <span className="truncate">{l.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })}
                      </SidebarMenuSub>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
