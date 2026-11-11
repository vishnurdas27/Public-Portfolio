// social previews (1200x630) for the professional homepage, story and every case study.
// they're only linked from <meta> when VITE_SITE_URL is set, but they're always generated.
// run through tsx so it can import the content files: tsx scripts/generate-og.mjs
import { Resvg } from "@resvg/resvg-js";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import satori from "satori";
import { profile } from "../app/content/profile.ts";
import { projects } from "../app/content/projects.ts";

const OUT = join("build", "client", "og");
mkdirSync(OUT, { recursive: true });

const font = (path) => readFileSync(join("node_modules", path));
const fonts = [
  { name: "Geist", data: font("@fontsource/geist/files/geist-latin-400-normal.woff"), weight: 400, style: "normal" },
  { name: "Geist", data: font("@fontsource/geist/files/geist-latin-600-normal.woff"), weight: 600, style: "normal" },
  { name: "Geist", data: font("@fontsource/geist/files/geist-latin-700-normal.woff"), weight: 700, style: "normal" },
  { name: "Instrument Serif", data: font("@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff"), weight: 400, style: "italic" },
];

const dataUri = (path) => `data:image/png;base64,${readFileSync(path).toString("base64")}`;
const HERO = { src: dataUri("assets/og-casual.png"), width: 360, height: 487 };
const HEADSHOT = { src: dataUri("assets/og-pro.png"), width: 440, height: 440 };

const INK = "#14100d";
const LAYER_COLORS = { interface: "#0891b2", logic: "#6d5ef0", data: "#c2610a", cloud: "#059669" };

// tiny hyperscript, so the cards don't need jsx
const h = (type, style, children) => ({ type, props: { style: { display: "flex", ...style }, children } });
const img = (image, style) => ({ type: "img", props: { src: image.src, width: image.width, height: image.height, style } });

function card({ eyebrow, title, subtitle, chips = [], accent, background, color, chipBorder, art, textWidth = 980 }) {
  return h(
    "div",
    {
      position: "relative",
      width: 1200,
      height: 630,
      flexDirection: "column",
      justifyContent: "space-between",
      padding: 72,
      color,
      fontFamily: "Geist",
      background,
    },
    [
      h("div", { alignItems: "center", gap: 18, fontSize: 24, color, opacity: 0.7, letterSpacing: 4, textTransform: "uppercase" }, [
        h("div", { width: 14, height: 14, borderRadius: 14, background: accent }, ""),
        eyebrow,
      ]),
      h("div", { flexDirection: "column", gap: 20, maxWidth: textWidth }, [
        h("div", { fontSize: title.length > 26 ? 76 : art ? 92 : 104, fontWeight: 700, letterSpacing: -4, lineHeight: 1.02 }, title),
        h("div", { fontFamily: "Instrument Serif", fontStyle: "italic", fontSize: 46, color: accent, lineHeight: 1.15 }, subtitle),
      ]),
      h(
        "div",
        { gap: 12, flexWrap: "wrap", maxWidth: textWidth },
        chips.map((chip) => h("div", { padding: "10px 20px", borderRadius: 999, border: `2px solid ${chipBorder}`, fontSize: 24 }, chip)),
      ),
      ...(art ? [art] : []),
    ],
  );
}

// story side: warm paper, ink outlines, the sticker portrait on a butter sun
const storyArt = h("div", { position: "absolute", right: 56, top: 70, width: 440, height: 500 }, [
  h("div", { position: "absolute", left: 20, top: 40, width: 400, height: 400, borderRadius: 400, background: "#ffd15c", border: `4px solid ${INK}`, boxShadow: `10px 10px 0 ${INK}` }, ""),
  img(HERO, { position: "absolute", left: 40, bottom: 0 }),
]);

const light = { background: "#f6f5f1", color: INK, chipBorder: "#d9d6cd" };
const professionalCard = card({
  ...light,
  eyebrow: "Full Stack Developer · Portfolio",
  title: profile.name,
  subtitle: `${profile.title}, with two enterprise platforms shipped.`,
  chips: ["React", "Node.js", "FastAPI", "PostgreSQL"],
  accent: "#b4510a",
  art: img(HEADSHOT, { position: "absolute", right: 64, top: 95, borderRadius: 36 }),
  textWidth: 600,
});

const pages = [
  { name: "default", node: professionalCard },
  { name: "pro", node: professionalCard },
  {
    name: "story",
    node: card({
      eyebrow: "Full Stack Developer · Palakkad",
      title: profile.name,
      subtitle: "Hi, I'm Vishnu. Come read my story.",
      chips: ["React", "Node.js", "Python", "AWS", "coffee"],
      accent: "#d9611a",
      background: "#fff3dc",
      color: INK,
      chipBorder: INK,
      art: storyArt,
      textWidth: 620,
    }),
  },
  ...projects.map((p) => ({
    name: p.slug,
    node: card({
      ...light,
      eyebrow: `${p.kind === "enterprise" ? "Enterprise project" : "Personal project"} · Case study`,
      title: p.title,
      subtitle: p.tagline,
      chips: p.stack.slice(0, 6),
      accent: LAYER_COLORS[p.accent],
    }),
  })),
];

for (const page of pages) {
  const svg = await satori(page.node, { width: 1200, height: 630, fonts });
  const png = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } }).render().asPng();
  writeFileSync(join(OUT, `${page.name}.png`), png);
}
console.log(`og: wrote ${pages.length} images to ${OUT}`);
