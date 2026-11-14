const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('@playwright/test');

const DIST_DIR = path.resolve(__dirname, '../mobile/dist');
const OUTPUT_DIR = path.resolve(__dirname, '../docs/design');

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ttf': 'font/ttf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function startServer(port = 8093) {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      let reqPath = decodeURIComponent(req.url.split('?')[0]);
      if (reqPath === '/' || reqPath.startsWith('/(tabs)')) {
        reqPath = '/index.html';
      }

      let filePath = path.join(DIST_DIR, reqPath);
      if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        filePath = path.join(DIST_DIR, 'index.html');
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      fs.readFile(filePath, (err, content) => {
        if (err) {
          res.writeHead(500);
          res.end('Error loading file');
          return;
        }
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      });
    });

    server.listen(port, () => resolve(server));
    server.on('error', reject);
  });
}

const mockPackages = [
  {
    id: "pkg-1",
    slug: "umroh-12-hari-turkey",
    name: "Umroh 12 Hari + Turkey",
    category: "umrah",
    packageType: "plus",
    badge: "Favorit",
    image: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=600&q=80",
    durationDays: 12,
    priceFrom: 34500000,
    status: "active",
    departures: [
      {
        id: "dep-1",
        departureDate: "2026-12-08",
        dateLabel: "8 Desember 2026",
        status: "available",
        selectable: true,
        remainingQuota: 8,
      },
    ],
  },
  {
    id: "pkg-2",
    slug: "umroh-reguler-9-hari",
    name: "Umroh Reguler 9 Hari",
    category: "umrah",
    packageType: "reguler",
    badge: "Hemat",
    image: "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=600&q=80",
    durationDays: 9,
    priceFrom: 27500000,
    status: "active",
    departures: [
      {
        id: "dep-2",
        departureDate: "2026-12-20",
        dateLabel: "20 Desember 2026",
        status: "available",
        selectable: true,
        remainingQuota: 14,
      },
    ],
  },
];

const mockPrayerTimes = {
  location: { id: "makkah", city: "Makkah", country: "Arab Saudi", timezone: "Asia/Riyadh", latitude: 21.42, longitude: 39.82 },
  date: { iso: "2026-11-11", hijri: { day: "2", month: 6, monthName: "Jumada al-Akhirah", year: "1448" } },
  times: { fajr: "05:04", sunrise: "06:22", dhuhr: "12:05", asr: "15:24", maghrib: "17:42", isha: "19:12" },
  calculation: "Umm al-Qura",
  updatedAt: new Date().toISOString(),
};

async function capture() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const server = await startServer(8093);
  console.log('Static server started at http://localhost:8093');

  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });

  try {
    // 1. Capture Beranda Tamu (Guest)
    console.log('Capturing Beranda Tamu...');
    {
      const context = await browser.newContext({
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 2,
      });

      const page = await context.newPage();

      await page.route('**/api/mobile/v1/packages*', (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: mockPackages }),
        });
      });

      await page.route('**/api/mobile/v1/notifications*', (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: [] }),
        });
      });

      await page.route('**/api/mobile/v1/prayer-times*', (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: mockPrayerTimes }),
        });
      });

      await page.addInitScript(() => {
        window.localStorage.setItem('jamwisata_mobile_onboarding_v2', 'done');
        window.localStorage.removeItem('jamwisata_mobile_session');
        window.sessionStorage.removeItem('jamwisata_mobile_session');
      });

      await page.goto('http://localhost:8093', { waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);

      const guestScreenshotPath = path.join(OUTPUT_DIR, 'screenshot-beranda-tamu.png');
      await page.screenshot({ path: guestScreenshotPath, fullPage: false });
      console.log(`Saved: ${guestScreenshotPath}`);
      await context.close();
    }

    // 2. Capture Beranda Login (Pilgrim)
    console.log('Capturing Beranda Login...');
    {
      const context = await browser.newContext({
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 2,
      });

      const page = await context.newPage();

      await page.route('**/api/mobile/v1/packages*', (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: mockPackages }),
        });
      });

      await page.route('**/api/mobile/v1/notifications*', (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: [{ id: 'notif-1', readAt: null }] }),
        });
      });

      await page.route('**/api/mobile/v1/prayer-times*', (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: mockPrayerTimes }),
        });
      });

      await page.route('**/api/mobile/v1/me', (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: {
              id: 'user-001',
              fullName: 'Ahmad Fauzi',
              whatsapp: '6281234567890',
              jamaahNumber: 'JW-2026-0812',
              journey: {
                departureDate: '2026-12-08',
                departureLabel: '8 Desember 2026',
                status: 'Terdaftar',
              },
            },
          }),
        });
      });

      await page.addInitScript(() => {
        window.localStorage.setItem('jamwisata_mobile_onboarding_v2', 'done');
        const session = {
          tokens: {
            accessToken: 'mock-access',
            refreshToken: 'mock-refresh',
            accessExpiresAt: '2028-01-01T00:00:00Z',
            refreshExpiresAt: '2028-01-01T00:00:00Z',
          },
          user: {
            id: 'user-001',
            fullName: 'Ahmad Fauzi',
            whatsapp: '6281234567890',
            role: 'jamaah',
          },
        };
        window.localStorage.setItem('jamwisata_mobile_session', JSON.stringify(session));
        window.sessionStorage.setItem('jamwisata_mobile_session', JSON.stringify(session));
      });

      await page.goto('http://localhost:8093', { waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);

      const loginScreenshotPath = path.join(OUTPUT_DIR, 'screenshot-beranda-login.png');
      await page.screenshot({ path: loginScreenshotPath, fullPage: false });
      console.log(`Saved: ${loginScreenshotPath}`);
      await context.close();
    }

  } finally {
    await browser.close();
    server.close();
    console.log('Server and browser closed.');
  }
}

capture().catch((err) => {
  console.error('Error during capture:', err);
  process.exit(1);
});
