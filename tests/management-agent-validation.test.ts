import { describe, expect, it } from "vitest";

import { agentSchema, normalizeWhatsapp } from "../src/lib/management/validation";

const validAgent = {
  name: "Agen Bandung",
  whatsapp: "081234567890",
  email: "",
  referralCode: "agen-bandung",
  defaultCommission: "500000",
};

describe("validasi agen dan referral", () => {
  it.each([
    ["081234567890", "6281234567890"],
    ["62 812-3456-7890", "6281234567890"],
    ["+62 (812) 3456 7890", "6281234567890"],
    ["81234567890", "6281234567890"],
  ])("menormalisasi WhatsApp %s", (input, expected) => {
    expect(normalizeWhatsapp(input)).toBe(expected);
    expect(agentSchema.parse({ ...validAgent, whatsapp: input }).whatsapp).toBe(expected);
  });

  it("menerima email kosong sebagai field opsional", () => {
    expect(agentSchema.parse({ ...validAgent, email: "   " }).email).toBeUndefined();
  });

  it("menormalisasi kode ke huruf kecil dan menolak format yang tidak aman", () => {
    expect(agentSchema.parse({ ...validAgent, referralCode: "Agen-Bandung-01" }).referralCode).toBe("agen-bandung-01");
    expect(agentSchema.safeParse({ ...validAgent, referralCode: "agen_bandung" }).success).toBe(false);
    expect(agentSchema.safeParse({ ...validAgent, referralCode: "-agen-" }).success).toBe(false);
  });

  it("menolak WhatsApp, email, dan komisi yang tidak valid pada field masing-masing", () => {
    const result = agentSchema.safeParse({ ...validAgent, whatsapp: "123", email: "bukan-email", defaultCommission: "750000" });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.flatten().fieldErrors).toMatchObject({
      whatsapp: [expect.any(String)],
      email: ["Format email tidak valid."],
      defaultCommission: ["Komisi hanya Rp500.000 atau Rp1.000.000."],
    });
  });
});
