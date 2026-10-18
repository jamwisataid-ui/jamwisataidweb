import { describe, expect, it } from "vitest";
import { qpcHafsText } from "../src/lib/qpc-hafs-text";

describe("QPC Hafs Arabic text", () => {
  it("uses supported glyphs without changing the canonical text", () => {
    const source = "آمِينَ بِسْمِ ٱللَّهِ";
    const display = qpcHafsText(source);
    expect(display).not.toContain("آ");
    expect(display.normalize("NFC")).toBe(source.normalize("NFC"));
  });
});
