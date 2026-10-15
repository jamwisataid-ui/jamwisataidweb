export const prayerLocations = {
  makkah: { id: "makkah", city: "Makkah", country: "Arab Saudi", apiCountry: "Saudi Arabia", timezone: "Asia/Riyadh", latitude: 21.4225, longitude: 39.8262, method: 4 },
  madinah: { id: "madinah", city: "Madinah", country: "Arab Saudi", apiCountry: "Saudi Arabia", timezone: "Asia/Riyadh", latitude: 24.4672, longitude: 39.6111, method: 4 },
  jeddah: { id: "jeddah", city: "Jeddah", country: "Arab Saudi", apiCountry: "Saudi Arabia", timezone: "Asia/Riyadh", latitude: 21.5433, longitude: 39.1728, method: 4 },
  bandung: { id: "bandung", city: "Bandung", country: "Indonesia", apiCountry: "Indonesia", timezone: "Asia/Jakarta", latitude: -6.9175, longitude: 107.6191, method: 20 },
  jakarta: { id: "jakarta", city: "Jakarta", country: "Indonesia", apiCountry: "Indonesia", timezone: "Asia/Jakarta", latitude: -6.2088, longitude: 106.8456, method: 20 },
  doha: { id: "doha", city: "Doha", country: "Qatar", apiCountry: "Qatar", timezone: "Asia/Qatar", latitude: 25.2854, longitude: 51.531, method: 10 },
  istanbul: { id: "istanbul", city: "Istanbul", country: "Turki", apiCountry: "Turkey", timezone: "Europe/Istanbul", latitude: 41.0082, longitude: 28.9784, method: 13 },
} as const;

export type PrayerLocationId = keyof typeof prayerLocations;

export function dateInTimezone(timezone: string, now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(now);
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${value.year}-${value.month}-${value.day}`;
}
