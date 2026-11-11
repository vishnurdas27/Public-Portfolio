import { Check } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";
import { MockWindow } from "./mock-window";

type Priority = "High" | "Medium" | "Low";

interface Ticket {
  id: number;
  title: string;
  priority: Priority;
  stage: number;
  // share of the SLA window used, 0 to 1
  sla: number;
}

const STAGES = ["Created", "Triage", "Assigned", "Investigating", "Resolved", "Closed"] as const;
const PRIORITY_BG: Record<Priority, string> = { High: "var(--coral)", Medium: "var(--butter)", Low: "var(--sky)" };

// made-up tickets
const SEED: Ticket[] = [
  { id: 1041, title: "Line 3 HMI not responding", priority: "High", stage: 3, sla: 0.78 },
  { id: 1040, title: "Cannot print dispatch labels", priority: "Medium", stage: 2, sla: 0.45 },
  { id: 1038, title: "VPN drops every few minutes", priority: "Medium", stage: 1, sla: 0.3 },
  { id: 1036, title: "Request: second monitor", priority: "Low", stage: 0, sla: 0.1 },
];

export function PrismMock() {
  const [tickets, setTickets] = useState<Ticket[]>(SEED);
  const [selected, setSelected] = useState(1041);
  const [draft, setDraft] = useState("");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [sent, setSent] = useState(false);

  const current = tickets.find((t) => t.id === selected) ?? tickets[0];

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const title = draft.trim() || "Printer offline in packing area";
    const id = Math.max(...tickets.map((t) => t.id)) + 1;
    setTickets((list) => [{ id, title, priority, stage: 0, sla: 0.02 }, ...list].slice(0, 5));
    setSelected(id);
    setDraft("");
    setSent(true);
    window.setTimeout(() => setSent(false), 2200);
  };

  const advance = () => {
    if (!current) return;
    setTickets((list) => list.map((t) => (t.id === current.id ? { ...t, stage: Math.min(STAGES.length - 1, t.stage + 1) } : t)));
  };

  return (
    <MockWindow title="prism / helpdesk">
      <div className="grid gap-4 p-4 md:p-5">
        {/* One-minute submission flow */}
        <form onSubmit={submit} className="grid gap-2.5 rounded-xl border-2 border-ink bg-paper p-3.5">
          <label htmlFor="prism-title" className="text-[0.74rem] font-bold uppercase tracking-wider">
            Report an issue · takes under a minute
          </label>
          <div className="flex flex-wrap gap-2">
            <input
              id="prism-title"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="What is wrong? e.g. Printer offline"
              className="min-w-0 flex-1 rounded-lg border-2 border-ink bg-cream px-3 py-2 text-[0.88rem] outline-none placeholder:text-ink/45 focus:bg-white"
            />
            <div role="radiogroup" aria-label="Priority" className="flex gap-1">
              {(["Low", "Medium", "High"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  role="radio"
                  aria-checked={priority === p}
                  onClick={() => setPriority(p)}
                  className="rounded-lg border-2 border-ink px-2.5 text-[0.76rem] font-bold transition-colors"
                  style={{ background: priority === p ? PRIORITY_BG[p] : "var(--cream)" }}
                >
                  {p}
                </button>
              ))}
            </div>
            <button type="submit" className="btn-ink !min-h-10 !px-4 !text-[0.82rem]">
              {sent ? (
                <>
                  <Check size={14} aria-hidden /> Sent
                </>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </form>

        {/* Agent queue */}
        <div>
          <p className="mb-2 text-[0.74rem] font-bold uppercase tracking-wider">Agent queue</p>
          <ul className="grid gap-2">
            {tickets.map((t) => (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={() => setSelected(t.id)}
                  aria-pressed={selected === t.id}
                  className="grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border-2 border-ink px-3 py-2.5 text-left transition-colors hover:bg-butter/60"
                  style={{ background: selected === t.id ? "var(--butter)" : "var(--cream)", boxShadow: selected === t.id ? "3px 3px 0 var(--ink)" : undefined }}
                >
                  <span className="text-[0.74rem] font-bold">#{t.id}</span>
                  <span className="min-w-0">
                    <span className="block truncate text-[0.88rem] font-semibold">{t.title}</span>
                    <span className="mt-1.5 block h-2 overflow-hidden rounded-full border-2 border-ink bg-paper" aria-hidden>
                      <span className="block h-full" style={{ width: `${Math.round(t.sla * 100)}%`, background: t.sla > 0.7 ? "var(--coral)" : t.sla > 0.4 ? "var(--tangerine)" : "var(--leaf)" }} />
                    </span>
                  </span>
                  <span className="rounded-full border-2 border-ink px-2.5 py-0.5 text-[0.68rem] font-bold uppercase" style={{ background: PRIORITY_BG[t.priority] }}>
                    {t.priority}
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[0.74rem] text-muted">Bar = share of the SLA window used. Colour = priority.</p>
        </div>

        {/* Lifecycle */}
        {current && (
          <div className="rounded-xl border-2 border-ink bg-paper p-3.5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-[0.74rem] font-bold uppercase tracking-wider">Lifecycle · #{current.id}</p>
              <button
                type="button"
                onClick={advance}
                disabled={current.stage >= STAGES.length - 1}
                className="rounded-full border-2 border-ink bg-cream px-3 py-1 text-[0.76rem] font-bold transition-colors hover:bg-butter disabled:cursor-not-allowed disabled:opacity-40"
              >
                Advance stage
              </button>
            </div>
            <ol className="mt-3 grid grid-cols-6 gap-1" aria-label="Ticket lifecycle">
              {STAGES.map((stage, i) => (
                <li key={stage} aria-current={i === current.stage ? "step" : undefined} className="text-center">
                  <span className="mx-auto mb-1.5 block h-2 rounded-full border-2 border-ink transition-colors duration-500" style={{ background: i <= current.stage ? "var(--leaf)" : "var(--cream)" }} />
                  <span className={`block text-[0.62rem] leading-tight sm:text-[0.68rem] ${i === current.stage ? "font-extrabold" : "text-muted"}`}>{stage}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </MockWindow>
  );
}
