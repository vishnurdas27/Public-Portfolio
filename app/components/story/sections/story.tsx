import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { photos, storyScenes } from "~/content";
import type { StoryScene } from "~/content";
import { Arrow, SceneDoodle, Squiggle } from "../illustrations";

function SceneCard({ scene, index }: { scene: StoryScene; index: number }) {
  const right = index % 2 === 1;
  return (
    <article
      className="scene relative grid gap-x-20 py-9 pl-14 md:grid-cols-2 md:py-14 md:pl-0"
      data-tone={scene.tone}
      data-active="false"
      data-reveal
    >
      <span className="road-stop" aria-hidden="true" />
      <div
        className={`sticker tilt relative ${right ? "md:col-start-2" : "md:col-start-1"}`}
        style={{ "--rot": right ? "1.1deg" : "-1.1deg" } as CSSProperties}
      >
        <span className="tape-strip" aria-hidden="true" />
        <div className="relative overflow-hidden rounded-t-[1.15rem] border-b-[2.5px] border-ink" style={{ background: "var(--tone)" }}>
          <SceneDoodle kind={scene.doodle} className="mx-auto block w-full max-w-[22rem]" />
          <span className="pill absolute left-3 top-3 !bg-cream">{scene.years}</span>
        </div>
        <div className="p-6 md:p-7">
          <p className="text-[0.88rem] font-semibold text-muted">{scene.place}</p>
          <h3 className="display mt-1.5 text-[clamp(1.9rem,3.4vw,2.7rem)]">{scene.title}</h3>
          <div className="mt-4 grid gap-3 text-[1.04rem] leading-relaxed">
            {scene.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <ul className="mt-5 flex flex-wrap gap-2" aria-label="Highlights">
            {scene.facts.map((fact) => (
              <li key={fact} className="pill" style={{ background: "var(--tone)" }}>
                {fact}
              </li>
            ))}
          </ul>
          <p className="hand mt-5 flex items-center gap-2 text-[1.5rem] text-muted" style={{ rotate: right ? "1.5deg" : "-1.5deg" }}>
            <Arrow className="w-10 shrink-0 -scale-x-100 rotate-[200deg]" />
            {scene.note}
          </p>
        </div>
      </div>
    </article>
  );
}

// the walker is moved straight from one rAF-throttled scroll handler; react only re-renders when the scene changes
export function Story() {
  const road = useRef<HTMLDivElement>(null);
  const walker = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLDivElement>(null);
  const [scene, setScene] = useState(0);

  useEffect(() => {
    const roadEl = road.current;
    const walkerEl = walker.current;
    const fillEl = fill.current;
    if (!roadEl || !walkerEl || !fillEl) return;

    const scenes = Array.from(roadEl.querySelectorAll<HTMLElement>(".scene"));
    let raf = 0;
    let lastTop = Number.NaN;
    let walkTimer = 0;
    const wide = window.matchMedia("(min-width: 900px)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () => {
      raf = 0;
      const rect = roadEl.getBoundingClientRect();
      const focus = window.innerHeight * 0.55;
      const progress = Math.min(1, Math.max(0, (focus - rect.top) / rect.height));
      const y = progress * rect.height;
      const h = walkerEl.offsetHeight;
      // feet on the progress line, with a slight sway on wide screens
      const sway = wide.matches && !still.matches ? Math.sin(progress * Math.PI * 9) * 34 : 0;
      walkerEl.style.transform = `translate(${sway.toFixed(1)}px, ${Math.max(0, y - h * 0.92).toFixed(1)}px)`;
      fillEl.style.height = `${y.toFixed(1)}px`;

      let best = 0;
      let bestDist = Infinity;
      scenes.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        const d = Math.abs(r.top + r.height / 2 - focus);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
        el.dataset.active = String(false);
      });
      scenes[best]?.setAttribute("data-active", "true");
      setScene((prev) => (prev === best ? prev : best));

      if (!Number.isNaN(lastTop) && Math.abs(rect.top - lastTop) > 0.5) {
        walkerEl.dataset.walking = "true";
        window.clearTimeout(walkTimer);
        walkTimer = window.setTimeout(() => (walkerEl.dataset.walking = "false"), 170);
      }
      lastTop = rect.top;
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    schedule();
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(raf);
      window.clearTimeout(walkTimer);
    };
  }, []);

  return (
    <section id="story" aria-labelledby="story-title" className="story-wrap pb-6 pt-10 md:pt-16">
      <header className="mx-auto max-w-[44rem] text-center" data-reveal>
        <p className="pill mx-auto" style={{ background: "var(--butter)" }}>
          The long version
        </p>
        <h2 id="story-title" className="display mt-5 text-[clamp(2.4rem,6vw,4.6rem)]">
          Grab a coffee. Here's how I got here.
        </h2>
        <p className="hand mt-3 text-[1.7rem] text-muted">(it's a short story, promise)</p>
        <Squiggle className="mx-auto mt-3 w-28" />
      </header>

      <div ref={road} className="road mt-12 md:mt-16">
        <div className="road-line" aria-hidden="true" />
        <div ref={fill} className="road-fill" aria-hidden="true" />
        <div ref={walker} className="walker" data-walking="false" aria-hidden="true">
          <p
            className="bubble hand absolute bottom-full left-1/2 mb-3 w-max max-w-[11rem] -translate-x-[28%] px-3 py-1.5 text-center text-[1.25rem] leading-[1.05]"
            style={{ ["--tail" as string]: "28%" }}
          >
            {storyScenes[scene]?.note}
          </p>
          <img className="walker-img" src={photos.walker.src} width={photos.walker.width} height={photos.walker.height} alt="" loading="lazy" decoding="async" draggable={false} />
        </div>

        {storyScenes.map((s, i) => (
          <SceneCard key={s.id} scene={s} index={i} />
        ))}
      </div>
    </section>
  );
}
