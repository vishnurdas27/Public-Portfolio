import { useId } from "react";
import type { Diagram } from "~/content";

type Group = Diagram["nodes"][number]["group"];

const GROUP_ORDER: Group[] = ["interface", "logic", "data", "external"];
const GROUP_LABEL: Record<Group, string> = {
  interface: "Interface",
  logic: "Logic",
  data: "Data",
  external: "Services",
};
const GROUP_COLOR: Record<Group, string> = {
  interface: "var(--layer-interface)",
  logic: "var(--layer-logic)",
  data: "var(--layer-data)",
  external: "var(--muted)",
};
// darker twins of the colours above, for text
const GROUP_TEXT: Record<Group, string> = {
  interface: "var(--layer-interface-text)",
  logic: "var(--layer-logic-text)",
  data: "var(--layer-data-text)",
  external: "var(--muted)",
};

const NODE_W = 212;
const NODE_H = 64;
const COL_GAP = 112;
const ROW_GAP = 26;
const PAD_X = 12;
const PAD_Y = 52;

interface Placed {
  id: string;
  label: string;
  sub?: string;
  group: Group;
  col: number;
  row: number;
  x: number;
  y: number;
}

function layout(diagram: Diagram) {
  const usedGroups = GROUP_ORDER.filter((g) => diagram.nodes.some((n) => n.group === g));
  const columns = usedGroups.map((g) => diagram.nodes.filter((n) => n.group === g));
  const tallest = Math.max(...columns.map((c) => c.length));
  const innerH = tallest * NODE_H + (tallest - 1) * ROW_GAP;

  const placed = new Map<string, Placed>();
  columns.forEach((nodes, col) => {
    const colH = nodes.length * NODE_H + (nodes.length - 1) * ROW_GAP;
    const top = PAD_Y + (innerH - colH) / 2;
    nodes.forEach((node, row) => {
      placed.set(node.id, {
        ...node,
        col,
        row,
        x: PAD_X + col * (NODE_W + COL_GAP),
        y: top + row * (NODE_H + ROW_GAP),
      });
    });
  });

  return {
    usedGroups,
    placed,
    width: PAD_X * 2 + usedGroups.length * NODE_W + (usedGroups.length - 1) * COL_GAP,
    height: PAD_Y * 2 + innerH,
  };
}

