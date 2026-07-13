import type { ReactNode } from "react";

type Props = {
  image: string;
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  meta?: ReactNode;
  align?: "left" | "center";
};

export function HeroBanner({ image, eyebrow, title, subtitle, actions, meta, align = "left" }: Props) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-border">
      <img
        src={image}
        alt=""
        width={1600}
        height={640}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover opacity-55"
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-background via-background/85 to-background/25" />
      <div
        className={
          "relative p-8 lg:p-12 " + (align === "center" ? "text-center flex flex-col items-center" : "")
        }
      >
        {eyebrow && (
          <div className="text-xs font-mono uppercase tracking-[0.28em] text-primary">{eyebrow}</div>
        )}
        <h1 className="mt-3 font-serif text-4xl lg:text-6xl tracking-tight leading-[1.05] max-w-3xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 text-base lg:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
        {meta && <div className="mt-6">{meta}</div>}
        {actions && <div className="mt-8 flex flex-wrap gap-3">{actions}</div>}
      </div>
    </section>
  );
}
