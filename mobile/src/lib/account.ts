import type { AccountProfile } from "@/types";

export function profileInitials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "JW";
}

export function jamaahNumber(profile: AccountProfile) {
  return profile.jamaahNumber || "Belum terdaftar paket";
}

export function journeySummary(profile: AccountProfile) {
  if (!profile.journey?.departureDate) return null;
  const date = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Jakarta" }).format(new Date(`${profile.journey.departureDate}T00:00:00+07:00`));
  return `Berangkat ${date}${profile.jamaahNumber ? ` · ${profile.jamaahNumber}` : ""}`;
}
