// black-and-white grading
import { blurF, rng } from "./pixels.mjs";

// luminance plane from RGB, weighted towards red to be kind to skin
export function luminance(img) {
  const { data, width, height } = img;
  const L = new Float32Array(width * height);
  for (let i = 0; i < L.length; i++) L[i] = 0.46 * data[i * 4] + 0.4 * data[i * 4 + 1] + 0.14 * data[i * 4 + 2];
  return L;
}

// soften micro-texture, add local contrast, levels + s-curve, then fine grain to match the page
export function grade(img, L0, { black = 4, white = 252, gamma = 1.15, curve = 0.2, clarity = 0.2, grain = 3, seed = 1 }) {
  const { data, width: W, height: H } = img;
  const n = W * H;
  const L = Float32Array.from(L0);

  const low2 = blurF(L, W, H, 1.8);
  const low18 = blurF(L, W, H, 18);
  const rand = rng(seed);
  for (let i = 0; i < n; i++) {
    let v = low2[i] + (L[i] - low2[i]) * 0.85;
    v += (v - low18[i]) * clarity;
    let x = Math.min(1, Math.max(0, (v - black) / (white - black)));
    x = Math.pow(x, gamma);
    x = x + curve * x * (1 - x) * (2 * x - 1);
    if (x > 0.78) x = 0.78 + (x - 0.78) * 0.72; // roll off the top so skin highlights keep detail
    const mid = 1 - Math.abs(x - 0.5) * 2;
    const out = x * 255 + (rand() + rand() - 1) * grain * (0.35 + 0.65 * mid);
    const g = Math.round(Math.min(255, Math.max(0, out)));
    data[i * 4] = data[i * 4 + 1] = data[i * 4 + 2] = g;
  }
}
