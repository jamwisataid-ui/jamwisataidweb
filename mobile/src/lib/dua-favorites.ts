import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const storageKey = "jamwisata_dua_favorites_v1";
export type DuaFavorite = { id: string; createdAt: string };

async function read() { return Platform.OS === "web" ? (typeof window === "undefined" ? null : window.localStorage.getItem(storageKey)) : SecureStore.getItemAsync(storageKey); }
async function write(value: string) { if (Platform.OS === "web") { if (typeof window !== "undefined") window.localStorage.setItem(storageKey, value); return; } await SecureStore.setItemAsync(storageKey, value); }

export async function loadDuaFavorites(): Promise<DuaFavorite[]> {
  try { const raw = await read(); return raw ? JSON.parse(raw) as DuaFavorite[] : []; } catch { return []; }
}

export async function toggleDuaFavorite(id: string) {
  const current = await loadDuaFavorites();
  const next = current.some((item) => item.id === id) ? current.filter((item) => item.id !== id) : [{ id, createdAt: new Date().toISOString() }, ...current];
  await write(JSON.stringify(next));
  return next;
}
