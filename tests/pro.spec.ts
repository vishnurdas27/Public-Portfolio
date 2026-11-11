import { expect, test } from "@playwright/test";
import { expectNoHorizontalScroll, expectNoSeriousA11yViolations, trackErrors } from "./helpers";

test.describe("Professional homepage (/)", () => {
  test("shows the essentials above the fold, with no errors", async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto("/");

    await expect(page).toHaveTitle(/Vishnu R Das/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Vishnu R Das");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Full Stack Developer");

    await expect(page.getByRole("link", { name: /Download résumé/ }).first()).toHaveAttribute("href", "/resume.pdf");
    await expect(page.getByRole("link", { name: /Email vishnurdas27@gmail.com/ })).toHaveAttribute("href", /^mailto:/);
    await expect(page.getByRole("link", { name: "LinkedIn profile" })).toHaveAttribute("href", /linkedin\.com\/in\/vishnurdas2004/);
    await expect(page.getByRole("link", { name: "GitHub profile" })).toHaveAttribute("href", /github\.com\/vishnurdas27/);
    await expect(page.getByRole("link", { name: /Download résumé/ }).first()).toBeInViewport();

    for (const heading of ["Full stack, end to end", "Two enterprise platforms", "Projects, and the engineering", "The stack I work in", "Get in touch"]) {
      await expect(page.getByRole("heading", { name: new RegExp(heading) })).toBeVisible();
    }

    await expectNoHorizontalScroll(page);
    expect(errors).toEqual([]);
  });

  test("opens with a summary and links straight to the Saint-Gobain case studies", async ({ page }) => {
    await page.goto("/");
    const summary = page.locator("section#summary");
    await expect(summary).toContainText("End-to-end delivery");
    await expect(summary).toContainText("Enterprise integrations");
    await expect(summary.locator("li")).toHaveCount(4);
    const hero = page.locator("section[aria-labelledby=hero-title]");
    await expect(hero.getByRole("link", { name: /Action Plan Tracker/ })).toHaveAttribute("href", "/projects/action-plan-tracker");
    await expect(hero.getByRole("link", { name: /PRISM/ })).toHaveAttribute("href", "/projects/prism-helpdesk");
  });

  test("splits projects into featured enterprise work and personal projects", async ({ page }) => {
    await page.goto("/#projects");
    const section = page.locator("section#projects");
    await expect(section.getByText("FEATURED")).toHaveCount(2);
    await expect(section.getByText("Personal project")).toHaveCount(3);
    await expect(section.getByText(/Private repo/).first()).toBeVisible();
  });

  test("numbers its sections 01 to 07 in order", async ({ page }) => {
    await page.goto("/");
    const labels = await page.locator("section.pro-section p.eyebrow").allInnerTexts();
    const numbers = labels.map((t) => t.slice(0, 2)).filter((t) => /^\d\d$/.test(t));
    expect(numbers).toEqual(["01", "02", "03", "04", "05", "06", "07"]);
  });

  test("phones get a sticky Email and Résumé bar", async ({ page }, info) => {
    test.skip(info.project.name !== "mobile", "The bar is phone-only");
    await page.goto("/");
    const bar = page.locator("div.fixed.bottom-0");
    await expect(bar.getByRole("link", { name: /Email me/ })).toHaveAttribute("href", /^mailto:/);
    await expect(bar.getByRole("link", { name: /Résumé/ })).toHaveAttribute("href", "/resume.pdf");
  });

  test("section navigation works at phone, tablet and desktop widths", async ({ page }) => {
    for (const width of [320, 768, 1024, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      const navigation = page.getByRole("navigation", { name: "Sections", exact: true });
      await expect(navigation).toBeVisible();
      await navigation.getByRole("link", { name: "Projects", exact: true }).click();
      await expect(page).toHaveURL(/\/#projects$/);
      await expect(navigation.getByRole("link", { name: "Projects", exact: true })).toHaveAttribute("aria-current", "true");
      const headerBottom = await page.locator("header.sticky").evaluate((el) => el.getBoundingClientRect().bottom);
      const sectionTop = await page.locator("#projects").evaluate((el) => el.getBoundingClientRect().top);
      expect(sectionTop, "anchor should clear the sticky header").toBeGreaterThanOrEqual(headerBottom);
      await expectNoHorizontalScroll(page);
      await navigation.getByRole("link", { name: "Contact", exact: true }).click();
      await expect(page).toHaveURL(/\/#contact$/);
      await expect(page.getByRole("heading", { name: "Get in touch." })).toBeInViewport();
    }
  });

  test("shows the studio portrait, loaded, with alt text and reserved space", async ({ page }) => {
    await page.goto("/");
    const portrait = page.getByRole("img", { name: "Portrait of Vishnu R Das" });
    await expect(portrait).toBeVisible();
    const loaded = await portrait.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0);
    expect(loaded, "portrait should decode").toBe(true);
    await expect(portrait).toHaveAttribute("width", "720");
    await expect(portrait).toHaveAttribute("height", "864");
    const dimensions = await portrait.evaluate((img: HTMLImageElement) => ({
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      width: img.getBoundingClientRect().width,
      height: img.getBoundingClientRect().height,
    }));
    expect(dimensions.naturalWidth).toBe(720);
    expect(dimensions.naturalHeight).toBe(864);
    expect(dimensions.width, "portrait should be prominent, not a small avatar").toBeGreaterThanOrEqual(200);
    expect(dimensions.width, "portrait should stay within its frame on wider cards").toBeLessThanOrEqual(208);
    expect(dimensions.width / dimensions.height).toBeCloseTo(5 / 6, 2);
    const card = page.getByRole("complementary", { name: "Snapshot" });
    await expect(card).toContainText("Professional profile");
    await expect(card.getByRole("link", { name: "View experience" })).toHaveAttribute("href", "#experience");
  });

  test("has structured data and social metadata", async ({ page }) => {
    await page.goto("/");
    const ld = await page.locator('script[type="application/ld+json"]').textContent();
    const person = JSON.parse(ld ?? "{}");
    expect(person["@type"]).toBe("Person");
    expect(person.name).toBe("Vishnu R Das");
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /production-grade full-stack/);
    await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
  });

  test("theme toggle switches and persists", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");
    const before = await html.getAttribute("data-theme");
    const toggle = page.getByRole("button", { name: /Toggle light and dark theme/ });
    await expect(toggle.locator("svg:visible")).toHaveCount(1);
    await toggle.click();
    const after = await html.getAttribute("data-theme");
    expect(after).not.toBe(before);
    await expect(toggle.locator("svg:visible")).toHaveCount(1);
    await page.reload();
    await expect(html).toHaveAttribute("data-theme", after ?? "");
  });

  test("is accessible (light and dark)", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    await expectNoSeriousA11yViolations(page);
    await page.getByRole("button", { name: /Toggle light and dark theme/ }).click();
    await expectNoSeriousA11yViolations(page);
  });

  test("prints as a compact résumé", async ({ page, browserName }, info) => {
    test.skip(info.project.name !== "desktop" || browserName !== "chromium", "PDF printing is desktop Chromium only");
    await page.goto("/");
    await page.emulateMedia({ media: "print" });
    await expect(page.locator("header.sticky")).toBeHidden();
    const pdf = await page.pdf({ format: "A4" });
    const pages = (pdf.toString("latin1").match(/\/Type\s*\/Page[^s]/g) ?? []).length;
    expect(pages, "print layout should stay a handful of pages").toBeLessThanOrEqual(6);
  });

  test("the old recruiter URL remains usable and links to the new homepage", async ({ page }) => {
    await page.goto("/pro");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Full Stack Developer");
    await expect(page.getByRole("link", { name: "Vishnu R Das, recruiter view home" })).toHaveAttribute("href", "/");
    await page.getByRole("link", { name: "Vishnu R Das, recruiter view home" }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator("main.story-main")).toHaveCount(0);
  });
});
