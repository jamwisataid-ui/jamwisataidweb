import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const mobileDirectory = path.resolve(scriptDirectory, "..");
const quranPath = path.join(mobileDirectory, "src", "data", "quran-id.json");
const dhikrDirectory = path.join(mobileDirectory, "src", "data", "dua");

const quran = JSON.parse(await readFile(quranPath, "utf8"));

const toArabicNumber = (value) => String(value).replace(/\d/g, (digit) => "٠١٢٣٤٥٦٧٨٩"[Number(digit)]);
const verseMarker = (verseNumber) => `﴿${toArabicNumber(verseNumber)}﴾`;

function getVerses(surahNumber, startVerse, endVerse) {
  const surah = quran.find((candidate) => candidate.id === surahNumber);
  if (!surah) throw new Error(`Surah ${surahNumber} tidak ditemukan`);

  const verses = surah.verses.filter((verse) => verse.id >= startVerse && verse.id <= endVerse);
  if (verses.length !== endVerse - startVerse + 1) {
    throw new Error(`Ayat ${surahNumber}:${startVerse}-${endVerse} tidak lengkap`);
  }
  return verses;
}

function quranEntry({ title, surahNumber, startVerse, endVerse, source }) {
  const verses = getVerses(surahNumber, startVerse, endVerse);
  return {
    title,
    arabic: verses.map((verse) => `${verse.text} ${verseMarker(verse.id)}`).join(" "),
    latin: "",
    translation: verses.map((verse) => `${verse.translation} ${verseMarker(verse.id)}`).join(" "),
    notes: "Dibaca 1x",
    source,
  };
}

const openingEntries = [
  quranEntry({
    title: "Al-Fatihah (Ayat 1–7)",
    surahNumber: 1,
    startVerse: 1,
    endVerse: 7,
    source: "QS. Al-Fatihah: 1–7",
  }),
  quranEntry({
    title: "Al-Baqarah (Ayat 1–5)",
    surahNumber: 2,
    startVerse: 1,
    endVerse: 5,
    source: "QS. Al-Baqarah: 1–5",
  }),
];

const shortSurahs = new Map([
  ["Al-Ikhlas", { surahNumber: 112, startVerse: 1, endVerse: 4 }],
  ["Al-Falaq", { surahNumber: 113, startVerse: 1, endVerse: 5 }],
  ["An-Naas", { surahNumber: 114, startVerse: 1, endVerse: 6 }],
]);

function refreshShortSurah(entry) {
  const selection = shortSurahs.get(entry.title);
  if (!selection) return entry;
  const verses = getVerses(selection.surahNumber, selection.startVerse, selection.endVerse);
  return {
    ...entry,
    arabic: verses.map((verse) => `${verse.text} ${verseMarker(verse.id)}`).join(" "),
    translation: verses.map((verse) => `${verse.translation} ${verseMarker(verse.id)}`).join(" "),
  };
}

for (const period of ["morning", "evening"]) {
  const filePath = path.join(dhikrDirectory, `${period}-dhikr.json`);
  const current = JSON.parse(await readFile(filePath, "utf8"));
  const currentAyatKursi = current.find((entry) => entry.title === "Ayat al-Kursi" || entry.title.startsWith("Ayat Kursi"));
  if (!currentAyatKursi) throw new Error(`Ayat Kursi tidak ditemukan di ${period}-dhikr.json`);
  const ayatKursi = period === "morning"
    ? {
        ...currentAyatKursi,
        ...quranEntry({
          title: "Ayat Kursi (Al-Baqarah 255–257)",
          surahNumber: 2,
          startVerse: 255,
          endVerse: 257,
          source: currentAyatKursi.source,
        }),
        fawaid: currentAyatKursi.fawaid,
        source: currentAyatKursi.source,
      }
    : { ...currentAyatKursi, title: "Ayat Kursi" };
  const closingStartVerse = period === "morning" ? 284 : 285;
  const closingBaqarahEntry = quranEntry({
    title: `Al-Baqarah (Ayat ${closingStartVerse}–286)`,
    surahNumber: 2,
    startVerse: closingStartVerse,
    endVerse: 286,
    source: `QS. Al-Baqarah: ${closingStartVerse}–286`,
  });

  const shortSurahEntries = ["Al-Ikhlas", "Al-Falaq", "An-Naas"].map((title) => {
    const entry = current.find((candidate) => candidate.title === title);
    if (!entry) throw new Error(`${title} tidak ditemukan di ${period}-dhikr.json`);
    return refreshShortSurah(entry);
  });

  const replacedTitles = new Set([
    ...openingEntries.map((entry) => entry.title),
    "Al-Baqarah (Ayat 284–286)",
    "Al-Baqarah (Ayat 285–286)",
    "Ayat al-Kursi",
    "Ayat Kursi",
    "Ayat Kursi (Al-Baqarah 255–257)",
    ...shortSurahEntries.map((entry) => entry.title),
  ]);
  const remainingEntries = current.filter((entry) => !replacedTitles.has(entry.title));
  const result = [
    ...openingEntries,
    ayatKursi,
    closingBaqarahEntry,
    ...shortSurahEntries,
    ...remainingEntries,
  ];

  await writeFile(filePath, `${JSON.stringify(result, null, 2)}\n`, "utf8");
}
