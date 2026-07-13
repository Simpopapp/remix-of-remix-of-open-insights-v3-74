// Tiny event bus so anywhere in the page can control the active <VideoPlayer>.
// Chapters, transcript timestamps and notes all use this to seek.

type SeekListener = (t: number) => void;
type CommandListener = (cmd: VideoCommand) => void;
type TimeListener = (t: number) => void;

export type VideoCommand =
  | { type: "toggle" }
  | { type: "play" }
  | { type: "pause" }
  | { type: "skip"; delta: number }
  | { type: "rate"; value: number }
  | { type: "fullscreen" };

const seekListeners = new Set<SeekListener>();
const cmdListeners = new Set<CommandListener>();
const timeListeners = new Set<TimeListener>();
let currentTime = 0;

export function onSeek(cb: SeekListener) {
  seekListeners.add(cb);
  return () => {
    seekListeners.delete(cb);
  };
}
export function seekTo(seconds: number) {
  seekListeners.forEach((l) => l(seconds));
}
export function onCommand(cb: CommandListener) {
  cmdListeners.add(cb);
  return () => {
    cmdListeners.delete(cb);
  };
}
export function sendCommand(cmd: VideoCommand) {
  cmdListeners.forEach((l) => l(cmd));
}
export function onTime(cb: TimeListener) {
  timeListeners.add(cb);
  return () => {
    timeListeners.delete(cb);
  };
}
export function reportTime(t: number) {
  currentTime = t;
  timeListeners.forEach((l) => l(t));
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
