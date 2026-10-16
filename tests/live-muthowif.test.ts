import { describe, expect, it } from "vitest";

import { MobileApiError } from "../src/lib/mobile/api";
import { assertLiveSessionJoinable } from "../src/lib/mobile/live-session-policy";
import { countJamaahParticipants, liveKitHttpUrl } from "../src/lib/mobile/livekit-room";

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

describe("LiveKit room metrics", () => {
  it.each([
    ["wss://live.example.com", "https://live.example.com"],
    ["ws://127.0.0.1:7880", "http://127.0.0.1:7880"],
    ["https://live.example.com", "https://live.example.com"],
  ])("converts %s to its service URL", (input, expected) => {
    expect(liveKitHttpUrl(input)).toBe(expected);
  });

  it("counts only jamaah and excludes the muthowif publisher", () => {
    expect(countJamaahParticipants([
      { identity: "muthowif-1" },
      { identity: "jamaah-1" },
      { identity: "jamaah-2" },
    ])).toBe(2);
  });
});
