import { useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { photos } from "~/content";
import { BugWhack } from "../games/bug-whack";
import { CoffeeCatch } from "../games/coffee-catch";
import { MemoryMatch } from "../games/memory-match";
import { Squiggle } from "../illustrations";

const GAMES = [
  { id: "catch", label: "Coffee Catch", tone: "var(--butter)", view: () => <CoffeeCatch /> },
  { id: "whack", label: "Bug Whack", tone: "var(--coral)", view: () => <BugWhack /> },
  { id: "memory", label: "Memory Match", tone: "var(--sky)", view: () => <MemoryMatch /> },
] as const;

export function Play() {
  const [active, setActive] = useState<(typeof GAMES)[number]["id"]>("catch");
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const game = GAMES.find((g) => g.id === active) ?? GAMES[0];

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = (index + (e.key === "ArrowRight" ? 1 : GAMES.length - 1)) % GAMES.length;
    setActive(GAMES[next]!.id);
    tabs.current[next]?.focus();
  };

  return (
    <section id="play" aria-labelledby="play-title" className="story-wrap py-16 md:py-24">
      <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_auto]">
        <header data-reveal className="max-w-[40rem]">
          <p className="pill" style={{ background: "var(--coral)" }}>
            Break time
          </p>
          <h2 id="play-title" className="display mt-5 text-[clamp(2.6rem,6.4vw,5rem)]">
            The <span className="mark">timepass</span> corner
          </h2>
          <p className="mt-5 text-[1.2rem] leading-relaxed">
            Every developer needs a break. Here are three tiny games, so I'm not the only one procrastinating. Your best scores stay on this device.
          </p>
          <Squiggle className="mt-3 w-28" />
        </header>
        <div className="relative hidden justify-self-end lg:block" aria-hidden="true">
          <p className="bubble hand absolute -left-24 top-2 z-10 w-36 px-3 py-2 text-center text-[1.35rem] leading-[1.05]" style={{ ["--tail" as string]: "76%" }}>
            go on, beat my score
          </p>
          <img
            src={photos.cool.src}
            width={photos.cool.width}
            height={photos.cool.height}
            alt=""
            loading="lazy"
            decoding="async"
            draggable={false}
            className="w-44 rotate-3"
            style={{ filter: "drop-shadow(6px 6px 0 var(--ink))" }}
          />
        </div>
      </div>

      <div className="mt-10" data-reveal>
        <div role="tablist" aria-label="Games" className="mb-5 flex flex-wrap gap-3">
          {GAMES.map((g, i) => (
            <button
              key={g.id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              id={`tab-${g.id}`}
              role="tab"
              type="button"
              className="game-tab"
              aria-selected={active === g.id}
              aria-controls="game-panel"
              tabIndex={active === g.id ? 0 : -1}
              onClick={() => setActive(g.id)}
              onKeyDown={(e) => onKey(e, i)}
            >
              {g.label}
            </button>
          ))}
        </div>
        <div id="game-panel" role="tabpanel" aria-labelledby={`tab-${game.id}`} className="game-card relative max-w-[46rem] p-5 md:p-7">
          <span aria-hidden className="absolute -top-3 left-8 h-6 w-24 rotate-[-3deg] border-2 border-ink" style={{ background: game.tone }} />
          {game.view()}
        </div>
      </div>
    </section>
  );
}
