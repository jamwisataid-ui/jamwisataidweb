import { describe, expect, it } from "vitest";
import { dhikrTabCollections, doaTabCollections, duaCollections, getDuaItem, selectedItems } from "../src/lib/dua-dhikr";

describe("offline dua and dhikr dataset", () => {
  it("keeps Arabic, Indonesian translation, and source metadata", () => {
    const sample = getDuaItem("morning", "morning-1");
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
});
