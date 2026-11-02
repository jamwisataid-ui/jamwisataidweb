import { describe, expect, it } from "vitest";
import { repeatCount } from "../src/lib/dhikr-reader";

describe("dhikr reader", () => {
  it("reads the repetition count from notes", () => {
    expect(repeatCount("Dibaca 3x")).toBe(3);
    expect(repeatCount("Dibaca 100x sehari")).toBe(100);
    expect(repeatCount("Dibaca 1x atau 10x di pagi hari, Dibaca 100x dalam sehari")).toBe(1);
  });

  it("falls back to one recitation", () => {
    expect(repeatCount("")).toBe(1);
    expect(repeatCount(null)).toBe(1);
    expect(repeatCount("Dibaca setelah salam")).toBe(1);
  });
});
