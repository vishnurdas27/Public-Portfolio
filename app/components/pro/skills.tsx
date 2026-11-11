import { skillGroups } from "~/content";
import { Section } from "./section";

export function SkillsSection() {
  return (
    <Section
      id="skills"
      index="04"
      eyebrow="Skills"
      title="The stack I work in."
      intro="Technologies I've used in the projects above."
    >
      <div className="grid gap-5 sm:grid-cols-2">
        {skillGroups.map((group) => (
          <div key={group.id} data-layer={group.id} className="card print-avoid-break overflow-hidden p-6">
            <div aria-hidden className="-mx-6 -mt-6 mb-5 h-1 bg-[var(--layer)]" />
            <h3 className="text-lg font-semibold tracking-tight">{group.label}</h3>
            <p className="mt-1.5 text-[0.92rem] leading-relaxed text-muted">{group.blurb}</p>
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {group.items.map((item) => (
                <li key={item} className="chip">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
