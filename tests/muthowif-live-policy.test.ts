import { describe, expect, it } from "vitest";

import { MobileApiError } from "../src/lib/mobile/api";
import { assertMuthowifSessionBroadcastable, clampLiveListenerCount } from "../src/lib/mobile/muthowif-live-policy";

describe("muthowif live policy", () => {
  it.each(["scheduled", "live"] as const)("allows a %s session to connect", (status) => {
    expect(() => assertMuthowifSessionBroadcastable(status)).not.toThrow();
  });

  it.each(["ended", "cancelled"] as const)("rejects a %s session", (status) => {
    try { assertMuthowifSessionBroadcastable(status); }
    catch (error) { expect(error).toBeInstanceOf(MobileApiError); expect((error as MobileApiError).code).toBe("LIVE_SESSION_ENDED"); }
  });

  it("keeps listener metrics inside room capacity", () => {
    expect(clampLiveListenerCount(38, 45)).toBe(38);
    expect(clampLiveListenerCount(80, 45)).toBe(45);
    expect(clampLiveListenerCount(-2, 45)).toBe(0);
  });
});
