import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, RotateCcw, Trophy, XCircle } from "lucide-react";
import { getQuiz, useQuizResults } from "@/lib/quiz-data";
import { course } from "@/lib/course-data";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/quiz/$moduleId")({
  head: ({ params }) => ({
    meta: [{ title: `Quiz — ${params.moduleId} | AI App Empire` }],
  }),
  component: QuizPage,
  notFoundComponent: () => <div className="p-8">Quiz não encontrado.</div>,
});

function QuizPage() {
  const { moduleId } = Route.useParams();
  const quiz = getQuiz(moduleId);
  const mod = course.modules.find((m) => m.id === moduleId);
  const { save, get } = useQuizResults();
  const previous = get(moduleId);
  const nav = useNavigate();

  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const total = quiz?.questions.length ?? 0;
  const score = useMemo(
    () =>
      quiz
        ? quiz.questions.reduce(
            (acc, q, i) => (answers[i] === q.correct ? acc + 1 : acc),
            0,
          )
        : 0,
    [answers, quiz],
  );

  if (!quiz || !mod) {
    return (
      <div className="p-8">
        <p className="text-muted-foreground">Quiz não encontrado.</p>
        <Link to="/" className="text-primary text-sm">← Voltar</Link>
      </div>
    );
  }

  const pct = total ? score / total : 0;
  const passed = submitted && pct >= quiz.passScore;

  function submit() {
    setSubmitted(true);
    save(moduleId, score, total);
  }
  function retake() {
    setAnswers({});
    setSubmitted(false);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-10">
      <Link
        to="/modulo/$moduleId"
        params={{ moduleId }}
        className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> voltar ao módulo
      </Link>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.24em] text-primary/70">
            Módulo {String(mod.number).padStart(2, "0")} · Quiz
          </div>
          <h1 className="mt-2 font-serif text-3xl md:text-4xl">{quiz.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {quiz.questions.length} questões · aprovação em {Math.round(quiz.passScore * 100)}%
            {previous && (
              <> · melhor tentativa: <span className="text-primary">{previous.score}/{previous.total}</span></>
            )}
          </p>
        </div>
        {submitted && (
          <div
            className={
              "rounded-xl border p-4 text-center " +
              (passed
                ? "border-primary/50 bg-primary/10"
                : "border-destructive/40 bg-destructive/10")
            }
          >
            <div className="font-serif text-4xl">
              {score}/{total}
            </div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-1">
              {passed ? "aprovado" : "reprovado"}
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 space-y-4">
        {quiz.questions.map((q, i) => {
          const chosen = answers[i];
          return (
            <div
              key={i}
              className="rounded-xl border border-border bg-card p-5"
            >
              <div className="flex gap-3">
                <span className="font-serif text-primary">{String(i + 1).padStart(2, "0")}.</span>
                <div className="flex-1">
                  <p className="text-sm font-medium">{q.q}</p>
                  <div className="mt-3 grid gap-2">
                    {q.options.map((opt, oi) => {
                      const isChosen = chosen === oi;
                      const isCorrect = q.correct === oi;
                      const revealCorrect = submitted && isCorrect;
                      const revealWrong = submitted && isChosen && !isCorrect;
                      return (
                        <button
                          key={oi}
                          disabled={submitted}
                          onClick={() => setAnswers((a) => ({ ...a, [i]: oi }))}
                          className={
                            "text-left rounded-lg border px-3 py-2 text-sm transition " +
                            (revealCorrect
                              ? "border-primary bg-primary/15"
                              : revealWrong
                                ? "border-destructive/60 bg-destructive/10"
                                : isChosen
                                  ? "border-primary/60 bg-primary/5"
                                  : "border-border hover:border-primary/40")
                          }
                        >
                          <div className="flex items-center gap-2">
                            {submitted && isCorrect && (
                              <CheckCircle2 className="h-4 w-4 text-primary" />
                            )}
                            {submitted && isChosen && !isCorrect && (
                              <XCircle className="h-4 w-4 text-destructive" />
                            )}
                            <span>{opt}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {submitted && (
                    <p className="mt-3 text-xs text-muted-foreground italic">
                      {q.explain}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-muted-foreground">
          Respondidas: {Object.keys(answers).length}/{total}
        </div>
        <div className="flex gap-2">
          {submitted ? (
            <>
              <Button variant="outline" onClick={retake} className="gap-2">
                <RotateCcw className="h-4 w-4" /> Refazer
              </Button>
              {passed ? (
                <Button
                  onClick={() => nav({ to: "/certificado" })}
                  className="gap-2"
                >
                  <Trophy className="h-4 w-4" /> Ver certificado
                </Button>
              ) : (
                <Button
                  onClick={() => nav({ to: "/modulo/$moduleId", params: { moduleId } })}
                  variant="outline"
                >
                  Revisar módulo
                </Button>
              )}
            </>
          ) : (
            <Button
              onClick={submit}
              disabled={Object.keys(answers).length < total}
              className="min-w-32"
            >
              Enviar respostas
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
