import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, CheckCircle2, Circle, Copy, Download, ShieldCheck } from "lucide-react";
import { useProfile } from "@/lib/profile";
import { course } from "@/lib/course-data";
import { useProgress } from "@/lib/progress";
import { useCertificate, CERT_LESSON_PCT } from "@/lib/certificate";
import { EXAM_PASS_PCT } from "@/lib/exam";
import { toast } from "sonner";

export const Route = createFileRoute("/certificado")({
  head: () => ({ meta: [{ title: "Certificado — AI App Empire" }] }),
  component: CertificadoPage,
});

function CertificadoPage() {
  const { profile } = useProfile();
  const { completedCount } = useProgress();
  const totalLessons = course.modules.reduce((n, m) => n + m.lessons.length, 0);
  const cert = useCertificate();

  const download = async () => {
    if (!cert.eligible || !cert.id) return;
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
    const w = doc.internal.pageSize.getWidth();
    const h = doc.internal.pageSize.getHeight();

    doc.setFillColor(11, 11, 18);
    doc.rect(0, 0, w, h, "F");
    doc.setDrawColor(201, 169, 110);
    doc.setLineWidth(2);
    doc.rect(30, 30, w - 60, h - 60);
    doc.setLineWidth(0.5);
    doc.rect(40, 40, w - 80, h - 80);

    doc.setTextColor(201, 169, 110);
    doc.setFont("times", "italic");
    doc.setFontSize(14);
    doc.text("AI APP EMPIRE · CERTIFICADO DE CONCLUSÃO", w / 2, 90, { align: "center" });

    doc.setFont("times", "normal");
    doc.setFontSize(40);
    doc.setTextColor(245, 240, 230);
    doc.text("Certificamos que", w / 2, 180, { align: "center" });

    doc.setFont("times", "bolditalic");
    doc.setFontSize(56);
    doc.setTextColor(201, 169, 110);
    doc.text(profile.name || "Aluno", w / 2, 260, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.setTextColor(220, 215, 205);
    doc.text("concluiu com distincao o curso premium AI APP EMPIRE, dominando o desenvolvimento", w / 2, 320, { align: "center" });
    doc.text("de aplicativos com Agentes de IA, Skills, Tools, MCPs e publicacao profissional.", w / 2, 342, { align: "center" });

    doc.setFontSize(11);
    doc.setTextColor(180, 175, 165);
    doc.text(
      `${course.modules.length} modulos  ·  ${totalLessons} aulas  ·  Prova ${Math.round(cert.examPct)}%  ·  ${cert.projectsCount} projeto(s)`,
      w / 2,
      380,
      { align: "center" },
    );

    doc.setDrawColor(201, 169, 110);
    doc.line(w / 2 - 120, h - 120, w / 2 + 120, h - 120);
    doc.setFont("times", "italic");
    doc.setFontSize(12);
    doc.setTextColor(201, 169, 110);
    doc.text("Concierge Chief · AI App Empire", w / 2, h - 100, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(160, 155, 145);
    const date = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
    doc.text(`Emitido em ${date}   ·   ID ${cert.id}   ·   Verificar em /verificar/${cert.id}`, w / 2, h - 70, { align: "center" });

    doc.save(`certificado-aiae-${(profile.handle || "aluno")}.pdf`);
    toast.success("Certificado emitido", { description: `ID ${cert.id}` });
  };

  const copyId = async () => {
    if (!cert.id) return;
    try { await navigator.clipboard.writeText(cert.id); toast.success("ID copiado"); } catch { /* noop */ }
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="text-xs uppercase tracking-[0.28em] text-primary">Credencial</div>
      <h1 className="mt-2 font-serif text-4xl">Certificado</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Só é emitido quando os três requisitos estão verdes: {CERT_LESSON_PCT}% das aulas, prova final aprovada
        (≥ {EXAM_PASS_PCT}%) e ao menos um projeto publicado na Vitrine. ID é gerado de forma determinística —
        qualquer alteração no seu progresso muda o ID.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Preview */}
        <div className={"relative aspect-[1.414] overflow-hidden rounded-2xl border-2 bg-[#0B0B12] p-8 shadow-2xl " + (cert.eligible ? "border-primary/60" : "border-border")}>
          <div className={"pointer-events-none absolute inset-4 border " + (cert.eligible ? "border-primary/40" : "border-border/40")} />
          {!cert.eligible && (
            <div className="pointer-events-none absolute inset-0 grid place-items-center bg-black/60 backdrop-blur-sm">
              <div className="text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-primary/40 bg-primary/10">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <div className="mt-3 text-sm text-muted-foreground">
                  {cert.doneCount}/3 requisitos concluídos
                </div>
              </div>
            </div>
          )}
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="text-[10px] uppercase tracking-[0.35em] text-primary">AI App Empire · Certificado</div>
            <div className="mt-6 font-serif text-2xl text-foreground/90">Certificamos que</div>
            <div className="mt-4 font-serif text-4xl italic text-primary md:text-5xl">
              {profile.name || "Seu nome"}
            </div>
            <div className="mt-6 max-w-lg text-sm text-muted-foreground">
              concluiu com distinção o curso premium AI App Empire, dominando o desenvolvimento
              de aplicativos com Agentes de IA, Skills, Tools, MCPs e publicação profissional.
            </div>
            <div className="mt-6 text-xs text-muted-foreground">
              {course.modules.length} módulos · {totalLessons} aulas · {completedCount} concluídas · Prova {Math.round(cert.examPct)}% · {cert.projectsCount} projeto(s)
            </div>
            <div className="mt-auto w-full">
              <div className="mx-auto h-px w-48 bg-primary/60" />
              <div className="mt-2 font-serif italic text-primary">Concierge Chief</div>
              {cert.id && <div className="mt-1 font-mono text-[10px] text-muted-foreground">ID {cert.id}</div>}
            </div>
          </div>
        </div>

        {/* Panel */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-primary/25 bg-card/50 p-5">
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Requisitos</div>
            <ul className="mt-4 space-y-4">
              {cert.requirements.map((r) => (
                <li key={r.key} className="flex items-start gap-3">
                  {r.done ? (
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  ) : (
                    <Circle className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground/60" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className={"text-sm " + (r.done ? "text-foreground" : "text-foreground/90")}>{r.label}</div>
                    <div className="text-xs text-muted-foreground">{r.detail}</div>
                    {!r.done && (
                      <Link
                        to={r.cta.to}
                        className="mt-1 inline-block text-xs text-primary underline underline-offset-2"
                      >
                        {r.cta.label} →
                      </Link>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={download}
            disabled={!cert.eligible || !profile.name}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Download className="h-4 w-4" /> Baixar PDF
          </button>

          {cert.id && (
            <div className="rounded-md border border-primary/30 bg-primary/5 p-3 text-xs">
              <div className="text-muted-foreground">ID determinístico</div>
              <div className="mt-1 flex items-center justify-between gap-2">
                <span className="font-mono text-primary">{cert.id}</span>
                <button onClick={copyId} className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary">
                  <Copy className="h-3 w-3" /> copiar
                </button>
              </div>
              <Link
                to="/verificar/$id"
                params={{ id: cert.id }}
                className="mt-2 inline-block text-primary underline underline-offset-2"
              >
                Verificar autenticidade →
              </Link>
            </div>
          )}

          {!profile.name && (
            <div className="text-xs text-muted-foreground">
              Defina seu nome no <Link to="/perfil" className="text-primary underline">perfil</Link> para gerar o PDF.
            </div>
          )}

          <Link
            to="/prova"
            className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-primary/40 px-4 py-3 text-sm hover:bg-primary/10"
          >
            <Award className="h-4 w-4" /> {cert.requirements[1].done ? "Refazer prova" : "Fazer prova final"}
          </Link>
        </div>
      </div>
    </div>
  );
}
