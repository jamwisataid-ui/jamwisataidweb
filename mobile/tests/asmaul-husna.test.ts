import { describe, expect, it } from "vitest";
import { asmaulHusna, searchAsmaulHusna } from "../src/data/asmaul-husna";

describe("Asmaul Husna", () => {
  it("contains the 99 names in order", () => {
    expect(asmaulHusna).toHaveLength(99);
    asmaulHusna.forEach((item, index) => expect(item.number).toBe(index + 1));
    expect(new Set(asmaulHusna.map((item) => item.arabic)).size).toBe(99);
  });

  it("searches by number, latin and meaning", () => {
    expect(searchAsmaulHusna("1")[0].latin).toBe("Ar-Rahman");
    expect(searchAsmaulHusna("quddus").map((item) => item.number)).toEqual([4]);
    expect(searchAsmaulHusna("pengampun").map((item) => item.number)).toEqual([14, 34]);
    expect(searchAsmaulHusna("")).toHaveLength(99);
  });
});
