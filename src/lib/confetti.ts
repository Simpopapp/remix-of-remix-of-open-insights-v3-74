import confetti from "canvas-confetti";

export function fireConfetti(intensity: "soft" | "burst" | "epic" = "burst") {
  if (typeof window === "undefined") return;
  const gold = ["#d4af37", "#f4d67a", "#b8860b", "#ffffff"];
  const base = { colors: gold, ticks: 220, gravity: 0.9, scalar: 0.9 };

  if (intensity === "soft") {
    confetti({ ...base, particleCount: 40, spread: 55, origin: { y: 0.7 } });
    return;
  }

  if (intensity === "burst") {
    confetti({ ...base, particleCount: 90, spread: 70, origin: { y: 0.65 } });
    setTimeout(
      () => confetti({ ...base, particleCount: 60, angle: 60, spread: 55, origin: { x: 0, y: 0.7 } }),
      120,
    );
    setTimeout(
      () => confetti({ ...base, particleCount: 60, angle: 120, spread: 55, origin: { x: 1, y: 0.7 } }),
      120,
    );
    return;
  }

  // epic
  const end = Date.now() + 1200;
  (function frame() {
    confetti({ ...base, particleCount: 4, angle: 60, spread: 60, origin: { x: 0, y: 0.7 } });
    confetti({ ...base, particleCount: 4, angle: 120, spread: 60, origin: { x: 1, y: 0.7 } });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}
