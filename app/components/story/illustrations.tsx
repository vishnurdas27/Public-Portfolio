import type { SVGProps } from "react";
import type { StoryScene } from "~/content";

const INK = "var(--ink)";

// one shared filter that makes svg lines wobble like felt-tip; shapes use filter="url(#wobble)"
export function WobbleFilter() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute" }}>
      <filter id="wobble" x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves="2" seed="4" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="3.4" />
      </filter>
    </svg>
  );
}

const line = { stroke: INK, strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round" } as const;

function School() {
  return (
    <g filter="url(#wobble)" {...line}>
      <circle cx="214" cy="44" r="19" fill="var(--butter)" />
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return <path key={i} d={`M${214 + Math.cos(a) * 26} ${44 + Math.sin(a) * 26} L${214 + Math.cos(a) * 34} ${44 + Math.sin(a) * 34}`} />;
      })}
      <path d="M8 172 H252" />
      <rect x="56" y="96" width="124" height="76" fill="var(--cream)" />
      <path d="M46 98 L118 54 L190 98 Z" fill="var(--coral)" />
      <rect x="104" y="128" width="28" height="44" fill="var(--espresso)" />
      <rect x="68" y="112" width="24" height="22" fill="var(--sky)" />
      <rect x="144" y="112" width="24" height="22" fill="var(--sky)" />
      <path d="M118 54 V14" />
      <rect x="118" y="14" width="30" height="8" fill="#ff9933" strokeWidth="2" />
      <rect x="118" y="22" width="30" height="8" fill="#fffbf2" strokeWidth="2" />
      <rect x="118" y="30" width="30" height="8" fill="#138808" strokeWidth="2" />
      <rect x="214" y="136" width="9" height="36" fill="var(--espresso)" />
      <circle cx="218" cy="118" r="26" fill="var(--leaf)" />
    </g>
  );
}

function Kochi() {
  const net = [
    [108, 54],
    [172, 36],
    [206, 100],
    [142, 118],
  ] as const;
  const lerp = (a: readonly [number, number], b: readonly [number, number], t: number) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t] as const;
  return (
    <g filter="url(#wobble)" {...line}>
      <circle cx="46" cy="46" r="18" fill="var(--butter)" />
      <path d="M0 152 H260 V200 H0 Z" fill="var(--sky)" stroke="none" />
      <path d="M12 166 q10 -8 20 0 t20 0 t20 0 M120 186 q10 -8 20 0 t20 0 t20 0 M190 168 q10 -8 20 0 t20 0" fill="none" />
      {/* the cantilevered Chinese fishing net */}
      <path d="M62 154 V66" strokeWidth="5" />
      <path d="M62 72 L174 32" strokeWidth="5" />
      <path d="M62 154 L96 120" />
      <path d={`M${net[0][0]} ${net[0][1]} L${net[1][0]} ${net[1][1]} L${net[2][0]} ${net[2][1]} L${net[3][0]} ${net[3][1]} Z`} fill="rgba(255,251,242,.55)" />
      {[0.25, 0.5, 0.75].map((t) => {
        const a = lerp(net[0], net[1], t);
        const b = lerp(net[3], net[2], t);
        const c = lerp(net[0], net[3], t);
        const d = lerp(net[1], net[2], t);
        return (
          <g key={t} strokeWidth="1.6">
            <path d={`M${a[0]} ${a[1]} L${b[0]} ${b[1]}`} />
            <path d={`M${c[0]} ${c[1]} L${d[0]} ${d[1]}`} />
          </g>
        );
      })}
      <path d="M118 66 L110 54 M174 34 L172 36 M150 60 L160 40" strokeWidth="1.6" />
      {/* a little boat */}
      <path d="M150 154 L232 154 L216 178 L166 178 Z" fill="var(--coral)" />
      <path d="M190 154 V118" />
      <path d="M192 120 L222 150 H192 Z" fill="var(--cream)" />
    </g>
  );
}

