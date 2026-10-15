import type { PrayerTimes } from "@/types";

export const prayerLocations = [
  { id: "makkah", city: "Makkah", country: "Arab Saudi", timezone: "Asia/Riyadh" },
  { id: "madinah", city: "Madinah", country: "Arab Saudi", timezone: "Asia/Riyadh" },
  { id: "jeddah", city: "Jeddah", country: "Arab Saudi", timezone: "Asia/Riyadh" },
  { id: "bandung", city: "Bandung", country: "Indonesia", timezone: "Asia/Jakarta" },
  { id: "jakarta", city: "Jakarta", country: "Indonesia", timezone: "Asia/Jakarta" },
  { id: "doha", city: "Doha", country: "Qatar", timezone: "Asia/Qatar" },
  { id: "istanbul", city: "Istanbul", country: "Turki", timezone: "Europe/Istanbul" },
] as const;

export type PrayerLocation = typeof prayerLocations[number];
export type PrayerKey = keyof PrayerTimes["times"];

export const prayerRows: Array<{ key: PrayerKey; name: string; icon: "moon-outline" | "sunny-outline" | "partly-sunny-outline" }> = [
  { key: "fajr", name: "Subuh", icon: "moon-outline" },
  { key: "sunrise", name: "Terbit", icon: "sunny-outline" },
  { key: "dhuhr", name: "Dzuhur", icon: "sunny-outline" },
  { key: "asr", name: "Ashar", icon: "partly-sunny-outline" },
  { key: "maghrib", name: "Maghrib", icon: "partly-sunny-outline" },
  { key: "isha", name: "Isya", icon: "moon-outline" },
];

export const hijriMonths = ["Muharam", "Safar", "Rabiul Awal", "Rabiul Akhir", "Jumadil Awal", "Jumadil Akhir", "Rajab", "Syakban", "Ramadan", "Syawal", "Zulkaidah", "Zulhijah"];

export function dateInTimezone(timezone: string, now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(now);
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${value.year}-${value.month}-${value.day}`;
}

export function minutesInTimezone(timezone: string, now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: timezone, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(now);
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return Number(value.hour) * 60 + Number(value.minute);
}

export function nextPrayer(times: PrayerTimes["times"], timezone: string, now = new Date()): { key: PrayerKey; tomorrow: boolean } {
  const current = minutesInTimezone(timezone, now);
  for (const row of prayerRows.filter((item) => item.key !== "sunrise")) {
    const [hour, minute] = times[row.key].split(":").map(Number);
    if (hour * 60 + minute > current) return { key: row.key, tomorrow: false };
  }
  return { key: "fajr", tomorrow: true };
}

export function qiblaBearing(latitude: number, longitude: number) {
  const toRadians = (degree: number) => degree * Math.PI / 180;
  const kaabaLatitude = toRadians(21.4225);
  const longitudeDelta = toRadians(39.8262 - longitude);
  const originLatitude = toRadians(latitude);
  const y = Math.sin(longitudeDelta);
  const x = Math.cos(originLatitude) * Math.tan(kaabaLatitude) - Math.sin(originLatitude) * Math.cos(longitudeDelta);
  return Math.round((Math.atan2(y, x) * 180 / Math.PI + 360) % 360);
}
