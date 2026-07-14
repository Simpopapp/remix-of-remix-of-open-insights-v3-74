// Export / import / wipe of all AI App Empire local data.
// Every persisted feature uses the `aiae:*` namespace, so we can round-trip
// the whole account state as one JSON file.

const PREFIX = "aiae:";
const VERSION = 2;

// Keys retired between versions. Removed on app boot and skipped on import.
const OBSOLETE_KEYS = new Set<string>([
  "aiae:streak:v1", // v1→v2: streak now derives from activity.ts + streak-freeze
]);

export function migrateStorage() {
  if (typeof window === "undefined") return;
  try {
    for (const k of OBSOLETE_KEYS) window.localStorage.removeItem(k);
  } catch {
    // Ignore quota/privacy errors — obsolete keys will be cleaned on next attempt.
  }
}

export type Dump = {
  version: number;
  exportedAt: string;
  data: Record<string, string>;
};

function keys(): string[] {
  if (typeof window === "undefined") return [];
  const out: string[] = [];
  for (let i = 0; i < window.localStorage.length; i++) {
    const k = window.localStorage.key(i);
    if (k && k.startsWith(PREFIX)) out.push(k);
  }
  return out;
}

export function exportAll(): Dump {
  const data: Record<string, string> = {};
  for (const k of keys()) {
    const v = window.localStorage.getItem(k);
    if (v !== null) data[k] = v;
  }
  return { version: VERSION, exportedAt: new Date().toISOString(), data };
}

export function downloadDump() {
  const dump = exportAll();
  const blob = new Blob([JSON.stringify(dump, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `ai-app-empire-${dump.exportedAt.slice(0, 10)}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 500);
}

export function importDump(raw: string): { ok: true; count: number } | { ok: false; error: string } {
  try {
    const parsed = JSON.parse(raw) as Dump;
    if (!parsed || typeof parsed !== "object" || !parsed.data) {
      return { ok: false, error: "Arquivo inválido." };
    }
    let count = 0;
    for (const [k, v] of Object.entries(parsed.data)) {
      if (!k.startsWith(PREFIX) || typeof v !== "string") continue;
      if (OBSOLETE_KEYS.has(k)) continue;
      window.localStorage.setItem(k, v);
      count++;
    }
    migrateStorage();
    // Nudge every subscriber via storage event
    window.dispatchEvent(new StorageEvent("storage"));
    return { ok: true, count };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export function wipeAll() {
  for (const k of keys()) window.localStorage.removeItem(k);
  window.dispatchEvent(new StorageEvent("storage"));
  // Force a reload so all react state resets clean
  window.location.href = "/";
}
