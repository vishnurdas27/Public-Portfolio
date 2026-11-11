import type { CSSProperties } from "react";
import { life } from "~/content";
import { Squiggle, Star } from "../illustrations";

type Shot = (typeof life.shots)[keyof typeof life.shots];
type Note = (typeof life.notes)[keyof typeof life.notes];

const vars = (values: Record<string, string | number>) => values as CSSProperties;

function Polaroid({
  shot,
  rot,
  delay = 0,
  className = "",
  priority,
}: {
  shot: Shot;
  rot: number;
  delay?: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <figure className={`polaroid tilt ${className}`} style={vars({ "--rot": `${rot}deg`, "--reveal-delay": `${delay}s` })} data-reveal>
      <span className="tape-strip" aria-hidden="true" />
      <img
        src={shot.src}
        width={shot.width}
        height={shot.height}
        alt={shot.alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
      />
      <figcaption className="hand">{shot.caption}</figcaption>
    </figure>
  );
}

function StickyNote({ note, tone, rot, className = "" }: { note: Note; tone: string; rot: number; className?: string }) {
  return (
    <div className={`note tilt ${className}`} style={vars({ background: tone, "--rot": `${rot}deg` })} data-reveal>
      <p className="hand text-[1.55rem]">{note.title}</p>
      <p className="mt-1 text-[1rem] font-bold leading-snug">{note.body}</p>
    </div>
  );
}

export function Life() {
  const { shots, notes } = life;

  return (
    <section id="life" aria-labelledby="life-title" className="py-16 md:py-24">
      <div className="story-wrap">
        <header data-reveal className="max-w-[40rem]">
          <p className="pill" style={{ background: "var(--sky)" }}>
            {life.kicker}
          </p>
          <h2 id="life-title" className="display mt-5 text-[clamp(2.6rem,6.4vw,5rem)]">
            Off the <span className="mark">clock</span>
          </h2>
          <p className="mt-5 text-[1.2rem] font-medium leading-relaxed">{life.intro}</p>
          <Squiggle className="mt-3 w-28" />
        </header>
      </div>

      <div className="life-band">
        <div className="life-bike" data-reveal>
          <p className="bubble hand life-bubble" style={vars({ "--tail": "2.4rem" })}>
            {life.bubble}
          </p>
          <img
            className="ride"
            src={shots.bike.src}
            width={shots.bike.width}
            height={shots.bike.height}
            alt={shots.bike.alt}
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="life-band-main">
          <StickyNote note={notes.bike} tone="var(--butter)" rot={-2} className="sm:max-w-[16rem]" />
          <Polaroid shot={shots.golden} rot={-3} delay={0.1} className="life-golden" />
          <Polaroid shot={shots.bridge} rot={3} delay={0.2} className="life-bridge" />
        </div>
      </div>

      <div className="story-wrap mt-20 grid items-start gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="relative lg:col-span-5">
          <div className="life-sun" aria-hidden="true" />
          <Star size={54} fill="var(--coral)" className="float absolute -left-3 top-8 z-10" style={vars({ "--d": "0.4s", "--r2": "-12deg" })} aria-hidden="true" />
          <Polaroid shot={shots.volleyball} rot={-2.5} className="relative z-[1] mx-auto max-w-[24rem]" />
          <StickyNote note={notes.volleyball} tone="var(--sky)" rot={2.5} className="relative z-[2] -mt-10 ml-auto max-w-[17rem] sm:mr-2" />
        </div>

        <div className="lg:col-span-7">
          <Polaroid shot={shots.batch} rot={1.2} className="mx-auto max-w-[40rem]" />
          <div className="mt-10 grid items-start gap-8 sm:grid-cols-[minmax(0,1fr)_14.5rem] md:mt-4">
            <StickyNote note={notes.batch} tone="var(--leaf)" rot={-1.5} className="sm:mt-16 sm:max-w-[18rem]" />
            <div className="relative">
              <Polaroid shot={shots.bouquet} rot={-3.5} className="mx-auto max-w-[14.5rem]" />
              <StickyNote note={notes.bouquet} tone="var(--coral)" rot={2} className="relative z-[2] mt-5 sm:-ml-10" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
