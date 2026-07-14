import { useMemo } from "react";
import { Award, BookMarked, BookOpen, Brain, Calendar, CheckCircle2, Compass, Feather, Flame, Flag, Highlighter, Layers, type LucideIcon, Medal, Moon, Rocket, ScrollText, Shield, ShieldCheck, Sparkles, Star, StickyNote, Sunrise, Target, Timer, Trophy, Users, Wand2, Zap } from "lucide-react";
import { course, totalLessons } from "./course-data";
import { useProgress } from "./progress";
import { useActivity } from "./activity";
import { useStreak } from "./streak";
import { useExercises, useBookmarks } from "./user-state";
import { useHighlights } from "./highlights";
import { useExam } from "./exam";
import { useUserProjects } from "./user-projects";

export type BadgeTier = "bronze" | "silver" | "gold" | "legend";

export type Badge = {
  id: string;
  icon: LucideIcon;
  title: string;
  desc: string;
  tier: BadgeTier;
  category: "progresso" | "hábito" | "prática" | "curadoria" | "elite";
  progress: number;
  target: number;
  unlocked: boolean;
};

function readMap(k: string): Record<string, unknown> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(window.localStorage.getItem(k) ?? "{}"); } catch { return {}; }
}

export function useBadges(): { badges: Badge[]; unlocked: number; total: number; byCategory: Record<string, Badge[]> } {
  const { isDone, completedCount } = useProgress();
  const { days } = useActivity(84);
  const { current: streak, longest, freezesLeft } = useStreak();
  const exercises = useExercises();
  const bookmarks = useBookmarks();
  const { list: highlights } = useHighlights();
  const exam = useExam();
  const { count: userProjectsCount } = useUserProjects();

  const pct = Math.round((completedCount / totalLessons) * 100);
  const modulesDone = course.modules.filter((m) => m.lessons.every((l) => isDone(m.id, l.id))).length;

  const totals = days.reduce(
    (a, d) => ({
      lesson: a.lesson + (d.kinds.lesson ?? 0),
      exercise: a.exercise + (d.kinds.exercise ?? 0),
      focus: a.focus + (d.kinds.focus ?? 0),
      note: a.note + (d.kinds.note ?? 0),
      watch: a.watch + (d.kinds.watch ?? 0),
    }),
    { lesson: 0, exercise: 0, focus: 0, note: 0, watch: 0 },
  );

  const notesMap = readMap("aiae:notes:v1") as Record<string, string>;
  const notesCount = Object.values(notesMap).filter((v) => typeof v === "string" && v.trim().length > 0).length;
  const notesWithTags = Object.values(notesMap).filter((v) => typeof v === "string" && /#[a-z0-9\-_]{2,}/i.test(v)).length;

  const quizMap = readMap("aiae:quiz:v1") as Record<string, { score: number; total: number; passed: boolean }>;
  const quizzesPassed = Object.values(quizMap).filter((q) => q?.passed).length;
  const perfectQuizzes = Object.values(quizMap).filter((q) => q?.score === q?.total).length;

  const activeDays = days.filter((d) => d.total > 0).length;

  // Early bird / night owl based on activity timestamps? Fallback to focus minutes threshold
  const earlyBird = readMap("aiae:activity-hours:v1") as { early?: number; night?: number };
  const earlyCount = earlyBird.early ?? 0;
  const nightCount = earlyBird.night ?? 0;

  const raw: Omit<Badge, "unlocked">[] = [
    // Progresso
    { id: "first", icon: Sparkles, title: "Primeira aula", desc: "A jornada começou.", tier: "bronze", category: "progresso", progress: Math.min(completedCount, 1), target: 1 },
    { id: "five", icon: Zap, title: "Momentum", desc: "5 aulas concluídas.", tier: "bronze", category: "progresso", progress: Math.min(completedCount, 5), target: 5 },
    { id: "ten", icon: Rocket, title: "Decolagem", desc: "10 aulas assistidas.", tier: "silver", category: "progresso", progress: Math.min(completedCount, 10), target: 10 },
    { id: "quarter", icon: Flag, title: "Primeiro quarto", desc: "25% do curso.", tier: "silver", category: "progresso", progress: Math.min(pct, 25), target: 25 },
    { id: "half", icon: Flame, title: "Meio caminho", desc: "50% concluído.", tier: "gold", category: "progresso", progress: Math.min(pct, 50), target: 50 },
    { id: "threequarter", icon: Compass, title: "Reta final", desc: "75% do curso.", tier: "gold", category: "progresso", progress: Math.min(pct, 75), target: 75 },
    { id: "emperor", icon: Award, title: "Imperador", desc: "100% do curso.", tier: "legend", category: "progresso", progress: pct, target: 100 },
    { id: "module1", icon: BookOpen, title: "Primeiro módulo", desc: "1 módulo completo.", tier: "silver", category: "progresso", progress: Math.min(modulesDone, 1), target: 1 },
    { id: "modules-half", icon: Layers, title: "Metade dos módulos", desc: "Metade dos módulos concluídos.", tier: "gold", category: "progresso", progress: modulesDone, target: Math.ceil(course.modules.length / 2) },
    { id: "all-modules", icon: Trophy, title: "Todos os módulos", desc: "Fundação completa.", tier: "legend", category: "progresso", progress: modulesDone, target: course.modules.length },

    // Hábito
    { id: "streak3", icon: Flame, title: "Chama acesa", desc: "3 dias seguidos.", tier: "bronze", category: "hábito", progress: Math.min(streak, 3), target: 3 },
    { id: "streak7", icon: Flame, title: "Semana perfeita", desc: "7 dias seguidos.", tier: "silver", category: "hábito", progress: Math.min(streak, 7), target: 7 },
    { id: "streak14", icon: Flame, title: "Ritual quinzenal", desc: "14 dias seguidos.", tier: "gold", category: "hábito", progress: Math.min(streak, 14), target: 14 },
    { id: "streak30", icon: Flame, title: "Mês inteiro", desc: "30 dias seguidos.", tier: "legend", category: "hábito", progress: Math.min(streak, 30), target: 30 },
    { id: "longest14", icon: Medal, title: "Recorde 14d", desc: "Melhor sequência ≥14.", tier: "gold", category: "hábito", progress: Math.min(longest, 14), target: 14 },
    { id: "active30", icon: Calendar, title: "30 dias ativos", desc: "30 dias com atividade.", tier: "gold", category: "hábito", progress: Math.min(activeDays, 30), target: 30 },
    { id: "freeze-hold", icon: Shield, title: "Escudo cheio", desc: "3 freezes disponíveis.", tier: "bronze", category: "hábito", progress: Math.min(freezesLeft, 3), target: 3 },
    { id: "earlybird", icon: Sunrise, title: "Madrugador", desc: "5 sessões antes das 8h.", tier: "silver", category: "hábito", progress: Math.min(earlyCount, 5), target: 5 },
    { id: "nightowl", icon: Moon, title: "Coruja", desc: "5 sessões depois das 22h.", tier: "silver", category: "hábito", progress: Math.min(nightCount, 5), target: 5 },

    // Prática
    { id: "ex1", icon: Target, title: "Primeiro exercício", desc: "1 entrega registrada.", tier: "bronze", category: "prática", progress: Math.min(exercises.count, 1), target: 1 },
    { id: "ex10", icon: Target, title: "Praticante", desc: "10 exercícios entregues.", tier: "silver", category: "prática", progress: Math.min(exercises.count, 10), target: 10 },
    { id: "ex25", icon: Target, title: "Praticante sério", desc: "25 exercícios entregues.", tier: "gold", category: "prática", progress: Math.min(exercises.count, 25), target: 25 },
    { id: "focus60", icon: Timer, title: "1h em foco", desc: "60 min de deep work.", tier: "bronze", category: "prática", progress: Math.min(totals.focus, 60), target: 60 },
    { id: "focus300", icon: Timer, title: "5h em foco", desc: "300 min acumulados.", tier: "silver", category: "prática", progress: Math.min(totals.focus, 300), target: 300 },
    { id: "focus1000", icon: Timer, title: "Deep worker", desc: "1000 min acumulados.", tier: "gold", category: "prática", progress: Math.min(totals.focus, 1000), target: 1000 },
    { id: "quiz1", icon: Brain, title: "Primeiro quiz", desc: "1 quiz aprovado.", tier: "bronze", category: "prática", progress: Math.min(quizzesPassed, 1), target: 1 },
    { id: "quiz-all", icon: Brain, title: "Quiz completo", desc: "Todos os módulos aprovados.", tier: "gold", category: "prática", progress: quizzesPassed, target: course.modules.length },
    { id: "quiz-perfect", icon: Star, title: "Nota máxima", desc: "1 quiz sem errar.", tier: "silver", category: "prática", progress: Math.min(perfectQuizzes, 1), target: 1 },
    { id: "quiz-perfect5", icon: Star, title: "Precisão cirúrgica", desc: "5 quizzes perfeitos.", tier: "gold", category: "prática", progress: Math.min(perfectQuizzes, 5), target: 5 },

    // Curadoria
    { id: "note1", icon: StickyNote, title: "Primeira nota", desc: "1 aula anotada.", tier: "bronze", category: "curadoria", progress: Math.min(notesCount, 1), target: 1 },
    { id: "note10", icon: StickyNote, title: "Cadernista", desc: "10 aulas anotadas.", tier: "silver", category: "curadoria", progress: Math.min(notesCount, 10), target: 10 },
    { id: "note25", icon: Feather, title: "Segundo cérebro", desc: "25 aulas anotadas.", tier: "gold", category: "curadoria", progress: Math.min(notesCount, 25), target: 25 },
    { id: "tagger", icon: BookMarked, title: "Taxonomista", desc: "5 notas com #tags.", tier: "silver", category: "curadoria", progress: Math.min(notesWithTags, 5), target: 5 },
    { id: "bookmark5", icon: BookMarked, title: "Curador", desc: "5 aulas favoritadas.", tier: "bronze", category: "curadoria", progress: Math.min(bookmarks.count, 5), target: 5 },
    { id: "highlight5", icon: Highlighter, title: "Grifador", desc: "5 trechos destacados.", tier: "silver", category: "curadoria", progress: Math.min(highlights.length, 5), target: 5 },
    { id: "highlight25", icon: Highlighter, title: "Antologia", desc: "25 trechos destacados.", tier: "gold", category: "curadoria", progress: Math.min(highlights.length, 25), target: 25 },

    // Elite
    { id: "concierge", icon: Users, title: "Concierge", desc: "Perfil personalizado.", tier: "bronze", category: "elite", progress: Object.keys(readMap("aiae:profile:v1")).length > 0 ? 1 : 0, target: 1 },
    { id: "wand", icon: Wand2, title: "Ferramenteiro", desc: "Usou o Command Palette 3x.", tier: "bronze", category: "elite", progress: Math.min(Number(readMap("aiae:cmdk-count:v1").n ?? 0), 3), target: 3 },
    { id: "check", icon: CheckCircle2, title: "Ritual completo", desc: "Tudo do dia zerado.", tier: "gold", category: "elite", progress: streak >= 1 && quizzesPassed >= 1 && exercises.count >= 1 ? 1 : 0, target: 1 },
  ];

  const badges: Badge[] = raw.map((b) => ({ ...b, unlocked: b.progress >= b.target }));
  const unlocked = badges.filter((b) => b.unlocked).length;
  const byCategory: Record<string, Badge[]> = {};
  for (const b of badges) (byCategory[b.category] ??= []).push(b);

  return useMemo(() => ({ badges, unlocked, total: badges.length, byCategory }), [badges, unlocked, byCategory]);
}

export const tierColor: Record<BadgeTier, string> = {
  bronze: "from-amber-700/20 to-card border-amber-700/30 text-amber-500",
  silver: "from-slate-400/15 to-card border-slate-400/30 text-slate-300",
  gold: "from-primary/20 to-card border-primary/50 text-primary",
  legend: "from-fuchsia-500/15 via-primary/15 to-card border-fuchsia-400/40 text-fuchsia-300",
};
