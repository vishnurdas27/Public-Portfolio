import { ArrowUpRight, Check, Lock } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { Link } from "react-router";
import { enterpriseProjects, experience } from "~/content";
import type { Project } from "~/content";
import { formatRange } from "~/lib/format";
import { Squiggle } from "../illustrations";
import { AptMock } from "../demos/apt-mock";
import { PrismMock } from "../demos/prism-mock";

function ProjectBlock({ project, tone, mock, flip }: { project: Project; tone: string; mock: ReactNode; flip?: boolean }) {
  return (
    <article className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12" data-tone={tone} data-reveal>
      <div
        className={`sticker tilt relative p-6 md:p-8 ${flip ? "lg:order-2" : ""}`}
        style={{ "--rot": flip ? "1deg" : "-1deg" } as CSSProperties}
      >
        <span className="tape-strip" aria-hidden="true" />
        <p className="pill" style={{ background: "var(--tone)" }}>
          Enterprise project
        </p>
        <h3 className="display mt-4 text-[clamp(2rem,3.8vw,3rem)]">{project.title}</h3>
        <p className="hand mt-2 text-[1.7rem] leading-none">{project.tagline}</p>
        <p className="mt-5 text-[1.04rem] leading-relaxed">{project.case.problem}</p>
        <ul className="mt-5 grid gap-2.5">
          {project.case.features.map((f) => (
            <li key={f.title} className="flex items-start gap-3 text-[0.98rem] font-semibold">
              <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border-2 border-ink" style={{ background: "var(--tone)" }}>
                <Check size={12} strokeWidth={3.5} aria-hidden />
              </span>
              {f.title}
            </li>
          ))}
        </ul>
        <ul className="mt-6 flex flex-wrap gap-1.5" aria-label="Technologies used">
          {project.stack.map((tech) => (
            <li key={tech} className="pill !py-0.5 text-[0.76rem]">
              {tech}
            </li>
          ))}
        </ul>
        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link to={`/projects/${project.slug}`} viewTransition className="btn-ink">
            Read the case study <ArrowUpRight size={17} aria-hidden />
          </Link>
          {!project.links.githubPublic && (
            <span className="inline-flex items-center gap-1.5 text-[0.85rem] font-semibold text-muted">
              <Lock size={14} aria-hidden /> Private repo
            </span>
          )}
        </div>
      </div>
      <div className={flip ? "lg:order-1" : ""}>{mock}</div>
    </article>
  );
}

export function Work() {
  const job = experience[0];
  const [apt, prism] = enterpriseProjects;
  if (!job || !apt || !prism) return null;

  return (
    <section id="work" aria-labelledby="work-title" className="story-wrap py-16 md:py-24">
      <header className="max-w-[46rem]" data-reveal>
        <p className="pill" style={{ background: "var(--sky)" }}>
          {formatRange(job.start, job.end)} · {job.company}
        </p>
        <h2 id="work-title" className="display mt-5 text-[clamp(2.6rem,6.4vw,5rem)]">
          Then it got <span className="mark">real.</span>
        </h2>
        <p className="mt-5 text-[1.2rem] leading-relaxed">
          In 2026 I joined Saint-Gobain SEFPRO as a Full Stack Developer and built two platforms: an action tracker wired into Microsoft 365, and an IT helpdesk for plant staff.
        </p>
        <p className="hand mt-2 text-[1.6rem] text-muted">(these are hands-on mock-ups; the real screens are in each case study)</p>
        <Squiggle className="mt-3 w-28" />
      </header>

      <div className="mt-14 grid gap-20 md:mt-20 md:gap-28">
        <ProjectBlock project={apt} tone="sky" mock={<AptMock />} />
        <ProjectBlock project={prism} tone="butter" mock={<PrismMock />} flip />
      </div>
    </section>
  );
}
