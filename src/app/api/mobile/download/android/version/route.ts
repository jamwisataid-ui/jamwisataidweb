import { NextResponse } from "next/server";

import { getPrivateObjectMetadata } from "@/lib/management/storage";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const objectKey = process.env.ANDROID_APK_OBJECT_KEY?.trim() || "private/mobile/releases/jam-wisata-latest.apk";
    const metadata = await getPrivateObjectMetadata(objectKey);
    const version = metadata.version;
    if (version && /^\d+\.\d+\.\d+$/.test(version)) {
      return NextResponse.json({ version }, { headers: { "Cache-Control": "no-store" } });
    }
  } catch (error) {
    console.error("Android APK version is not available", error);
  }

  return NextResponse.json({ error: "Versi APK belum tersedia." }, { status: 503, headers: { "Cache-Control": "no-store" } });
}
