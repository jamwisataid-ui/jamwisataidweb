import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const baseUrl = process.env.GLOSSY_PREVIEW_URL || "http://127.0.0.1:4173";
const outputRoot = path.resolve("docs/design/glossy-audit");

const routes = [
  ["home", "/"], ["packages", "/packages"], ["worship", "/worship"], ["notifications", "/notifications"], ["account", "/account"],
  ["search", "/search"], ["package-detail", "/package/umroh-premium-demo"], ["schedule", "/schedule"], ["register", "/register/dep-demo"],
  ["payment", "/payment/reg-demo"], ["payments", "/payments"], ["prayer-times", "/prayer-times"], ["quran", "/quran"], ["quran-surah", "/quran/1"],
  ["duas", "/duas"], ["duas-collection", "/duas/morning"], ["duas-item", "/duas/daily/daily-1"], ["asmaul-husna", "/asmaul-husna"],
  ["live-muthowif", "/live-muthowif"], ["live-listener", "/live-muthowif/live-demo"], ["muthowif-home", "/muthowif"],
  ["muthowif-login", "/muthowif/login"], ["muthowif-live", "/muthowif/live"], ["muthowif-jamaah", "/muthowif/jamaah"], ["muthowif-settings", "/muthowif/settings"],
  ["profile", "/account/profile"], ["documents", "/documents"], ["journey", "/journey"], ["help", "/help"], ["onboarding", "/onboarding"],
  ["login", "/login"], ["activate", "/activate"], ["entry", "/index"],
];

const departure = { id: "dep-demo", departureDate: "2027-02-07", dateLabel: "7 Februari 2027", returnDate: "2027-02-16", price: 41500000, quota: 45, remainingQuota: 12, status: "available", selectable: true };
const packageData = { id: "pkg-demo", slug: "umroh-premium-demo", name: "Umroh Premium 10 Hari", category: "umrah", packageType: "reguler", badge: "Pilihan Jamaah", image: "", durationDays: 10, destination: ["Makkah", "Madinah"], priceFrom: 41500000, status: "active", airline: "Garuda Indonesia", departureAirport: "Soekarno-Hatta", makkahHotel: { name: "Pullman Zamzam", star: 5 }, madinahHotel: { name: "Anwar Al Madinah", star: 5 }, departures: [departure], highlights: ["Hotel dekat Masjidil Haram", "Muthowif berpengalaman", "Manasik sebelum keberangkatan"], itinerary: [{ day: 1, title: "Jakarta - Jeddah", description: "Keberangkatan menuju Tanah Suci" }, { day: 2, title: "Tiba di Makkah", description: "Check-in dan persiapan Umroh" }], facilities: ["Tiket pesawat PP", "Hotel", "Visa Umroh", "Transportasi"], terms: ["Paspor berlaku minimal 8 bulan", "Melengkapi dokumen jamaah"] };
const profile = { id: "jamaah-demo", fullName: "Ahmad Fauzi", whatsapp: "6281290002026", email: "demo@jamwisata.id", gender: "male", birthDate: "1977-02-10", nationality: "Indonesia", passportNumber: "A1234567", passportExpiry: "2030-02-10", jamaahNumber: "JW2026-DEMO", journey: { departureDate: departure.departureDate, departureLabel: departure.dateLabel, status: "Terdaftar" } };
const journey = { registrationId: "reg-demo", bookingNumber: "JW-DEMO-001", status: "confirmed", source: "mobile", package: { id: packageData.id, slug: packageData.slug, name: packageData.name, image: "", durationDays: 10 }, departure: { id: departure.id, departureDate: departure.departureDate, returnDate: departure.returnDate, dateLabel: departure.dateLabel, airline: packageData.airline, departureAirport: packageData.departureAirport, status: "available", price: "41500000" }, itinerary: [{ id: "day-1", day: 1, title: "Jakarta - Jeddah", description: "Keberangkatan menuju Tanah Suci" }, { id: "day-2", day: 2, title: "Tiba di Makkah", description: "Check-in hotel dan Umroh pertama" }, { id: "day-3", day: 3, title: "Makkah", description: "Ibadah dan ziarah" }], hotels: [{ id: "hotel-1", city: "Makkah", hotelName: "Pullman Zamzam", star: 5 }], rooms: { makkah: "Quad", madinah: "Quad", type: "quad" } };
const muthowifSession = { id: "live-demo", title: "Panduan Thawaf", type: "thawaf", status: "live", roomName: "jam-wisata-demo", startsAt: "2026-11-13T06:00:00.000Z", liveStartedAt: "2026-11-13T06:05:00.000Z", location: "Mataf - Makkah", listenerCount: 38, capacity: 45, rombongan: { id: "group-demo", name: "JAM WISATA 07 FEB 2027", totalJamaah: 45 }, rombonganName: "JAM WISATA 07 FEB 2027", muthowifName: "Ustadz Ghiffary Farchan", muthowif: { name: "Ustadz Ghiffary Farchan" }, canJoin: true };

