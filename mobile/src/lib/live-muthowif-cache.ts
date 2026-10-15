import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

import type { LiveMuthowifSession } from "@/types";

const KEY = "jamwisata_live_muthowif_cache";
export type LiveMuthowifCache = { savedAt: string; data: LiveMuthowifSession[] };

export async function loadLiveMuthowifCache(): Promise<LiveMuthowifCache | null> {
  const raw = Platform.OS === "web"
    ? (typeof window === "undefined" ? null : window.localStorage.getItem(KEY))
    : await SecureStore.getItemAsync(KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as LiveMuthowifCache; } catch { return null; }
}

export async function saveLiveMuthowifCache(value: LiveMuthowifCache) {
  const raw = JSON.stringify(value);
  if (Platform.OS === "web") {
    if (typeof window !== "undefined") window.localStorage.setItem(KEY, raw);
    return;
  }
  await SecureStore.setItemAsync(KEY, raw);
}

export async function clearLiveMuthowifCache() {
  if (Platform.OS === "web") {
    if (typeof window !== "undefined") window.localStorage.removeItem(KEY);
    return;
  }
  await SecureStore.deleteItemAsync(KEY);
}
