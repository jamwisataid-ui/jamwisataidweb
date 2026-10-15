import dailyRaw from "../data/dua/daily-dua.json";
import afterSalahRaw from "../data/dua/dhikr-after-salah.json";
import eveningRaw from "../data/dua/evening-dhikr.json";
import morningRaw from "../data/dua/morning-dhikr.json";
import sacredLandRaw from "../data/dua/sacred-land.json";
import selectedRaw from "../data/dua/selected-dua.json";
import travelRaw from "../data/dua/travel-dua.json";

export type DuaKind = "dua" | "dhikr";
export type DuaRaw = { title: string; arabic: string; latin?: string | null; translation: string; notes?: string | null; fawaid?: string | null; source?: string | null };
export type DuaItem = Required<Omit<DuaRaw, "latin" | "notes" | "fawaid" | "source">> & { id: string; collectionId: string; kind: DuaKind; latin: string; notes: string; fawaid: string; source: string };
export type DuaCollection = { id: string; title: string; subtitle: string; icon: "book-outline" | "navigate-outline" | "location-outline" | "sunny-outline" | "moon-outline" | "sparkles-outline"; kind: DuaKind; items: DuaItem[] };

function items(collectionId: string, kind: DuaKind, values: DuaRaw[]): DuaItem[] {
  return values.map((item, index) => ({ ...item, id: `${collectionId}-${index + 1}`, collectionId, kind, latin: item.latin ?? "", notes: item.notes ?? "", fawaid: item.fawaid ?? "", source: item.source ?? "" }));
}

export const duaCollections: DuaCollection[] = [
  { id: "daily", title: "Doa Harian", subtitle: "Kumpulan doa sehari-hari", icon: "book-outline", kind: "dua", items: items("daily", "dua", dailyRaw) },
  { id: "travel", title: "Doa dalam Perjalanan", subtitle: "Doa safar, kendaraan, dan perlindungan", icon: "navigate-outline", kind: "dua", items: items("travel", "dua", travelRaw) },
  { id: "sacred-land", title: "Doa di Tanah Suci", subtitle: "Doa Makkah, Madinah, Thawaf, dan Sa'i", icon: "location-outline", kind: "dua", items: items("sacred-land", "dua", sacredLandRaw) },
  { id: "after-salah", title: "Doa Setelah Sholat", subtitle: "Dzikir dan doa setelah sholat", icon: "sparkles-outline", kind: "dhikr", items: items("after-salah", "dhikr", afterSalahRaw) },
  { id: "selected", title: "Doa Pilihan", subtitle: "Doa terpilih dari Al-Qur'an dan Hadits", icon: "sparkles-outline", kind: "dua", items: items("selected", "dua", selectedRaw) },
  { id: "morning", title: "Dzikir Pagi", subtitle: "Bacaan dzikir pada waktu pagi", icon: "sunny-outline", kind: "dhikr", items: items("morning", "dhikr", morningRaw) },
  { id: "evening", title: "Dzikir Petang", subtitle: "Bacaan dzikir pada waktu petang", icon: "moon-outline", kind: "dhikr", items: items("evening", "dhikr", eveningRaw) },
];

export const doaTabCollections = duaCollections.filter((collection) => ["daily", "travel", "sacred-land", "after-salah", "selected"].includes(collection.id));
export const dhikrTabCollections = duaCollections.filter((collection) => ["morning", "evening", "after-salah"].includes(collection.id));
export const selectedItems = [...(duaCollections.find((item) => item.id === "sacred-land")?.items ?? []), ...(duaCollections.find((item) => item.id === "travel")?.items.slice(0, 4) ?? []), ...(duaCollections.find((item) => item.id === "selected")?.items ?? [])];

export function getDuaCollection(id: string) { return duaCollections.find((collection) => collection.id === id); }
export function getDuaItem(collectionId: string, itemId: string) { return getDuaCollection(collectionId)?.items.find((item) => item.id === itemId); }
export function getDuaItemById(itemId: string) { return duaCollections.flatMap((collection) => collection.items).find((item) => item.id === itemId); }
