import { readFile, stat } from "node:fs/promises";
import { resolve } from "node:path";
import { config } from "dotenv";

config({ path: ".env.local" });

const filePath = resolve(process.argv[2] || "artifacts/android/jam-wisata-preview-1.0.0.apk");
const objectKey = process.env.ANDROID_APK_OBJECT_KEY?.trim() || "private/mobile/releases/jam-wisata-latest.apk";

async function main() {
  const fileStat = await stat(filePath);
  if (!fileStat.isFile() || fileStat.size < 4) throw new Error("File APK tidak valid.");

  const bytes = new Uint8Array(await readFile(filePath));
  if (bytes[0] !== 0x50 || bytes[1] !== 0x4b || bytes[2] !== 0x03 || bytes[3] !== 0x04) {
    throw new Error("File bukan arsip APK yang valid.");
  }

  const { putPrivateObject } = await import("../src/lib/management/storage");
  await putPrivateObject(objectKey, bytes, "application/vnd.android.package-archive");
  console.log(`APK berhasil diunggah (${Math.round(fileStat.size / 1024 / 1024)} MB).`);
  console.log(`Object key: ${objectKey}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
