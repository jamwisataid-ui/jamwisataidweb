import { describe, expect, it } from "vitest";

import { findMatchingContact, findMatchingReferralLead, latestLeadPerPilgrim, referralContactsMatch, type ReferralLeadCandidate } from "../src/lib/management/referral-attribution";

const baseLead: ReferralLeadCandidate = {
  id: "lead-1",
  agentId: "agent-1",
  name: "Calon Jamaah",
  whatsapp: "6281234567890",
  email: null,
  status: "new",
  convertedPilgrimId: null,
  createdAt: new Date("2026-10-01T08:00:00Z"),
};

describe("referral attribution", () => {
  it.each(["081234567890", "62 812-3456-7890", "+62 (812) 3456-7890"])("matches equivalent WhatsApp format %s", (whatsapp) => {
    expect(referralContactsMatch(baseLead, { whatsapp })).toBe(true);
  });

  it("matches email case-insensitively when the WhatsApp differs", () => {
    expect(referralContactsMatch({ ...baseLead, email: "JAMAAH@example.com" }, { whatsapp: "081399999999", email: "jamaah@example.com" })).toBe(true);
  });

  it("prioritizes an exact WhatsApp match over an earlier email match", () => {
    const contacts = [
      { id: "email", whatsapp: "081300000000", email: "same@example.com" },
      { id: "phone", whatsapp: "081299999999", email: null },
    ];
    expect(findMatchingContact(contacts, { whatsapp: "+62 812 9999 9999", email: "same@example.com" })?.id).toBe("phone");
  });

  it("selects the newest open unconverted lead", () => {
    const newest = { ...baseLead, id: "lead-2", createdAt: new Date("2026-10-02T08:00:00Z") };
    const closed = { ...baseLead, id: "lead-3", status: "closed" as const, createdAt: new Date("2026-10-03T08:00:00Z") };
    expect(findMatchingReferralLead([baseLead, newest, closed], { whatsapp: "081234567890" })?.id).toBe("lead-2");
  });

  it("keeps one latest referral lead for each converted pilgrim", () => {
    const rows = [
      { ...baseLead, id: "old", convertedPilgrimId: "pilgrim-1", status: "converted" as const },
      { ...baseLead, id: "new", convertedPilgrimId: "pilgrim-1", status: "converted" as const, createdAt: new Date("2026-10-02T08:00:00Z") },
      { ...baseLead, id: "other", convertedPilgrimId: "pilgrim-2", status: "converted" as const },
    ];
    expect(latestLeadPerPilgrim(rows).map((lead) => lead.id)).toEqual(["new", "other"]);
  });
});
