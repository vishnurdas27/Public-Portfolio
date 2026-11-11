// npm run scrapbook
// builds the images for the "Off the clock" section from assets/photos and assets/cutouts into public/images.
// the photos get a light warm grade so they sit on the cream paper; the bike becomes a die-cut sticker.
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { bbox, crop, erase, keepMainRegions, loadRGBA } from "./images/pixels.mjs";
import { refine, stickerize } from "./images/sticker.mjs";

const OUT = "public/images";
mkdirSync(OUT, { recursive: true });

async function write(pipeline, name, quality = 80) {
  const info = await pipeline.webp({ quality, alphaQuality: 90, effort: 6 }).toFile(`${OUT}/${name}`);
  console.log(`  ${name.padEnd(24)} ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} kB`);
}

// crop, resize and nudge towards warm paper tones
function print(file, { rotate, box, width }) {
  let p = sharp(`assets/photos/${file}`);
  if (rotate) p = p.rotate(rotate);
  return p
    .extract(box)
    .resize({ width, kernel: "lanczos3" })
    .modulate({ saturation: 0.92 })
    .linear([1.035, 1.0, 0.95], [0, 0, 0]);
}

await write(print("bike-golden.jpg", { box: { left: 0, top: 213, width: 854, height: 1067 }, width: 720 }), "life-golden.webp");
await write(print("bridge.jpg", { box: { left: 20, top: 0, width: 1239, height: 826 }, width: 900 }), "life-bridge.webp");
await write(print("volleyball.jpg", { box: { left: 0, top: 30, width: 960, height: 1200 }, width: 760 }), "life-volleyball.webp");
await write(print("bouquet.jpg", { box: { left: 0, top: 380, width: 720, height: 900 }, width: 720 }), "life-bouquet.webp");
// the batch photo was taken sideways
await write(print("batch.jpg", { rotate: 270, box: { left: 0, top: 0, width: 1280, height: 720 }, width: 1100 }), "life-batch.webp", 82);

// the bike: die-cut sticker. the rear of the bike is cut off by the original frame, so the sticker is trimmed flush on
// the left and the page lets it ride in from the screen edge
{
  const img = await loadRGBA("assets/cutouts/bike.png");
  // sand specks and the kickstand below the frame, left of the front wheel
  erase(img, (x, y) => y > 1150 && x < 340);
  keepMainRegions(img);
  await refine(img, { sigma: 1.4, lo: 0.4, hi: 0.9 });
  const st = await stickerize(img, { white: 15, black: 5 });
  const b = bbox(st);
  const left = st.pad + 1;
  await write(crop(st, { left, top: b.top, width: b.left + b.width - left, height: b.height }), "life-bike.webp", 86);
}

console.log("scrapbook: done");
