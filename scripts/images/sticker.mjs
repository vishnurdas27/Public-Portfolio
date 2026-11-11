// matte clean-up and the die-cut sticker outline
import sharp from "sharp";

// softens the matte: blur the alpha, then re-threshold it. defringe darkens semi-transparent edge pixels,
// which removes the bright background bleed that shows up as a halo
export async function refine(img, { sigma = 1, lo = 0.3, hi = 0.88, defringe = 0 }) {
  const { data, width, height } = img;
  const alpha = Buffer.alloc(width * height);
  for (let i = 0; i < alpha.length; i++) alpha[i] = data[i * 4 + 3];
  const blurred = await sharp(alpha, { raw: { width, height, channels: 1 } })
    .blur(sigma)
    .toColourspace("b-w")
    .raw()
    .toBuffer();
  if (blurred.length !== alpha.length) throw new Error(`matte buffer mismatch: ${blurred.length} vs ${alpha.length}`);

  for (let i = 0; i < alpha.length; i++) {
    const t = Math.min(1, Math.max(0, (blurred[i] / 255 - lo) / (hi - lo)));
    const a = Math.min(data[i * 4 + 3], Math.round(t * 255));
    data[i * 4 + 3] = a;
    if (defringe && a > 0 && a < 255) {
      const k = 1 - defringe * (1 - a / 255);
      data[i * 4] *= k;
      data[i * 4 + 1] *= k;
      data[i * 4 + 2] *= k;
    }
  }
  return img;
}

// grows a mask by about r px with a rounded profile
async function grow(alpha, w, h, r) {
  // three separate passes on purpose: inside one sharp pipeline only the last blur counts and the
  // threshold runs before it, which would give a soft ramp instead of a crisp edge
  const raw = { raw: { width: w, height: h, channels: 1 } };
  const blurred = await sharp(alpha, raw).blur(Math.max(0.3, r / 1.17)).toColourspace("b-w").raw().toBuffer();
  const hard = await sharp(blurred, raw).threshold(30).toColourspace("b-w").raw().toBuffer();
  return sharp(hard, raw).blur(0.7).toColourspace("b-w").raw().toBuffer();
}

function padImage(img, p) {
  const W = img.width + p * 2;
  const H = img.height + p * 2;
  const data = Buffer.alloc(W * H * 4);
  for (let y = 0; y < img.height; y++) img.data.copy(data, ((y + p) * W + p) * 4, y * img.width * 4, (y + 1) * img.width * 4);
  return { data, width: W, height: H };
}

// subject + paper-white border + thin black outline. the page adds the offset shadow with CSS drop-shadow
export async function stickerize(img, { white = 8, black = 3.5, ink = [20, 16, 13], paper = [255, 250, 240] } = {}) {
  const p = Math.ceil(white + black + 3);
  const P = padImage(img, p);
  const { width: W, height: H } = P;
  const alpha = Buffer.alloc(W * H);
  for (let i = 0; i < alpha.length; i++) alpha[i] = P.data[i * 4 + 3];
  const blackMask = await grow(alpha, W, H, white + black);
  const whiteMask = await grow(alpha, W, H, white);

  const out = Buffer.alloc(W * H * 4);
  for (let i = 0; i < W * H; i++) {
    const wa = whiteMask[i] / 255;
    let [r, g, b] = [ink[0] + (paper[0] - ink[0]) * wa, ink[1] + (paper[1] - ink[1]) * wa, ink[2] + (paper[2] - ink[2]) * wa];
    let a = blackMask[i] / 255;
    const sa = P.data[i * 4 + 3] / 255;
    r = P.data[i * 4] * sa + r * (1 - sa);
    g = P.data[i * 4 + 1] * sa + g * (1 - sa);
    b = P.data[i * 4 + 2] * sa + b * (1 - sa);
    a = sa + a * (1 - sa);
    out[i * 4] = r;
    out[i * 4 + 1] = g;
    out[i * 4 + 2] = b;
    out[i * 4 + 3] = Math.round(a * 255);
  }
  return { data: out, width: W, height: H, pad: p };
}
