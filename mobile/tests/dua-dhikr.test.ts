import { describe, expect, it } from "vitest";
import { dhikrTabCollections, doaTabCollections, duaCollections, getDuaItem, selectedItems } from "../src/lib/dua-dhikr";

describe("offline dua and dhikr dataset", () => {
  it("keeps Arabic, Indonesian translation, and source metadata", () => {
    const sample = getDuaItem("morning", "morning-3");
    expect(sample?.arabic.length).toBeGreaterThan(20);
    expect(sample?.latin.length).toBeGreaterThan(20);
    expect(sample?.translation.length).toBeGreaterThan(20);
    expect(sample?.source).toMatch(/HR\./);
  });

  it("contains the requested browsing groups", () => {
    expect(duaCollections.map((item) => item.id)).toEqual(expect.arrayContaining(["daily", "travel", "sacred-land", "after-salah", "selected", "morning", "evening"]));
    expect(dhikrTabCollections).toHaveLength(3);
    expect(doaTabCollections.length).toBeGreaterThanOrEqual(5);
  });

  it("curates travel and sacred-land content for pilgrims", () => {
    expect(selectedItems.some((item) => /Ka'bah/i.test(item.title))).toBe(true);
    expect(selectedItems.some((item) => /kendaraan/i.test(item.title))).toBe(true);
  });

  it("starts morning and evening dhikr in the Al-Ma'tsurat order", () => {
    const expectedOpening = [
      "Al-Fatihah (Ayat 1–7)",
      "Al-Baqarah (Ayat 1–5)",
      "Ayat Kursi",
      "Al-Baqarah (Ayat 285–286)",
      "Al-Ikhlas",
    ];

    for (const collectionId of ["morning", "evening"]) {
      const collection = duaCollections.find((item) => item.id === collectionId);
      expect(collection?.items.slice(0, 5).map((item) => item.title)).toEqual(expectedOpening);
    }
  });
});
