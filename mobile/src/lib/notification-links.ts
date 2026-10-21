const supportedDeepLinks = [
  "/(tabs)/account",
  "/(tabs)/notifications",
  "/documents",
  "/journey",
  "/payments",
  "/live-muthowif",
] as const;

export const APP_DOWNLOAD_ACTION = "/download-app";

export function notificationDeepLink(value?: string | null) {
  if (!value) return null;
  const path = value.split("?")[0];
  if (supportedDeepLinks.some((route) => path === route || path.startsWith(`${route}/`))) return value;
  if (/^\/payment\/[0-9a-f-]{36}(?:\?.*)?$/i.test(value)) return value;
  return null;
}

export function notificationDownloadUrl(value?: string | null) {
  if (value !== APP_DOWNLOAD_ACTION) return null;
  const configuredUrl = process.env.EXPO_PUBLIC_ANDROID_APK_URL?.trim();
  if (!configuredUrl) return null;
  try {
    const url = new URL(configuredUrl);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

