import { Volume2, VolumeX } from "lucide-react";
import { useEffect } from "react";
import { gust } from "../ambience";
import { prefersReducedMotion } from "../hooks";
import { clickSound, loadSoundPref, pauseAudio, setSoundEnabled, sfx, unlock, useSoundEnabled } from "../sound";

const INTERACTIVE = "button, a, summary, label, [role='tab'], [role='button'], [cmdk-item]";
const SILENT = "input, textarea, select, [data-no-sound]";

// click sounds and the breeze that follows the scroll (the music starts itself, see ambience.ts).
// the games, cups and the bug play their own sounds, so they opt out with data-no-sound
export function Sounds() {
  useEffect(() => {
    loadSoundPref();

    const onDown = (e: PointerEvent) => {
      unlock();
      const target = e.target as Element | null;
      if (!target || target.closest(SILENT)) return;
      if (target.closest(INTERACTIVE)) clickSound();
      else sfx.tick();
    };
    // keyboard activation has no pointerdown
    const onClick = (e: MouseEvent) => {
      if (e.detail !== 0) return;
      const target = e.target as Element | null;
      if (target && !target.closest(SILENT)) clickSound();
    };
    const onKey = () => unlock();

    let lastY = window.scrollY;
    let lastT = performance.now();
    const onScroll = () => {
      const now = performance.now();
      const dt = now - lastT;
      if (dt < 40) return;
      const speed = (Math.abs(window.scrollY - lastY) / dt) * 1000;
      lastY = window.scrollY;
      lastT = now;
      if (speed > 40 && !prefersReducedMotion()) gust(speed);
    };
    const onVisibility = () => pauseAudio(document.hidden);

    document.addEventListener("pointerdown", onDown);
    document.addEventListener("click", onClick);
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("click", onClick);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
  return null;
}

export function SoundToggle() {
  const on = useSoundEnabled();
  return (
    <button
      type="button"
      onClick={() => setSoundEnabled(!on)}
      aria-pressed={on}
      aria-label="Sound effects"
      title={on ? "Sound effects on" : "Sound effects off"}
      className="grid size-10 place-items-center rounded-full border-2 border-ink bg-cream transition-colors hover:bg-butter"
    >
      {on ? <Volume2 size={17} aria-hidden /> : <VolumeX size={17} aria-hidden />}
    </button>
  );
}
