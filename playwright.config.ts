import { defineConfig } from "@playwright/test";

// tests run against the production build (npm run build && npm run test:e2e) in the installed Edge,
// so no browser download is needed. set PW_CHANNEL=chrome to use Chrome instead
const channel = process.env.PW_CHANNEL ?? "msedge";

export default defineConfig({
  testDir: "tests",
  timeout: 45_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  workers: process.env.CI ? 2 : 3,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:4173",
    channel,
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { viewport: { width: 1280, height: 800 } } },
    { name: "mobile", use: { viewport: { width: 390, height: 844 }, hasTouch: true } },
  ],
  webServer: {
    command: "npm run preview",
    url: "http://localhost:4173",
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
