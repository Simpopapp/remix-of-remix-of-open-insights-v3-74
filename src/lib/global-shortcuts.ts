import { useEffect } from "react";
import { sendCommand } from "./video-bus";

// Global playback shortcuts. Route them via the video-bus command channel so
// the active <VideoPlayer> reacts no matter where in the tree it lives.
export function useGlobalPlaybackShortcuts() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (!el) return;
      if (["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName)) return;
      if (el.isContentEditable) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      switch (e.key) {
        case " ":
        case "k":
          e.preventDefault();
          sendCommand({ type: "toggle" });
          break;
        case "ArrowRight":
        case "l":
          sendCommand({ type: "skip", delta: 10 });
          break;
        case "ArrowLeft":
        case "j":
          sendCommand({ type: "skip", delta: -10 });
          break;
        case ",":
          sendCommand({ type: "rate", value: -1 });
          break;
        case ".":
          sendCommand({ type: "rate", value: 1 });
          break;
        case "f":
          sendCommand({ type: "fullscreen" });
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
}
