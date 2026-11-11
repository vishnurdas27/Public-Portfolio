import { tapePhrases } from "~/content";
import { Star } from "../illustrations";

// the loop is two identical halves, so it never jumps
export function Tape() {
  const half = (suffix: string) =>
    tapePhrases.map((phrase) => (
      <span key={`${suffix}-${phrase}`} className="tape-item">
        {phrase} <Star size={26} fill="var(--butter)" />
      </span>
    ));
  return (
    <div className="tape" aria-hidden="true">
      <div className="tape-track">
        {half("a")}
        {half("b")}
        {half("c")}
        {half("d")}
      </div>
    </div>
  );
}
