export function isNewerAppVersion(latest: string, installed: string) {
  const parse = (value: string) => /^\d+\.\d+\.\d+$/.test(value) ? value.split(".").map(Number) : null;
  const latestParts = parse(latest);
  const installedParts = parse(installed);
  if (!latestParts || !installedParts) return false;
  for (let index = 0; index < 3; index += 1) {
    if (latestParts[index] !== installedParts[index]) return latestParts[index] > installedParts[index];
  }
  return false;
}

export function apkVersionUrl(downloadUrl: string) {
  try {
    const url = new URL(downloadUrl);
    if (url.protocol !== "https:") return null;
    url.pathname = `${url.pathname.replace(/\/$/, "")}/version`;
    return url.toString();
  } catch {
    return null;
  }
}
