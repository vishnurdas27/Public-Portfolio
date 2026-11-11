import { ArrowDown, ArrowRight, Download, Mail, MapPin } from "lucide-react";
import { Link } from "react-router";
import { education, enterpriseProjects, experience, photos, profile } from "~/content";
import { GitHubIcon, LinkedInIcon } from "~/components/shared/icons";
import { formatRange } from "~/lib/format";

const iconLink =
  "no-print inline-grid size-11 place-items-center rounded-full border border-line text-fg transition-colors hover:border-fg hover:bg-surface";

export function ProHero() {
  const current = experience[0];
  const degree = education.find((item) => item.id === "bvoc");

  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      {/* faint grid, masked to fade out */}
      <div
        aria-hidden
        className="no-print pointer-events-none absolute inset-0 -z-10 opacity-60 [mask-image:radial-gradient(ellipse_80%_70%_at_30%_0%,#000_20%,transparent_75%)]"
        style={{
          backgroundImage:
            "linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      {/* shown in print instead of the header */}
      <div className="print-only mb-4 border-b border-line pb-3 text-[9.5pt]">
        <p>
          {profile.email} · {profile.linkedin.replace("https://www.", "")} · {profile.github.replace("https://", "")} ·{" "}
          {profile.location}
        </p>
      </div>

      <div className="pro-hero-inner container-x grid items-center gap-9 py-10 md:py-14 lg:grid-cols-[minmax(0,1fr)_21rem] lg:gap-12">
        <div className="min-w-0">
          <p className="inline-flex items-center gap-2.5 rounded-full border border-line bg-surface px-3 py-2 text-[0.75rem] font-medium">
            <span aria-hidden className="size-2 shrink-0 rounded-full bg-layer-cloud" />
            {profile.availability}
          </p>

          <h1 id="hero-title" className="mt-6">
            <span className="pro-name block text-[clamp(2.65rem,8vw,5.25rem)] font-semibold leading-[1.02] tracking-[-0.05em]">
              {profile.name}
            </span>
            <span className="sr-only">, </span>
            <span className="pro-role mt-3 block font-serif text-[clamp(1.9rem,5vw,3rem)] italic leading-[1.1] text-accent">
              {profile.title}
            </span>
          </h1>

          <p className="mt-5 max-w-[38rem] text-pretty text-base leading-relaxed text-muted md:text-[1.05rem]">
            {profile.valueProp}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-2">
            <span className="eyebrow w-full">Delivered at {current?.company.split(" (")[0] ?? "SEFPRO"}</span>
            {enterpriseProjects.map((project) => (
              <Link
                key={project.slug}
                to={`/projects/${project.slug}`}
                data-layer={project.accent}
                className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-[0.82rem] font-medium transition-colors hover:border-fg"
              >
                <span aria-hidden className="size-2 rounded-full bg-[var(--layer)]" />
                {project.title}
                <ArrowRight size={13} aria-hidden className="text-muted" />
              </Link>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a href={profile.resumeUrl} download className="btn btn-primary no-print">
              <Download size={16} aria-hidden /> Download résumé
            </a>
            <a href="#projects" className="btn btn-ghost no-print">
              View projects <ArrowDown size={16} aria-hidden />
            </a>
            <span className="mx-1 hidden h-6 w-px bg-line sm:block" aria-hidden />
            <a href={`mailto:${profile.email}`} className={iconLink} aria-label={`Email ${profile.email}`}>
              <Mail size={18} aria-hidden />
            </a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className={iconLink} aria-label="LinkedIn profile">
              <LinkedInIcon size={17} />
            </a>
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className={iconLink} aria-label="GitHub profile">
              <GitHubIcon size={18} />
            </a>
          </div>
        </div>

        <aside aria-label="Snapshot" className="card print-avoid-break mx-auto w-full max-w-md overflow-hidden shadow-[0_20px_60px_-35px_var(--fg)]">
          <div className="no-print border-b border-line bg-surface-2 bg-[radial-gradient(ellipse_at_top,var(--accent-soft),transparent_75%)] px-6 py-5">
            <div className="mx-auto max-w-52">
              <img
                src={photos.pro.src}
                width={photos.pro.width}
                height={photos.pro.height}
                alt={photos.pro.alt}
                decoding="async"
                fetchPriority="high"
                className="aspect-[5/6] w-full rounded-xl object-cover shadow-[0_8px_24px_-12px_var(--fg)]"
              />
            </div>
          </div>
          <div className="p-5">
            <p className="eyebrow">Professional profile</p>
            <p className="mt-2 text-xl font-semibold tracking-tight">{profile.name}</p>
            <p className="mt-1 flex items-center gap-1.5 text-xs leading-relaxed text-muted">
              <MapPin size={14} aria-hidden className="shrink-0" /> {profile.location}
            </p>
            <dl className="mt-4 grid gap-4 border-t border-line pt-4 text-[0.82rem]">
              {current && (
                <div>
                  <dt className="eyebrow">Latest experience</dt>
                  <dd className="mt-1 font-medium">
                    {current.role} · {current.company}
                    <span className="mt-1 block text-muted">{formatRange(current.start, current.end)}</span>
                  </dd>
                </div>
              )}
              {degree && (
                <div>
                  <dt className="eyebrow">Education</dt>
                  <dd className="mt-1 font-medium">
                    {degree.title}
                    <span className="mt-1 block text-muted">{degree.institution}</span>
                    <span className="mt-2 inline-flex rounded-md bg-accent-soft px-2 py-1 text-xs text-fg">
                      {degree.result} · {degree.period}
                    </span>
                  </dd>
                </div>
              )}
            </dl>
            <a href="#experience" className="no-print mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-accent underline-offset-4 hover:underline">
              View experience <ArrowRight size={14} aria-hidden />
            </a>
          </div>
        </aside>
      </div>
    </section>
  );
}
