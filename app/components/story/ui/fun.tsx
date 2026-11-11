import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "../hooks";
import { sfx } from "../sound";
import { loadBugs, showToast, squashBug, useBugsSquashed, useToast } from "../store";

// little glyphs that pop out of a point (web animations, nothing left behind)
export function burstAt(x: number, y: number, glyphs: readonly string[] = ["✦", "★", "☕", "♥"], count = 7) {
  if (prefersReducedMotion() || typeof document === "undefined") return;
  for (let i = 0; i < count; i++) {
    const el = document.createElement("span");
    el.className = "burst";
    el.textContent = glyphs[i % glyphs.length] ?? "✦";
    el.setAttribute("aria-hidden", "true");
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    document.body.appendChild(el);
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.6;
    const dist = 38 + Math.random() * 46;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist;
    const anim = el.animate(
      [
        { transform: "translate(-50%, -50%) scale(0.4) rotate(0deg)", opacity: 1 },
        { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(1.2) rotate(${(Math.random() - 0.5) * 220}deg)`, opacity: 1, offset: 0.55 },
        { transform: `translate(calc(-50% + ${dx * 1.15}px), calc(-50% + ${dy * 1.15 + 36}px)) scale(0.8) rotate(${(Math.random() - 0.5) * 300}deg)`, opacity: 0 },
      ],
      { duration: 800 + Math.random() * 300, easing: "cubic-bezier(.16,1,.3,1)" },
    );
    anim.onfinish = () => el.remove();
  }
}

// one glyph falling down the screen, for the konami rain
function rainDrop(x: number, glyph: string) {
  const el = document.createElement("span");
  el.className = "burst";
  el.textContent = glyph;
  el.setAttribute("aria-hidden", "true");
  el.style.left = `${x}px`;
  el.style.top = "0px";
  el.style.fontSize = `${1.2 + Math.random() * 1.2}rem`;
  document.body.appendChild(el);
  const drift = (Math.random() - 0.5) * 120;
  const anim = el.animate(
    [
      { transform: "translate(0, -40px) rotate(0deg)", opacity: 1 },
      { transform: `translate(${drift}px, ${window.innerHeight + 40}px) rotate(${(Math.random() - 0.5) * 540}deg)`, opacity: 1 },
    ],
    { duration: 1800 + Math.random() * 1800, easing: "cubic-bezier(.4,.1,.6,1)" },
  );
  anim.onfinish = () => el.remove();
}

// a small pop on click, except on form fields
export function ClickBurst() {
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      const target = e.target as Element | null;
      if (!target || target.closest("input, textarea, select, [data-no-burst], [cmdk-root]")) return;
      burstAt(e.clientX, e.clientY, ["✦", "★", "♥"], 5);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, []);
  return null;
}

export function Toast() {
  const toast = useToast();
  if (!toast) return null;
  return (
    <div key={toast.id} className="toast" role="status" aria-live="polite">
      {toast.text}
    </div>
  );
}

const SQUASH_LINES = [
  "Squashed! One less bug in production.",
  "Bug fixed. No ticket needed.",
  "Got it! (It was a feature. Not anymore.)",
  "Splat! git blame says it wasn't me.",
];

// a bug wanders along the bottom of the screen now and then; the running total is saved between visits
export function BugCrawler() {
  const [bug, setBug] = useState<{ id: number; dur: number } | null>(null);
  const id = useRef(0);
  const lines = useRef(0);

  useEffect(() => {
    loadBugs();
    if (prefersReducedMotion()) return;
    let timer = 0;
    const schedule = (ms: number) => {
      timer = window.setTimeout(() => {
        if (!document.hidden) {
          setBug({ id: ++id.current, dur: 13 + Math.random() * 7 });
          sfx.bugArrives();
        }
        schedule(24_000 + Math.random() * 20_000);
      }, ms);
    };
    schedule(9_000);
    return () => window.clearTimeout(timer);
  }, []);

  if (!bug) return null;
  return (
    <button
      key={bug.id}
      type="button"
      className="crawler"
      style={{ ["--dur" as string]: `${bug.dur}s` }}
      aria-label="A bug is crawling by. Squash it."
      data-no-burst
      data-no-sound
      onAnimationEnd={() => setBug(null)}
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        burstAt(r.left + r.width / 2, r.top + r.height / 2, ["💥", "✦", "★"], 6);
        sfx.splat();
        const total = squashBug();
        showToast(`${SQUASH_LINES[lines.current++ % SQUASH_LINES.length]} (bugs fixed: ${total})`);
        setBug(null);
      }}
    >
      <span aria-hidden="true">🐛</span>
    </button>
  );
}

export function BugCount({ className = "" }: { className?: string }) {
  const n = useBugsSquashed();
  return (
    <span className={className} title="Bugs you have squashed on this site">
      <span aria-hidden="true">🐛</span> <span className="tabular-nums">{n}</span>
      <span className="sr-only"> bugs squashed</span>
    </span>
  );
}

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

// konami code
export function KonamiRain() {
  useEffect(() => {
    let progress = 0;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName))) return;
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (key === KONAMI[progress]) {
        progress += 1;
        if (progress === KONAMI.length) {
          progress = 0;
          showToast("Konami code! Free coffee for everyone ☕");
          sfx.fanfare();
          if (prefersReducedMotion()) return;
          for (let i = 0; i < 36; i++) {
            window.setTimeout(() => rainDrop(Math.random() * window.innerWidth, ["☕", "✦", "🐛", "★"][i % 4] ?? "☕"), i * 70);
          }
        }
      } else {
        progress = key === KONAMI[0] ? 1 : 0;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return null;
}
