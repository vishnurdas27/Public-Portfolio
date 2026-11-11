// runs after react-router build: writes 404.html for static hosts, plus robots.txt and sitemap.xml
// (the sitemap needs an absolute site url)
import { copyFileSync, existsSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUT = "build/client";
const SITE_URL = (process.env.VITE_SITE_URL ?? process.env.SITE_URL ?? "").replace(/\/$/, "");

const notFound = join(OUT, "404", "index.html");
if (existsSync(notFound)) {
  copyFileSync(notFound, join(OUT, "404.html"));
  console.log("postbuild: wrote 404.html");
} else {
  console.warn("postbuild: /404 was not prerendered; skipping 404.html");
}

// /pro remains a working alias; only its canonical homepage belongs in the sitemap.
const routes = [];
const walk = (dir, rel = "") => {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (!statSync(full).isDirectory()) continue;
    if (existsSync(join(full, "index.html"))) {
      const route = `${rel}/${name}`;
      if (!route.startsWith("/404") && route !== "/pro") routes.push(route);
    }
    walk(full, `${rel}/${name}`);
  }
};
if (existsSync(join(OUT, "index.html"))) routes.push("");
walk(OUT);
routes.sort();

if (SITE_URL) {
  const urls = routes.map((r) => `  <url><loc>${SITE_URL}${r || "/"}</loc></url>`).join("\n");
  writeFileSync(
    join(OUT, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
  );
  writeFileSync(join(OUT, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
  console.log(`postbuild: wrote sitemap.xml (${routes.length} routes) and robots.txt`);
} else {
  writeFileSync(join(OUT, "robots.txt"), "User-agent: *\nAllow: /\n");
  console.log("postbuild: SITE_URL not set; wrote permissive robots.txt and skipped sitemap.xml");
}
