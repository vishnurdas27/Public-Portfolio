import { ArrowUpRight, Sparkles } from "lucide-react";
import { Link } from "react-router";

export function ModeSwitch({
  target,
  className = "",
  variant = "outline",
}: {
  target: "creative" | "pro";
  className?: string;
  variant?: "outline" | "solid";
}) {
  const toCreative = target === "creative";
  const look =
    variant === "solid"
      ? "border-transparent bg-accent text-accent-fg hover:brightness-110"
      : "border-line text-fg hover:border-fg hover:bg-surface";
  return (
    <Link
      to={toCreative ? "/story" : "/"}
      viewTransition
      data-cursor="hover"
      className={`no-print group inline-flex h-10 items-center gap-2 rounded-full border px-3.5 text-[0.82rem] font-medium transition-[color,background-color,border-color,filter] ${look} ${className}`}
    >
      {toCreative ? (
        <>
          <Sparkles size={15} aria-hidden className="text-accent" />
          <span>
            <span className="hidden sm:inline">My story</span>
            <span className="sm:hidden">Story</span>
          </span>
        </>
      ) : (
        <>
          <span>
            <span className="hidden sm:inline">Recruiter view</span>
            <span className="sm:hidden">Recruiter</span>
          </span>
          <ArrowUpRight
            size={15}
            aria-hidden
            className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </>
      )}
    </Link>
  );
}
