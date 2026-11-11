// npm run icons
// favicon.svg, favicon.ico and the touch icon
import sharp from "sharp";
import { writeFileSync } from "node:fs";

const mark = (size) =>
  Buffer.from(`
  <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">
    <rect width="64" height="64" rx="15" fill="#14100d"/>
    <rect x="1.5" y="1.5" width="61" height="61" rx="13.5" fill="none" stroke="#ffd15c" stroke-width="2"/>
    <text x="32" y="43" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="29" letter-spacing="-1.5" fill="#fff3dc">VR</text>
  </svg>`);

writeFileSync("public/favicon.svg", mark(64).toString().trim());

// the .ico is a container of png frames, which every current browser reads
const frames = await Promise.all(
  [32, 48].map(async (size) => ({ size, data: await sharp(mark(64)).resize(size, size).png().toBuffer() })),
);
const header = Buffer.alloc(6);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(frames.length, 4);
let offset = 6 + frames.length * 16;
const entries = frames.map((f) => {
  const e = Buffer.alloc(16);
  e.writeUInt8(f.size, 0);
  e.writeUInt8(f.size, 1);
  e.writeUInt16LE(1, 4);
  e.writeUInt16LE(32, 6);
  e.writeUInt32LE(f.data.length, 8);
  e.writeUInt32LE(offset, 12);
  offset += f.data.length;
  return e;
});
writeFileSync("public/favicon.ico", Buffer.concat([header, ...entries, ...frames.map((f) => f.data)]));

// home-screen icon: the studio portrait, so a bookmark is recognisable
await sharp("public/images/portrait-pro.webp").resize(180, 180).png().toFile("public/apple-touch-icon.png");

console.log("icons: done");
