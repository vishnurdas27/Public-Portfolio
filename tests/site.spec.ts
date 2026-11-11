import { expect, test } from "@playwright/test";

test.describe("Site-wide", () => {
  test("prerenders the professional landing page and a separate story page", async ({ request }) => {
    const home = await request.get("/");
    expect(home.status()).toBe(200);
    const homeHtml = await home.text();
    expect(homeHtml).toContain('id="hero-title"');
    expect(homeHtml).toContain("Professional profile");
    expect(homeHtml).not.toContain('class="story-main"');
    const story = await request.get("/story");
    expect(story.status()).toBe(200);
    expect(await story.text()).toContain('class="story-main"');
  });

  test("serves a branded 404 for unknown URLs", async ({ page }) => {
    const response = await page.goto("/definitely-not-a-page");
    expect(response?.status()).toBe(404);
    await expect(page.getByText("Page not found.")).toBeVisible();
  });

  test("favicon, touch icon and portraits are served", async ({ request }) => {
    for (const path of ["/favicon.svg", "/favicon.ico", "/apple-touch-icon.png", "/images/portrait-pro.webp"]) {
      const res = await request.get(path);
      expect(res.status(), path).toBe(200);
    }
  });

  test("résumé PDF is downloadable", async ({ request }) => {
    const res = await request.get("/resume.pdf");
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("pdf");
  });

  test("social cards are generated for every page", async ({ request }) => {
    for (const name of ["default", "pro", "story", "action-plan-tracker", "court-booking"]) {
      const res = await request.get(`/og/${name}.png`);
      expect(res.status(), name).toBe(200);
    }
  });
});
