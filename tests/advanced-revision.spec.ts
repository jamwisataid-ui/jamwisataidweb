import { expect, test } from "@playwright/test";

test.setTimeout(90_000);
const base = process.env.UAT_BASE_URL ?? "http://127.0.0.1:3000";

const sizes = [
  { width: 320, height: 900 },
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
  { width: 768, height: 1024 },
  { width: 1024, height: 900 },
  { width: 1280, height: 900 },
  { width: 1440, height: 1000 },
  { width: 1920, height: 1080 },
];

test("responsive layout has no horizontal overflow", async ({ page }) => {
  for (const size of sizes) {
    await page.setViewportSize(size);
    await page.goto(base, { waitUntil: "domcontentloaded" });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, `${size.width}px overflow`).toBeLessThanOrEqual(1);
    await page.screenshot({ path: `test-results/jamwisata-${size.width}.png`, fullPage: size.width === 390 || size.width === 1440 });
  }
});

test("search filters packages and updates URL", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(base);
  await page.getByRole("region", { name: "Pencarian Paket Umrah" }).getByRole("combobox").nth(1).selectOption("2026-12");
  await page.getByRole("button", { name: "Cari Paket" }).click();
  await expect(page).toHaveURL(/bulan=2026-12/);
  await expect(page.getByText("1 paket ditemukan")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Umroh 12 Hari + Turkey" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Umroh Bintang 5" })).toHaveCount(0);
});

test("mobile drawer, lite video lazy load, and concierge are keyboard operable", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base);
  await page.getByRole("button", { name: "Buka menu" }).click();
  await expect(page.getByRole("dialog", { name: "Menu navigasi" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Menu navigasi" })).toHaveCount(0);

  await page.locator("#testimoni").scrollIntoViewIfNeeded();
  const autoConcierge = page.getByRole("dialog", { name: "WhatsApp concierge Jam Wisata" });
  if (await autoConcierge.isVisible().catch(() => false)) {
    await page.getByRole("button", { name: "Tutup WhatsApp concierge" }).click();
  }
  await expect(page.locator("iframe")).toHaveCount(0);
  await page.getByRole("button", { name: /Putar video/ }).first().click();
  await expect(page.locator("iframe")).toHaveCount(1);
  await expect(page.locator("iframe")).toHaveAttribute("src", /youtube-nocookie\.com\/embed/);

  await page.getByRole("button", { name: "Buka bantuan Jam Wisata" }).click();
  await expect(page.getByRole("dialog", { name: "WhatsApp concierge Jam Wisata" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Tutup bantuan Jam Wisata" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Tanya Jadwal Keberangkatan/ })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "WhatsApp concierge Jam Wisata" })).toHaveCount(0);
});

test("page has no runtime console errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto(base, { waitUntil: "domcontentloaded" });
  expect(errors).toEqual([]);
});

test("sticky main navigation keeps stable geometry while scrolling", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(base);
  const heights: number[] = [];
  for (const y of [0, 16, 32, 48, 80, 160]) {
    await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
    await page.waitForTimeout(80);
    heights.push(await page.locator("header > div").nth(1).evaluate((element) => element.getBoundingClientRect().height));
  }
  expect(new Set(heights).size).toBe(1);
});
