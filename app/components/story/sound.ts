import { useSyncExternalStore } from "react";

// every sound is synthesized with the Web Audio API, so there are no audio files to load.
// browsers only allow audio after a click, tap or key press, so the context is created in unlock()

const KEY = "vrd:sound";

let enabled = true;
const listeners = new Set<() => void>();
const unlockHooks = new Set<() => void>();
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let noise: AudioBuffer | null = null;

export const subscribeSound = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
export const isSoundEnabled = () => enabled;
export const useSoundEnabled = () => useSyncExternalStore(subscribeSound, isSoundEnabled, () => true);

// runs once the audio context exists (the ambience starts from here)
export const onUnlock = (hook: () => void) => {
  unlockHooks.add(hook);
  return () => unlockHooks.delete(hook);
};

function set(next: boolean) {
  if (next === enabled) return;
  enabled = next;
  if (ctx) void (next ? ctx.resume() : ctx.suspend());
  listeners.forEach((l) => l());
}

export function loadSoundPref() {
  try {
    if (localStorage.getItem(KEY) === "off") set(false);
  } catch {
    /* storage blocked */
  }
}

export function setSoundEnabled(next: boolean) {
  set(next);
  try {
    localStorage.setItem(KEY, next ? "on" : "off");
  } catch {
    /* storage blocked */
  }
  if (next) {
    unlock();
    sfx.bwip();
  }
}

// call from a user gesture
export function unlock() {
  if (!enabled || typeof window === "undefined") return;
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;
    ctx = new Ctor();
    master = ctx.createGain();
    master.gain.value = 0.22;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
  unlockHooks.forEach((hook) => hook());
}

// silences everything while the tab is hidden
export function pauseAudio(paused: boolean) {
  if (!ctx) return;
  if (paused) void ctx.suspend();
  else if (enabled) void ctx.resume();
}

export function audio() {
  if (!enabled || !ctx || !master) return null;
  return { c: ctx, out: master };
}

// four seconds of white noise, shared by every hiss and the breeze
export function noiseBuffer(c: AudioContext) {
  if (!noise) {
    noise = c.createBuffer(1, c.sampleRate * 4, c.sampleRate);
    const data = noise.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  }
  return noise;
}

interface Tone {
  type?: OscillatorType;
  from: number;
  to?: number;
  dur: number;
  gain?: number;
  at?: number;
  wobble?: number;
}

export function tone({ type = "sine", from, to = from, dur, gain = 0.5, at = 0, wobble = 0 }: Tone) {
  const a = audio();
  if (!a) return;
  const { c, out } = a;
  const t0 = c.currentTime + at;
  const osc = c.createOscillator();
  const env = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(from, t0);
  if (to !== from) osc.frequency.exponentialRampToValueAtTime(to, t0 + dur);
  env.gain.setValueAtTime(0.0001, t0);
  env.gain.exponentialRampToValueAtTime(gain, t0 + 0.008);
  env.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  if (wobble) {
    const lfo = c.createOscillator();
    const depth = c.createGain();
    lfo.frequency.value = 22;
    depth.gain.value = wobble;
    lfo.connect(depth).connect(osc.frequency);
    lfo.start(t0);
    lfo.stop(t0 + dur + 0.02);
  }
  osc.connect(env).connect(out);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

interface Hiss {
  filter: BiquadFilterType;
  from: number;
  to?: number;
  q?: number;
  dur: number;
  gain: number;
  at?: number;
  attack?: number;
  // with a release the level is held, then fades over the last `release` seconds
  release?: number;
}

// filtered white noise: clicks, the scuttle and the body of a splat
export function hiss({ filter, from, to = from, q = 1, dur, gain, at = 0, attack, release }: Hiss) {
  const a = audio();
  if (!a) return;
  const { c, out } = a;
  const t0 = c.currentTime + at;
  const src = c.createBufferSource();
  src.buffer = noiseBuffer(c);
  src.loop = true;
  const f = c.createBiquadFilter();
  f.type = filter;
  f.Q.value = q;
  f.frequency.setValueAtTime(from, t0);
  if (to !== from) f.frequency.exponentialRampToValueAtTime(to, t0 + dur);
  const env = c.createGain();
  env.gain.setValueAtTime(0.0001, t0);
  env.gain.exponentialRampToValueAtTime(gain, t0 + (attack ?? Math.min(0.03, dur / 3)));
  if (release) env.gain.setValueAtTime(gain, t0 + dur - release);
  env.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  src.connect(f).connect(env).connect(out);
  src.start(t0, Math.random() * 3);
  src.stop(t0 + dur + 0.02);
}

const rand = (min: number, max: number) => min + Math.random() * (max - min);

export const sfx = {
  pop: () => tone({ from: rand(420, 680), to: 160, dur: 0.09, gain: 0.6 }),
  bloop: () => tone({ from: 180, to: rand(560, 760), dur: 0.11, gain: 0.55 }),
  boing: () => tone({ from: 320, to: 110, dur: 0.32, gain: 0.5, wobble: 40 }),
  squeak() {
    tone({ type: "triangle", from: 950, to: 1500, dur: 0.07, gain: 0.45 });
    tone({ type: "triangle", from: 1500, to: 1100, dur: 0.07, gain: 0.4, at: 0.07 });
  },
  bwip: () => tone({ type: "square", from: 600, to: 1100, dur: 0.07, gain: 0.16 }),
  tick() {
    hiss({ filter: "highpass", from: 2500, dur: 0.04, gain: 0.2 });
    tone({ from: 900, dur: 0.03, gain: 0.15 });
  },
  gloop: () => tone({ from: 340, to: 110, dur: 0.22, gain: 0.5, wobble: 60 }),
  splat() {
    hiss({ filter: "lowpass", from: 900, to: 300, dur: 0.16, gain: 0.55 });
    tone({ from: 180, to: 50, dur: 0.18, gain: 0.6 });
  },
  coin() {
    tone({ type: "square", from: 988, dur: 0.07, gain: 0.14 });
    tone({ type: "square", from: 1319, dur: 0.16, gain: 0.14, at: 0.07 });
  },
  bonk() {
    tone({ type: "triangle", from: 220, to: 80, dur: 0.16, gain: 0.6 });
    hiss({ filter: "bandpass", from: 500, dur: 0.05, gain: 0.3 });
  },
  flip: () => hiss({ filter: "highpass", from: 2800, dur: 0.035, gain: 0.22 }),
  // a tiny scuttle and a pip, for when the bug shows up
  bugArrives() {
    [0, 0.08, 0.15, 0.24].forEach((at) => hiss({ filter: "highpass", from: 4500, dur: 0.02, gain: 0.12, at }));
    tone({ type: "triangle", from: 900, to: 1400, dur: 0.06, gain: 0.2, at: 0.32 });
  },
  match() {
    [523, 659, 784].forEach((f, i) => tone({ from: f, dur: 0.1, gain: 0.35, at: i * 0.07 }));
  },
  fanfare() {
    [523, 659, 784, 1047].forEach((f, i) => tone({ type: "square", from: f, dur: i === 3 ? 0.32 : 0.12, gain: 0.14, at: i * 0.11 }));
  },
};

const CLICKS = [sfx.pop, sfx.bloop, sfx.pop, sfx.boing, sfx.squeak, sfx.bwip, sfx.bloop];
let lastClick = -1;

// a random cartoon sound for a click, never the same one twice in a row
export function clickSound() {
  let i = Math.floor(Math.random() * CLICKS.length);
  if (i === lastClick) i = (i + 1) % CLICKS.length;
  lastClick = i;
  CLICKS[i]?.();
}
