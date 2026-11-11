import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import type { RefObject } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

// false on the server, corrected on the client after hydration
export function useReducedMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(QUERY);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia(QUERY).matches;

// lets timers and loops pause while the element is off screen
export function useInView<T extends Element>(ref: RefObject<T | null>, margin = "0px") {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(Boolean(entry?.isIntersecting)), {
      rootMargin: margin,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, margin]);
  return inView;
}

// personal best for a game, kept in localStorage; `better` says whether higher or lower wins
export function useBest(key: string, better: "high" | "low") {
  const storageKey = `vrd:best:${key}`;
  const [best, setBest] = useState<number | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrating a client-only value after mount
      if (raw !== null) setBest(Number(raw));
    } catch {
      /* storage blocked */
    }
  }, [storageKey]);

  const report = useCallback(
    (value: number) => {
      const beats = best === null || (better === "high" ? value > best : value < best);
      if (!beats) return false;
      setBest(value);
      try {
        localStorage.setItem(storageKey, String(value));
      } catch {
        /* ignore */
      }
      return true;
    },
    [best, better, storageKey],
  );

  return [best, report] as const;
}
