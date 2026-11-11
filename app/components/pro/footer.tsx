import { Sparkles } from "lucide-react";
import { Link } from "react-router";
import { profile } from "~/content";

export function ProFooter() {
  return (
    <footer className="no-print border-t border-line py-8 pb-28 md:pb-8">
      <div className="container-x flex flex-wrap items-center justify-between gap-4 text-[0.85rem] text-muted">
        <p>{profile.name} · Built with React, TypeScript and Tailwind CSS.</p>
        <Link to="/story" viewTransition className="inline-flex items-center gap-1.5 font-medium text-fg hover:underline">
          <Sparkles size={14} aria-hidden className="text-accent" /> Read my story
        </Link>
      </div>
    </footer>
  );
}
