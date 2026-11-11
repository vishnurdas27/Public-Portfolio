import { lazy, Suspense, useEffect } from "react";
import { usePaletteEverOpened, openPalette } from "./store";
import { WobbleFilter } from "./illustrations";
import { BugCrawler, ClickBurst, KonamiRain, Toast } from "./ui/fun";
import { StoryHeader } from "./ui/header";
import { Sounds } from "./ui/sounds";
import { Tape } from "./ui/tape";
import { About } from "./sections/about";
import { Contact } from "./sections/contact";
import { Hero } from "./sections/hero";
import { Life } from "./sections/life";
import { Menu } from "./sections/menu";
import { Play } from "./sections/play";
import { Story } from "./sections/story";
import { Work } from "./sections/work";

// loaded only when someone opens the menu
const Palette = lazy(() => import("./ui/palette").then((m) => ({ default: m.Palette })));

// css hides [data-reveal] elements only once js has run, then this reveals them as they scroll into view
function useReveal() {
  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.06 },
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

function useShortcuts() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const typing = Boolean(t && (t.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName)));
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openPalette();
      } else if (e.key === "/" && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        openPalette();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
}

export function StoryExperience() {
  useReveal();
  useShortcuts();
  const paletteUsed = usePaletteEverOpened();

  return (
    <div className="story">
      <WobbleFilter />
      <StoryHeader />
      <main id="main" className="story-main">
        <Hero />
        <Tape />
        <About />
        <Story />
        <Work />
        <Menu />
        <Life />
        <Play />
        <Contact />
      </main>

      <Suspense fallback={null}>{paletteUsed && <Palette />}</Suspense>
      <ClickBurst />
      <Sounds />
      <BugCrawler />
      <KonamiRain />
      <Toast />
    </div>
  );
}
