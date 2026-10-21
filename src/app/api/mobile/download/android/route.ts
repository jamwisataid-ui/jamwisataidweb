import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export function GET() {
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

  return NextResponse.json(
    { error: "Build Android terbaru sedang disiapkan. Silakan coba kembali beberapa saat lagi." },
    { status: 503, headers: { "Cache-Control": "no-store" } },
  );
}
