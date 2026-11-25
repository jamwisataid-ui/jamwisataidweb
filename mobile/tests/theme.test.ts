import { describe, expect, it } from "vitest";
import { colors, gradients, typography } from "../src/theme";

describe("Jam Wisata mobile brand theme", () => {
  it("uses the client reference palette", () => {
    expect(colors.navy).toBe("#0B2A55");
    expect(colors.navyDeep).toBe("#061B38");
    expect(colors.gold).toBe("#D4AF37");
    expect(colors.goldDark).toBe("#C9971F");
    expect(colors.softGold).toBe("#EDCB66");
    expect(gradients.navy).toEqual(["#061B38", "#0B2A55", "#134A80"]);
    expect(gradients.gold).toEqual(["#FCE9A8", "#F2D06B", "#E2B640", "#D1A12B"]);
    expect(gradients.goldLocations).toEqual([0, 0.3, 0.62, 1]);
  });

  it("uses the website font families for every text role", () => {
    expect(typography.body).toBe("Montserrat_400Regular");
    expect(typography.heading).toBe("Cinzel_700Bold");
    expect(typography.editorial).toBe("CormorantGaramond_500Medium");
    expect(typography.quranLatin).toBe("Georgia");
    expect(typography.quranArabic).toBe("QPCUthmaniHafs");
  });
});

describe("Jam Wisata luxury tokens", () => {
  it("keeps readable gold text and soft radii", async () => {
    const { colors: c, radius } = await import("../src/theme");
    expect(c.goldText).toBe("#8C6708");
    expect(c.ivory).toBe("#E6E7EA");
    expect(radius.button).toBe(12);
    expect(radius.card).toBe(15);
  });
});
