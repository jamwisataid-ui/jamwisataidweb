import { expect, test } from "@playwright/test";

test.setTimeout(90_000);

for (const viewport of [
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1440, height: 1000 },
]) {
  test(`homepage tidak overflow pada ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("http://127.0.0.1:3000", { waitUntil: "networkidle" });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    await expect(page.getByRole("heading", { name: /Setiap langkah menuju Baitullah/i })).toBeVisible();
  });
}

test("menu mobile dan Journey Planner dapat dioperasikan", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("http://127.0.0.1:3000");
  await page.getByRole("button", { name: "Buka menu" }).click();
  await expect(page.getByRole("dialog", { name: "Menu navigasi" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Menu navigasi" })).toHaveCount(0);

  await page.goto("http://127.0.0.1:3000/journey-planner");
  await page.getByRole("button", { name: /Umrah pertama kali/i }).click();
  await page.getByRole("button", { name: "Selanjutnya" }).click();
  await expect(page.getByRole("heading", { name: /Bersama siapa/i })).toBeVisible();
});

test("detail program tersedia dan video baru dimuat setelah interaksi", async ({ page }) => {
  await page.goto("http://127.0.0.1:3000");
  await expect(page.locator("iframe")).toHaveCount(0);
  await page.getByRole("button", { name: /Putar video:/ }).first().click();
  await expect(page.locator("iframe")).toHaveAttribute("src", /youtube-nocookie\.com/);
  await page.keyboard.press("Escape");

  await page.goto("http://127.0.0.1:3000/program/umrah-premium-9-hari");
  await expect(page.getByRole("heading", { name: "Umrah Premium 9 Hari", level: 1 })).toBeVisible();
  await expect(page.getByRole("link", { name: /Konsultasikan program/i })).toBeVisible();
});
