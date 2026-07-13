import { useEffect, useRef, useState } from "react";
import { Play, Pause, PictureInPicture2, RotateCcw, Volume2, VolumeX, Maximize2, Gauge } from "lucide-react";
import { useVideoProgress } from "@/lib/video-progress";
import { addWatchSeconds, pingStreak } from "@/lib/gamification";
import { onSeek, reportTime } from "@/lib/video-bus";

// Public sample video used as placeholder — swap per lesson later.
const DEFAULT_SRC = "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

type Props = {
  moduleId: string;
  lessonId: string;
  poster?: string;
  src?: string;
  onNearComplete?: () => void;
};

function fmt(t: number) {
  if (!Number.isFinite(t)) return "0:00";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function VideoPlayer({ moduleId, lessonId, poster, src, onNearComplete }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const { time, save } = useVideoProgress(moduleId, lessonId);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [cur, setCur] = useState(time);
  const [dur, setDur] = useState(0);
  const [rate, setRate] = useState(1);
  const [showResume, setShowResume] = useState(false);
  const firedRef = useRef(false);
  const lastPingRef = useRef(0);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const onMeta = () => {
      setDur(v.duration || 0);
      if (time > 3 && time < (v.duration || 0) - 5) setShowResume(true);
    };
    const onTime = () => {
      setCur(v.currentTime);
      reportTime(v.currentTime);
      const now = Date.now();
      if (now - lastPingRef.current > 5000) {
        save(v.currentTime, v.duration || 0);
        addWatchSeconds(5);
        lastPingRef.current = now;
      }
      if (!firedRef.current && v.duration && v.currentTime / v.duration > 0.9) {
        firedRef.current = true;
        pingStreak();
        onNearComplete?.();
      }
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    v.addEventListener("loadedmetadata", onMeta);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    return () => {
      v.removeEventListener("loadedmetadata", onMeta);
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      save(v.currentTime, v.duration || 0);
    };
  }, [moduleId, lessonId, save, time, onNearComplete]);

  // External seek bus (chapters, transcript timestamps, notes)
  useEffect(() => {
    return onSeek((t) => {
      const v = ref.current;
      if (!v) return;
      v.currentTime = Math.max(0, t);
      setShowResume(false);
      v.play().catch(() => {});
    });
  }, []);



  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) return;
      const v = ref.current;
      if (!v) return;
      if (e.key === " " || e.key === "k") {
        e.preventDefault();
        v.paused ? v.play() : v.pause();
      } else if (e.key === "ArrowRight" || e.key === "l") {
        v.currentTime = Math.min((v.duration || 0), v.currentTime + 10);
      } else if (e.key === "ArrowLeft" || e.key === "j") {
        v.currentTime = Math.max(0, v.currentTime - 10);
      } else if (e.key === "m") {
        v.muted = !v.muted;
        setMuted(v.muted);
      } else if (e.key === "f") {
        wrapRef.current?.requestFullscreen?.();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    v.paused ? v.play() : v.pause();
  };

  const resume = () => {
    const v = ref.current;
    if (!v) return;
    v.currentTime = time;
    v.play();
    setShowResume(false);
  };
  const restart = () => {
    const v = ref.current;
    if (!v) return;
    v.currentTime = 0;
    v.play();
    setShowResume(false);
  };

  const cycleRate = () => {
    const rates = [1, 1.25, 1.5, 1.75, 2, 0.75];
    const next = rates[(rates.indexOf(rate) + 1) % rates.length];
    setRate(next);
    if (ref.current) ref.current.playbackRate = next;
  };

  const pct = dur ? (cur / dur) * 100 : 0;

  return (
    <div ref={wrapRef} className="relative aspect-video overflow-hidden rounded-xl border border-primary/25 bg-black">
      <video
        ref={ref}
        src={src ?? DEFAULT_SRC}
        poster={poster}
        className="h-full w-full object-cover"
        preload="metadata"
        onClick={toggle}
      />

      {/* Resume overlay */}
      {showResume && (
        <div className="absolute inset-0 grid place-items-center bg-black/60 backdrop-blur-sm">
          <div className="rounded-2xl border border-primary/40 bg-background/90 p-6 text-center shadow-2xl">
            <div className="text-xs uppercase tracking-[0.2em] text-primary">Continue de onde parou</div>
            <div className="mt-1 font-serif text-2xl">{fmt(time)}</div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={resume}
                className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                Retomar
              </button>
              <button
                onClick={restart}
                className="rounded-md border border-input px-4 py-2 text-sm hover:bg-accent"
              >
                <RotateCcw className="mr-1 inline h-3.5 w-3.5" /> Do início
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
        <button
          type="button"
          aria-label="Buscar no vídeo"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const ratio = (e.clientX - rect.left) / rect.width;
            const v = ref.current;
            if (v && dur) v.currentTime = Math.max(0, Math.min(dur, ratio * dur));
          }}
          className="mb-2 h-2 w-full overflow-hidden rounded-full bg-white/15 cursor-pointer"
        >
          <div className="h-full bg-primary pointer-events-none" style={{ width: `${pct}%` }} />
        </button>
        <div className="flex items-center gap-2 text-white">
          <button onClick={toggle} className="rounded p-1.5 hover:bg-white/10" aria-label="Play/Pause">
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
          <button
            onClick={() => {
              if (!ref.current) return;
              ref.current.muted = !ref.current.muted;
              setMuted(ref.current.muted);
            }}
            className="rounded p-1.5 hover:bg-white/10"
            aria-label="Mute"
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
          <span className="text-xs tabular-nums text-white/80">
            {fmt(cur)} / {fmt(dur)}
          </span>
          <div className="ml-auto flex items-center gap-1">
            <button
              onClick={cycleRate}
              className="rounded px-2 py-1 text-xs hover:bg-white/10"
              aria-label="Velocidade"
            >
              <Gauge className="mr-1 inline h-3 w-3" />
              {rate}x
            </button>
            <button
              onClick={async () => {
                const v = ref.current;
                if (!v) return;
                try {
                  if (document.pictureInPictureElement) await document.exitPictureInPicture();
                  else await v.requestPictureInPicture?.();
                } catch { /* ignore */ }
              }}
              className="rounded p-1.5 hover:bg-white/10"
              aria-label="Picture-in-picture"
            >
              <PictureInPicture2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => wrapRef.current?.requestFullscreen?.()}
              className="rounded p-1.5 hover:bg-white/10"
              aria-label="Fullscreen"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/50">
          espaço · ←/→ 10s · m mudo · f tela cheia
        </div>
      </div>
    </div>
  );
}
