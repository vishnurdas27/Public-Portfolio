import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";
import { expectNoHorizontalScroll, expectNoSeriousA11yViolations, trackErrors } from "./helpers";

test.describe("Story side (/story)", () => {
  test("tells the story in order, with real content in the DOM", async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto("/story");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Vishnu");
    for (const id of ["top", "about", "story", "work", "menu", "life", "play", "contact"]) {
      await expect(page.locator(`section#${id}`)).toHaveCount(1);
    }
    const titles = await page.locator(".scene h3").allInnerTexts();
    expect(titles.map((t) => t.replace(/\.$/, ""))).toEqual([
      "It started at Navodaya",
      "Then came Kochi",
      "Two classrooms at once",
      "I said yes to rooms with new ideas",
      "A regular at Tinkerspace",
    ]);
    await expect(page.locator("html")).toHaveAttribute("data-theme", "story");
    await expectNoHorizontalScroll(page);
    expect(errors).toEqual([]);
  });

  test("covers the personal details from the brief", async ({ page }) => {
    await page.goto("/story");
    const text = (await page.locator("main").innerText()).toLowerCase();
    for (const phrase of ["Navodaya", "CUSAT", "NxtWave", "Tinkerspace", "coffee", "volleyball", "Quality over quantity", "Confident"]) {
      expect(text, phrase).toContain(phrase.toLowerCase());
    }
  });

  test("opens with a short version grounded in the résumé", async ({ page }) => {
    await page.goto("/story");
    const about = page.locator("section#about");
    await expect(about.getByRole("heading", { level: 2 })).toContainText("short version");
    await expect(about).toContainText("I build the whole product");
    await expect(about.getByLabel("At a glance").locator("li")).toHaveCount(3);
    await expect(about).toContainText("8.34");
    await expect(about).toContainText("1st");
    await expect(about.getByLabel("Strengths").locator("li")).toHaveCount(6);
    // the black is design only: nothing announces a favourite colour
    const text = (await page.locator("main").innerText()).toLowerCase();
    expect(text).not.toMatch(/i (love|like) black|favou?rite colou?r/);
  });

  test("hero cups tell jokes", async ({ page }) => {
    await page.goto("/story");
    const bubble = page.locator("#top .bubble");
    await expect(bubble).toContainText("click a cup");
    await page.getByRole("button", { name: "Pour a coffee joke" }).first().click();
    await expect(bubble).not.toContainText("click a cup");
  });

  test("portraits load and never shift the layout", async ({ page }) => {
    await page.goto("/story");
    const hero = page.locator(".hero-person img");
    await expect(hero).toBeAttached();
    await expect.poll(() => hero.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
    const undeclared = await page
      .locator("main img")
      .evaluateAll((imgs) => imgs.filter((img) => !img.getAttribute("width") || !img.getAttribute("height")).length);
    expect(undeclared).toBe(0);
    // the portraits are decorative; only the scrapbook photos carry alt text
    await expect(page.locator('section:not(#life) img[alt]:not([alt=""])')).toHaveCount(0);
  });

  test("the scrapbook shows all six photos with alt text", async ({ page }) => {
    await page.goto("/story");
    const life = page.locator("section#life");
    await expect(life.getByRole("heading", { level: 2 })).toContainText("Off the clock");
    await life.scrollIntoViewIfNeeded();
    const images = life.locator("img");
    await expect(images).toHaveCount(6);
    for (const alt of await images.evaluateAll((imgs) => imgs.map((i) => i.getAttribute("alt") ?? ""))) {
      expect(alt.length, "scrapbook photos need alt text").toBeGreaterThan(10);
    }
    for (const note of ["My travelling partner", "University volleyball player", "Not on the résumé"]) {
      await expect(life).toContainText(note);
    }
  });

  test("the bike sticker rides in when the scrapbook scrolls into view", async ({ page }) => {
    await page.goto("/story");
    const bike = page.locator("#life .life-bike");
    await bike.scrollIntoViewIfNeeded();
    await expect(bike).toHaveClass(/is-in/);
    await expect.poll(() => bike.locator("img").evaluate((img) => getComputedStyle(img).transform)).toBe("none");
  });

  test("Coffee Catch starts and runs", async ({ page }) => {
    await page.goto("/story");
    await page.locator("#play").scrollIntoViewIfNeeded();
    await page.getByRole("button", { name: "Start", exact: true }).click();
    await expect(page.getByLabel(/Coffee Catch\. Move the cup/)).toBeVisible();
    await expect(page.getByLabel("3 lives left")).toBeVisible();
    await expect(page.getByRole("button", { name: "Start", exact: true })).toHaveCount(0);
  });

  test("Bug Whack counts down and scores", async ({ page }) => {
    await page.goto("/story");
    await page.locator("#play").scrollIntoViewIfNeeded();
    await page.getByRole("tab", { name: "Bug Whack" }).click();
    await page.getByRole("button", { name: "Start", exact: true }).click();
    const holes = page.getByRole("group", { name: "Bug Whack board" }).getByRole("button");
    await expect(holes).toHaveCount(9);
    await expect(page.getByText(/Go go go/)).toBeVisible();
    const bug = page.getByRole("button", { name: /bug! squash it/ }).first();
    await bug.waitFor({ timeout: 8000 });
    await bug.dispatchEvent("pointerdown");
    await expect(page.getByText("Splat!", { exact: true })).toBeVisible();
  });

  test("Memory Match pairs cards", async ({ page }) => {
    await page.goto("/story");
    await page.locator("#play").scrollIntoViewIfNeeded();
    await page.getByRole("tab", { name: "Memory Match" }).click();
    await page.getByRole("button", { name: "Shuffle & start" }).click();
    const cards = page.getByRole("group", { name: "Memory Match cards" }).getByRole("button");
    await expect(cards).toHaveCount(16);
    await cards.nth(0).click();
    await cards.nth(1).click();
    await expect(page.getByText(/Moves/)).toContainText("1");
  });

  test("command menu opens with Ctrl+K and can switch to the recruiter view", async ({ page }, info) => {
    test.skip(info.project.name === "mobile", "Keyboard shortcut is a desktop affordance");
    await page.goto("/story");
    await page.waitForLoadState("networkidle");
    await page.keyboard.press("Control+k");
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByPlaceholder(/Where to/).fill("recruiter");
    // results re-rank asynchronously, so wait for the intended item to be selected
    await expect(page.locator("[cmdk-item][data-selected=true]")).toContainText("recruiter view");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/$/);
  });

  test("menu finds the scrapbook by keyword", async ({ page }, info) => {
    test.skip(info.project.name === "mobile", "Keyboard shortcut is a desktop affordance");
    await page.goto("/story");
    await page.waitForLoadState("networkidle");
    await page.keyboard.press("Control+k");
    await page.getByPlaceholder(/Where to/).fill("volleyball");
    await expect(page.locator("[cmdk-item][data-selected=true]")).toContainText("Scrapbook");
  });

  test("menu opens from the header on any device", async ({ page }) => {
    await page.goto("/story");
    await page.getByRole("button", { name: /Open the menu/ }).first().click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeHidden();
  });

  test("mode switch works in both directions", async ({ page }) => {
    await page.goto("/story");
    await page.getByRole("link", { name: /Recruiter/ }).first().click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator("html")).toHaveAttribute("data-theme", /light|dark/);
    await page.getByRole("link", { name: /story/i }).first().click();
    await expect(page).toHaveURL(/\/story$/);
    await expect(page.locator("html")).toHaveAttribute("data-theme", "story");
  });

  test("respects reduced motion: nothing animates and everything is visible", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/story");
    await page.waitForTimeout(1200);
    const animated = await page.locator(".tape-track").evaluate((el) => getComputedStyle(el).animationName);
    expect(animated).toBe("none");
    const hidden = await page.locator("[data-reveal]").evaluateAll((els) => els.filter((el) => getComputedStyle(el).opacity === "0").length);
    expect(hidden).toBe(0);
    const bikeTransform = await page.locator("#life .ride").evaluate((el) => getComputedStyle(el).transform);
    expect(bikeTransform).toBe("none");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("is accessible, including colour contrast", async ({ page }) => {
    await page.goto("/story");
    await page.waitForTimeout(1500);
    // reveal everything first so contrast is measured on the final colours
    await page.evaluate(() => document.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("is-in")));
    await page.waitForTimeout(1500);
    await expectNoSeriousA11yViolations(page, ["wcag2a", "wcag2aa"]);
  });
});

