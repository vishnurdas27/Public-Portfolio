import { Command } from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";
import { Link } from "react-router";
import { profile } from "~/content";
import { scrollToId } from "../scroll";
import { openPalette } from "../store";
import { BugCount } from "./fun";
import { SoundToggle } from "./sounds";
import { Cup } from "../illustrations";

const NAV = [
  { id: "about", label: "About" },
  { id: "story", label: "Story" },
  { id: "work", label: "Real work" },
  { id: "menu", label: "Menu" },
  { id: "life", label: "Scrapbook" },
  { id: "play", label: "Play" },
  { id: "contact", label: "Say hi" },
] as const;

const noopSubscribe = () => () => {};
const detectMac = () => /Mac|iPhone|iPad/.test(navigator.platform);

export function StoryHeader() {
  const [active, setActive] = useState<string>("");
  const isMac = useSyncExternalStore(noopSubscribe, detectMac, () => false);

  // highlight the nav link for the section on screen
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    NAV.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <header className="story-header">
      <div className="story-header-bar">
        <button
          type="button"
          onClick={() => scrollToId("top")}
          aria-label={`${profile.name}: back to the top`}
          className="flex items-center gap-2.5 rounded-full py-0.5 pr-3 text-left"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-full border-2 border-ink bg-butter">
            <Cup className="size-8" steam={false} />
          </span>
          <span className="display hidden text-[1.15rem] min-[420px]:inline">Vishnu R Das</span>
        </button>

        <nav aria-label="Sections" className="hidden items-center gap-0.5 xl:flex">
          {NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollToId(item.id)}
              aria-current={active === item.id ? "true" : undefined}
              className="nav-link"
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <BugCount className="pill hidden !py-1 sm:inline-flex" />
          <SoundToggle />
          <button
            type="button"
            onClick={openPalette}
            aria-label="Open the menu (search and shortcuts)"
            className="grid size-10 place-items-center rounded-full border-2 border-ink bg-cream xl:hidden"
          >
            <Command size={17} aria-hidden />
          </button>
          <button
            type="button"
            onClick={openPalette}
            aria-label="Open the menu (search and shortcuts)"
            className="pill hidden !py-1.5 transition-colors hover:bg-butter xl:inline-flex"
          >
            <Command size={14} aria-hidden /> <kbd className="font-body text-[0.75rem]">{isMac ? "⌘" : "Ctrl"} K</kbd>
          </button>
          <Link to="/" viewTransition className="btn-ink !min-h-10 !px-4 !py-2 !text-[0.88rem]">
            <span className="hidden sm:inline">Recruiter view</span>
            <span className="sm:hidden">Recruiter</span>
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
