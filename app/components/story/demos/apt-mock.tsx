import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "../hooks";
import { MockWindow } from "./mock-window";

type Role = "Admin" | "Manager" | "User";
type Status = "open" | "done" | "overdue";

interface Item {
  id: number;
  title: string;
  owner: string;
  dept: string;
  status: Status;
  due: string;
  fresh?: boolean;
}

// made-up data
const SEED: Item[] = [
  { id: 1, title: "Update the safety checklist", owner: "AK", dept: "Operations", status: "open", due: "Fri" },
  { id: 2, title: "Share vendor quotation", owner: "PS", dept: "Procurement", status: "overdue", due: "Mon" },
  { id: 3, title: "Review maintenance plan", owner: "RM", dept: "Operations", status: "done", due: "Wed" },
  { id: 4, title: "Confirm audit schedule", owner: "AK", dept: "Quality", status: "open", due: "Tue" },
  { id: 5, title: "Close open NCR items", owner: "JT", dept: "Quality", status: "overdue", due: "Last Fri" },
  { id: 6, title: "Draft training calendar", owner: "RM", dept: "HR", status: "open", due: "Thu" },
];

const INCOMING: Array<Omit<Item, "id" | "fresh">> = [
  { title: "Follow up on supplier audit", owner: "AK", dept: "Quality", status: "open", due: "Next Mon" },
  { title: "Publish shift handover notes", owner: "JT", dept: "Operations", status: "open", due: "Tomorrow" },
  { title: "Book review meeting room", owner: "PS", dept: "Procurement", status: "open", due: "Wed" },
  { title: "Approve revised SOP", owner: "RM", dept: "Quality", status: "open", due: "Fri" },
];

const STATUS_BG: Record<Status, string> = { open: "var(--sky)", done: "var(--leaf)", overdue: "var(--coral)" };

const visibleFor = (role: Role, item: Item) =>
  role === "Admin" ? true : role === "Manager" ? item.dept === "Operations" || item.dept === "Quality" : item.owner === "AK";

export function AptMock() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const reduced = useReducedMotion();
  const [role, setRole] = useState<Role>("Manager");
  const [items, setItems] = useState<Item[]>(SEED);
  const [toast, setToast] = useState<string | null>(null);
  const next = useRef(0);
  const nextId = useRef(100);

  // fake websocket push: a new item every few seconds while the panel is on screen
  useEffect(() => {
    if (!inView || reduced) return;
    const id = window.setInterval(() => {
      const incoming = INCOMING[next.current % INCOMING.length]!;
      next.current += 1;
      setItems((list) => [{ ...incoming, id: nextId.current++, fresh: true }, ...list.map((i) => ({ ...i, fresh: false }))].slice(0, 7));
    }, 4200);
    return () => window.clearInterval(id);
  }, [inView, reduced]);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(id);
  }, [toast]);

  const shown = items.filter((i) => visibleFor(role, i));
  const count = (s: Status) => shown.filter((i) => i.status === s).length;

  return (
    <div ref={ref}>
      <MockWindow title="action-plan-tracker / dashboard">
        <div className="p-4 md:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div role="tablist" aria-label="View as role" className="inline-flex gap-1 rounded-full border-2 border-ink bg-paper p-1">
              {(["Admin", "Manager", "User"] as const).map((r) => (
                <button
                  key={r}
                  role="tab"
                  aria-selected={role === r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`rounded-full px-3.5 py-1.5 text-[0.8rem] font-bold transition-colors ${role === r ? "bg-ink text-paper" : "hover:bg-butter"}`}
                >
                  {r}
                </button>
              ))}
            </div>
            <p className="pill !py-0.5">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-leaf opacity-70" />
                <span className="relative inline-flex size-2 rounded-full bg-leaf" />
              </span>
              Live
            </p>
          </div>

          <dl className="mt-4 grid grid-cols-3 gap-2">
            {(
              [
                ["Open", count("open"), "var(--sky)"],
                ["Done", count("done"), "var(--leaf)"],
                ["Overdue", count("overdue"), "var(--coral)"],
              ] as const
            ).map(([label, value, color]) => (
              <div key={label} className="rounded-xl border-2 border-ink px-3 py-2" style={{ background: color }}>
                <dt className="text-[0.7rem] font-bold uppercase tracking-wider">{label}</dt>
                <dd className="display text-[1.9rem] leading-none">{value}</dd>
              </div>
            ))}
          </dl>

          <ul className="mt-4 grid gap-2" aria-label={`Action items visible to ${role}`}>
            {shown.slice(0, 5).map((item) => (
              <li
                key={item.id}
                className="flex items-center gap-3 rounded-xl border-2 border-ink px-3 py-2.5 transition-colors duration-700"
                style={{ background: item.fresh ? "var(--butter)" : "var(--cream)" }}
              >
                <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-full border-2 border-ink bg-paper text-[0.7rem] font-bold">
                  {item.owner}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[0.88rem] font-semibold">{item.title}</span>
                  <span className="block truncate text-[0.74rem] text-muted">
                    {item.dept} · due {item.due}
                  </span>
                </span>
                {item.fresh && <span className="rounded-full border-2 border-ink bg-ink px-2 py-0.5 text-[0.62rem] font-bold uppercase text-paper">New</span>}
                <span className="rounded-full border-2 border-ink px-2.5 py-0.5 text-[0.68rem] font-bold uppercase" style={{ background: STATUS_BG[item.status] }}>
                  {item.status}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t-2 border-dashed border-ink/40 pt-4">
            <p aria-live="polite" className="min-h-5 text-[0.78rem] text-muted">
              {toast ?? "New items arrive live over WebSockets."}
            </p>
            <div className="flex gap-2">
              {["Export PDF", "Export Excel"].map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setToast(`Mock: "${label}" exports the ${role} view.`)}
                  className="rounded-full border-2 border-ink bg-cream px-3 py-1.5 text-[0.76rem] font-bold transition-colors hover:bg-butter"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </MockWindow>
    </div>
  );
}
