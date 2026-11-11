import { useSyncExternalStore } from "react";

function createStore<T>(initial: T) {
  let value = initial;
  const listeners = new Set<() => void>();
  return {
    get: () => value,
    set(next: T) {
      if (Object.is(next, value)) return;
      value = next;
      listeners.forEach((l) => l());
    },
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

const paletteStore = createStore(false);
export const setPaletteOpen = paletteStore.set;
export const usePaletteOpen = () => useSyncExternalStore(paletteStore.subscribe, paletteStore.get, () => false);

// the palette is lazy-loaded, so remember whether it has ever been opened
const paletteEverStore = createStore(false);
export const openPalette = () => {
  paletteEverStore.set(true);
  paletteStore.set(true);
};
export const usePaletteEverOpened = () => useSyncExternalStore(paletteEverStore.subscribe, paletteEverStore.get, () => false);

const BUGS_KEY = "vrd:bugs";
const bugStore = createStore(0);
export const useBugsSquashed = () => useSyncExternalStore(bugStore.subscribe, bugStore.get, () => 0);
export function loadBugs() {
  try {
    const n = Number(localStorage.getItem(BUGS_KEY));
    if (Number.isFinite(n) && n > 0) bugStore.set(n);
  } catch {
    /* storage blocked */
  }
}
export function squashBug(by = 1) {
  const next = bugStore.get() + by;
  bugStore.set(next);
  try {
    localStorage.setItem(BUGS_KEY, String(next));
  } catch {
    /* ignore */
  }
  return next;
}

const toastStore = createStore<{ id: number; text: string } | null>(null);
export const useToast = () => useSyncExternalStore(toastStore.subscribe, toastStore.get, () => null);
let toastTimer = 0;
let toastId = 0;
export function showToast(text: string, ms = 3200) {
  toastStore.set({ id: ++toastId, text });
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toastStore.set(null), ms);
}
