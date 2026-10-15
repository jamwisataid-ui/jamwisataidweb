import quranData from "../data/quran-id.json";

export type QuranVerse = { id: number; text: string; translation: string };
export type QuranSurah = {
  id: number;
  name: string;
  transliteration: string;
  translation: string;
  type: "meccan" | "medinan";
  total_verses: number;
  verses: QuranVerse[];
};

export const surahs = quranData as QuranSurah[];

export const juz = [
  [1, 1, "Al-Fatihah 1 → Al-Baqarah 141"], [2, 142, "Al-Baqarah 142 → Al-Baqarah 252"],
  [2, 253, "Al-Baqarah 253 → Ali 'Imran 92"], [3, 93, "Ali 'Imran 93 → An-Nisa' 23"],
  [4, 24, "An-Nisa' 24 → An-Nisa' 147"], [4, 148, "An-Nisa' 148 → Al-Ma'idah 81"],
  [5, 82, "Al-Ma'idah 82 → Al-An'am 110"], [6, 111, "Al-An'am 111 → Al-A'raf 87"],
  [7, 88, "Al-A'raf 88 → Al-Anfal 40"], [8, 41, "Al-Anfal 41 → At-Taubah 92"],
  [9, 93, "At-Taubah 93 → Hud 5"], [11, 6, "Hud 6 → Yusuf 52"],
  [12, 53, "Yusuf 53 → Ibrahim 52"], [15, 1, "Al-Hijr 1 → An-Nahl 128"],
  [17, 1, "Al-Isra' 1 → Al-Kahf 74"], [18, 75, "Al-Kahf 75 → Taha 135"],
  [21, 1, "Al-Anbiya' 1 → Al-Hajj 78"], [23, 1, "Al-Mu'minun 1 → Al-Furqan 20"],
  [25, 21, "Al-Furqan 21 → An-Naml 55"], [27, 56, "An-Naml 56 → Al-'Ankabut 45"],
  [29, 46, "Al-'Ankabut 46 → Al-Ahzab 30"], [33, 31, "Al-Ahzab 31 → Yasin 27"],
  [36, 28, "Yasin 28 → Az-Zumar 31"], [39, 32, "Az-Zumar 32 → Fussilat 46"],
  [41, 47, "Fussilat 47 → Al-Jasiyah 37"], [46, 1, "Al-Ahqaf 1 → Az-Zariyat 30"],
  [51, 31, "Az-Zariyat 31 → Al-Hadid 29"], [58, 1, "Al-Mujadilah 1 → At-Tahrim 12"],
  [67, 1, "Al-Mulk 1 → Al-Mursalat 50"], [78, 1, "An-Naba' 1 → An-Nas 6"],
] as const;

export function getSurah(number: number) { return surahs.find((surah) => surah.id === number); }
export function revelationLabel(type: QuranSurah["type"]) { return type === "meccan" ? "Makkiyah" : "Madaniyah"; }
export function filterSurahs(query: string) {
  const value = query.trim().toLocaleLowerCase("id-ID");
  if (!value) return surahs;
  return surahs.filter((surah) => [String(surah.id), surah.transliteration, surah.translation].some((field) => field.toLocaleLowerCase("id-ID").includes(value)));
}
