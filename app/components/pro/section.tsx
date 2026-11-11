import type { ReactNode } from "react";

export function Section({
  id,
  index,
  eyebrow,
  title,
  intro,
  children,
}: {
  id: string;
  index: string;
  eyebrow: string;
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="pro-section border-t border-line py-12 md:py-16">
      <div className="container-x">
        <p className="eyebrow">
          <span className="text-accent">{index}</span> · {eyebrow}
        </p>
        <div className="mb-7 mt-3 grid items-start gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-12">
          <h2
            id={`${id}-title`}
            className="pro-h2 max-w-[26ch] text-balance text-[clamp(1.8rem,3.6vw,2.5rem)] font-semibold leading-[1.12] tracking-[-0.035em]"
          >
            {title}
          </h2>
          {intro && (
            <p className="max-w-[46rem] text-pretty text-[0.95rem] leading-relaxed text-muted">{intro}</p>
          )}
        </div>
        <div>{children}</div>
      </div>
    </section>
  );
}
