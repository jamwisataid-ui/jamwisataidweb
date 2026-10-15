import { describe, expect, it } from "vitest";

import { nextPrayer, qiblaBearing } from "../src/lib/prayer-times";

const times = { fajr: "05:00", sunrise: "06:16", dhuhr: "12:07", asr: "15:28", maghrib: "17:56", isha: "19:26" };

describe("nextPrayer", () => {
  it("uses the selected location timezone", () => {
    expect(nextPrayer(times, "Asia/Riyadh", new Date("2026-10-15T12:30:00Z"))).toEqual({ key: "maghrib", tomorrow: false });
  });

  it("rolls over to tomorrow's Subuh after Isya", () => {
    expect(nextPrayer(times, "Asia/Riyadh", new Date("2026-10-15T20:00:00Z"))).toEqual({ key: "fajr", tomorrow: true });
  });

  it("does not treat sunrise as a prayer target", () => {
    expect(nextPrayer(times, "Asia/Riyadh", new Date("2026-10-15T02:30:00Z"))).toEqual({ key: "dhuhr", tomorrow: false });
  });
});

describe("qiblaBearing", () => {
  it("calculates the bearing from Jakarta", () => {
    expect(qiblaBearing(-6.2088, 106.8456)).toBe(295);
  });
});
