import { useCallback, useEffect, useRef, useState } from "react";
import { useBest } from "../hooks";
import { sfx } from "../sound";

const HOLES = 9;
const SECONDS = 30;

type Critter = "bug" | "coffee" | null;

export function BugWhack() {
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(SECONDS);
  const [up, setUp] = useState<Critter[]>(() => Array<Critter>(HOLES).fill(null));
  const [hit, setHit] = useState<boolean[]>(() => Array<boolean>(HOLES).fill(false));
  const [message, setMessage] = useState("Squash the bugs. Spare the coffee.");
  const [newBest, setNewBest] = useState(false);
  const [best, report] = useBest("bug-whack", "high");
  const scoreRef = useRef(0);
  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  const start = useCallback(() => {
    scoreRef.current = 0;
    setScore(0);
    setTime(SECONDS);
    setUp(Array<Critter>(HOLES).fill(null));
    setNewBest(false);
    setMessage("Go go go!");
    setPhase("playing");
  }, []);

  // countdown
  useEffect(() => {
    if (phase !== "playing") return;
    const id = window.setInterval(() => {
      setTime((t) => {
        if (t <= 1) {
          window.clearInterval(id);
          setPhase("over");
          setUp(Array<Critter>(HOLES).fill(null));
          setNewBest(report(scoreRef.current));
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [phase, report]);

  // spawner: critters get quicker as the clock runs down
  useEffect(() => {
    if (phase !== "playing") return;
    let alive = true;
    const spawn = (elapsed: number) => {
      if (!alive) return;
      const hole = Math.floor(Math.random() * HOLES);
      const kind: Critter = Math.random() < 0.2 ? "coffee" : "bug";
      setUp((cur) => (cur[hole] ? cur : cur.map((c, i) => (i === hole ? kind : c))));
      const visible = Math.max(420, 900 - elapsed * 14);
      timers.current.push(
        window.setTimeout(() => setUp((cur) => cur.map((c, i) => (i === hole ? null : c))), visible),
      );
      const gap = Math.max(260, 640 - elapsed * 9);
      timers.current.push(window.setTimeout(() => spawn(elapsed + gap / 1000), gap));
    };
    spawn(0);
    return () => {
      alive = false;
      clearTimers();
    };
  }, [phase]);

  const whack = (i: number) => {
    if (phase !== "playing") return;
    const kind = up[i];
    if (!kind) return;
    setUp((cur) => cur.map((c, idx) => (idx === i ? null : c)));
    setHit((cur) => cur.map((h, idx) => (idx === i ? true : h)));
    timers.current.push(window.setTimeout(() => setHit((cur) => cur.map((h, idx) => (idx === i ? false : h))), 500));
    if (kind === "bug") {
      scoreRef.current += 1;
      sfx.splat();
      setMessage("Splat!");
    } else {
      scoreRef.current = Math.max(0, scoreRef.current - 2);
      sfx.bonk();
      setMessage("Not the coffee! (-2)");
    }
    setScore(scoreRef.current);
  };

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-[0.95rem] font-bold">
        <p>
          Score <span className="display align-middle text-[1.5rem]">{score}</span>
        </p>
        <p>
          Time <span className="display align-middle text-[1.5rem] tabular-nums">{time}</span>s
        </p>
        <p className="text-muted">Best {best ?? "–"}</p>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:gap-4" role="group" aria-label="Bug Whack board">
        {Array.from({ length: HOLES }, (_, i) => (
          <button
            key={i}
            type="button"
            className="hole"
            data-up={Boolean(up[i])}
            data-hit={hit[i]}
            onPointerDown={(e) => {
              e.preventDefault();
              whack(i);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                whack(i);
              }
            }}
            aria-label={`Hole ${i + 1}${up[i] === "bug" ? ": bug! squash it" : up[i] === "coffee" ? ": coffee, leave it" : ""}`}
            data-no-burst
            data-no-sound
          >
            <span className="critter" aria-hidden="true">
              {up[i] === "coffee" ? "☕" : "🐛"}
            </span>
            <span className="splat" aria-hidden="true">
              SPLAT!
            </span>
          </button>
        ))}
      </div>

      <p aria-live="polite" className="hand mt-4 min-h-[2rem] text-[1.6rem]">
        {phase === "over" ? `Time! You squashed ${score}.${newBest ? " New personal best!" : ""}` : message}
      </p>
      {phase !== "playing" && (
        <button type="button" className="btn-ink mt-2" onClick={start}>
          {phase === "over" ? "Play again" : "Start"}
        </button>
      )}
    </div>
  );
}
