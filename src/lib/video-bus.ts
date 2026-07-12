// Tiny event bus so anywhere in the page can control the active <VideoPlayer>.
// Chapters, transcript timestamps and notes all use this to seek.

type Listener = (t: number) => void;
const listeners = new Set<Listener>();
let currentTime = 0;

export function onSeek(cb: Listener) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}
export function seekTo(seconds: number) {
  listeners.forEach((l) => l(seconds));
}
export function reportTime(t: number) {
  currentTime = t;
}
export function getCurrentTime() {
  return currentTime;
}

// "01:23" | "1:02:03" -> seconds
export function parseTimestamp(s: string): number {
  const parts = s.split(":").map((n) => parseInt(n, 10));
  if (parts.some((n) => Number.isNaN(n))) return 0;
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return parts[0] ?? 0;
}
export function fmtTimestamp(sec: number): string {
  const s = Math.max(0, Math.floor(sec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}
