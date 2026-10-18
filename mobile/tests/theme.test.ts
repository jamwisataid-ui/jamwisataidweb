import { describe, expect, it } from "vitest";
import { colors, gradients, typography } from "../src/theme";

describe("Jam Wisata mobile brand theme", () => {
  it("uses the same primary palette as the public website", () => {
    expect(colors.navy).toBe("#0A1D3A");
    expect(colors.navyDeep).toBe("#06152B");
    expect(colors.gold).toBe("#D4AF37");
    expect(colors.goldDark).toBe("#B8860B");
    expect(colors.softGold).toBe("#E8C967");
    expect(gradients.navy).toEqual(["#06152B", "#0A1D3A", "#1E3A5F"]);
    expect(gradients.gold).toEqual(["#8C6708", "#B8860B", "#D4AF37", "#F5D97A", "#D4AF37", "#B8860B", "#8C6708"]);
    expect(gradients.goldLocations).toEqual([0, 0.18, 0.4, 0.58, 0.76, 0.92, 1]);
  });

  it("uses the website font families for every text role", () => {
    expect(typography.body).toBe("Montserrat_400Regular");
    expect(typography.heading).toBe("Cinzel_700Bold");
    expect(typography.editorial).toBe("CormorantGaramond_500Medium");
    expect(typography.quranLatin).toBe("Georgia");
    expect(typography.quranArabic).toBe("QPCUthmaniHafs");
  });
});
