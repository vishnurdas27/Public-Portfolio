import { ArrowUpRight, Lock } from "lucide-react";
import type { Project } from "~/content";
import { GitHubIcon } from "./icons";

const linkClass =
  "inline-flex items-center gap-1.5 text-sm font-medium text-fg underline-offset-4 hover:underline";

// private repos get a note instead of a dead link
export function ProjectLinks({ project, className = "" }: { project: Project; className?: string }) {
  const { links } = project;
  return (
    <ul className={`flex flex-wrap items-center gap-x-5 gap-y-2 ${className}`}>
      {links.live && (
        <li>
          <a href={links.live} target="_blank" rel="noopener noreferrer" className={linkClass}>
            Live demo <ArrowUpRight size={14} aria-hidden />
          </a>
        </li>
      )}
      {links.github && links.githubPublic && (
        <li>
          <a href={links.github} target="_blank" rel="noopener noreferrer" className={linkClass}>
            <GitHubIcon size={15} /> Source <ArrowUpRight size={14} aria-hidden />
          </a>
        </li>
      )}
      {links.github && !links.githubPublic && (
        <li>
          <span
            className="inline-flex items-center gap-1.5 text-sm text-muted"
            title="Enterprise repository. Source is private; walkthrough available on request."
          >
            <Lock size={14} aria-hidden /> Private repo · walkthrough on request
          </span>
        </li>
      )}
    </ul>
  );
}
