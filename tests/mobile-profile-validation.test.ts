import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { mobilePilgrimProfileSchema } from "../src/lib/mobile/validation";

const validProfile = {
  fullName: "Jamaah Uji",
  whatsapp: "081234567890",
  gender: "Laki-laki" as const,
  nationality: "Indonesia",
};

describe("mobile pilgrim date validation", () => {
  it("normalizes Indonesian date input for registration and profile editing", () => {
    const result = mobilePilgrimProfileSchema.parse({ ...validProfile, birthDate: "10021977", passportExpiry: "10/02/2030" });
    expect(result.birthDate).toBe("1977-02-10");
    expect(result.passportExpiry).toBe("2030-02-10");
  });

  it("returns field-specific messages for impossible dates", () => {
    const result = mobilePilgrimProfileSchema.safeParse({ ...validProfile, birthDate: "31-02-1977", passportExpiry: "31-02-2030" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.birthDate?.[0]).toContain("tanggal lahir");
      expect(result.error.flatten().fieldErrors.passportExpiry?.[0]).toContain("masa berlaku paspor");
    }
  });

  it("wires every server field error into the visible registration controls", () => {
    const screen = readFileSync(
      new URL("../mobile/app/register/[departureId].tsx", import.meta.url),
      "utf8",
    );
    for (const field of ["gender", "birthDate", "passportNumber", "passportExpiry"]) {
      expect(screen).toContain(`error={errors.${field}}`);
    }
  });
});
