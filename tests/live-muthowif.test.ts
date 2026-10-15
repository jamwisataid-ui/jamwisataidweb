import { describe, expect, it } from "vitest";

import { MobileApiError } from "../src/lib/mobile/api";
import { assertLiveSessionJoinable } from "../src/lib/mobile/live-session-policy";

describe("assertLiveSessionJoinable", () => {
  it("allows an active room with remaining capacity", () => {
    expect(() => assertLiveSessionJoinable({ status: "live", listenerCount: 38, capacity: 45 })).not.toThrow();
  });

  it.each([
    ["scheduled", "LIVE_SESSION_NOT_STARTED"],
    ["ended", "LIVE_SESSION_ENDED"],
    ["cancelled", "LIVE_SESSION_ENDED"],
  ] as const)("rejects a %s session", (status, code) => {
    try { assertLiveSessionJoinable({ status, listenerCount: 0, capacity: 45 }); }
    catch (error) { expect(error).toBeInstanceOf(MobileApiError); expect((error as MobileApiError).code).toBe(code); }
  });

  it("rejects a full room", () => {
    expect(() => assertLiveSessionJoinable({ status: "live", listenerCount: 45, capacity: 45 })).toThrowError("Sesi sedang penuh");
  });
});
