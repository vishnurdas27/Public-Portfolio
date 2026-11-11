import { expect, test } from "@playwright/test";
import { expectNoHorizontalScroll, expectNoSeriousA11yViolations, PROJECT_SLUGS, trackErrors } from "./helpers";

test.describe("Case studies", () => {
  for (const slug of PROJECT_SLUGS) {
    test(`/projects/${slug} renders and is accessible`, async ({ page }) => {
      const errors = trackErrors(page);
      await page.goto(`/projects/${slug}`);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(page.getByRole("heading", { name: "How the pieces fit together" })).toBeVisible();
      await expect(page.getByRole("heading", { name: "Key features" })).toBeVisible();
      await expect(page.getByRole("complementary", { name: "What I delivered" }).locator("li")).toHaveCount(3);
      await expectNoHorizontalScroll(page);
      await expectNoSeriousA11yViolations(page);
      await page.getByRole("button", { name: "Toggle light and dark theme" }).click();
      await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
      await expectNoSeriousA11yViolations(page);
      expect(errors).toEqual([]);
    });
  }

  test("case study jump links match the sections available", async ({ page }) => {
    for (const slug of ["action-plan-tracker", "cinespot"]) {
      await page.goto(`/projects/${slug}`);
      const navigation = page.getByRole("navigation", { name: "Case study sections" });
      await expect(navigation.getByRole("link", { name: "Product screens" })).toHaveCount(slug === "cinespot" ? 0 : 1);
      for (const [name, id] of [["Problem & approach", "overview"], ["Architecture", "architecture"], ["Key features", "features"]]) {
        await navigation.getByRole("link", { name, exact: true }).click();
        await expect(page).toHaveURL(new RegExp(`#${id}$`));
        const headerBottom = await page.locator("header.sticky").evaluate((el) => el.getBoundingClientRect().bottom);
        const sectionTop = await page.locator(`#${id}`).evaluate((el) => el.getBoundingClientRect().top);
        expect(sectionTop, "case-study section should clear the sticky header").toBeGreaterThanOrEqual(headerBottom);
      }
      await page.getByRole("navigation", { name: "Sections", exact: true }).getByRole("link", { name: "Projects", exact: true }).click();
      await expect(page).toHaveURL(/\/#projects$/);
    }
  });

  test("enterprise case studies show screens from the real apps", async ({ page }) => {
    for (const [slug, count] of [["action-plan-tracker", 6], ["prism-helpdesk", 8]] as const) {
      await page.goto(`/projects/${slug}`);
      const shots = page.locator("#screens img");
      await expect(shots).toHaveCount(count);
      await expect.poll(() => shots.first().evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth)).toBe(1440);
      await expect(page.locator("#screens figcaption").first()).not.toBeEmpty();
    }
    // projects without screenshots keep the original numbering
    await page.goto("/projects/cinespot");
    await expect(page.locator("#screens")).toHaveCount(0);
    await expect(page.getByText("03 · Architecture")).toBeVisible();
  });

  test("enterprise repos never render a dead GitHub link", async ({ page }) => {
    await page.goto("/projects/action-plan-tracker");
    await expect(page.getByText(/Private repo/)).toBeVisible();
    await expect(page.locator('a[href*="Action-Plan-Tracker"]')).toHaveCount(0);
  });

  test("unknown project slugs show the 404 page", async ({ page }) => {
    await page.goto("/projects/does-not-exist");
    await expect(page.getByText("Page not found.")).toBeVisible();
  });
});
