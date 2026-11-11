import { ArrowRight, Check } from "lucide-react";
import { Link } from "react-router";
import { enterpriseProjects, personalProjects } from "~/content";
import type { Project } from "~/content";
import { ProjectLinks } from "~/components/shared/project-links";
import { Section } from "./section";

const cardHover =
  "transition-[border-color,transform,box-shadow] duration-300 [transition-timing-function:var(--ease-out-expo)] hover:-translate-y-1 hover:border-[var(--layer)] hover:shadow-[0_18px_40px_-24px_var(--layer)]";

function FeaturedProject({ project }: { project: Project }) {
  const cover = project.screenshots?.[0];
  return (
    <article data-layer={project.accent} className={`card print-avoid-break group relative flex flex-col overflow-hidden ${cardHover}`}>
      <div aria-hidden className="h-1.5 bg-[var(--layer)]" />
      {cover && (
        <div className="no-print border-b border-line bg-surface-2 p-4 pb-0 md:p-5 md:pb-0">
          <div aria-hidden className="flex items-center gap-1.5 rounded-t-lg border border-b-0 border-line bg-surface px-3 py-2">
            <span className="size-1.5 rounded-full bg-muted/40" />
            <span className="size-1.5 rounded-full bg-muted/40" />
            <span className="size-1.5 rounded-full bg-muted/40" />
            <span className="ml-2 font-mono text-[0.65rem] text-muted">{project.title}</span>
          </div>
          <img
            src={cover.src}
            width={1440}
            height={900}
            alt=""
            loading="lazy"
            decoding="async"
            className="aspect-[8/5] w-full border-x border-line object-cover object-top"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6 md:p-7">
        <p className="eyebrow flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-accent px-2 py-0.5 font-mono text-[0.62rem] tracking-[0.1em] text-accent-fg">FEATURED</span>
          Enterprise · Saint-Gobain SEFPRO
        </p>
        <h3 className="mt-4 text-[1.45rem] font-semibold leading-tight tracking-[-0.02em]">
          <Link to={`/projects/${project.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {project.title}
          </Link>
        </h3>
        <p className="mt-1.5 font-serif text-lg italic text-muted">{project.tagline}</p>
        <p className="mt-3 text-xs leading-relaxed text-muted">{project.role}{project.period ? ` · ${project.period}` : ""}</p>
        <ul className="mt-5 grid gap-2 text-[0.92rem] leading-relaxed">
          {project.highlights.slice(0, 3).map((line) => (
            <li key={line} className="flex gap-3">
              <Check size={15} aria-hidden className="mt-[0.2em] shrink-0 text-accent" />
              <span>{line}</span>
            </li>
          ))}
        </ul>
        <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Technologies used">
          {project.stack.map((tech) => (
            <li key={tech} className="chip">
              {tech}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex flex-col items-start gap-3 pt-6">
          <span className="no-print inline-flex items-center gap-1.5 text-sm font-medium text-accent">
            Read case study <ArrowRight size={15} aria-hidden className="transition-transform duration-300 group-hover:translate-x-1" />
          </span>
          <ProjectLinks project={project} className="no-print relative z-10" />
        </div>
      </div>
    </article>
  );
}

function CompactProject({ project }: { project: Project }) {
  const shown = project.stack.slice(0, 4);
  const extra = project.stack.length - shown.length;
  return (
    <article
      data-layer={project.accent}
      className={`card print-avoid-break group relative flex flex-col p-6 md:[&:last-child:nth-child(odd)]:col-span-2 lg:[&:last-child:nth-child(odd)]:col-span-1 ${cardHover}`}
    >
      <p className="eyebrow flex items-center gap-2">
        <span className="inline-block size-2 rounded-full bg-[var(--layer)]" aria-hidden />
        Personal project
      </p>
      <h3 className="mt-3 text-[1.2rem] font-semibold leading-tight tracking-[-0.02em]">
        <Link to={`/projects/${project.slug}`} className="after:absolute after:inset-0 after:content-['']">
          {project.title}
        </Link>
      </h3>
      <p className="mt-1.5 font-serif text-[1.05rem] italic text-muted">{project.tagline}</p>
      <p className="mt-3 text-[0.9rem] leading-relaxed text-muted">{project.summary}</p>
      <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Technologies used">
        {shown.map((tech) => (
          <li key={tech} className="chip">
            {tech}
          </li>
        ))}
        {extra > 0 && <li className="chip text-muted">+{extra}</li>}
      </ul>
      <div className="mt-auto flex flex-col items-start gap-3 pt-5">
        <span className="no-print inline-flex items-center gap-1.5 text-sm font-medium text-accent">
          Case study <ArrowRight size={15} aria-hidden className="transition-transform duration-300 group-hover:translate-x-1" />
        </span>
        <ProjectLinks project={project} className="no-print relative z-10" />
      </div>
    </article>
  );
}

export function ProjectsSection() {
  return (
    <Section
      id="projects"
      index="03"
      eyebrow="Selected work"
      title="Projects, and the engineering behind them."
      intro="Each project has a case study with the problem, the approach, the architecture and the features. Source and live demos are linked where they're public."
    >
      <div className="grid gap-5 md:grid-cols-2">
        {enterpriseProjects.map((project) => (
          <FeaturedProject key={project.slug} project={project} />
        ))}
      </div>
      <h3 className="eyebrow mb-5 mt-12">Built on my own</h3>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {personalProjects.map((project) => (
          <CompactProject key={project.slug} project={project} />
        ))}
      </div>
    </Section>
  );
}