test.describe("Sound effects", () => {
  type Counters = { __oscillators: number; __noise: number; __targets: number };

  // counts the oscillators and noise sources the page creates (that's how we tell something played)
  // and the gain/filter changes it schedules (that's how we tell the wind follows the scroll)
  const spyOnAudio = (page: Page) =>
    page.addInitScript(() => {
      const w = window as unknown as Counters;
      w.__oscillators = 0;
      w.__noise = 0;
      w.__targets = 0;
      const setTarget = AudioParam.prototype.setTargetAtTime;
      AudioParam.prototype.setTargetAtTime = function (...args: Parameters<typeof setTarget>) {
        w.__targets++;
        return setTarget.apply(this, args);
      };
      const Base = window.AudioContext;
      window.AudioContext = class extends Base {
        createOscillator() {
          w.__oscillators++;
          return super.createOscillator();
        }
        createBufferSource() {
          w.__noise++;
          return super.createBufferSource();
        }
      };
    });
  const counts = (page: Page) =>
    page.evaluate(() => {
      const w = window as unknown as Counters;
      return { __oscillators: w.__oscillators, __noise: w.__noise, __targets: w.__targets };
    });

  test("the sound toggle is on by default and remembers being switched off", async ({ page }) => {
    await page.goto("/story");
    const toggle = page.getByRole("button", { name: "Sound effects" });
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
    await page.reload();
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
  });

  test("clicking a button makes a sound", async ({ page }) => {
    await spyOnAudio(page);
    await page.goto("/story");
    await page.getByRole("button", { name: /Read my story/ }).click();
    await expect.poll(async () => (await counts(page)).__oscillators).toBeGreaterThan(0);
  });

  test("every click variant and the cup sound play without errors", async ({ page }) => {
    const errors = trackErrors(page);
    await spyOnAudio(page);
    await page.goto("/story");
    const logo = page.getByRole("button", { name: /back to the top/ });
    for (let i = 0; i < 24; i++) await logo.click();
    const cup = page.getByRole("button", { name: "Pour a coffee joke" }).first();
    for (let i = 0; i < 3; i++) await cup.click();
    expect((await counts(page)).__oscillators).toBeGreaterThan(20);
    expect(errors).toEqual([]);
  });

  test("nothing plays while sound is off", async ({ page }) => {
    await spyOnAudio(page);
    await page.addInitScript(() => localStorage.setItem("vrd:sound", "off"));
    await page.goto("/story");
    await page.getByRole("button", { name: /Read my story/ }).click();
    await page.waitForTimeout(800);
    const { __oscillators, __noise } = await counts(page);
    expect(__oscillators + __noise).toBe(0);
  });

  test("calm background music starts after the first click", async ({ page }) => {
    await spyOnAudio(page);
    await page.goto("/story");
    expect((await counts(page)).__oscillators, "nothing before the first interaction").toBe(0);
    await page.locator("#top").click({ position: { x: 5, y: 5 } });
    // the first chord is four notes, each from two slightly detuned oscillators, and the breeze loops a noise source
    await expect.poll(async () => (await counts(page)).__oscillators).toBeGreaterThanOrEqual(8);
    expect((await counts(page)).__noise).toBeGreaterThanOrEqual(1);
  });

  test("scrolling stirs up the wind", async ({ page }) => {
    await spyOnAudio(page);
    await page.goto("/story");
    await page.locator("#top").click({ position: { x: 5, y: 5 } });
    await page.waitForTimeout(500);
    const before = (await counts(page)).__targets;
    await expect
      .poll(async () => {
        await page.mouse.wheel(0, 1600);
        return (await counts(page)).__targets;
      })
      .toBeGreaterThan(before + 2);
  });

  test("the bug announces itself with a small sound", async ({ page }) => {
    test.setTimeout(60_000);
    await spyOnAudio(page);
    await page.goto("/story");
    await page.locator("#top").click({ position: { x: 5, y: 5 } });
    await page.waitForTimeout(800);
    const before = (await counts(page)).__noise;
    // the first bug crawls in after about nine seconds; its scuttle is a few short noise ticks
    await page.locator(".crawler").waitFor({ timeout: 20_000 });
    await expect.poll(async () => (await counts(page)).__noise).toBeGreaterThanOrEqual(before + 4);
  });
});
