import { Award, Sparkles, Trophy, Users } from "lucide-react";
import { achievements } from "~/content";
import type { Achievement } from "~/content";
import { Section } from "./section";

const ICONS: Record<Achievement["kind"], typeof Trophy> = {
  award: Trophy,
  certificate: Award,
  workshop: Sparkles,
  event: Users,
};

export function AchievementsSection() {
  return (
    <Section id="achievements" index="06" eyebrow="Recognition" title="Certificates, workshops and events.">
      <ul className="grid gap-5 sm:grid-cols-2">
        {achievements.map((item) => {
          const Icon = ICONS[item.kind];
          return (
            <li key={item.id} className="card print-avoid-break p-6">
              <div className="flex items-start gap-4">
                <span className="no-print grid size-10 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent">
                  <Icon size={19} aria-hidden />
                </span>
                <div>
                  <h3 className="font-semibold leading-snug tracking-tight">{item.title}</h3>
                  <p className="mt-1 font-mono text-[0.75rem] text-muted">
                    {item.issuer}
                    {item.date ? ` · ${item.date}` : ""}
                  </p>
                  <p className="mt-3 text-[0.92rem] leading-relaxed text-muted">{item.body}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
