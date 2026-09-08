import { config } from "dotenv";
import { getMuhasibMasterData } from "./extract-muhasib";

config({ path: ".env.local" });

async function seedHotels() {
  const [{ requireDatabase }, schema] = await Promise.all([
    import("../src/db/index"),
    import("../src/db/schema"),
  ]);
  const database = requireDatabase();

  const data = await getMuhasibMasterData();
  console.log(`Loading ${data.makkahHotels.length} Makkah hotels...`);
  console.log(`Loading ${data.madinahHotels.length} Madinah hotels...`);
  console.log(`Loading ${data.laPackages.length} LA packages...`);

  // 1. Insert Makkah Hotels
  let makkahSort = 400;
  for (const h of data.makkahHotels) {
    makkahSort += 10;
    const cleanSlug = h.name.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").slice(0, 40);
    const code = `hotel-makkah-${cleanSlug}-${h.no}`;
    
    await database.insert(schema.hppPriceMaster).values({
      code,
      category: "hotel_makkah",
      name: h.name,
      currency: "SAR",
      costBasis: "room_per_night",
      amount: String(h.high || h.medium || h.low),
      sortOrder: makkahSort,
      metadata: {
        roomType: "quad",
        low: h.low,
        medium: h.medium,
        high: h.high,
      }
    }).onConflictDoUpdate({
      target: schema.hppPriceMaster.code,
      set: {
        name: h.name,
        amount: String(h.high || h.medium || h.low),
        metadata: {
          roomType: "quad",
          low: h.low,
          medium: h.medium,
          high: h.high,
        }
      }
    });
  }

  // 2. Insert Madinah Hotels
  let madinahSort = 600;
  for (const h of data.madinahHotels) {
    madinahSort += 10;
    const cleanSlug = h.name.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").slice(0, 40);
    const code = `hotel-madinah-${cleanSlug}-${h.no}`;

    await database.insert(schema.hppPriceMaster).values({
      code,
      category: "hotel_madinah",
      name: h.name,
      currency: "SAR",
      costBasis: "room_per_night",
      amount: String(h.high || h.medium || h.low),
      sortOrder: madinahSort,
      metadata: {
        roomType: "quad",
        low: h.low,
        medium: h.medium,
        high: h.high,
      }
    }).onConflictDoUpdate({
      target: schema.hppPriceMaster.code,
      set: {
        name: h.name,
        amount: String(h.high || h.medium || h.low),
        metadata: {
          roomType: "quad",
          low: h.low,
          medium: h.medium,
          high: h.high,
        }
      }
    });
  }

  // 3. Insert LA Packages
  let laSort = 300;
  for (let i = 0; i < data.laPackages.length; i++) {
    const p = data.laPackages[i];
    laSort += 5;
    const cleanSlug = `${p.makkah}-${p.madinah}`.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").slice(0, 40);
    const code = `la-pkg-${cleanSlug}-${i + 1}`;
    const name = `${p.makkah} / ${p.madinah}`;

    await database.insert(schema.hppPriceMaster).values({
      code,
      category: "la_package",
      name,
      currency: "IDR",
      costBasis: "per_pax",
      amount: String(p.price),
      sortOrder: laSort,
      metadata: {
        makkah: p.makkah,
        madinah: p.madinah,
      }
    }).onConflictDoUpdate({
      target: schema.hppPriceMaster.code,
      set: {
        name,
        amount: String(p.price),
        metadata: {
          makkah: p.makkah,
          madinah: p.madinah,
        }
      }
    });
  }

  console.log("SUCCESS! All hotels and LA packages have been synced into hpp_price_master.");
  process.exit(0);
}

seedHotels().catch((err) => {
  console.error("Failed to seed hotels:", err);
  process.exit(1);
});
