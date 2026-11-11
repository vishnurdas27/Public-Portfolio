import { GraduationCap } from "lucide-react";
import { education } from "~/content";
import { Section } from "./section";

export function EducationSection() {
  return (
    <Section id="education" index="05" eyebrow="Education" title="Degree and training.">
      <ul className="divide-y divide-line border-y border-line">
        {education.map((item) => (
          <li
            key={item.id}
            className="print-avoid-break grid gap-1 py-5 sm:grid-cols-[10rem_minmax(0,1fr)_auto] sm:items-baseline sm:gap-6"
          >
            <p className="font-mono text-[0.8rem] text-muted">{item.period}</p>
            <div>
              <h3 className="flex items-center gap-2 font-semibold tracking-tight">
                <GraduationCap size={16} aria-hidden className="no-print shrink-0 text-muted" />
                {item.title}
              </h3>
              <p className="text-[0.93rem] text-muted">{item.institution}</p>
            </div>
            {item.result && <p className="font-mono text-[0.85rem] font-medium">{item.result}</p>}
          </li>
        ))}
      </ul>
    </Section>
  );
}