function envelope(data) { return JSON.stringify({ data }); }

async function mockApi(route) {
  const url = new URL(route.request().url());
  const apiPath = url.pathname.split("/api/mobile/v1")[1] || url.pathname;
  let data = {};
  if (apiPath === "/packages") data = [packageData];
  else if (apiPath.startsWith("/packages/")) data = packageData;
  else if (apiPath === "/me") data = profile;
  else if (apiPath === "/documents") data = [{ id: "doc-1", kind: "passport", originalName: "paspor-ahmad.pdf", mimeType: "application/pdf", sizeBytes: 312000, reviewStatus: "approved", createdAt: "2026-11-01T00:00:00.000Z" }];
  else if (apiPath === "/journey") data = [journey];
  else if (apiPath === "/notifications") data = [{ id: "notif-1", title: "Dokumen disetujui", body: "Paspor Anda sudah diverifikasi.", createdAt: "2026-11-12T08:00:00.000Z", readAt: null }];
  else if (apiPath === "/payments") data = { summary: { billed: 41500000, paid: 0, refunded: 0, outstanding: 41500000 }, bills: [{ registrationId: "reg-demo", bookingNumber: "JW-DEMO-001", packageName: packageData.name, total: 41500000, paid: 0, outstanding: 41500000, status: "unpaid" }], transactions: [] };
  else if (apiPath === "/payments/reg-demo") data = { registrationId: "reg-demo", bookingNumber: "JW-DEMO-001", packageName: packageData.name, total: 41500000, paid: 0, outstanding: 41500000, status: "unpaid", selectedMethod: null, paymentContactWhatsapp: "6281809627499", methods: [{ id: "bank_transfer", name: "Transfer Bank", type: "bank_transfer", description: "Rekening resmi Jam Wisata", enabled: true }, { id: "virtual_account", name: "Virtual Account", type: "virtual_account", description: "Simulasi", enabled: false }] };
  else if (apiPath.startsWith("/prayer-times")) data = { location: { id: "makkah", city: "Makkah", country: "Arab Saudi", timezone: "Asia/Riyadh", latitude: 21.42, longitude: 39.82 }, date: { iso: "2026-11-13", hijri: { day: "3", month: 6, monthName: "Jumadil Akhir", year: "1448" } }, times: { fajr: "05:04", sunrise: "06:22", dhuhr: "12:05", asr: "15:24", maghrib: "17:42", isha: "19:12" }, calculation: "Umm al-Qura", updatedAt: new Date().toISOString() };
  else if (apiPath === "/live-muthowif") data = [muthowifSession];
  else if (apiPath === "/muthowif/sessions") data = [muthowifSession];
  else if (apiPath.startsWith("/muthowif/sessions/")) data = muthowifSession;
  await route.fulfill({ status: 200, contentType: "application/json", body: envelope(data) });
}

async function installSession(page, role) {
  await page.addInitScript(({ roleName, profileData }) => {
    window.localStorage.setItem("jamwisata_mobile_onboarding_v2", "done");
    if (roleName === "guest") {
      window.localStorage.removeItem("jamwisata_mobile_session");
      window.sessionStorage.removeItem("jamwisata_mobile_session");
      return;
    }
    const user = roleName === "muthowif" ? { id: "muthowif-demo", fullName: "Ustadz Ghiffary Farchan", email: "muthowif@jamwisata.id", role: "muthowif" } : { ...profileData, role: "jamaah" };
    const session = { tokens: { accessToken: "preview-access", refreshToken: "preview-refresh", accessExpiresAt: "2028-01-01T00:00:00Z", refreshExpiresAt: "2028-01-01T00:00:00Z" }, user };
    window.localStorage.setItem("jamwisata_mobile_session", JSON.stringify(session));
    window.sessionStorage.setItem("jamwisata_mobile_session", JSON.stringify(session));
  }, { roleName: role, profileData: profile });
}

