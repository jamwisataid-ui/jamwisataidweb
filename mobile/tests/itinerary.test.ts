import { describe, expect, it } from "vitest";

import { getCurrentItineraryDay } from "../src/lib/itinerary";

describe("getCurrentItineraryDay", () => {
  it("marks every day upcoming before departure", () => {
    expect(getCurrentItineraryDay("2026-11-08", 11, new Date(2026, 9, 15))).toBe(0);
  });

  it("returns the active day during the trip", () => {
    expect(getCurrentItineraryDay("2026-11-08", 11, new Date(2026, 10, 12))).toBe(5);
  });

  it("marks the timeline completed after the last day", () => {
    expect(getCurrentItineraryDay("2026-11-08", 11, new Date(2026, 10, 25))).toBe(12);
  });

  it("falls back safely for an invalid date", () => {
    expect(getCurrentItineraryDay("2026-99-99", 9)).toBe(0);
  });
});
