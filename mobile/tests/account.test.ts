import { describe, expect, it } from "vitest";
import { jamaahNumber, journeySummary, profileInitials } from "../src/lib/account";
import type { AccountProfile } from "../src/types";

const oldPilgrim: AccountProfile = { id: "p1", fullName: "Ahmad Fauzi", whatsapp: "628123456789", jamaahNumber: null, journey: null };

describe("account profile", () => {
  it("keeps pilgrims without a booking backward compatible", () => {
    expect(jamaahNumber(oldPilgrim)).toBe("Belum terdaftar paket");
    expect(journeySummary(oldPilgrim)).toBeNull();
  });

  it("uses the real booking number and active departure", () => {
    const profile: AccountProfile = { ...oldPilgrim, jamaahNumber: "JW-031026-01", journey: { departureDate: "2026-10-03", departureLabel: "3 Oktober 2026", status: "active" } };
    expect(jamaahNumber(profile)).toBe("JW-031026-01");
    expect(journeySummary(profile)).toContain("JW-031026-01");
    expect(journeySummary(profile)).toContain("3 Okt 2026");
  });

  it("builds compact initials for long names", () => {
    expect(profileInitials("Muhammad Ahmad Fauzi")).toBe("MA");
  });
});
