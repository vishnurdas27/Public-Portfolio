// raw pixel helpers shared by the image scripts
import sharp from "sharp";

export async function loadRGBA(file) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height };
}

export const rgbaToSharp = (data, width, height) => sharp(data, { raw: { width, height, channels: 4 } });

// zero the alpha wherever test(x, y, r, g, b) is true
export function erase(img, test) {
  const { data, width, height } = img;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      if (test(x, y, data[i], data[i + 1], data[i + 2])) data[i + 3] = 0;
    }
  }
}

// separable gaussian blur on a Float32Array plane
export function blurF(src, w, h, sigma) {
  if (sigma <= 0) return Float32Array.from(src);
  const radius = Math.max(1, Math.ceil(sigma * 3));
  const kernel = new Float32Array(radius * 2 + 1);
  let sum = 0;
  for (let i = -radius; i <= radius; i++) sum += kernel[i + radius] = Math.exp(-(i * i) / (2 * sigma * sigma));
  for (let i = 0; i < kernel.length; i++) kernel[i] /= sum;

  const tmp = new Float32Array(w * h);
  const out = new Float32Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let acc = 0;
      for (let k = -radius; k <= radius; k++) acc += src[y * w + Math.min(w - 1, Math.max(0, x + k))] * kernel[k + radius];
      tmp[y * w + x] = acc;
    }
  }
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let acc = 0;
      for (let k = -radius; k <= radius; k++) acc += tmp[Math.min(h - 1, Math.max(0, y + k)) * w + x] * kernel[k + radius];
      out[y * w + x] = acc;
    }
  }
  return out;
}

function morph(src, w, h, r, pick) {
  const tmp = new Float32Array(w * h);
  const out = new Float32Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let v = src[y * w + x];
      for (let k = -r; k <= r; k++) v = pick(v, src[y * w + Math.min(w - 1, Math.max(0, x + k))]);
      tmp[y * w + x] = v;
    }
  }
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let v = tmp[y * w + x];
      for (let k = -r; k <= r; k++) v = pick(v, tmp[Math.min(h - 1, Math.max(0, y + k)) * w + x]);
      out[y * w + x] = v;
    }
  }
  return out;
}
export const erode = (s, w, h, r) => morph(s, w, h, r, Math.min);
export const dilate = (s, w, h, r) => morph(s, w, h, r, Math.max);

// seeded noise, so rebuilding gives the same bytes
export function rng(seed) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function bbox({ data, width, height }, threshold = 24) {
  let [x0, y0, x1, y1] = [width, height, 0, 0];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] > threshold) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
  }
  return { left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 };
}

// crop a raw RGBA image and optionally resize; returns a sharp pipeline
export const crop = (img, box, width) => {
  let p = rgbaToSharp(img.data, img.width, img.height).extract(box);
  if (width) p = p.resize({ width, kernel: "lanczos3" });
  return p;
};

// drops stray specks: keeps only connected regions at least `ratio` as big as the largest one
export function keepMainRegions(img, ratio = 0.05) {
  const { data, width: W, height: H } = img;
  const label = new Int32Array(W * H);
  const sizes = [0];
  const stack = [];
  for (let start = 0; start < W * H; start++) {
    if (label[start] || data[start * 4 + 3] < 40) continue;
    const id = sizes.length;
    sizes.push(0);
    label[start] = id;
    stack.push(start);
    while (stack.length) {
      const p = stack.pop();
      sizes[id]++;
      const x = p % W;
      const y = (p - x) / W;
      for (const [nx, ny] of [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]) {
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        const q = ny * W + nx;
        if (!label[q] && data[q * 4 + 3] >= 40) {
          label[q] = id;
          stack.push(q);
        }
      }
    }
  }
  const largest = Math.max(...sizes);
  for (let i = 0; i < W * H; i++) {
    if (data[i * 4 + 3] && (!label[i] || sizes[label[i]] < largest * ratio)) data[i * 4 + 3] = 0;
  }
}
