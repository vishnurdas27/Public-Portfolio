import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { data, Link } from "react-router";
import { ArchitectureDiagram } from "~/components/shared/architecture-diagram";
import { ProjectLinks } from "~/components/shared/project-links";
import { MobileActionBar, ProHeader } from "~/components/pro/header";
import { ContactSection } from "~/components/pro/contact";
import { ProFooter } from "~/components/pro/footer";
import { getProject, profile, projects } from "~/content";
import { buildMeta } from "~/lib/seo";
import type { Route } from "./+types/project";

export function meta({ params }: Route.MetaArgs) {
  const project = getProject(params.slug);
  if (!project) return [{ title: `Not found | ${profile.name}` }, { name: "robots", content: "noindex" }];
  return buildMeta({
    title: `${project.title}: case study | ${profile.name}`,
    description: project.summary,
    path: `/projects/${project.slug}`,
    image: project.slug,
  });
}

export default function ProjectPage({ params }: Route.ComponentProps) {
  const project = getProject(params.slug);
  if (!project) throw data(null, { status: 404 });

  const index = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(index + 1) % projects.length];
  const shots = project.screenshots ?? [];
  // the screens section only exists for some projects, so the later sections are numbered from here
  const step = (n: number) => String(n + (shots.length ? 1 : 0)).padStart(2, "0");

  return (
    <>
      <ProHeader onPage={false} />
      <main id="main" data-layer={project.accent}>
        <article>
          <header className="pro-section relative overflow-hidden border-b border-line">
            <div
              aria-hidden
              className="no-print pointer-events-none absolute -right-40 -top-40 size-[34rem] rounded-full opacity-[0.16] blur-3xl"
              style={{ background: "var(--layer)" }}
            />
            <div className="container-x relative py-8 md:py-12">
              <Link
                to="/#projects"
                className="no-print inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-fg"
              >
                <ArrowLeft size={15} aria-hidden /> All projects
              </Link>

              <div className="mt-7 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-12">
                <div className="min-w-0">
                  <p className="eyebrow flex items-center gap-2">
                    <span className="inline-block size-2 rounded-full bg-[var(--layer)]" aria-hidden />
                    {project.kind === "enterprise" ? "Enterprise · Saint-Gobain SEFPRO" : "Personal project"} · Case study
                  </p>
                  <h1 className="pro-name mt-4 max-w-[20ch] text-balance text-[clamp(2.3rem,5.5vw,4rem)] font-semibold leading-[1.05] tracking-[-0.045em]">
                    {project.title}
                  </h1>
                  {project.fullTitle && <p className="mt-3 text-sm leading-relaxed text-muted">{project.fullTitle}</p>}
                  <p className="mt-4 font-serif text-[clamp(1.4rem,3vw,1.8rem)] italic leading-tight text-muted">
                    {project.tagline}
                  </p>
                  <p className="mt-4 max-w-[42rem] text-pretty text-base leading-relaxed text-muted">{project.summary}</p>

                  <dl className="mt-6 grid gap-5 border-t border-line pt-5 sm:grid-cols-2">
                    <div>
                      <dt className="eyebrow">Role</dt>
                      <dd className="mt-1.5 text-[0.95rem] font-medium">{project.role}</dd>
                    </div>
                    {project.period && (
                      <div>
                        <dt className="eyebrow">When</dt>
                        <dd className="mt-1.5 text-[0.95rem] font-medium">{project.period}</dd>
                      </div>
                    )}
                    <div className="sm:col-span-2">
                      <dt className="eyebrow">Stack</dt>
                      <dd className="mt-2">
                        <ul className="flex flex-wrap gap-1.5">
                          {project.stack.map((tech) => (
                            <li key={tech} className="chip">
                              {tech}
                            </li>
                          ))}
                        </ul>
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-6">
                    <ProjectLinks project={project} />
                    {project.links.liveNote && <p className="mt-2 text-sm text-muted">{project.links.liveNote}</p>}
                  </div>
                </div>
                <aside aria-labelledby="delivery-title" className="card print-avoid-break border-t-4 border-t-[var(--layer)] p-6 md:p-7">
                  <p className="eyebrow">At a glance</p>
                  <h2 id="delivery-title" className="mt-2 text-xl font-semibold tracking-tight">What I delivered</h2>
                  <ul className="mt-5 grid gap-4">
                    {project.highlights.slice(0, 3).map((highlight) => (
                      <li key={highlight} className="flex gap-3 text-sm leading-relaxed">
                        <Check size={16} aria-hidden className="mt-0.5 shrink-0 text-[var(--layer-text)]" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                  <a href="#contact" className="btn btn-ghost no-print mt-6 w-full">
                    Discuss this project <ArrowRight size={15} aria-hidden />
                  </a>
                </aside>
              </div>
              <nav aria-label="Case study sections" className="no-print mt-8 flex flex-wrap items-center gap-2 border-t border-line pt-5">
                <span className="eyebrow mr-2">Explore</span>
                <a href="#overview" className="btn btn-ghost !text-xs">Problem &amp; approach</a>
                {shots.length > 0 && <a href="#screens" className="btn btn-ghost !text-xs">Product screens</a>}
                <a href="#architecture" className="btn btn-ghost !text-xs">Architecture</a>
                <a href="#features" className="btn btn-ghost !text-xs">Key features</a>
              </nav>
            </div>
          </header>

          <section id="overview" aria-labelledby="problem-title" className="pro-section border-b border-line py-10 md:py-14">
            <div className="container-x grid gap-5 md:grid-cols-2">
              <div className="card p-6 md:p-8">
                <p className="eyebrow">01 · Context</p>
                <h2 id="problem-title" className="mt-3 text-2xl font-semibold tracking-tight">
                  The problem
                </h2>
                <p className="mt-4 text-pretty text-base leading-relaxed text-muted">{project.case.problem}</p>
              </div>
              <div className="card p-6 md:p-8">
                <p className="eyebrow">02 · Solution</p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight">The approach</h2>
                <p className="mt-4 text-pretty text-base leading-relaxed text-muted">{project.case.approach}</p>
              </div>
            </div>
          </section>

          {shots.length > 0 && (
            <section id="screens" aria-labelledby="screens-title" className="pro-section border-b border-line py-10 md:py-14">
              <div className="container-x">
                <p className="eyebrow">03 · The product</p>
                <h2 id="screens-title" className="mt-3 text-[clamp(1.6rem,3.4vw,2.4rem)] font-semibold tracking-[-0.03em]">
                  Screens from the app
                </h2>
                <p className="no-print mt-3 text-sm text-muted">Select any screen to view it full size in a new tab.</p>
                <ul className="mt-8 grid gap-x-6 gap-y-8 md:grid-cols-2">
                  {shots.map((shot, i) => (
                    <li key={shot.src} className={shots.length % 2 === 1 && i === 0 ? "md:col-span-2" : ""}>
                      <figure className="m-0">
                        <a
                          href={shot.src}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="card print-avoid-break block overflow-hidden transition-[border-color] hover:border-[var(--layer)]"
                        >
                          {/* every screenshot is captured at 1440x900 */}
                          <img
                            src={shot.src}
                            width={1440}
                            height={900}
                            alt={shot.alt}
                            loading={i === 0 ? "eager" : "lazy"}
                            decoding="async"
                            className="h-auto w-full"
                          />
                          <span className="sr-only"> (opens full size in a new tab)</span>
                        </a>
                        <figcaption className="mt-3 text-sm text-muted">{shot.caption}</figcaption>
                      </figure>
                    </li>
                  ))}
                </ul>
                {project.case.notes && <p className="mt-8 max-w-[46rem] text-sm text-muted">{project.case.notes}</p>}
              </div>
            </section>
          )}

          <section id="architecture" aria-labelledby="arch-title" className="pro-section border-b border-line py-10 md:py-14">
            <div className="container-x">
              <p className="eyebrow">{step(3)} · Architecture</p>
              <h2 id="arch-title" className="mt-3 text-[clamp(1.6rem,3.4vw,2.4rem)] font-semibold tracking-[-0.03em]">
                How the pieces fit together
              </h2>
              <div className="card mt-8 p-4 md:p-8">
                <ArchitectureDiagram diagram={project.case.diagram} title={project.title} />
              </div>
              {project.case.notes && shots.length === 0 && <p className="mt-4 max-w-[46rem] text-sm text-muted">{project.case.notes}</p>}
            </div>
          </section>

          <section id="features" aria-labelledby="features-title" className="pro-section py-10 md:py-14">
            <div className="container-x">
              <p className="eyebrow">{step(4)} · What I built</p>
              <h2 id="features-title" className="mt-3 text-[clamp(1.6rem,3.4vw,2.4rem)] font-semibold tracking-[-0.03em]">
                Key features
              </h2>
              <ol className="mt-8 grid gap-5 sm:grid-cols-2">
                {project.case.features.map((feature, i) => (
                  <li key={feature.title} className="card print-avoid-break p-6 md:p-7">
                    <p className="font-mono text-[0.78rem] text-[var(--layer-text)]">{String(i + 1).padStart(2, "0")}</p>
                    <h3 className="mt-3 text-lg font-semibold tracking-tight">{feature.title}</h3>
                    <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{feature.body}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        </article>

        {next && next.slug !== project.slug && (
          <nav aria-label="Next project" className="no-print border-t border-line">
            <Link
              to={`/projects/${next.slug}`}
              className="container-x group flex items-center justify-between gap-6 py-10 md:py-14"
            >
              <span>
                <span className="eyebrow">Next project</span>
                <span className="mt-2 block text-[clamp(1.5rem,4vw,2.75rem)] font-semibold tracking-[-0.035em]">
                  {next.title}
                </span>
              </span>
              <ArrowRight
                aria-hidden
                className="size-8 shrink-0 transition-transform duration-300 [transition-timing-function:var(--ease-out-expo)] group-hover:translate-x-2"
              />
            </Link>
          </nav>
        )}

        <ContactSection />
      </main>
      <ProFooter />
      <MobileActionBar />
    </>
  );
}
