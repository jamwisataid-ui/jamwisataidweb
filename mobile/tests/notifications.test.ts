import { describe, expect, it } from "vitest";

import { notificationDeepLink } from "../src/lib/notification-links";

describe("notification deep links", () => {
  it("accepts supported internal destinations", () => {
    expect(notificationDeepLink("/documents")).toBe("/documents");
    expect(notificationDeepLink("/journey?tab=important")).toBe("/journey?tab=important");
    expect(notificationDeepLink("/payment/123e4567-e89b-12d3-a456-426614174000")).toContain("/payment/");
  });

  it("rejects external and unknown destinations", () => {
    expect(notificationDeepLink("https://example.com")).toBeNull();
    expect(notificationDeepLink("/admin/manajemen")).toBeNull();
    expect(notificationDeepLink("/payment/not-a-uuid")).toBeNull();
  });
});