function Parallel() {
  return (
    <g filter="url(#wobble)" {...line}>
      <rect x="22" y="70" width="104" height="68" rx="7" fill={INK} />
      <text x="74" y="116" textAnchor="middle" fontFamily="var(--font-display)" fontWeight="800" fontSize="34" fill="var(--butter)" stroke="none">
        {"</>"}
      </text>
      <path d="M10 142 H138 L128 156 H20 Z" fill="var(--cream)" />
      <rect x="156" y="134" width="88" height="20" fill="var(--sky)" />
      <rect x="162" y="114" width="74" height="20" fill="var(--butter)" />
      <rect x="152" y="94" width="84" height="20" fill="var(--coral)" />
      <path d="M142 90 L194 66 L246 90 L194 112 Z" fill={INK} />
      <path d="M232 94 V118" />
      <circle cx="232" cy="122" r="5" fill="var(--butter)" />
      <circle cx="140" cy="38" r="17" fill="var(--butter)" />
      <path d="M140 29 V47 M131 38 H149" />
      <path d="M20 168 H240" strokeDasharray="2 9" />
    </g>
  );
}

function Events() {
  return (
    <g filter="url(#wobble)" {...line}>
      <path d="M96 38 H164 V88 Q164 124 130 128 Q96 124 96 88 Z" fill="var(--butter)" />
      <path d="M96 50 Q68 50 70 76 Q72 96 98 100" fill="none" />
      <path d="M164 50 Q192 50 190 76 Q188 96 162 100" fill="none" />
      <rect x="122" y="128" width="16" height="20" fill="var(--butter)" />
      <rect x="98" y="148" width="64" height="16" rx="3" fill={INK} />
      <path d="M130 58 l7 15 l16 2 l-12 11 l3 16 l-14 -8 l-14 8 l3 -16 l-12 -11 l16 -2 Z" fill="var(--coral)" strokeWidth="2.4" />
      {/* confetti */}
      <path d="M40 40 l10 10 M52 38 l-8 12" />
      <circle cx="30" cy="96" r="6" fill="var(--sky)" />
      <rect x="206" y="40" width="14" height="14" fill="var(--leaf)" transform="rotate(20 213 47)" />
      <circle cx="226" cy="108" r="6" fill="var(--coral)" />
      <path d="M214 140 l12 -4 l-4 12 Z" fill="var(--tangerine)" />
      <path d="M40 130 q6 -10 12 0 t12 0" fill="none" />
      <path d="M8 172 H252" />
    </g>
  );
}

function Tinker() {
  return (
    <g filter="url(#wobble)" {...line}>
      <g transform="translate(92 100)">
        {Array.from({ length: 8 }, (_, i) => (
          <rect key={i} x="-8" y="-46" width="16" height="18" rx="2" fill="var(--tangerine)" transform={`rotate(${i * 45})`} />
        ))}
        <circle r="34" fill="var(--tangerine)" />
        <circle r="12" fill="var(--paper)" />
      </g>
      <circle cx="186" cy="68" r="25" fill="var(--butter)" />
      <rect x="177" y="92" width="18" height="12" fill="var(--cream)" />
      <path d="M180 108 H192" />
      <path d="M180 72 q6 -8 6 6 M186 78 q6 -14 12 -2" fill="none" strokeWidth="2" />
      {Array.from({ length: 6 }, (_, i) => {
        const a = (-150 + i * 24) * (Math.PI / 180);
        return <path key={i} d={`M${186 + Math.cos(a) * 33} ${68 + Math.sin(a) * 33} L${186 + Math.cos(a) * 42} ${68 + Math.sin(a) * 42}`} />;
      })}
      <path d="M14 176 H96 L110 162 H246" fill="none" />
      <circle cx="14" cy="176" r="5" fill="var(--leaf)" />
      <circle cx="246" cy="162" r="5" fill="var(--leaf)" />
      <rect x="134" y="154" width="30" height="14" fill="var(--coral)" />
    </g>
  );
}

const DOODLES: Record<StoryScene["doodle"], () => React.JSX.Element> = {
  school: School,
  kochi: Kochi,
  parallel: Parallel,
  events: Events,
  tinker: Tinker,
};

