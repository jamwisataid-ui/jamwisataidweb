import { describe, expect, it } from "vitest";
import { apkVersionUrl, isNewerAppVersion } from "../src/lib/apk-updates";

describe("native APK updates", () => {
  it("compares semantic app versions", () => {
    expect(isNewerAppVersion("1.1.0", "1.0.9")).toBe(true);
    expect(isNewerAppVersion("1.0.0", "1.0.0")).toBe(false);
    expect(isNewerAppVersion("1.0.9", "1.1.0")).toBe(false);
    expect(isNewerAppVersion("invalid", "1.0.0")).toBe(false);
  });

  it("derives the version endpoint from the APK URL", () => {
    expect(apkVersionUrl("https://www.jamwisata.id/api/mobile/download/android"))
      .toBe("https://www.jamwisata.id/api/mobile/download/android/version");
    expect(apkVersionUrl("http://localhost:3000/api/mobile/download/android")).toBeNull();
    expect(apkVersionUrl("invalid-url")).toBeNull();
  });
});
