import { profile, strengths } from "~/content";
import { Section } from "./section";

export function SummarySection() {
  return (
    <Section id="summary" index="01" eyebrow="Summary" title="Full stack, end to end." intro={profile.summary}>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {strengths.slice(0, 4).map((strength, i) => (
          <li key={strength.title} className="card print-avoid-break relative overflow-hidden p-6">
            <span aria-hidden className="absolute inset-y-0 left-0 w-1 bg-accent" />
            <p className="font-mono text-[0.72rem] text-accent">{String(i + 1).padStart(2, "0")}</p>
            <h3 className="mt-2 text-[1.05rem] font-semibold tracking-tight">{strength.title}</h3>
            <p className="mt-2 text-[0.93rem] leading-relaxed text-muted">{strength.body}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
