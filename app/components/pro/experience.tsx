import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { experience, getProject } from "~/content";
import { formatRange } from "~/lib/format";
import { Section } from "./section";

export function ExperienceSection() {
  return (
    <Section
      id="experience"
      index="02"
      eyebrow="Experience"
      title="Two enterprise platforms, shipped end to end."
      intro="Built and deployed for Saint-Gobain SEFPRO's internal teams."
    >
      <div className="grid gap-12">
        {experience.map((job) => (
          <article key={job.id} className="grid gap-6">
            <header className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-line bg-surface p-5">
              <div>
                <h3 className="text-xl font-semibold tracking-tight">{job.role}</h3>
                <p className="text-muted">{job.company}</p>
              </div>
              <p className="rounded-full bg-accent-soft px-3 py-2 font-mono text-[0.8rem] text-fg">{formatRange(job.start, job.end)}</p>
            </header>
            <p className="max-w-[44rem] text-pretty leading-relaxed">{job.summary}</p>

            <div className="grid gap-5 md:grid-cols-2">
              {job.projectSlugs.map((slug) => {
                const project = getProject(slug);
                if (!project) return null;
                return (
                  <div key={slug} className="card print-avoid-break p-6 md:p-8" data-layer={project.accent}>
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="eyebrow flex items-center gap-2">
                          <span className="inline-block size-2 rounded-full bg-[var(--layer)]" aria-hidden />
                          Enterprise project
                        </p>
                        <h4 className="mt-2 text-lg font-semibold tracking-tight">{project.title}</h4>
                      </div>
                      <Link
                        to={`/projects/${project.slug}`}
                        className="no-print inline-flex items-center gap-1.5 text-sm font-medium text-accent underline-offset-4 hover:underline"
                      >
                        Case study <ArrowRight size={15} aria-hidden />
                      </Link>
                    </div>
                    <ul className="mt-5 grid gap-2.5 text-[0.95rem] leading-relaxed">
                      {project.highlights.slice(0, 2).map((line) => (
                        <li key={line} className="flex gap-3">
                          <span aria-hidden className="mt-[0.62em] size-1.5 shrink-0 rounded-full bg-[var(--layer)]" />
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                    <ul className="mt-6 flex flex-wrap gap-1.5" aria-label="Technologies used">
                      {project.stack.map((tech) => (
                        <li key={tech} className="chip">
                          {tech}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
