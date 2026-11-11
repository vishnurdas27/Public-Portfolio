// checks that every internal href/src in build/client resolves to a file.
// pass --external to also request every external url
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = "build/client";
const checkExternal = process.argv.includes("--external");

const htmlFiles = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full);
    else if (name.endsWith(".html")) htmlFiles.push(full);
  }
};
walk(ROOT);

const internal = new Map(); // path -> pages that link to it
const external = new Map();
for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  for (const m of html.matchAll(/(?:href|src)="([^"#]+)(?:#[^"]*)?"/g)) {
    const url = m[1];
    if (url.startsWith("mailto:") || url.startsWith("tel:") || url.startsWith("data:")) continue;
    const bucket = /^https?:\/\//.test(url) ? external : internal;
    if (!bucket.has(url)) bucket.set(url, new Set());
    bucket.get(url).add(file.replace(ROOT, "") || "/");
  }
}

const exists = (url) => {
  const clean = url.split("?")[0];
  const path = join(ROOT, clean);
  if (existsSync(path) && statSync(path).isFile()) return true;
  return existsSync(join(path, "index.html"));
};

let failures = 0;
for (const [url, pages] of internal) {
  if (!exists(url)) {
    failures += 1;
    console.error(`✗ broken internal link ${url}  (on ${[...pages].slice(0, 3).join(", ")})`);
  }
}
console.log(`internal: ${internal.size} unique links checked, ${failures} broken`);

if (checkExternal) {
  const urls = [...external.keys()].filter((u) => !u.includes("localhost"));
  const results = await Promise.all(
    urls.map(async (url) => {
      const request = (method) =>
        fetch(url, { method, redirect: "follow", signal: AbortSignal.timeout(15000), headers: { "user-agent": "portfolio-link-check" } });
      try {
        let res = await request("HEAD");
        if (res.status === 405 || res.status === 403) res = await request("GET");
        return { url, status: res.status };
      } catch (error) {
        return { url, status: String(error.cause?.code ?? error.name) };
      }
    }),
  );
  for (const { url, status } of results) {
    const ok = typeof status === "number" && status < 400;
    // linkedin answers bots with 999, which isn't a broken link
    const soft = url.includes("linkedin.com") && status === 999;
    if (!ok && !soft) failures += 1;
    console.log(`${ok || soft ? "✓" : "✗"} ${status} ${url}`);
  }
}

process.exit(failures ? 1 : 0);
