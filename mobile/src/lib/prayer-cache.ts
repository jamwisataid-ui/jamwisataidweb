import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

import type { PrayerTimes } from "@/types";

const prefix = "jamwisata_prayer_cache_v1";
const locationKey = "jamwisata_prayer_location_v1";
export type PrayerCache = { savedAt: string; data: PrayerTimes };
const key = (location: string, date: string) => `${prefix}_${location}_${date}`;

async function read(key: string) {
  return Platform.OS === "web" ? (typeof window === "undefined" ? null : window.localStorage.getItem(key)) : SecureStore.getItemAsync(key);
}

async function write(key: string, value: string) {
  if (Platform.OS === "web") { if (typeof window !== "undefined") window.localStorage.setItem(key, value); return; }
  await SecureStore.setItemAsync(key, value);
}

export async function loadPrayerCache(location: string, date: string): Promise<PrayerCache | null> {
  try {
    const cacheKey = key(location, date);
    const raw = await read(cacheKey);
    return raw ? JSON.parse(raw) as PrayerCache : null;
  } catch { return null; }
}

export async function savePrayerCache(location: string, date: string, data: PrayerTimes) {
  const cacheKey = key(location, date);
  const value = JSON.stringify({ savedAt: new Date().toISOString(), data });
  await write(cacheKey, value);
}

export async function loadPrayerLocation() {
  try { return await read(locationKey); } catch { return null; }
}

export async function savePrayerLocation(location: string) {
  try { await write(locationKey, location); } catch { /* preference persistence is best effort */ }
}
