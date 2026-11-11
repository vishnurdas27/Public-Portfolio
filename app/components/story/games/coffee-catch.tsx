import { useCallback, useEffect, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import { useBest, useInView } from "../hooks";
import { sfx } from "../sound";

const W = 480;
const H = 340;
const CUP_W = 78;
const CUP_H = 46;

type Kind = "bean" | "croissant" | "bug";
interface Drop {
  x: number;
  y: number;
  vy: number;
  kind: Kind;
  rot: number;
  spin: number;
}

// slide the cup (mouse, touch or arrow keys), catch beans and croissants, dodge bugs. the loop only runs while it's on screen
export function CoffeeCatch() {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const inView = useInView(wrap);
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [hurt, setHurt] = useState(false);
  const [newBest, setNewBest] = useState(false);
  const [best, report] = useBest("coffee-catch", "high");

  // game state lives in a ref so the loop doesn't depend on renders
  const game = useRef({ cupX: W / 2, target: W / 2, drops: [] as Drop[], score: 0, lives: 3, spawn: 0, elapsed: 0, keys: { left: false, right: false } });

  const start = useCallback(() => {
    game.current = { cupX: W / 2, target: W / 2, drops: [], score: 0, lives: 3, spawn: 0, elapsed: 0, keys: { left: false, right: false } };
    setScore(0);
    setLives(3);
    setNewBest(false);
    setPhase("playing");
    canvas.current?.focus({ preventScroll: true });
  }, []);

  const finish = useCallback(
    (finalScore: number) => {
      setPhase("over");
      setNewBest(report(finalScore));
    },
    [report],
  );

  useEffect(() => {
    if (phase !== "playing" || !inView) return;
    const el = canvas.current;
    const ctx = el?.getContext("2d");
    if (!el || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    el.width = W * dpr;
    el.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    let raf = 0;
    let last = performance.now();

    const drawDrop = (d: Drop) => {
      ctx.save();
      ctx.translate(d.x, d.y);
      ctx.rotate(d.rot);
      if (d.kind === "bean") {
        ctx.fillStyle = "#3b2418";
        ctx.strokeStyle = "#14100d";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.ellipse(0, 0, 9, 13, 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.strokeStyle = "#d9a66f";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-3, -9);
        ctx.quadraticCurveTo(4, 0, -2, 9);
        ctx.stroke();
      } else {
        ctx.font = "26px system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(d.kind === "bug" ? "🐛" : "🥐", 0, 2);
      }
      ctx.restore();
    };

    const frame = (now: number) => {
      const g = game.current;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      g.elapsed += dt;

      // keyboard / pointer movement
      const speed = 420;
      if (g.keys.left) g.target -= speed * dt;
      if (g.keys.right) g.target += speed * dt;
      g.target = Math.max(CUP_W / 2, Math.min(W - CUP_W / 2, g.target));
      g.cupX += (g.target - g.cupX) * Math.min(1, dt * 16);

      // spawn: faster and buggier the longer you last
      g.spawn -= dt;
      if (g.spawn <= 0) {
        g.spawn = Math.max(0.28, 0.78 - g.elapsed * 0.012);
        const roll = Math.random();
        const bugChance = Math.min(0.34, 0.14 + g.elapsed * 0.004);
        const kind: Kind = roll < bugChance ? "bug" : roll < bugChance + 0.09 ? "croissant" : "bean";
        g.drops.push({ x: 24 + Math.random() * (W - 48), y: -20, vy: 130 + g.elapsed * 5 + Math.random() * 70, kind, rot: 0, spin: (Math.random() - 0.5) * 4 });
      }

      const cupTop = H - 22 - CUP_H;
      for (const d of g.drops) {
        d.y += d.vy * dt;
        d.rot += d.spin * dt;
      }
      g.drops = g.drops.filter((d) => {
        const caught = d.y > cupTop - 6 && d.y < cupTop + 22 && Math.abs(d.x - g.cupX) < CUP_W / 2 + 4;
        if (caught) {
          if (d.kind === "bug") {
            g.lives -= 1;
            sfx.bonk();
            setLives(g.lives);
            setHurt(true);
            window.setTimeout(() => setHurt(false), 260);
          } else {
            g.score += d.kind === "croissant" ? 3 : 1;
            sfx.coin();
            setScore(g.score);
          }
          return false;
        }
        return d.y < H + 30;
      });

      // draw
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#fff3dc";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#ffd15c";
      ctx.beginPath();
      ctx.arc(W - 70, 64, 34, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#14100d";
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.fillStyle = "#14100d";
      ctx.fillRect(0, H - 22, W, 22);
      g.drops.forEach(drawDrop);

      // the cup
      const x = g.cupX;
      const top = H - 22 - CUP_H;
      ctx.fillStyle = "#fffbf2";
      ctx.strokeStyle = "#14100d";
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(x - CUP_W / 2, top);
      ctx.lineTo(x + CUP_W / 2, top);
      ctx.lineTo(x + CUP_W / 2 - 9, top + CUP_H);
      ctx.lineTo(x - CUP_W / 2 + 9, top + CUP_H);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#3b2418";
      ctx.beginPath();
      ctx.ellipse(x, top, CUP_W / 2 - 1, 7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x + CUP_W / 2 + 4, top + CUP_H / 2 - 2, 11, -Math.PI / 2, Math.PI / 2);
      ctx.stroke();

      if (g.lives <= 0) {
        finish(g.score);
        return;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const onVisibility = () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [phase, inView, finish]);

  const onPointerMove = (e: PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    game.current.target = ((e.clientX - r.left) / r.width) * W;
  };
  const onKeyDown = (e: KeyboardEvent<HTMLCanvasElement>) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    game.current.keys[e.key === "ArrowLeft" ? "left" : "right"] = true;
    e.preventDefault();
  };
  const onKeyUp = (e: KeyboardEvent<HTMLCanvasElement>) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    game.current.keys[e.key === "ArrowLeft" ? "left" : "right"] = false;
    e.preventDefault();
  };

  return (
    <div ref={wrap}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-[0.95rem] font-bold">
        <p>
          Score <span className="display text-[1.5rem] align-middle">{score}</span>
        </p>
        <p aria-label={`${lives} lives left`}>{"♥".repeat(Math.max(0, lives)).padEnd(3, "♡")}</p>
        <p className="text-muted">Best {best ?? "–"}</p>
      </div>

      <div className={`relative overflow-hidden rounded-2xl border-[2.5px] border-ink ${hurt ? "animate-[shake_0.26s]" : ""}`}>
        <canvas
          ref={canvas}
          data-no-sound
          width={W}
          height={H}
          tabIndex={0}
          aria-label="Coffee Catch. Move the cup with the mouse, touch or arrow keys. Catch beans and croissants, dodge bugs."
          onPointerMove={onPointerMove}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          className="block aspect-[480/340] w-full touch-none bg-paper"
        />
        {phase !== "playing" && (
          <div className="absolute inset-0 grid place-content-center gap-3 bg-paper/90 p-6 text-center">
            {phase === "over" ? (
              <>
                <p className="display text-[2.4rem]">Game over!</p>
                <p className="text-[1.05rem] font-semibold">
                  You caught <span className="display text-[1.5rem]">{score}</span> points of coffee goodness.
                </p>
                {newBest && <p className="hand text-[1.7rem]">new personal best!</p>}
              </>
            ) : (
              <>
                <p className="display text-[2.2rem]">Coffee Catch</p>
                <p className="mx-auto max-w-[22rem] text-[1rem] font-medium">
                  Catch the beans (+1) and croissants (+3). Dodge the bugs. Three lives.
                </p>
              </>
            )}
            <button type="button" className="btn-ink mx-auto" onClick={start}>
              {phase === "over" ? "Play again" : "Start"}
            </button>
          </div>
        )}
      </div>
      <p className="mt-3 text-[0.86rem] text-muted">Mouse, touch-drag, or ← → keys.</p>
    </div>
  );
}
