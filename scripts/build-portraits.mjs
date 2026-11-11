// npm run portraits
// builds the portraits in public/images: black-and-white stickers for the story side (from the cutouts in
// assets/cutouts) and the professional headshot (from assets/photos/headshot.jpg).
// the cutouts were made locally with @imgly/background-removal-node; nothing was uploaded anywhere.
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { grade, luminance } from "./images/grade.mjs";
import { bbox, blurF, crop, dilate, erase, erode, loadRGBA, rng } from "./images/pixels.mjs";
import { refine, stickerize } from "./images/sticker.mjs";

const IN = "assets/cutouts";
const OUT = "public/images";
mkdirSync(OUT, { recursive: true });

const load = (name) => loadRGBA(join(IN, name));

async function write(pipeline, name, quality = 88, alphaQuality = 92) {
  const info = await pipeline.webp({ quality, alphaQuality, effort: 6 }).toFile(join(OUT, name));
  console.log(`  ${name.padEnd(26)} ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} kB`);
}

// the floral shirt becomes a plain charcoal one. skin is warmer than the beige fabric (red minus blue is
// 52-80 vs 34-47), which gives a clean mask. the soft shading (folds) is kept, the pattern is not.
function plainShirt(img, L, tone = 52) {
  const { data, width: W, height: H } = img;
  const mask = new Float32Array(W * H);
  for (let y = 478; y < 812; y++) {
    for (let x = 225; x < 660; x++) {
      const i = (y * W + x) * 4;
      if (data[i + 3] < 128) continue;
      const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      const isNeck = y < 512 && x > 440 && x < 506;
      if (!isNeck && r - b < 50 && lum > 88) mask[y * W + x] = 1;
    }
  }
  // fill pinholes (buttons, bright flowers), then feather the edge
  const closed = erode(dilate(mask, W, H, 3), W, H, 3);
  const soft = blurF(closed, W, H, 1.6);

  const masked = L.map((v, i) => v * closed[i]);
  const numBase = blurF(masked, W, H, 12);
  const numMid = blurF(masked, W, H, 3.2);
  const denBase = blurF(closed, W, H, 12);
  const denMid = blurF(closed, W, H, 3.2);
  const rand = rng(7);
  for (let i = 0; i < L.length; i++) {
    const m = soft[i];
    if (m <= 0.01) continue;
    const base = denBase[i] > 0.05 ? numBase[i] / denBase[i] : L[i];
    const mid = denMid[i] > 0.05 ? numMid[i] / denMid[i] : L[i];
    // folds live between the two blur scales; soft-clamp them so the loud floral edges flatten but real folds stay
    const detail = Math.tanh((mid - base) / 12) * 12 * 0.55;
    const weave = Math.sin((i % W) * 1.9 + Math.floor(i / W) * 1.9) * 1.6;
    const plain = tone + (base - 165) * 0.72 + detail + weave + (rand() - 0.5) * 7;
    L[i] = L[i] * (1 - m) + plain * m;
  }
}

// removes the small light print on the black tee: thin bright strokes vanish under a top-hat subtraction
function removePrint(img, L, rects) {
  const { width: W, height: H } = img;
  const open = dilate(erode(L, W, H, 4), W, H, 4);
  for (const { x0, y0, x1, y1 } of rects) {
    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        const i = y * W + x;
        const top = L[i] - open[i];
        if (top > 0) L[i] -= top;
      }
    }
  }
}

// story hero: smiling, behind the cafe counter
{
  const img = await load("smile.png");
  erase(img, (x) => x >= 712); // a faint leaf ghost at the right edge
  await refine(img, { sigma: 0.9, lo: 0.32, hi: 0.88 });
  grade(img, luminance(img), { black: 5, white: 250, gamma: 1.08, curve: 0.22, clarity: 0.22, grain: 2.2, seed: 5 });
  const st = await stickerize(img, { white: 9, black: 4 });
  await write(crop(st, bbox(st)), "story-hero.webp", 86, 92);
}

// full length: the little walker
{
  const img = await load("full.png");
  // someone else's arm enters from the right below y=692; keep the shirt and trousers, trim the cuff
  erase(
    img,
    (x, y, r, g, b) =>
      (y >= 668 && x >= 636) ||
      (y >= 692 && y < 790 && x >= 548) ||
      (y >= 790 && x >= 530) ||
      // pale sliver of a car next to the hip
      (y >= 780 && y <= 900 && x >= 490 && x < 540 && (r + g + b) / 3 > 150 && Math.max(r, g, b) - Math.min(r, g, b) < 55),
  );
  await refine(img, { sigma: 0.9, lo: 0.3, hi: 0.88 });

  const L = luminance(img);
  plainShirt(img, L, 50);
  grade(img, L, { gamma: 1.0, curve: 0.2, clarity: 0.2, seed: 23 });
  const st = await stickerize(img, { white: 10, black: 4.5 });
  await write(crop(st, bbox(st), 220), "story-walker.webp", 84, 90);
}

// sunglasses (games corner)
{
  const img = await load("casual.png");
  erase(img, (x) => x < 392); // a woman walking past on the left
  await refine(img, { sigma: 0.9, lo: 0.32, hi: 0.88 });
  const L = luminance(img);
  removePrint(img, L, [
    { x0: 512, y0: 630, x1: 538, y1: 664 },
    { x0: 596, y0: 626, x1: 690, y1: 684 },
  ]);
  grade(img, L, { gamma: 1.12, curve: 0.22, clarity: 0.22, seed: 11 });
  const st = await stickerize(img, { white: 10, black: 4.5 });
  await write(crop(st, bbox(st), 560), "story-cool.webp", 84, 90);
}

// selfie (peeks over the contact form)
{
  const img = await load("selfie.png");
  await refine(img, { sigma: 2.1, lo: 0.6, hi: 0.97, defringe: 0.92 });
  grade(img, luminance(img), { gamma: 1.15, curve: 0.22, clarity: 0.2, seed: 37 });
  const st = await stickerize(img, { white: 10, black: 4.5 });
  await write(crop(st, bbox(st), 560), "story-peek.webp", 84, 90);
}

// Keep the original facial detail and more shoulder room in the professional portrait.
await write(
  sharp("assets/photos/headshot.jpg")
    .rotate()
    .extract({ left: 0, top: 0, width: 1500, height: 1800 })
    .resize(720, 864, { kernel: "lanczos3" })
    .grayscale()
    .normalise({ lower: 1, upper: 99 })
    .modulate({ brightness: 1.025 })
    .sharpen({ sigma: 0.5 }),
  "portrait-pro.webp",
  88,
);

// satori can't read webp, so the social cards get png copies
await sharp(join(OUT, "story-hero.webp")).resize({ height: 560 }).png().toFile("assets/og-casual.png");
await sharp(join(OUT, "portrait-pro.webp")).resize(520, 520, { position: "north" }).png().toFile("assets/og-pro.png");

console.log("portraits: done");
