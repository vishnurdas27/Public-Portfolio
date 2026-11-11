import { Download, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { profile } from "~/content";
import { ModeSwitch } from "~/components/shared/mode-switch";
import { ThemeToggle } from "~/components/shared/theme-toggle";

const NAV = [
  { id: "summary", label: "Summary" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
  { id: "achievements", label: "Recognition" },
  { id: "contact", label: "Contact" },
];

const linkBase = "inline-flex min-h-11 shrink-0 items-center rounded-lg px-3.5 text-[0.82rem] font-medium transition-colors hover:bg-surface hover:text-fg";

// On the professional overview, nav items are plain in-page anchors.
export function ProHeader({ onPage = true }: { onPage?: boolean }) {
  const [active, setActive] = useState("");

  // scroll-spy
  useEffect(() => {
    if (!onPage) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    NAV.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [onPage]);

  return (
    <header className="no-print sticky top-0 z-50 border-b border-line bg-bg/80 backdrop-blur-xl">
      <div className="container-x flex h-16 items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-3" aria-label={`${profile.name}, recruiter view home`}>
          <span className="grid size-9 place-items-center rounded-[10px] bg-fg font-mono text-[0.8rem] font-semibold tracking-tight text-bg">
            VR
          </span>
          <span className="hidden min-[420px]:block">
            <span className="block text-[0.95rem] font-semibold tracking-tight">{profile.name}</span>
            <span className="block text-xs text-muted">Recruiter view</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <ModeSwitch target="creative" />
          <ThemeToggle />
          <a
            href={profile.resumeUrl}
            download
            className="btn btn-primary hidden !min-h-10 !px-4 !text-[0.85rem] sm:inline-flex"
          >
            <Download size={15} aria-hidden /> Résumé
          </a>
        </div>
      </div>
      <div className="border-t border-line">
        <nav aria-label="Sections" className="pro-section-nav container-x flex items-center gap-1 overflow-x-auto py-1">
          {NAV.map((item) =>
            onPage ? (
              <a
                key={item.id}
                href={`#${item.id}`}
                aria-current={active === item.id ? "true" : undefined}
                className={`${linkBase} ${active === item.id ? "bg-accent-soft font-medium text-fg" : "text-muted"}`}
              >
                {item.label}
              </a>
            ) : (
              <Link key={item.id} to={`/#${item.id}`} className={`${linkBase} text-muted`}>
                {item.label}
              </Link>
            ),
          )}
          </nav>
      </div>
    </header>
  );
}

export function MobileActionBar() {
  return (
    <div
      className="no-print fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg/90 px-3 pt-3 backdrop-blur-xl md:hidden"
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <div className="mx-auto flex max-w-md gap-2">
        <a href={`mailto:${profile.email}`} className="btn btn-primary flex-1">
          <Mail size={16} aria-hidden /> Email me
        </a>
        <a href={profile.resumeUrl} download className="btn btn-ghost flex-1">
          <Download size={16} aria-hidden /> Résumé
        </a>
      </div>
    </div>
  );
}
