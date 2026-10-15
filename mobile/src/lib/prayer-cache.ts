import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

import type { PrayerTimes } from "@/types";

const prefix = "jamwisata_prayer_cache_v1";
export type PrayerCache = { savedAt: string; data: PrayerTimes };
const key = (location: string, date: string) => `${prefix}_${location}_${date}`;

export async function loadPrayerCache(location: string, date: string): Promise<PrayerCache | null> {
  try {
    const cacheKey = key(location, date);
    const raw = Platform.OS === "web" ? (typeof window === "undefined" ? null : window.localStorage.getItem(cacheKey)) : await SecureStore.getItemAsync(cacheKey);
    return raw ? JSON.parse(raw) as PrayerCache : null;
  } catch { return null; }
}

export async function savePrayerCache(location: string, date: string, data: PrayerTimes) {
  const cacheKey = key(location, date);
  const value = JSON.stringify({ savedAt: new Date().toISOString(), data });
  if (Platform.OS === "web") { if (typeof window !== "undefined") window.localStorage.setItem(cacheKey, value); return; }
  await SecureStore.setItemAsync(cacheKey, value);
}
