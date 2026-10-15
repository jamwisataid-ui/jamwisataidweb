import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export type QuranBookmark = { surahNumber: number; ayahNumber: number; createdAt: string };
export type LastRead = { surahNumber: number; ayahNumber: number; updatedAt: string };
export type QuranProgress = { bookmarks: QuranBookmark[]; lastRead: LastRead | null };

const storageKey = "jamwisata_quran_progress_v1";
const empty: QuranProgress = { bookmarks: [], lastRead: null };

async function read() {
  return Platform.OS === "web" ? (typeof window === "undefined" ? null : window.localStorage.getItem(storageKey)) : SecureStore.getItemAsync(storageKey);
}

async function write(value: string) {
  if (Platform.OS === "web") { if (typeof window !== "undefined") window.localStorage.setItem(storageKey, value); return; }
  await SecureStore.setItemAsync(storageKey, value);
}

export async function loadQuranProgress(): Promise<QuranProgress> {
  try { const raw = await read(); return raw ? { ...empty, ...JSON.parse(raw) as QuranProgress } : empty; } catch { return empty; }
}

async function update(mutator: (value: QuranProgress) => QuranProgress) {
  const next = mutator(await loadQuranProgress());
  await write(JSON.stringify(next));
  return next;
}

export function toggleQuranBookmark(surahNumber: number, ayahNumber: number) {
  return update((value) => {
    const exists = value.bookmarks.some((item) => item.surahNumber === surahNumber && item.ayahNumber === ayahNumber);
    const bookmarks = exists
      ? value.bookmarks.filter((item) => item.surahNumber !== surahNumber || item.ayahNumber !== ayahNumber)
      : [{ surahNumber, ayahNumber, createdAt: new Date().toISOString() }, ...value.bookmarks];
    return { ...value, bookmarks };
  });
}

export function saveLastRead(surahNumber: number, ayahNumber: number) {
  return update((value) => ({ ...value, lastRead: { surahNumber, ayahNumber, updatedAt: new Date().toISOString() } }));
}
