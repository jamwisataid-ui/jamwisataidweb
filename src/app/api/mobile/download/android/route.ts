import { NextResponse } from "next/server";

import { createPrivateDownloadUrl } from "@/lib/management/storage";

export const dynamic = "force-dynamic";

export async function GET() {
  const configuredUrl = process.env.ANDROID_APK_URL?.trim();
  if (configuredUrl) {
    try {
      const url = new URL(configuredUrl);
      if (url.protocol === "https:") {
        return NextResponse.redirect(url, { status: 307 });
      }
    } catch {
      // Invalid configuration is handled with the same user-friendly response below.
    }
  }

  try {
    const objectKey = process.env.ANDROID_APK_OBJECT_KEY?.trim() || "private/mobile/releases/jam-wisata-latest.apk";
    const downloadUrl = await createPrivateDownloadUrl(objectKey, "Jam-Wisata-Android.apk");
    return NextResponse.redirect(downloadUrl, { status: 307 });
  } catch (error) {
    console.error("Android APK download is not available", error);
  }

  return NextResponse.json(
    { error: "Build Android terbaru sedang disiapkan. Silakan coba kembali beberapa saat lagi." },
    { status: 503, headers: { "Cache-Control": "no-store" } },
  );
}
