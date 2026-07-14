import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, ShieldCheck, XCircle } from "lucide-react";
import { useCertificate } from "@/lib/certificate";
import { useProfile } from "@/lib/profile";

export const Route = createFileRoute("/verificar/$id")({
  head: () => ({ meta: [{ title: "Verificar certificado — AI App Empire" }] }),
  component: VerifyPage,
});

function VerifyPage() {
  const { id } = Route.useParams();
  const { id: currentId, eligible } = useCertificate();
  const { profile } = useProfile();

  const valid = eligible && currentId && currentId === id;

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <div className={`rounded-2xl border p-8 ${valid ? "border-primary/60 bg-primary/10" : "border-destructive/40 bg-destructive/5"}`}>
        <div className="flex items-center gap-3">
          {valid ? <CheckCircle2 className="h-8 w-8 text-primary" /> : <XCircle className="h-8 w-8 text-destructive" />}
          <div>
            <div className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
              Verificação de certificado
            </div>
            <h1 className="font-serif text-3xl">{valid ? "Certificado autêntico" : "Certificado não reconhecido"}</h1>
          </div>
        </div>

        <dl className="mt-6 grid gap-3 text-sm">
          <div className="flex justify-between border-b border-border/60 pb-2">
            <dt className="text-muted-foreground">ID</dt>
            <dd className="font-mono">{id}</dd>
          </div>
          {valid && (
            <>
              <div className="flex justify-between border-b border-border/60 pb-2">
                <dt className="text-muted-foreground">Titular</dt>
                <dd className="font-serif">{profile.name || "—"}</dd>
              </div>
              <div className="flex justify-between border-b border-border/60 pb-2">
                <dt className="text-muted-foreground">Curso</dt>
                <dd>AI App Empire · Cohort 01</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Status</dt>
                <dd className="inline-flex items-center gap-1 text-primary">
                  <ShieldCheck className="h-4 w-4" /> Válido
                </dd>
              </div>
            </>
          )}
        </dl>

        {!valid && (
          <p className="mt-6 text-sm text-muted-foreground">
            Este ID não corresponde a nenhum certificado emitido nesta sessão. Certificados são
            gerados de forma determinística a partir do titular e do resultado da prova — um ID que
            não bate significa dados alterados desde a emissão.
          </p>
        )}

        <div className="mt-8">
          <Link
            to="/certificado"
            className="inline-flex items-center justify-center rounded-md border border-primary/40 px-4 py-2 text-sm hover:bg-primary/10"
          >
            Ir para meu certificado
          </Link>
        </div>
      </div>
    </div>
  );
}
