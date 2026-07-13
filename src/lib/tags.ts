export function extractTags(text: string): string[] {
  if (!text) return [];
  const matches = text.match(/(^|\s)#([a-zA-ZÀ-ÿ0-9_-]{2,32})/g) ?? [];
  const set = new Set<string>();
  for (const m of matches) {
    const clean = m.trim().replace(/^#/, "").toLowerCase();
    if (clean) set.add(clean);
  }
  return [...set];
}
