import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useRef, useState } from "react";
import type { CSSProperties } from "react";
import { Link } from "react-router";
import { cupJokes, photos, profile } from "~/content";
import { Arrow, Bean, Cup, Squiggle, Star } from "../illustrations";
import { scrollToId } from "../scroll";
import { sfx } from "../sound";
import { burstAt } from "../ui/fun";

const enter = (n: number) => ({ "--reveal-delay": `${n * 0.09}s` }) as CSSProperties;

function Decor() {
  return (
    <>
      <Star size={46} className="float absolute -left-2 top-2 z-10" style={{ ["--d" as string]: "0s", ["--r2" as string]: "14deg" }} />
      <Star size={26} fill="var(--coral)" className="float absolute right-[34%] -top-3 z-10" style={{ ["--d" as string]: "1.2s", ["--r2" as string]: "-12deg" }} />
      <Bean size={34} className="float absolute -right-1 top-[40%] z-10" style={{ ["--d" as string]: "0.6s", ["--r2" as string]: "20deg" }} />
      <Bean size={26} className="float absolute left-[2%] top-[46%] z-10" style={{ ["--d" as string]: "2s", ["--r2" as string]: "-18deg" }} />
      <Squiggle className="float absolute -right-4 bottom-[34%] z-10 w-24" style={{ ["--d" as string]: "1.7s", ["--r2" as string]: "5deg" }} />
    </>
  );
}

export function Hero() {
  const [joke, setJoke] = useState<string | null>(null);
  const [shaking, setShaking] = useState(-1);
  const next = useRef(0);

  const pour = (index: number, el: HTMLElement) => {
    setJoke(cupJokes[next.current++ % cupJokes.length] ?? null);
    setShaking(index);
    sfx.gloop();
    window.setTimeout(() => setShaking(-1), 520);
    const r = el.getBoundingClientRect();
    burstAt(r.left + r.width / 2, r.top + 6, ["☕", "✦", "★"], 6);
  };

  return (
    <section id="top" aria-labelledby="hero-title" className="story-wrap relative pb-6 pt-28 md:pt-36">
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,1fr)] lg:gap-8">
        <div>
          <p data-reveal style={enter(0)} className="pill">
            <Cup className="size-6" steam={false} />
            {profile.title} · Palakkad, Kerala
          </p>

          <h1 id="hero-title" data-reveal style={enter(1)} className="display mt-6 text-[clamp(3.6rem,11vw,8.4rem)]">
            Hi, I&apos;m{" "}
            <span className="wave text-[0.62em]" aria-hidden="true">
              👋
            </span>
            <br />
            <span className="mark">Vishnu</span>.<span className="sr-only">, {profile.title}</span>
          </h1>

          <p data-reveal style={enter(2)} className="mt-7 max-w-[36rem] text-[clamp(1.2rem,2.3vw,1.55rem)] font-semibold leading-snug">
            I build production software end to end, and I've already shipped two enterprise platforms for Saint-Gobain SEFPRO.
          </p>
          <p data-reveal style={enter(3)} className="mt-3 max-w-[34rem] text-[1.1rem] font-medium leading-snug text-muted">
            I turn coffee into code, and I'd rather ship one great thing than ten okay ones.
          </p>
          <p data-reveal style={enter(3)} className="hand mt-2 text-[1.6rem]">
            (MERN · Python · AWS · and a lot of coffee)
          </p>

          <div data-reveal style={enter(4)} className="mt-8 flex flex-wrap items-center gap-4">
            <button type="button" onClick={() => scrollToId("story")} className="btn-ink">
              Read my story <ArrowDown size={18} aria-hidden />
            </button>
            <Link to="/" viewTransition className="btn-paper">
              Recruiter view <ArrowUpRight size={18} aria-hidden />
            </Link>
          </div>

          <p data-reveal style={enter(5)} className="mt-6 inline-flex items-center gap-2.5 text-[0.95rem] font-semibold">
            <span className="relative flex size-3">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-leaf opacity-70" />
              <span className="relative inline-flex size-3 rounded-full border-2 border-ink bg-leaf" />
            </span>
            {profile.availability}
          </p>
        </div>

        {/* cafe counter: sun behind, three joke cups in front */}
        <div className="hero-stage" data-reveal style={enter(2)}>
          <Decor />
          <div className="hero-rays" aria-hidden="true" />
          <div className="hero-sun" aria-hidden="true" />
          <div className="hero-person" aria-hidden="true">
            <img src={photos.hero.src} width={photos.hero.width} height={photos.hero.height} alt="" decoding="async" fetchPriority="high" draggable={false} />
          </div>

          <p
            aria-live="polite"
            className="bubble hand absolute left-[2%] top-[1%] z-20 max-w-[62%] px-4 py-2.5 text-[1.35rem] leading-[1.05]"
            style={{ ["--tail" as string]: "2.2rem" }}
          >
            {joke ?? "Psst… click a cup."}
          </p>

          <div className="hero-counter z-20">
            <span className="hand absolute left-[24%] top-[26%] text-[1.25rem] leading-none text-paper/85">
              OPEN ☕ now serving: React · Node · Postgres
            </span>
          </div>
          {[
            { left: "2%", size: "18%", rot: -6 },
            { left: "72%", size: "17%", rot: 4 },
            { left: "84%", size: "14%", rot: -3 },
          ].map((cup, i) => (
            <button
              key={cup.left}
              type="button"
              data-no-burst
              data-no-sound
              data-shake={shaking === i}
              aria-label="Pour a coffee joke"
              onClick={(e) => pour(i, e.currentTarget)}
              className="cup-btn absolute bottom-[16%] z-30 aspect-square"
              style={{ left: cup.left, width: cup.size, rotate: `${cup.rot}deg` }}
            >
              <Cup className="size-full" />
            </button>
          ))}

          <div className="hand absolute right-[-3%] top-[3%] z-20 hidden w-32 rotate-[5deg] text-[1.5rem] leading-none sm:block">
            yes, that&apos;s me!
            <Arrow className="ml-1 mt-1 w-12 rotate-[70deg]" />
          </div>
        </div>
      </div>
    </section>
  );
}
