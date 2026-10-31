import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("security regressions", () => {
  it("keeps mobile login throttling caller-scoped without locking the victim account", () => {
    const source = readFileSync("src/app/api/mobile/v1/auth/login/route.ts", "utf8");
    expect(source).toContain("mobile-login|");
    expect(source).toContain("authRateLimits");
    expect(source).toContain("DUMMY_PIN_HASH");
    expect(source).not.toContain("ACCOUNT_LOCKED");
    expect(source).not.toContain("status: attempts >=");
  });

  it("does not convert an existing pilgrim from an anonymous referral submission", () => {
    const source = readFileSync("src/app/api/referral-leads/route.ts", "utf8");
    expect(source).toContain('status: "new"');
    expect(source).toContain("convertedPilgrimId: null");
    expect(source).not.toContain("findMatchingContact");
    expect(source).not.toContain("select().from(pilgrims)");
  });

  it("serializes duplicate registration checks inside the write transaction", () => {
    const source = readFileSync("src/app/api/mobile/v1/registrations/route.ts", "utf8");
    const transaction = source.indexOf("withManagementTransaction");
    const lock = source.indexOf("pg_advisory_xact_lock", transaction);
    const duplicateCheck = source.indexOf("existingRegistrations", transaction);
    const bookingInsert = source.indexOf("tx.insert(bookings)", transaction);
    expect(lock).toBeGreaterThan(transaction);
    expect(duplicateCheck).toBeGreaterThan(lock);
    expect(bookingInsert).toBeGreaterThan(duplicateCheck);
  });

  it("clears account queries and namespaces sensitive registration drafts", () => {
    const authStore = readFileSync("mobile/src/lib/auth-store.ts", "utf8");
    const drafts = readFileSync("mobile/src/lib/registration-draft.ts", "utf8");
    expect(authStore.match(/clearAccountQueries\(\)/g)?.length).toBeGreaterThanOrEqual(2);
    expect(authStore.match(/clearAllRegistrationDrafts\(\)/g)?.length).toBeGreaterThanOrEqual(2);
    expect(drafts).toContain("encodeURIComponent(ownerId)");
    expect(drafts).toContain("INDEX_KEY");
  });
});
