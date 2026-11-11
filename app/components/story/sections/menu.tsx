import { ArrowUpRight } from "lucide-react";
import type { CSSProperties } from "react";
import { Link } from "react-router";
import { personalProjects, principles, skillGroups } from "~/content";
import type { Project } from "~/content";
import { ProjectLinks } from "~/components/shared/project-links";
import { PrincipleIcon, Squiggle } from "../illustrations";

// each skill group is a section of the coffee-shop menu
const SECTION_FLAVOUR: Record<string, { name: string; note: string }> = {
  interface: { name: "Latte art", note: "the pretty part" },
  logic: { name: "Espresso shots", note: "the strong stuff" },
  data: { name: "Cold brew", note: "steeped and stored" },
  cloud: { name: "To go", note: "shipping it" },
};

const PRINCIPLE_TONES = ["var(--butter)", "var(--sky)", "var(--coral)", "var(--leaf)"] as const;

function Cover({ slug }: { slug: string }) {
  const s = { fill: "none", stroke: "var(--ink)", strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  if (slug === "ai-wiki-quiz") {
    return (
      <svg viewBox="0 0 260 150" aria-hidden className="h-full w-full">
        <g filter="url(#wobble)" {...s}>
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <rect x="30" y={24 + i * 40} width="150" height="30" rx="15" fill={i === 1 ? "var(--butter)" : "var(--cream)"} />
              <circle cx="48" cy={39 + i * 40} r="6" fill={i === 1 ? "var(--ink)" : "none"} />
              <path d={`M64 ${39 + i * 40} H${140 - i * 14}`} />
            </g>
          ))}
          <text x="214" y="104" textAnchor="middle" fontFamily="var(--font-display)" fontWeight="800" fontSize="96" fill="var(--coral)" stroke="var(--ink)" strokeWidth="2.5">
            ?
          </text>
        </g>
      </svg>
    );
  }
  if (slug === "cinespot") {
    return (
      <svg viewBox="0 0 260 150" aria-hidden className="h-full w-full">
        <g filter="url(#wobble)" {...s}>
          <path d="M30 30 Q130 -2 230 30" strokeWidth="5" />
          {Array.from({ length: 4 }, (_, r) =>
            Array.from({ length: 8 }, (_, c) => {
              const picked = (r === 1 && (c === 3 || c === 4)) || (r === 2 && c === 2);
              return <rect key={`${r}-${c}`} x={42 + c * 24 + (c > 3 ? 8 : 0)} y={50 + r * 24} width="17" height="17" rx="4" fill={picked ? "var(--tangerine)" : "var(--cream)"} />;
            }),
          )}
        </g>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 260 150" aria-hidden className="h-full w-full">
      <g filter="url(#wobble)" {...s}>
        <rect x="34" y="16" width="192" height="118" rx="3" fill="var(--leaf)" />
        <path d="M130 16 V134 M34 40 H226 M34 110 H226 M78 16 V134 M182 16 V134 M34 75 H78 M182 75 H226" strokeWidth="2.4" stroke="var(--cream)" />
        <circle cx="168" cy="58" r="8" fill="var(--butter)" />
      </g>
    </svg>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const tones = ["var(--butter)", "var(--sky)", "var(--leaf)"] as const;
  return (
    <article
      className="sticker tilt group relative flex flex-col overflow-hidden transition-transform duration-300 hover:-translate-y-1.5"
      style={{ "--rot": `${[-1.2, 0.8, -0.6][index % 3]}deg` } as CSSProperties}
      data-reveal
    >
      <div className="h-40 border-b-[2.5px] border-ink p-3" style={{ background: tones[index % 3] }}>
        <Cover slug={project.slug} />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="display text-[1.7rem]">
          <Link to={`/projects/${project.slug}`} viewTransition className="after:absolute after:inset-0 after:content-['']">
            {project.title}
          </Link>
        </h3>
        <p className="hand mt-1 text-[1.5rem] leading-none text-muted">{project.tagline}</p>
        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Technologies used">
          {project.stack.slice(0, 5).map((t) => (
            <li key={t} className="pill !py-0.5 text-[0.74rem]">
              {t}
            </li>
          ))}
          {project.stack.length > 5 && <li className="pill !py-0.5 text-[0.74rem]">+{project.stack.length - 5}</li>}
        </ul>
        <div className="relative z-10 mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
          <span className="inline-flex items-center gap-1.5 text-[0.95rem] font-bold">
            Case study <ArrowUpRight size={16} aria-hidden className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
          <ProjectLinks project={project} />
        </div>
      </div>
    </article>
  );
}

export function Menu() {
  return (
    <section id="menu" aria-labelledby="menu-title" className="story-wrap py-16 md:py-24">
      <header className="max-w-[44rem]" data-reveal>
        <p className="pill" style={{ background: "var(--leaf)" }}>
          What I serve
        </p>
        <h2 id="menu-title" className="display mt-5 text-[clamp(2.6rem,6.4vw,5rem)]">
          The menu
        </h2>
        <p className="hand mt-2 text-[1.7rem] text-muted">(small menu, everything made well)</p>
      </header>

      <div className="chalkboard mt-10 p-6 md:p-10" data-reveal>
        <div className="grid gap-9 md:grid-cols-2">
          {skillGroups.map((group) => {
            const flavour = SECTION_FLAVOUR[group.id];
            return (
              <div key={group.id}>
                <h3 className="display text-[1.9rem] text-butter">{flavour?.name ?? group.label}</h3>
                <p className="hand text-[1.35rem] text-paper/70">
                  {group.label} · {flavour?.note}
                </p>
                <ul className="mt-3">
                  {group.items.map((item) => (
                    <li key={item} className="menu-row">
                      <span className="font-semibold">{item}</span>
                      <span aria-hidden="true" className="text-butter">
                        ✦
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
        <p className="hand mt-8 text-center text-[1.5rem] text-paper/80">Chef&apos;s note: quality over quantity, always.</p>
      </div>

      <h3 className="display mt-20 text-[clamp(2rem,4.4vw,3.2rem)]" data-reveal>
        Today&apos;s specials <span className="hand text-[1.6rem] text-muted">(what I care about)</span>
      </h3>
      <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {principles.map((p, i) => (
          <li
            key={p.title}
            className="sticker tilt p-6"
            style={{ background: PRINCIPLE_TONES[i % 4], "--rot": `${[-1.4, 1, -0.8, 1.3][i % 4]}deg` } as CSSProperties}
            data-reveal
          >
            <PrincipleIcon kind={p.icon} className="size-14" />
            <h4 className="display mt-4 text-[1.55rem]">{p.title}</h4>
            <p className="mt-2 text-[1rem] font-medium leading-snug">{p.body}</p>
          </li>
        ))}
      </ul>

      <h3 className="display mt-24 text-[clamp(2rem,4.4vw,3.2rem)]" data-reveal>
        Signature dishes <span className="hand text-[1.6rem] text-muted">(things I built on my own)</span>
      </h3>
      <div className="mt-8 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
        {personalProjects.map((project, i) => (
          <ProjectCard key={project.slug} project={project} index={i} />
        ))}
      </div>
      <Squiggle className="mt-10 w-28" />
    </section>
  );
}
