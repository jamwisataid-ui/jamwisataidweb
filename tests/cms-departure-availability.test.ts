import { describe, expect, it } from "vitest";

import { calculateRemainingSeats, countSeatConsumingRegistrations, hasDepartureSeats, isDepartureSelectable } from "../src/lib/cms/departure-availability";

describe("departure availability", () => {
  it("treats an unspecified quota as unrestricted", () => {
    expect(calculateRemainingSeats(null, 12)).toBeNull();
    expect(hasDepartureSeats(null)).toBe(true);
    expect(isDepartureSelectable({ status: "open", remainingSeats: null })).toBe(true);
  });

  it.each([
    [0, 45],
    [12, 33],
    [45, 0],
  ])("calculates capacity 45 with %i active registrations", (active, remaining) => {
    expect(calculateRemainingSeats(45, active)).toBe(remaining);
  });

  it("does not count cancelled registrations", () => {
    const active = countSeatConsumingRegistrations(["pending", "active", "cancelled", "completed"]);
    expect(active).toBe(3);
    expect(calculateRemainingSeats(45, active)).toBe(42);
  });

  it("blocks only exhausted, closed, or coming-soon departures", () => {
    expect(isDepartureSelectable({ status: "open", remainingSeats: 0 })).toBe(false);
    expect(isDepartureSelectable({ status: "limited", remainingSeats: 1 })).toBe(true);
    expect(isDepartureSelectable({ status: "full", remainingSeats: 1 })).toBe(true);
    expect(isDepartureSelectable({ status: "closed", remainingSeats: 10 })).toBe(false);
    expect(isDepartureSelectable({ status: "coming-soon", remainingSeats: 10 })).toBe(false);
  });
});
