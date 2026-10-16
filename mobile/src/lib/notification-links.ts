const supportedDeepLinks = [
  "/(tabs)/account",
  "/(tabs)/notifications",
  "/documents",
  "/journey",
  "/payments",
  "/live-muthowif",
] as const;

export function notificationDeepLink(value?: string | null) {
  if (!value) return null;
  const path = value.split("?")[0];
  if (supportedDeepLinks.some((route) => path === route || path.startsWith(`${route}/`))) return value;
  if (/^\/payment\/[0-9a-f-]{36}(?:\?.*)?$/i.test(value)) return value;
  return null;
}

