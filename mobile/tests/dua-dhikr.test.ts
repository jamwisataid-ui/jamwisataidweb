import { describe, expect, it } from "vitest";
import { dhikrTabCollections, doaTabCollections, duaCollections, getDuaItem, selectedItems } from "../src/lib/dua-dhikr";

describe("offline dua and dhikr dataset", () => {
  it("keeps Arabic, Indonesian translation, and source metadata", () => {
    const sample = getDuaItem("morning", "morning-5");
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

  it("starts morning dhikr with the client-approved Al-Baqarah ranges", () => {
    const morning = duaCollections.find((item) => item.id === "morning");
    expect(morning?.items.slice(0, 5).map((item) => item.title)).toEqual([
      "Al-Fatihah (Ayat 1–7)",
      "Al-Baqarah (Ayat 1–5)",
      "Ayat Kursi (Al-Baqarah 255–257)",
      "Al-Baqarah (Ayat 284–286)",
      "Al-Ikhlas",
    ]);
    expect(morning?.items[2].arabic).toContain("﴿٢٥٧﴾");
    expect(morning?.items[3].arabic).toContain("﴿٢٨٤﴾");
  });

  it("keeps evening dhikr unchanged until the client approves the same range update", () => {
    const evening = duaCollections.find((item) => item.id === "evening");
    expect(evening?.items.slice(2, 4).map((item) => item.title)).toEqual([
      "Ayat Kursi",
      "Al-Baqarah (Ayat 285–286)",
    ]);
  });
});
