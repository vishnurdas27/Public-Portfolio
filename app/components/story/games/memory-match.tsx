import { useEffect, useRef, useState } from "react";
import { useBest } from "../hooks";
import { sfx } from "../sound";

const FACES = [
  { key: "react", label: "React", tone: "var(--sky)" },
  { key: "node", label: "Node.js", tone: "var(--leaf)" },
  { key: "sql", label: "SQL", tone: "var(--butter)" },
  { key: "aws", label: "AWS", tone: "var(--tangerine)" },
  { key: "git", label: "Git", tone: "var(--coral)" },
  { key: "py", label: "Python", tone: "var(--butter)" },
  { key: "tw", label: "Tailwind", tone: "var(--sky)" },
  { key: "coffee", label: "☕ Coffee", tone: "var(--latte)" },
] as const;

interface Card {
  id: number;
  face: (typeof FACES)[number];
}

// unshuffled for the first render so server and client agree; the real shuffle happens on start
const orderedDeck = (): Card[] => FACES.flatMap((face, i) => [{ id: i * 2, face }, { id: i * 2 + 1, face }]);

const shuffled = (deck: Card[]) => {
  const copy = [...deck];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
};

export function MemoryMatch() {
  const [deck, setDeck] = useState<Card[]>(orderedDeck);
  const [open, setOpen] = useState<number[]>([]);
  const [done, setDone] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [started, setStarted] = useState(false);
  const [newBest, setNewBest] = useState(false);
  const [best, report] = useBest("memory-match", "low");
  const lock = useRef(false);
  const timer = useRef(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const won = done.length === FACES.length;

  const start = () => {
    window.clearTimeout(timer.current);
    lock.current = false;
    setDeck(shuffled(orderedDeck()));
    setOpen([]);
    setDone([]);
    setMoves(0);
    setNewBest(false);
    setStarted(true);
  };

  const flip = (card: Card) => {
    if (!started || lock.current || won || open.includes(card.id) || done.includes(card.face.key)) return;
    const next = [...open, card.id];
    sfx.flip();
    setOpen(next);
    if (next.length < 2) return;

    const a = deck.find((c) => c.id === next[0]);
    const b = deck.find((c) => c.id === next[1]);
    if (!a || !b) return;
    const m = moves + 1;
    setMoves(m);
    lock.current = true;
    if (a.face.key === b.face.key) {
      timer.current = window.setTimeout(() => {
        const nextDone = [...done, a.face.key];
        if (nextDone.length === FACES.length) sfx.fanfare();
        else sfx.match();
        setDone(nextDone);
        setOpen([]);
        lock.current = false;
        if (nextDone.length === FACES.length) setNewBest(report(m));
      }, 450);
    } else {
      timer.current = window.setTimeout(() => {
        setOpen([]);
        lock.current = false;
      }, 800);
    }
  };

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-[0.95rem] font-bold">
        <p>
          Moves <span className="display align-middle text-[1.5rem] tabular-nums">{moves}</span>
        </p>
        <p>
          Pairs <span className="display align-middle text-[1.5rem] tabular-nums">{done.length}</span>/{FACES.length}
        </p>
        <p className="text-muted">Best {best ?? "–"}</p>
      </div>

      <div className="grid grid-cols-4 gap-2.5 sm:gap-3" role="group" aria-label="Memory Match cards">
        {deck.map((card) => {
          const isOpen = open.includes(card.id) || done.includes(card.face.key);
          return (
            <button
              key={card.id}
              type="button"
              className="mcard"
              data-open={isOpen}
              data-done={done.includes(card.face.key)}
              onClick={() => flip(card)}
              aria-label={isOpen ? card.face.label : "Hidden card"}
              aria-pressed={isOpen}
              disabled={!started}
              data-no-burst
              data-no-sound
            >
              <span className="mcard-inner">
                <span className="mcard-face mcard-back" aria-hidden="true">
                  ?
                </span>
                <span className="mcard-face mcard-front" style={{ ["--tone" as string]: card.face.tone }}>
                  {card.face.label}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div aria-live="polite" className="mt-4 flex flex-wrap items-center gap-3">
        {won ? (
          <p className="hand text-[1.6rem]">
            All paired in {moves} moves!{newBest ? " New personal best!" : ""}
          </p>
        ) : (
          !started && <p className="hand text-[1.6rem]">Find all 8 pairs.</p>
        )}
        {(!started || won) && (
          <button type="button" className="btn-ink" onClick={start}>
            {won ? "Play again" : "Shuffle & start"}
          </button>
        )}
      </div>
    </div>
  );
}