async function runInteractionSmoke(page, name) {
  const visible = (text) => page.getByText(text, { exact: true }).first().waitFor({ state: "visible", timeout: 4_000 });
  if (name === "home") {
    await page.getByRole("tab", { name: "Paket", exact: true }).click();
    await page.waitForURL(/packages/);
    await page.getByLabel("Beranda").click();
    await visible("LAYANAN UTAMA");
  } else if (name === "packages") {
    await page.getByText("Plus", { exact: true }).click();
    await visible("Belum ada paket di kategori ini");
    await page.getByText("Semua", { exact: true }).click();
    await visible("Umroh Premium 10 Hari");
  } else if (name === "quran") {
    await page.getByText("Juz", { exact: true }).click();
    await visible("Juz 1");
    await page.getByText("Bookmark", { exact: true }).click();
    await visible("Belum ada bookmark");
    await page.getByText("Surah", { exact: true }).click();
    await visible("Al-Fatihah");
  } else if (name === "duas") {
    await page.getByText("Dzikir", { exact: true }).click();
    await visible("Dzikir Pagi");
    await page.getByText("Pilihan", { exact: true }).click();
    await page.getByText("Doa", { exact: true }).click();
    await visible("Doa Harian");
  } else if (name === "journey") {
    await page.getByText("Informasi Penting", { exact: true }).click();
    await page.getByText("Jadwal Perjalanan", { exact: true }).click();
    await visible("Jakarta - Jeddah");
  } else if (name === "live-muthowif") {
    await page.getByText("Jadwal Siaran", { exact: true }).click();
    await visible("Belum ada jadwal siaran");
    await page.getByText("Siaran Aktif", { exact: true }).click();
    await visible("Panduan Thawaf");
  } else if (name === "payment") {
    await page.getByText("Transfer Bank", { exact: true }).click();
    await visible("Tampilkan Instruksi Pembayaran");
  } else if (name === "register") {
    await page.getByRole("button", { name: /lanjutkan/i }).click();
    await visible("Dokumen Jamaah");
  } else if (name === "onboarding") {
    await page.getByRole("button", { name: /selanjutnya/i }).click();
    await page.waitForTimeout(450);
    await page.getByRole("button", { name: /selanjutnya/i }).click();
    await page.waitForTimeout(450);
    await page.getByRole("button", { name: /mulai jelajahi/i }).waitFor({ state: "visible", timeout: 4_000 });
  } else if (name === "account") {
    await page.getByText("Profil Saya", { exact: true }).click();
    await page.waitForURL(/account\/profile/);
    await page.waitForTimeout(350);
  }
}

const browser = await chromium.launch({ headless: true });
const results = [];
try {
  for (const platform of [{ name: "android", viewport: { width: 412, height: 915 }, userAgent: "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 Chrome/120 Mobile Safari/537.36" }, { name: "ios", viewport: { width: 430, height: 932 }, userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Version/17.0 Mobile/15E148 Safari/604.1" }].filter((item) => !process.env.GLOSSY_PLATFORM || item.name === process.env.GLOSSY_PLATFORM)) {
    const outputDir = path.join(outputRoot, platform.name);
    await mkdir(outputDir, { recursive: true });
    const selectedScreens = process.env.GLOSSY_SCREENS?.split(",").map((item) => item.trim()).filter(Boolean);
    for (const [name, routePath] of routes.filter(([screenName]) => !selectedScreens?.length || selectedScreens.includes(screenName))) {
      const context = await browser.newContext({ viewport: platform.viewport, deviceScaleFactor: 1, isMobile: true, hasTouch: true, userAgent: platform.userAgent });
      const page = await context.newPage();
      const role = name.startsWith("muthowif-") && name !== "muthowif-login" ? "muthowif" : ["onboarding", "login", "activate", "entry"].includes(name) ? "guest" : "jamaah";
      await installSession(page, role);
      await page.route("**/api/mobile/v1/**", mockApi);
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      try {
        await page.goto(`${baseUrl}${name === "home" ? "/packages" : routePath}`, { waitUntil: "networkidle", timeout: 20_000 });
        await page.getByLabel("Memuat aplikasi Jam Wisata").waitFor({ state: "detached", timeout: 6_500 }).catch(() => undefined);
        if (name === "home") {
          await page.getByLabel("Beranda").click();
        }
        await page.waitForTimeout(1_400);
        if (process.env.GLOSSY_SMOKE === "1") await runInteractionSmoke(page, name);
        await page.screenshot({ path: path.join(outputDir, `${name}.png`), animations: "disabled" });
        results.push({ platform: platform.name, name, path: routePath, errors });
      } catch (error) {
        results.push({ platform: platform.name, name, path: routePath, captureError: error instanceof Error ? error.message : String(error), errors });
      }
      await context.close();
    }
  }
} finally {
  await browser.close();
}
await writeFile(path.join(outputRoot, process.env.GLOSSY_SMOKE === "1" ? "smoke-results.json" : "last-capture-results.json"), JSON.stringify(results, null, 2));
const failed = results.filter((item) => item.captureError || item.errors.length);
console.log(`Captured ${results.length - failed.length}/${results.length} screens without runtime errors.`);
if (failed.length) console.log(JSON.stringify(failed, null, 2));
