import { describe, expect, it } from "vitest";

import { filterSurahs, getSurah, juz, revelationLabel, surahs } from "../src/lib/quran";

describe("offline Quran dataset", () => {
  it("contains all 114 surahs and 6,236 verses", () => {
    expect(surahs).toHaveLength(114);
    expect(surahs.reduce((total, surah) => total + surah.verses.length, 0)).toBe(6236);
    expect(getSurah(1)?.verses[0].text).toContain("ٱللَّهِ");
    expect(getSurah(114)?.transliteration).toBe("An-Nas");
  });

  it("searches by name, number, and Indonesian meaning", () => {
    expect(filterSurahs("baqarah")[0]?.id).toBe(2);
    expect(filterSurahs("114")[0]?.transliteration).toBe("An-Nas");
    expect(filterSurahs("sapi betina")[0]?.id).toBe(2);
  });

  it("contains 30 juz entry points and Indonesian revelation labels", () => {
    expect(juz).toHaveLength(30);
    expect(juz[29].slice(0, 2)).toEqual([78, 1]);
    expect(revelationLabel("meccan")).toBe("Makkiyah");
    expect(revelationLabel("medinan")).toBe("Madaniyah");
  });
});
