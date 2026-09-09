import { describe, expect, it } from "vitest";
import { applyHppMasterPrices, calculateHpp, DEFAULT_HPP_ITEMS, hppMasterCode, itemCostPerPax, roundSellingPrice } from "../src/lib/management/hpp";

describe("HPP Umrah", () => {
  it("mereproduksi golden case MUHASIB 35 pax", () => {
    const result = calculateHpp({ paxCount: 35, usdRate: 17_649, sarRate: 4_817, profitMargin: 1_000_000, marketingFee: 1_000_000, items: DEFAULT_HPP_ITEMS });
    expect(result.subtotalBase).toBeCloseTo(27_114_468.5714, 2);
    expect(result.focTourLeader).toBeCloseTo(774_699.102, 2);
    expect(result.hppPerPax).toBeCloseTo(27_889_167.6734, 2);
    expect(result.sellingPrice).toBeCloseTo(29_889_167.6734, 2);
  });

  it("membedakan biaya jamaah, rombongan, dan kamar", () => {
    const rates = { paxCount: 40, usdRate: 16_000, sarRate: 4_000 };
    expect(itemCostPerPax({ code: "a", category: "x", name: "Visa", currency: "USD", costBasis: "per_pax", unitAmount: 100, quantity: 1 }, rates)).toBe(1_600_000);
    expect(itemCostPerPax({ code: "b", category: "x", name: "Bus", currency: "IDR", costBasis: "group", unitAmount: 12_000_000, quantity: 1 }, rates)).toBe(300_000);
    expect(itemCostPerPax({ code: "c", category: "x", name: "Hotel", currency: "SAR", costBasis: "room_per_night", unitAmount: 1_000, quantity: 4, occupancy: 4 }, rates)).toBe(4_000_000);
  });

  it("menolak pax nol dan membulatkan harga jual ke atas", () => {
    expect(() => calculateHpp({ paxCount: 0, usdRate: 1, sarRate: 1, profitMargin: 0, marketingFee: 0, items: DEFAULT_HPP_ITEMS })).toThrow("Jumlah jamaah");
    expect(roundSellingPrice(29_889_167.67)).toBe(29_900_000);
  });

  it("membuat kode master yang aman dan konsisten", () => {
    expect(hppMasterCode("hotel_makkah", "Mövenpick Hotel *****", "A1B2-C3D4-E5F6")).toBe("hotel_makkah-movenpick-hotel-a1b2c3d4");
  });

  it("menghubungkan harga, jumlah, mata uang, dan cara hitung dari master", () => {
    const items = applyHppMasterPrices(DEFAULT_HPP_ITEMS, [{ code: "main_ticket", name: "Tiket utama", currency: "IDR", costBasis: "per_pax", amount: 16_000_000, metadata: { defaultQuantity: 2 } }]);
    const ticket = items.find((item) => item.code === "main_ticket");
    expect(ticket).toMatchObject({ unitAmount: 16_000_000, quantity: 2, costBasis: "per_pax" });
    expect(itemCostPerPax(ticket!, { paxCount: 35, usdRate: 17_000, sarRate: 4_500 })).toBe(32_000_000);
  });

  it("menghitung bus berangkat dan datang per jamaah", () => {
    const buses = DEFAULT_HPP_ITEMS.filter((item) => item.code === "departure_bus" || item.code === "arrival_bus");
    expect(buses.every((item) => item.costBasis === "per_pax")).toBe(true);
    expect(itemCostPerPax({ ...buses[0], unitAmount: 250_000, quantity: 2 }, { paxCount: 40, usdRate: 1, sarRate: 1 })).toBe(500_000);
  });

  it("harga jual final selalu sama dengan HPP ditambah keuntungan dan fee", () => {
    const result = calculateHpp({ paxCount: 35, usdRate: 17_649, sarRate: 4_817, profitMargin: 2_500_000, marketingFee: 500_000, items: DEFAULT_HPP_ITEMS });
    expect(result.sellingPrice).toBeCloseTo(result.hppPerPax + 3_000_000, 5);
  });
});