export function ArchitectureDiagram({
  diagram,
  title,
  animate = true,
}: {
  diagram: Diagram;
  title: string;
  animate?: boolean;
}) {
  const uid = useId().replace(/:/g, "");
  const { usedGroups, placed, width, height } = layout(diagram);

  const pairKey = (a: string, b: string) => [a, b].sort().join("|");
  const reverseCount = new Map<string, number>();
  diagram.edges.forEach((e) => reverseCount.set(pairKey(e.from, e.to), (reverseCount.get(pairKey(e.from, e.to)) ?? 0) + 1));

  const edges = diagram.edges.flatMap((edge, i) => {
    const a = placed.get(edge.from);
    const b = placed.get(edge.to);
    if (!a || !b) return [];

    const hasReverse = (reverseCount.get(pairKey(edge.from, edge.to)) ?? 0) > 1;
    const lane = hasReverse ? (edge.from < edge.to ? -12 : 12) : 0;

    let d: string;
    let lx: number;
    let ly: number;

    if (a.col === b.col && Math.abs(a.row - b.row) > 1) {
      // non-adjacent nodes in one column: arc around the side
      const outward = a.col === usedGroups.length - 1 ? -1 : 1;
      const sx = outward === 1 ? a.x + NODE_W : a.x;
      const ex = outward === 1 ? b.x + NODE_W : b.x;
      const sy = a.y + NODE_H / 2;
      const ey = b.y + NODE_H / 2;
      const bulge = 52 * outward;
      d = `M${sx} ${sy} C${sx + bulge} ${sy}, ${ex + bulge} ${ey}, ${ex} ${ey}`;
      lx = sx + bulge * 0.75;
      ly = (sy + ey) / 2;
    } else if (a.col === b.col) {
      const down = b.y > a.y;
      const sx = a.x + NODE_W / 2 + lane;
      const sy = down ? a.y + NODE_H : a.y;
      const ex = b.x + NODE_W / 2 + lane;
      const ey = down ? b.y : b.y + NODE_H;
      d = `M${sx} ${sy} L${ex} ${ey}`;
      lx = sx;
      ly = (sy + ey) / 2;
    } else {
      const toRight = b.col > a.col;
      const sx = toRight ? a.x + NODE_W : a.x;
      const ex = toRight ? b.x : b.x + NODE_W;
      const sy = a.y + NODE_H / 2 + lane;
      const ey = b.y + NODE_H / 2 + lane;
      const skip = Math.abs(b.col - a.col) > 1;
      if (skip) {
        const bow = ey <= sy ? -(NODE_H * 1.1) : NODE_H * 1.1;
        const dx = Math.abs(ex - sx) * 0.3;
        const s = toRight ? 1 : -1;
        d = `M${sx} ${sy} C${sx + s * dx} ${sy + bow}, ${ex - s * dx} ${ey + bow}, ${ex} ${ey}`;
        lx = (sx + ex) / 2;
        ly = (sy + ey) / 2 + bow * 0.75;
      } else {
        const dx = Math.abs(ex - sx) * 0.5;
        const s = toRight ? 1 : -1;
        d = `M${sx} ${sy} C${sx + s * dx} ${sy}, ${ex - s * dx} ${ey}, ${ex} ${ey}`;
        lx = (sx + ex) / 2;
        ly = (sy + ey) / 2;
      }
    }
    return [{ key: `${edge.from}-${edge.to}-${i}`, d, label: edge.label, lx, ly }];
  });

  return (
    <figure className="m-0">
      {/* diagram on wide screens; the list below carries the meaning for assistive tech */}
      <div className="hidden overflow-x-auto md:block">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="mx-auto h-auto w-full min-w-[640px]"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <marker id={`${uid}-arrow`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0 1 L9 5 L0 9 Z" fill="var(--muted)" />
            </marker>
          </defs>

          {usedGroups.map((g, col) => (
            <text
              key={g}
              x={PAD_X + col * (NODE_W + COL_GAP) + NODE_W / 2}
              y={22}
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize="11"
              letterSpacing="1.6"
              fill={GROUP_TEXT[g]}
            >
              {GROUP_LABEL[g].toUpperCase()}
            </text>
          ))}

          {edges.map((edge) => (
            <g key={edge.key}>
              <path
                d={edge.d}
                fill="none"
                stroke="var(--muted)"
                strokeOpacity="0.55"
                strokeWidth="1.5"
                markerEnd={`url(#${uid}-arrow)`}
              />
              {animate && (
                <path
                  d={edge.d}
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="2 14"
                  className="arch-flow"
                />
              )}
              {edge.label && (
                <g>
                  <rect
                    x={edge.lx - edge.label.length * 3.4 - 6}
                    y={edge.ly - 9}
                    width={edge.label.length * 6.8 + 12}
                    height={18}
                    rx={9}
                    fill="var(--bg)"
                    stroke="var(--line)"
                  />
                  <text
                    x={edge.lx}
                    y={edge.ly + 3.5}
                    textAnchor="middle"
                    fontFamily="var(--font-mono)"
                    fontSize="10.5"
                    fill="var(--muted)"
                  >
                    {edge.label}
                  </text>
                </g>
              )}
            </g>
          ))}

          {[...placed.values()].map((node) => (
            <g key={node.id} transform={`translate(${node.x} ${node.y})`}>
              <rect
                width={NODE_W}
                height={NODE_H}
                rx={14}
                fill="var(--surface)"
                stroke={GROUP_COLOR[node.group]}
                strokeOpacity={node.group === "external" ? 0.9 : 0.75}
                strokeDasharray={node.group === "external" ? "5 4" : undefined}
              />
              <rect x={0} y={14} width={3} height={NODE_H - 28} rx={1.5} fill={GROUP_COLOR[node.group]} />
              <text x={20} y={node.sub ? 28 : 38} fontSize="14" fontWeight="600" fill="var(--fg)">
                {node.label}
              </text>
              {node.sub && (
                <text x={20} y={47} fontFamily="var(--font-mono)" fontSize="10.5" fill="var(--muted)">
                  {node.sub}
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>

      {/* list on small screens, screen-reader only on wide ones */}
      <figcaption className="md:sr-only">
        <p className="eyebrow mb-3">{title} · architecture</p>
        <ol className="grid gap-3">
          {usedGroups.map((g) => (
            <li key={g} data-layer={g === "external" ? undefined : g} className="rounded-xl border border-line bg-surface p-4">
              <p className="eyebrow" style={{ color: GROUP_TEXT[g] }}>
                {GROUP_LABEL[g]}
              </p>
              <ul className="mt-2 grid gap-1.5">
                {diagram.nodes
                  .filter((n) => n.group === g)
                  .map((n) => (
                    <li key={n.id} className="text-sm">
                      <span className="font-semibold">{n.label}</span>
                      {n.sub && <span className="text-muted"> · {n.sub}</span>}
                    </li>
                  ))}
              </ul>
            </li>
          ))}
        </ol>
        <p className="eyebrow mb-2 mt-4">Data flow</p>
        <ul className="grid gap-1 text-sm text-muted">
          {diagram.edges.map((e, i) => {
            const from = diagram.nodes.find((n) => n.id === e.from)?.label;
            const to = diagram.nodes.find((n) => n.id === e.to)?.label;
            return (
              <li key={i}>
                {from} → {to}
                {e.label ? ` (${e.label})` : ""}
              </li>
            );
          })}
        </ul>
      </figcaption>
    </figure>
  );
}
