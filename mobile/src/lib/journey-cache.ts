import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

import type { Journey } from "@/types";

const KEY = "jamwisata_journey_cache_v1";
export type JourneyCache = { savedAt: string; data: Journey[] };

export async function loadJourneyCache(): Promise<JourneyCache | null> {
  try {
    const raw = Platform.OS === "web" ? (typeof window === "undefined" ? null : window.localStorage.getItem(KEY)) : await SecureStore.getItemAsync(KEY);
    return raw ? JSON.parse(raw) as JourneyCache : null;
  } catch { return null; }
}

export async function saveJourneyCache(cache: JourneyCache) {
  const value = JSON.stringify(cache);
  if (Platform.OS === "web") { if (typeof window !== "undefined") window.localStorage.setItem(KEY, value); return; }
  await SecureStore.setItemAsync(KEY, value);
}

export async function clearJourneyCache() {
  if (Platform.OS === "web") { if (typeof window !== "undefined") window.localStorage.removeItem(KEY); return; }
  await SecureStore.deleteItemAsync(KEY);
}
