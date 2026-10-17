import { describe, expect, it } from "vitest";

import { hasDepartureSeats, isDepartureSelectable } from "../src/lib/cms/departure-availability";

describe("departure availability", () => {
  it("treats an unspecified quota as unrestricted", () => {
    expect(hasDepartureSeats(null)).toBe(true);
    expect(isDepartureSelectable({ status: "open", availableSeats: null })).toBe(true);
  });

  it("blocks an exhausted departure even when its status is open or limited", () => {
    expect(hasDepartureSeats(0)).toBe(false);
    expect(isDepartureSelectable({ status: "open", availableSeats: 0 })).toBe(false);
    expect(isDepartureSelectable({ status: "limited", availableSeats: 0 })).toBe(false);
  });

  it("keeps positive quota bookable and closed departures unavailable", () => {
    expect(isDepartureSelectable({ status: "limited", availableSeats: 1 })).toBe(true);
    expect(isDepartureSelectable({ status: "closed", availableSeats: 10 })).toBe(false);
  });
});
