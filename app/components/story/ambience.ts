import { audio, noiseBuffer, onUnlock } from "./sound";

// the background of the page: a slow piece of ambient music that never stops, and a soft breeze that swells with the
// scroll. it's generated live, so it never repeats. like the click sounds, it starts after the visitor's first interaction.

const MUSIC = 0.7; // overall level of the music
const WIND = 1; // overall level of the scroll breeze

// I - vi - IV - V in C major, voiced low and close so it stays warm
const CHORDS = [
  [130.81, 196.0, 246.94, 329.63], // Cmaj7
  [110.0, 164.81, 196.0, 261.63], // Am7
  [87.31, 130.81, 220.0, 329.63], // Fmaj7
  [98.0, 146.83, 246.94, 329.63], // G6
];
const CHORD_SECONDS = 16;

// C major pentatonic, D4 to C6: every note sits well over every chord above
const SCALE = [293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25, 783.99, 880.0, 1046.5];

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const pick = <T>(items: readonly T[]) => items[Math.floor(Math.random() * items.length)] as T;

let started = false;
let windGain: GainNode | null = null;
let windFilters: BiquadFilterNode[] = [];
let calmTimer = 0;
let smoothSpeed = 0;

// while the tab is hidden or the sound is off the audio clock is frozen, so don't queue anything
const live = () => {
  const a = audio();
  return a && a.c.state === "running" && !document.hidden ? a : null;
};

function startAmbience() {
  const a = audio();
  if (!a || started) return;
  started = true;
  const { c, out } = a;

  const music = c.createGain();
  music.gain.value = 0.0001;
  music.gain.setTargetAtTime(MUSIC, c.currentTime, 2.5); // fade in slowly
  music.connect(out);

  // the pad goes through a low-pass so it stays soft
  const pad = c.createBiquadFilter();
  pad.type = "lowpass";
  pad.frequency.value = 800;
  pad.Q.value = 0.3;
  pad.connect(music);

  // the notes go dry to the output and through a soft echo
  const notes = c.createGain();
  notes.connect(music);
  const echo = c.createDelay(1.5);
  echo.delayTime.value = 0.43;
  const feedback = c.createGain();
  feedback.gain.value = 0.42;
  const echoTone = c.createBiquadFilter();
  echoTone.type = "lowpass";
  echoTone.frequency.value = 1600;
  const send = c.createGain();
  send.gain.value = 0.55;
  notes.connect(send).connect(echo);
  echo.connect(echoTone).connect(feedback).connect(echo);
  echoTone.connect(music);

  const playChord = (freqs: number[]) => {
    if (!live()) return;
    const t0 = c.currentTime;
    for (const freq of freqs) {
      for (const detune of [-5, 5]) {
        const osc = c.createOscillator();
        osc.type = "triangle";
        osc.frequency.value = freq;
        osc.detune.value = detune;
        const env = c.createGain();
        env.gain.setValueAtTime(0.0001, t0);
        env.gain.linearRampToValueAtTime(0.05, t0 + 5);
        env.gain.setValueAtTime(0.05, t0 + CHORD_SECONDS);
        env.gain.linearRampToValueAtTime(0.0001, t0 + CHORD_SECONDS + 6);
        osc.connect(env).connect(pad);
        osc.start(t0);
        osc.stop(t0 + CHORD_SECONDS + 6.1);
      }
    }
  };

  // a soft music-box note: a sine with a quiet octave above it, panned somewhere in the room
  const playNote = (freq: number) => {
    if (!live()) return;
    const t0 = c.currentTime;
    const pan = c.createStereoPanner();
    pan.pan.value = rand(-0.55, 0.55);
    const env = c.createGain();
    env.gain.setValueAtTime(0.0001, t0);
    env.gain.exponentialRampToValueAtTime(0.12, t0 + 0.006);
    env.gain.exponentialRampToValueAtTime(0.0001, t0 + 2.6);
    const body = c.createOscillator();
    body.frequency.value = freq;
    const shimmer = c.createOscillator();
    shimmer.frequency.value = freq * 2;
    const shimmerLevel = c.createGain();
    shimmerLevel.gain.value = 0.15;
    body.connect(env);
    shimmer.connect(shimmerLevel).connect(env);
    env.connect(pan).connect(notes);
    for (const osc of [body, shimmer]) {
      osc.start(t0);
      osc.stop(t0 + 2.7);
    }
  };

  let chord = 0;
  const nextChord = () => {
    playChord(CHORDS[chord % CHORDS.length] ?? []);
    chord += 1;
    window.setTimeout(nextChord, CHORD_SECONDS * 1000);
  };

  // a wandering melody: mostly small steps, a note every few seconds, sometimes an answer right after
  let step = 4;
  const nextNote = () => {
    step = Math.min(SCALE.length - 1, Math.max(0, step + pick([-2, -1, -1, 1, 1, 2])));
    playNote(SCALE[step] ?? 440);
    if (Math.random() < 0.25) {
      step = Math.min(SCALE.length - 1, Math.max(0, step + pick([-1, 1])));
      window.setTimeout(() => playNote(SCALE[step] ?? 440), rand(280, 520));
    }
    window.setTimeout(nextNote, rand(3200, 7000));
  };

  // the breeze: silent until you scroll. two low-pass filters in a row take all the hiss out, so it's a dark, soft whoosh
  windFilters = [c.createBiquadFilter(), c.createBiquadFilter()];
  for (const f of windFilters) {
    f.type = "lowpass";
    f.frequency.value = 600;
    f.Q.value = 0.4;
  }
  windGain = c.createGain();
  windGain.gain.value = 0;
  const wind = c.createGain();
  wind.gain.value = WIND;
  const src = c.createBufferSource();
  src.buffer = noiseBuffer(c);
  src.loop = true;
  src.start(0, 2.9);
  src.connect(windFilters[0] as BiquadFilterNode);
  windFilters[0]?.connect(windFilters[1] as BiquadFilterNode);
  windFilters[1]?.connect(windGain).connect(wind).connect(out);

  nextChord();
  window.setTimeout(nextNote, 4000);
}

// called while scrolling, with the speed in px per second. the speed is smoothed over the whole gesture so single wheel
// ticks don't flutter, slow reading scrolls stay silent, and the swell comes in gently and fades out slowly
export function gust(speed: number) {
  const a = audio();
  if (!a || windGain === null || windFilters.length === 0) return;
  smoothSpeed += (speed - smoothSpeed) * 0.2;
  const t = a.c.currentTime;
  const x = Math.min(1, Math.max(0, (smoothSpeed - 250) / 2400));
  const level = x * x * (3 - 2 * x);
  windGain.gain.setTargetAtTime(level * 1.8, t, 0.3);
  for (const f of windFilters) f.frequency.setTargetAtTime(600 + level * 900, t, 0.35);
  window.clearTimeout(calmTimer);
  calmTimer = window.setTimeout(() => {
    const b = audio();
    if (!b || windGain === null) return;
    smoothSpeed = 0;
    windGain.gain.setTargetAtTime(0, b.c.currentTime, 0.9);
    for (const f of windFilters) f.frequency.setTargetAtTime(600, b.c.currentTime, 0.9);
  }, 220);
}

onUnlock(startAmbience);
