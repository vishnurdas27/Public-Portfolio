import type { CSSProperties } from "react";
import { achievements, education, enterpriseProjects, shortVersion, strengths } from "~/content";
import { Squiggle } from "../illustrations";

const TONES = ["var(--butter)", "var(--sky)", "var(--leaf)", "var(--coral)", "var(--tangerine)", "var(--butter)"] as const;

// the numbers come from the content files, so they can't drift from the résumé
export function About() {
  const win = achievements.find((a) => a.kind === "award");
  const cgpa = education.find((e) => e.id === "bvoc")?.result?.replace("CGPA ", "");

  const stats = [
    { value: String(enterpriseProjects.length), label: "enterprise platforms delivered for Saint-Gobain SEFPRO", tone: "var(--butter)", rot: -2 },
    { value: "1st", label: `place in the CUSAT business idea competition${win?.date ? ` (${win.date})` : ""}`, tone: "var(--sky)", rot: 1.6 },
    { value: cgpa ?? "–", label: "CGPA in my B.Voc at CUSAT", tone: "var(--leaf)", rot: -1.2 },
  ];

  return (
    <section id="about" aria-labelledby="about-title" className="story-wrap py-10 md:py-16">
      <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-16">
        <div data-reveal>
          <h2 id="about-title" className="display text-[clamp(2.4rem,6vw,4.6rem)]">
            {shortVersion.kicker.replace(/short version/i, "")}
            <span className="mark">short version</span>
          </h2>
          <p className="mt-6 text-[clamp(1.35rem,2.6vw,2rem)] font-semibold leading-[1.22] tracking-[-0.01em]">{shortVersion.statement}</p>
          <div className="mt-6 grid max-w-[40rem] gap-4 text-[1.12rem] font-medium leading-relaxed">
            {shortVersion.lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <Squiggle className="mt-6 w-28" />
        </div>

        <ul className="grid gap-5 sm:grid-cols-3 lg:grid-cols-1" aria-label="At a glance">
          {stats.map((stat, i) => (
            <li
              key={stat.label}
              className="sticker tilt flex items-center gap-5 p-5 md:p-6"
              style={{ background: stat.tone, "--rot": `${stat.rot}deg`, "--reveal-delay": `${i * 0.1}s` } as CSSProperties}
              data-reveal
            >
              <span className="display text-[clamp(3rem,6vw,4.6rem)] leading-none">{stat.value}</span>
              <span className="text-[1rem] font-bold leading-snug">{stat.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-14" data-reveal>
        <p className="hand text-[1.9rem]">what I do well</p>
        <ul className="mt-3 flex flex-wrap gap-3" aria-label="Strengths">
          {strengths.map((s, i) => (
            <li
              key={s.title}
              className="rounded-full border-[2.5px] border-ink px-4 py-2 text-[0.98rem] font-bold shadow-[3px_3px_0_var(--ink)]"
              style={{ background: TONES[i % TONES.length] }}
            >
              {s.title}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
