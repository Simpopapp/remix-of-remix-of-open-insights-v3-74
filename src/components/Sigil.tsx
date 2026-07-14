import type { ReactNode } from "react";

export type SigilDef = { id: string; name: string; draw: (stroke: string) => ReactNode };

export const SIGILS: SigilDef[] = [
  {
    id: "obelisk",
    name: "Obelisco",
    draw: (s) => (
      <>
        <path d="M20 6 L28 32 L12 32 Z" fill="none" stroke={s} strokeWidth="1.2" />
        <path d="M14 26 H26" stroke={s} strokeWidth="0.8" />
        <circle cx="20" cy="20" r="1.2" fill={s} />
      </>
    ),
  },
  {
    id: "sun",
    name: "Sol",
    draw: (s) => (
      <>
        <circle cx="20" cy="20" r="6" fill="none" stroke={s} strokeWidth="1.2" />
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2;
          const x1 = 20 + Math.cos(a) * 9;
          const y1 = 20 + Math.sin(a) * 9;
          const x2 = 20 + Math.cos(a) * 13;
          const y2 = 20 + Math.sin(a) * 13;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={s} strokeWidth="0.9" />;
        })}
      </>
    ),
  },
  {
    id: "moon",
    name: "Crescente",
    draw: (s) => (
      <>
        <path d="M26 10 A11 11 0 1 0 26 30 A9 9 0 1 1 26 10 Z" fill="none" stroke={s} strokeWidth="1.2" />
        <circle cx="28" cy="14" r="0.9" fill={s} />
      </>
    ),
  },
  {
    id: "diamond",
    name: "Diamante",
    draw: (s) => (
      <>
        <path d="M20 6 L32 20 L20 34 L8 20 Z" fill="none" stroke={s} strokeWidth="1.2" />
        <path d="M8 20 H32 M20 6 V34" stroke={s} strokeWidth="0.6" opacity="0.55" />
      </>
    ),
  },
  {
    id: "compass",
    name: "Rosa",
    draw: (s) => (
      <>
        <circle cx="20" cy="20" r="11" fill="none" stroke={s} strokeWidth="1" />
        <path d="M20 8 L22 20 L20 32 L18 20 Z" fill={s} opacity="0.85" />
        <path d="M8 20 L20 22 L32 20 L20 18 Z" fill="none" stroke={s} strokeWidth="0.9" />
      </>
    ),
  },
  {
    id: "laurel",
    name: "Laurel",
    draw: (s) => (
      <>
        <path d="M20 8 V32" stroke={s} strokeWidth="1.2" />
        {[12, 16, 20, 24, 28].map((y, i) => (
          <g key={i}>
            <path d={`M20 ${y} Q${13 - i * 0.3} ${y + 2} ${15} ${y + 5}`} fill="none" stroke={s} strokeWidth="0.9" />
            <path d={`M20 ${y} Q${27 + i * 0.3} ${y + 2} ${25} ${y + 5}`} fill="none" stroke={s} strokeWidth="0.9" />
          </g>
        ))}
      </>
    ),
  },
  {
    id: "orbit",
    name: "Órbita",
    draw: (s) => (
      <>
        <ellipse cx="20" cy="20" rx="13" ry="5" fill="none" stroke={s} strokeWidth="1" transform="rotate(-25 20 20)" />
        <ellipse cx="20" cy="20" rx="13" ry="5" fill="none" stroke={s} strokeWidth="1" transform="rotate(25 20 20)" />
        <circle cx="20" cy="20" r="2.2" fill={s} />
      </>
    ),
  },
  {
    id: "prism",
    name: "Prisma",
    draw: (s) => (
      <>
        <path d="M20 6 L34 32 L6 32 Z" fill="none" stroke={s} strokeWidth="1.2" />
        <path d="M20 6 L20 32" stroke={s} strokeWidth="0.7" opacity="0.6" />
        <path d="M6 32 L20 20 L34 32" stroke={s} strokeWidth="0.7" opacity="0.6" fill="none" />
      </>
    ),
  },
  {
    id: "arch",
    name: "Arco",
    draw: (s) => (
      <>
        <path d="M8 32 V18 A12 12 0 0 1 32 18 V32" fill="none" stroke={s} strokeWidth="1.2" />
        <path d="M8 32 H32" stroke={s} strokeWidth="1.2" />
        <path d="M20 32 V20" stroke={s} strokeWidth="0.8" />
      </>
    ),
  },
  {
    id: "star",
    name: "Estrela",
    draw: (s) => (
      <>
        <path d="M20 6 L23 16 L33 16 L25 22 L28 32 L20 26 L12 32 L15 22 L7 16 L17 16 Z" fill="none" stroke={s} strokeWidth="1.2" />
      </>
    ),
  },
  {
    id: "key",
    name: "Chave",
    draw: (s) => (
      <>
        <circle cx="14" cy="20" r="6" fill="none" stroke={s} strokeWidth="1.2" />
        <path d="M20 20 H34 M30 20 V25 M26 20 V24" stroke={s} strokeWidth="1.2" />
      </>
    ),
  },
  {
    id: "phoenix",
    name: "Ave",
    draw: (s) => (
      <>
        <path d="M6 24 Q14 14 20 20 Q26 14 34 24 Q28 22 20 26 Q12 22 6 24 Z" fill="none" stroke={s} strokeWidth="1.1" />
        <path d="M20 26 V32" stroke={s} strokeWidth="1" />
        <circle cx="20" cy="20" r="1" fill={s} />
      </>
    ),
  },
];

export const DEFAULT_SIGIL_ID = "diamond";

export function isSigilId(v: unknown): v is string {
  return typeof v === "string" && SIGILS.some((s) => s.id === v);
}

export function Sigil({
  id,
  active = false,
  className = "h-full w-full",
}: {
  id: string;
  active?: boolean;
  className?: string;
}) {
  const s = SIGILS.find((x) => x.id === id) ?? SIGILS.find((x) => x.id === DEFAULT_SIGIL_ID)!;
  const gid = `sigil-grad-${s.id}`;
  const hid = `sigil-halo-${s.id}`;
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(0.92 0.08 82)" />
          <stop offset="55%" stopColor="oklch(0.78 0.11 78)" />
          <stop offset="100%" stopColor="oklch(0.62 0.09 78)" />
        </linearGradient>
        <radialGradient id={hid} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="oklch(0.76 0.09 82 / 0.35)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      {active && <circle cx="20" cy="20" r="19" fill={`url(#${hid})`} />}
      <g strokeLinecap="round" strokeLinejoin="round">
        {s.draw(`url(#${gid})`)}
      </g>
    </svg>
  );
}