export function SceneDoodle({ kind, className = "" }: { kind: StoryScene["doodle"]; className?: string }) {
  const Doodle = DOODLES[kind];
  return (
    <svg viewBox="0 0 260 200" aria-hidden="true" focusable="false" className={className}>
      <Doodle />
    </svg>
  );
}

export function Star({ size = 40, fill = "var(--butter)", ...rest }: { size?: number; fill?: string } & SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden="true" focusable="false" {...rest}>
      <path d="M24 4 L29.5 17.5 L44 18.5 L33 28 L36.5 42 L24 34.5 L11.5 42 L15 28 L4 18.5 L18.5 17.5 Z" fill={fill} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
    </svg>
  );
}

export function Bean({ size = 32, ...rest }: { size?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} aria-hidden="true" focusable="false" {...rest}>
      <ellipse cx="20" cy="20" rx="12" ry="17" fill="var(--espresso)" stroke={INK} strokeWidth="3" transform="rotate(30 20 20)" />
      <path d="M13 10 Q24 20 15 31" fill="none" stroke="var(--latte)" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function Squiggle({ className = "", ...rest }: { className?: string } & SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 120 16" aria-hidden="true" focusable="false" className={className} {...rest}>
      <path d="M3 8 q9 -9 18 0 t18 0 t18 0 t18 0 t18 0 t18 0" fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 60" aria-hidden="true" focusable="false" className={className}>
      <path d="M6 8 C 30 4, 58 14, 58 40" fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M46 34 L58 46 L68 32" fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Cup({ className = "", steam = true }: { className?: string; steam?: boolean }) {
  return (
    <svg viewBox="0 0 96 96" aria-hidden="true" focusable="false" className={className}>
      {steam && (
        <g>
          <path className="steam" style={{ ["--d" as string]: "0s" }} d="M34 38 q-6 -8 0 -14 t0 -14" />
          <path className="steam" style={{ ["--d" as string]: "0.8s" }} d="M48 38 q-6 -8 0 -14 t0 -14" />
          <path className="steam" style={{ ["--d" as string]: "1.6s" }} d="M62 38 q-6 -8 0 -14 t0 -14" />
        </g>
      )}
      <path d="M18 44 H78 L72 82 Q71 88 64 88 H32 Q25 88 24 82 Z" fill="var(--cream)" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
      <ellipse cx="48" cy="44" rx="30" ry="6" fill="var(--espresso)" stroke={INK} strokeWidth="3.5" />
      <path d="M77 52 q16 0 14 14 t-18 8" fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M30 60 Q32 76 36 80" fill="none" stroke="var(--butter)" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

export function PrincipleIcon({ kind, className = "" }: { kind: "diamond" | "layers" | "coffee" | "spark"; className?: string }) {
  const common = { fill: "none", stroke: INK, strokeWidth: 3.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false" className={className}>
      {kind === "diamond" && (
        <g {...common}>
          <path d="M14 24 L24 12 H40 L50 24 L32 54 Z" fill="var(--sky)" />
          <path d="M14 24 H50 M24 12 L28 24 L32 54 L36 24 L40 12" />
        </g>
      )}
      {kind === "layers" && (
        <g {...common}>
          <path d="M32 8 L56 20 L32 32 L8 20 Z" fill="var(--butter)" />
          <path d="M8 30 L32 42 L56 30" fill="none" />
          <path d="M8 40 L32 52 L56 40" fill="none" />
          <path d="M8 20 V40 M56 20 V40" strokeWidth="0" />
        </g>
      )}
      {kind === "coffee" && (
        <g {...common}>
          <path d="M12 24 H46 L43 48 Q42 54 36 54 H22 Q16 54 15 48 Z" fill="var(--butter)" />
          <path d="M46 28 q10 0 9 9 t-11 6" />
          <path d="M22 8 q-4 5 0 9 M31 8 q-4 5 0 9" />
        </g>
      )}
      {kind === "spark" && (
        <g {...common}>
          <path d="M32 6 L38 26 L58 32 L38 38 L32 58 L26 38 L6 32 L26 26 Z" fill="var(--coral)" />
        </g>
      )}
    </svg>
  );
}
