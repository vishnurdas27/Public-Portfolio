import { expect, test } from "@playwright/test";
import { trackErrors } from "./helpers";

test.describe("Recruiter theme preferences", () => {
  test.use({ colorScheme: "dark" });

  for (const stored of [null, "story", "invalid"]) {
    test(`defaults to light with ${stored === null ? "no" : stored} stored preference, even on a dark device`, async ({ page }) => {
      await page.addInitScript((value) => {
        if (value === null) localStorage.removeItem("theme");
        else localStorage.setItem("theme", value);
      }, stored);
      for (const path of ["/", "/pro", "/projects/action-plan-tracker", "/projects/cinespot"]) {
        await page.goto(path);
        await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
      }
    });
  }

  test("sets light before the application hydrates", async ({ page }) => {
    await page.route("**/*.js", (route) => route.abort());
    for (const [path, theme] of [["/", "light"], ["/pro", "light"], ["/story", "story"]] as const) {
      await page.goto(path);
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    }
  });

  test("saved choices survive reloads, case studies and the story round trip", async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto("/");
    const html = page.locator("html");
    await expect(html).toHaveAttribute("data-theme", "light");
    await page.getByRole("button", { name: "Toggle light and dark theme" }).click();
    await expect(html).toHaveAttribute("data-theme", "dark");
    await expect.poll(() => page.evaluate(() => localStorage.getItem("theme"))).toBe("dark");
    await page.reload();
    await expect(html).toHaveAttribute("data-theme", "dark");
    await page.locator("section[aria-labelledby=hero-title]").getByRole("link", { name: /Action Plan Tracker/ }).click();
    await expect(html).toHaveAttribute("data-theme", "dark");
    await page.getByRole("banner").getByRole("link", { name: /^(My story|Story)$/ }).click();
    await expect(page).toHaveURL(/\/story$/);
    await expect(html).toHaveAttribute("data-theme", "story");
    await expect.poll(() => page.evaluate(() => localStorage.getItem("theme"))).toBe("dark");
    await page.getByRole("banner").getByRole("link", { name: /^Recruiter( view)?$/ }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(html).toHaveAttribute("data-theme", "dark");
    await page.getByRole("button", { name: "Toggle light and dark theme" }).click();
    await page.reload();
    await expect(html).toHaveAttribute("data-theme", "light");
    expect(errors).toEqual([]);
  });

  test("blocked storage still applies a theme and leaves the toggle usable", async ({ page }) => {
    const errors = trackErrors(page);
    await page.addInitScript(() => {
      Object.defineProperty(window, "localStorage", {
        get() { throw new DOMException("Storage is blocked", "SecurityError"); },
      });
    });
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await page.getByRole("button", { name: "Toggle light and dark theme" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    expect(errors).toEqual([]);
  });
});
