import { describe, expect, it } from "vitest";

import { notificationDeepLink, notificationDownloadUrl } from "../src/lib/notification-links";

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

  it("resolves the download action only to a configured HTTPS APK URL", () => {
    process.env.EXPO_PUBLIC_ANDROID_APK_URL = "https://www.jamwisata.id/api/mobile/download/android";
    expect(notificationDownloadUrl("/download-app")).toBe("https://www.jamwisata.id/api/mobile/download/android");
    expect(notificationDownloadUrl("https://example.com/app.apk")).toBeNull();
    process.env.EXPO_PUBLIC_ANDROID_APK_URL = "http://download.jamwisata.id/app.apk";
    expect(notificationDownloadUrl("/download-app")).toBeNull();
    delete process.env.EXPO_PUBLIC_ANDROID_APK_URL;
  });
});
