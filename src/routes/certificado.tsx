import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, Download } from "lucide-react";
import { useProfile } from "@/lib/profile";
import { course } from "@/lib/course-data";
import { useProgress } from "@/lib/progress";

export const Route = createFileRoute("/certificado")({
  head: () => ({ meta: [{ title: "Certificado — AI App Empire" }] }),
  component: CertificadoPage,
});

function CertificadoPage() {
  const { profile } = useProfile();
  const { completedCount } = useProgress();
  const totalLessons = course.modules.reduce((n, m) => n + m.lessons.length, 0);
  const pct = totalLessons ? (completedCount / totalLessons) * 100 : 0;
  const eligible = pct >= 80;

  const download = async () => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
    const w = doc.internal.pageSize.getWidth();
    const h = doc.internal.pageSize.getHeight();

    // Background
    doc.setFillColor(11, 11, 18);
    doc.rect(0, 0, w, h, "F");

    // Gold border
    doc.setDrawColor(201, 169, 110);
    doc.setLineWidth(2);
    doc.rect(30, 30, w - 60, h - 60);
    doc.setLineWidth(0.5);
    doc.rect(40, 40, w - 80, h - 80);

    // Header
    doc.setTextColor(201, 169, 110);
    doc.setFont("times", "italic");
    doc.setFontSize(14);
    doc.text("AI APP EMPIRE · CERTIFICADO DE CONCLUSÃO", w / 2, 90, { align: "center" });

    // Title
    doc.setFont("times", "normal");
    doc.setFontSize(40);
    doc.setTextColor(245, 240, 230);
    doc.text("Certificamos que", w / 2, 180, { align: "center" });

    // Name
    doc.setFont("times", "bolditalic");
    doc.setFontSize(56);
    doc.setTextColor(201, 169, 110);
    doc.text(profile.name || "Aluno", w / 2, 260, { align: "center" });

    // Body
    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.setTextColor(220, 215, 205);
    const body = "concluiu com distincao o curso premium AI APP EMPIRE, dominando o desenvolvimento";
    const body2 = "de aplicativos com Agentes de IA, Skills, Tools, MCPs e publicacao profissional.";
    doc.text(body, w / 2, 320, { align: "center" });
    doc.text(body2, w / 2, 342, { align: "center" });

    // Stats
    doc.setFontSize(11);
    doc.setTextColor(180, 175, 165);
    doc.text(`${course.modules.length} modulos  ·  ${totalLessons} aulas  ·  ${Math.round(pct)}% concluido`, w / 2, 380, { align: "center" });

    // Signature line
    doc.setDrawColor(201, 169, 110);
    doc.line(w / 2 - 120, h - 120, w / 2 + 120, h - 120);
    doc.setFont("times", "italic");
    doc.setFontSize(12);
    doc.setTextColor(201, 169, 110);
    doc.text("Concierge Chief · AI App Empire", w / 2, h - 100, { align: "center" });

    // Date + ID
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(160, 155, 145);
    const date = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
    const id = "AAE-" + Math.random().toString(36).slice(2, 10).toUpperCase();
    doc.text(`Emitido em ${date}   ·   ID ${id}`, w / 2, h - 70, { align: "center" });

    doc.save(`certificado-aiae-${(profile.handle || "aluno")}.pdf`);
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="font-serif text-4xl">Certificado</h1>
      <p className="text-sm text-muted-foreground">
        Emissão premium ao concluir 80% do curso + prova final.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-[1fr_320px]">
        {/* Preview */}
        <div className="relative aspect-[1.414] overflow-hidden rounded-2xl border-2 border-primary/60 bg-[#0B0B12] p-8 shadow-2xl">
          <div className="pointer-events-none absolute inset-4 border border-primary/40" />
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="text-[10px] uppercase tracking-[0.35em] text-primary">
              AI App Empire · Certificado
            </div>
            <div className="mt-6 font-serif text-2xl text-foreground/90">Certificamos que</div>
            <div className="mt-4 font-serif text-4xl italic text-primary md:text-5xl">
              {profile.name || "Seu nome"}
            </div>
            <div className="mt-6 max-w-lg text-sm text-muted-foreground">
              concluiu com distinção o curso premium AI App Empire, dominando o desenvolvimento
              de aplicativos com Agentes de IA, Skills, Tools, MCPs e publicação profissional.
            </div>
            <div className="mt-6 text-xs text-muted-foreground">
              {course.modules.length} módulos · {totalLessons} aulas · {Math.round(pct)}% concluído
            </div>
            <div className="mt-auto w-full">
              <div className="mx-auto h-px w-48 bg-primary/60" />
              <div className="mt-2 font-serif italic text-primary">Concierge Chief</div>
            </div>
          </div>
        </div>

        {/* Panel */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-primary/25 bg-card/50 p-6">
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Elegibilidade</div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full bg-primary" style={{ width: `${Math.min(100, pct)}%` }} />
            </div>
            <div className="mt-2 text-sm">
              {Math.round(pct)}% concluído · <span className="text-muted-foreground">meta 80%</span>
            </div>
            {eligible ? (
              <div className="mt-4 rounded-md bg-primary/15 p-3 text-xs text-primary">
                ✓ Elegível para emissão
              </div>
            ) : (
              <div className="mt-4 rounded-md border border-input bg-background/40 p-3 text-xs text-muted-foreground">
                Complete mais aulas para desbloquear o certificado.
              </div>
            )}
          </div>

          <button
            onClick={download}
            disabled={!eligible || !profile.name}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Download className="h-4 w-4" /> Baixar PDF
          </button>

          {!profile.name && (
            <div className="text-xs text-muted-foreground">
              Defina seu nome no <Link to="/perfil" className="text-primary underline">perfil</Link> para gerar o PDF.
            </div>
          )}

          <Link
            to="/prova"
            className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-primary/40 px-4 py-3 text-sm hover:bg-primary/10"
          >
            <Award className="h-4 w-4" /> Fazer prova final
          </Link>
        </div>
      </div>
    </div>
  );
}
