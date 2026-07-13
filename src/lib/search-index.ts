// Full-text search across course content (title + description + transcript +
// chapters + exercises) plus user notes. Uses MiniSearch for tiny in-memory
// index built lazily on first ⌘K open.

import MiniSearch, { type SearchResult } from "minisearch";
import { course } from "./course-data";

export type Doc = {
  id: string; // moduleId/lessonId
  moduleId: string;
  lessonId: string;
  moduleTitle: string;
  lessonTitle: string;
  section: "aula" | "transcricao" | "capitulos" | "exercicio" | "nota";
  body: string;
  t?: number; // seconds anchor for deep-link
};

const NOTES_KEY = "aiae:notes:v1";

function parseTime(s: string): number {
  const parts = s.split(":").map((n) => parseInt(n, 10));
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return 0;
}

function buildDocs(): Doc[] {
  const docs: Doc[] = [];
  for (const m of course.modules) {
    for (const l of m.lessons) {
      const base = {
        moduleId: m.id,
        lessonId: l.id,
        moduleTitle: m.title,
        lessonTitle: l.title,
      };
      docs.push({
        ...base,
        id: `${m.id}/${l.id}#aula`,
        section: "aula",
        body: `${l.title}. ${l.description}. ${l.keyPoints.join(". ")}`,
      });
      docs.push({
        ...base,
        id: `${m.id}/${l.id}#trans`,
        section: "transcricao",
        body: l.transcript ?? "",
      });
      for (const c of l.chapters) {
        docs.push({
          ...base,
          id: `${m.id}/${l.id}#cap-${c.time}`,
          section: "capitulos",
          body: c.title,
          t: parseTime(c.time),
        });
      }
      docs.push({
        ...base,
        id: `${m.id}/${l.id}#ex`,
        section: "exercicio",
        body: `${l.exercise.title}. ${l.exercise.brief}. ${l.exercise.deliverable}`,
      });
    }
  }
  // Notes
  try {
    const raw = typeof window !== "undefined" ? window.localStorage.getItem(NOTES_KEY) : null;
    const map = raw ? (JSON.parse(raw) as Record<string, string>) : {};
    for (const [k, v] of Object.entries(map)) {
      if (!v?.trim()) continue;
      const [mid, lid] = k.split("/");
      const m = course.modules.find((x) => x.id === mid);
      const l = m?.lessons.find((x) => x.id === lid);
      if (!m || !l) continue;
      docs.push({
        id: `${k}#nota`,
        moduleId: mid,
        lessonId: lid,
        moduleTitle: m.title,
        lessonTitle: l.title,
        section: "nota",
        body: v,
      });
    }
  } catch {
    /* ignore */
  }
  return docs;
}

let cache: { ms: MiniSearch<Doc>; docs: Map<string, Doc> } | null = null;

export function buildIndex() {
  const docs = buildDocs();
  const ms = new MiniSearch<Doc>({
    fields: ["lessonTitle", "moduleTitle", "body"],
    storeFields: ["moduleId", "lessonId", "moduleTitle", "lessonTitle", "section", "body", "t"],
    searchOptions: { boost: { lessonTitle: 3, moduleTitle: 2 }, fuzzy: 0.15, prefix: true },
  });
  ms.addAll(docs);
  cache = { ms, docs: new Map(docs.map((d) => [d.id, d])) };
  return cache;
}

export function searchContent(q: string, limit = 20): (SearchResult & Doc)[] {
  if (!q.trim()) return [];
  if (!cache) buildIndex();
  const results = cache!.ms.search(q).slice(0, limit);
  return results as (SearchResult & Doc)[];
}

export function resetIndex() {
  cache = null;
}

export function snippet(body: string, q: string, len = 120): string {
  if (!body) return "";
  const lower = body.toLowerCase();
  const term = q.trim().split(/\s+/)[0]?.toLowerCase() ?? "";
  const idx = term ? lower.indexOf(term) : -1;
  if (idx < 0) return body.slice(0, len) + (body.length > len ? "…" : "");
  const start = Math.max(0, idx - 40);
  const end = Math.min(body.length, idx + len - 40);
  return (start > 0 ? "…" : "") + body.slice(start, end) + (end < body.length ? "…" : "");
}
