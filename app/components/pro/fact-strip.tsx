import { achievements, education, projects } from "~/content";

export function FactStrip() {
  const enterprise = projects.filter((p) => p.kind === "enterprise").length;
  const cgpa = education.find((e) => e.id === "bvoc")?.result?.replace("CGPA ", "");
  const award = achievements.find((a) => a.kind === "award");

  const facts = [
    { value: String(enterprise), label: "Production platforms shipped for Saint-Gobain SEFPRO" },
    { value: String(projects.length), label: "Full-stack projects, each with an architecture write-up" },
    { value: cgpa ?? "–", label: "CGPA, B.Voc. at CUSAT" },
    { value: "First", label: `Place in the ${award?.title.replace("First Place, ", "")}, CUSAT (${award?.date})` },
  ];

  return (
    <section aria-label="At a glance" className="pro-section border-t border-line">
      <div className="container-x">
        <dl className="grid grid-cols-2 gap-px bg-line [&>div]:bg-bg lg:grid-cols-4">
          {facts.map((fact) => (
            <div key={fact.label} className="print-avoid-break flex flex-col px-4 py-6 md:px-6">
              <dt className="order-2 mt-3 max-w-[22ch] text-[0.84rem] leading-snug text-muted">{fact.label}</dt>
              <dd className="pro-fact order-1 font-serif text-[clamp(2.5rem,5vw,3.5rem)] leading-none tracking-tight text-accent">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
