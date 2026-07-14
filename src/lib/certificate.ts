// Certificate eligibility + deterministic ID.
import { useMemo } from "react";
import { course, totalLessons } from "./course-data";
import { useProgress } from "./progress";
import { useExam, EXAM_PASS_PCT } from "./exam";
import { useUserProjects } from "./user-projects";
import { useProfile } from "./profile";

export const CERT_LESSON_PCT = 90;

function hash(s: string): string {
  // FNV-1a 32-bit — deterministic, small, no deps.
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(36).toUpperCase().padStart(7, "0");
}

export function certificateId(input: { handle: string; name: string; examPct: number; lessonPct: number; projects: number }): string {
  const seed = `${input.handle}|${input.name}|${Math.round(input.examPct)}|${Math.round(input.lessonPct)}|${input.projects}`;
  return `AAE-${hash(seed)}`;
}

export type CertRequirement = {
  key: "lessons" | "exam" | "project";
  label: string;
  done: boolean;
  detail: string;
  cta: { label: string; to: string };
};

export function useCertificate() {
  const { completedCount } = useProgress();
  const exam = useExam();
  const { count: projectsCount } = useUserProjects();
  const { profile } = useProfile();

  return useMemo(() => {
    const lessonPct = totalLessons ? (completedCount / totalLessons) * 100 : 0;
    const examPct = exam.best?.pct ?? 0;
    const lessonsOk = lessonPct >= CERT_LESSON_PCT;
    const examOk = (exam.best?.passed ?? false) && examPct >= EXAM_PASS_PCT;
    const projectOk = projectsCount >= 1;

    const requirements: CertRequirement[] = [
      {
        key: "lessons",
        label: `${CERT_LESSON_PCT}% das aulas`,
        done: lessonsOk,
        detail: `${completedCount}/${totalLessons} aulas · ${Math.round(lessonPct)}%`,
        cta: { label: "Continuar aulas", to: "/mapa" },
      },
      {
        key: "exam",
        label: `Prova final aprovada (≥ ${EXAM_PASS_PCT}%)`,
        done: examOk,
        detail: exam.best
          ? `Melhor tentativa: ${Math.round(examPct)}% · ${exam.attempts} tentativa(s)`
          : "Nenhuma tentativa registrada.",
        cta: { label: exam.best?.passed ? "Refazer prova" : "Fazer prova", to: "/prova" },
      },
      {
        key: "project",
        label: "1 projeto na vitrine",
        done: projectOk,
        detail: projectsCount > 0 ? `${projectsCount} projeto(s) publicado(s).` : "Publique seu primeiro projeto.",
        cta: { label: "Publicar projeto", to: "/projetos" },
      },
    ];

    const eligible = lessonsOk && examOk && projectOk;
    const doneCount = requirements.filter((r) => r.done).length;

    const id = eligible
      ? certificateId({
          handle: profile.handle || profile.name || "aluno",
          name: profile.name || "Aluno",
          examPct,
          lessonPct,
          projects: projectsCount,
        })
      : null;

    // Modules completed count (used elsewhere)
    const modulesDone = course.modules.filter((m) =>
      m.lessons.every((_l) => completedCount > 0), // approx not needed for cert
    ).length;

    return {
      eligible,
      requirements,
      doneCount,
      lessonPct,
      examPct,
      projectsCount,
      id,
      modulesDone,
    };
  }, [completedCount, exam, projectsCount, profile.handle, profile.name]);
}
