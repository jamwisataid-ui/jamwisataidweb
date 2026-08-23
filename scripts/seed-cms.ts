import { config } from "dotenv";
import { and, eq } from "drizzle-orm";

config({ path: ".env.local" });

const assetRoot = "/sites/jamwisata-com-2868cc8a/root-8a5edab2";

const monthNumbers: Record<string, string> = {
  Januari: "01",
  Februari: "02",
  Maret: "03",
  April: "04",
  Mei: "05",
  Juni: "06",
  Juli: "07",
  Agustus: "08",
  September: "09",
  Oktober: "10",
  November: "11",
  Desember: "12",
};

function toIsoDate(label: string) {
  const [day, month, year] = label.split(" ");
  return `${year}-${monthNumbers[month]}-${day.padStart(2, "0")}`;
}

async function seed() {
  const [{ requireDatabase }, schema, data] = await Promise.all([
    import("../src/db/index"),
    import("../src/db/schema"),
    import("../src/data/jamwisata"),
  ]);
  const database = requireDatabase();

  for (const [sortOrder, item] of data.umrahPackages.entries()) {
    const existing = await database.query.packages.findFirst({
      where: eq(schema.packages.id, item.id),
      columns: { id: true },
    });

    if (existing) continue;

    await database.insert(schema.packages).values({
      id: item.id,
      slug: item.slug,
      name: item.name,
      category: item.category,
      type: item.packageType,
      badge: item.badge,
      imageUrl: item.image,
      durationDays: item.durationDays,
      currency: item.currency,
      status: "published",
      detailUrl: item.detailUrl,
      whatsappMessage: item.whatsappMessage,
      sortOrder,
      featured: true,
      publishedAt: new Date(),
    });

    if (item.departureDate && item.airline && item.departureAirport && item.priceFrom) {
      const [departure] = await database
        .insert(schema.departures)
        .values({
          packageId: item.id,
          departureDate: toIsoDate(item.departureDate),
          dateLabel: item.departureDate,
          airline: item.airline,
          departureAirport: item.departureAirport,
          arrivalAirport: item.arrivalAirport,
          price: String(item.priceFrom),
          status: item.status === "limited" ? "limited" : item.status === "sold-out" ? "full" : item.status === "coming-soon" ? "coming-soon" : "open",
        })
        .returning({ id: schema.departures.id });

      const hotels = [
        item.makkahHotel ? { city: "Makkah", ...item.makkahHotel, sortOrder: 0 } : null,
        item.madinahHotel ? { city: "Madinah", ...item.madinahHotel, sortOrder: 1 } : null,
      ].filter(Boolean) as Array<{ city: string; name: string; star?: number; distance?: string; sortOrder: number }>;

      if (hotels.length) {
        await database.insert(schema.accommodations).values(
          hotels.map((hotel) => ({
            departureId: departure.id,
            city: hotel.city,
            hotelName: hotel.name,
            star: hotel.star,
            distance: hotel.distance,
            sortOrder: hotel.sortOrder,
          })),
        );
      }
    }

    const groupedItems = [
      ["facility", item.facilities ?? []],
      ["highlight", item.highlights ?? []],
      ["include", item.includes ?? []],
      ["exclude", item.excludes ?? []],
      ["term", item.terms ?? []],
      ["destination", item.destination ?? []],
    ] as const;

    const packageItemValues = groupedItems.flatMap(([kind, values]) =>
      values.map((value, index) => ({ packageId: item.id, kind, value, sortOrder: index })),
    );
    if (packageItemValues.length) await database.insert(schema.packageItems).values(packageItemValues);

    if (item.itinerary?.length) {
      await database.insert(schema.itineraryDays).values(
        item.itinerary.map((day) => ({ packageId: item.id, ...day })),
      );
    }
  }

  const entries = [
    ...[
      ["8vJae3mZooI", "Testimoni Ust. Mega & Ust. Ahsan"],
      ["W6DJ7sZAiso", "Testimoni Jamaah"],
      ["KivXY7zX4JU", "Testimoni Keluarga Ibu Della"],
      ["K3qRoKJGYzc", "Testimoni Keluarga Ibu Inggit Bandung"],
      ["YYBBUrcDAhs", "Testimoni Keluarga Pak Richie"],
    ].map(([youtubeId, title], index) => ({
      type: "testimonial" as const,
      key: `video-${index + 1}`,
      title,
      data: { youtubeId, program: "Cerita jamaah Jam Wisata", orientation: "portrait" },
      sortOrder: index,
    })),
    ...[
      ["about.jpg", "Suasana jamaah di Masjidil Haram", "Perjalanan di tanah suci"],
      ["umrah-1.png", "Dokumentasi paket Umroh Bintang 5", "Program umrah"],
      ["umrah-2.png", "Dokumentasi perjalanan umrah plus", "Perjalanan jamaah"],
      ["umrah-3.png", "Dokumentasi umrah awal tahun", "Makkah dan Madinah"],
      ["hero.jpg", "Suasana Masjidil Haram bersama jamaah", "Menuju Baitullah"],
      ["tour-1.png", "Dokumentasi wisata halal Turki", "Wisata halal Turki"],
      ["tour-2.png", "Dokumentasi wisata halal Jepang", "Wisata halal Jepang"],
      ["promo.jpg", "Suasana ibadah di Masjidil Haram", "Momen ibadah jamaah"],
      ["tour-3.png", "Dokumentasi wisata halal Asia", "Perjalanan wisata halal"],
      ["tour-4.png", "Dokumentasi wisata halal Eropa", "Wisata halal Eropa"],
    ].map(([image, alt, caption], index) => ({
      type: "gallery" as const,
      key: `gallery-${index + 1}`,
      title: caption,
      data: { imageUrl: `${assetRoot}/${image}`, alt, caption },
      sortOrder: index,
    })),
    ...[
      ["Apa saja yang termasuk dalam paket umrah?", "Fasilitas berbeda pada setiap program. Umumnya paket dapat mencakup tiket, visa, hotel, transportasi, konsumsi, perlengkapan, dan pendampingan. Periksa detail paket sebelum mendaftar."],
      ["Bagaimana cara mendapatkan jadwal terbaru?", "Hubungi tim Jam Wisata melalui WhatsApp untuk mendapatkan jadwal keberangkatan dan informasi program terbaru."],
      ["Apakah tersedia pilihan tipe kamar?", "Pilihan kamar double, triple, atau quad mengikuti paket dan ketersediaan pada jadwal yang dipilih."],
      ["Apa saja dokumen yang perlu disiapkan?", "Dokumen dapat mencakup paspor, KTP, kartu keluarga, pas foto, dan dokumen pendukung sesuai ketentuan. Tim akan memberikan checklist setelah pemilihan paket."],
      ["Apakah tersedia bimbingan manasik?", "Jam Wisata menyediakan persiapan dan bimbingan manasik sesuai program sebelum keberangkatan."],
      ["Bagaimana cara berkonsultasi?", "Klik tombol WhatsApp, lalu sampaikan paket, jadwal, atau kebutuhan perjalanan yang ingin ditanyakan."],
    ].map(([question, answer], index) => ({
      type: "faq" as const,
      key: `faq-${index + 1}`,
      title: question,
      data: { question, answer, scope: "homepage" },
      sortOrder: index,
    })),
    ...[
      ["Turki", "Istanbul · Bursa · Cappadocia", "tour-1.png"],
      ["Jepang", "Tokyo · Osaka · Kyoto", "tour-2.png"],
      ["Eropa Barat", "Paris · Amsterdam · Brussels", "tour-4.png"],
    ].map(([name, places, image], index) => ({
      type: "destination" as const,
      key: name.toLowerCase().replaceAll(" ", "-"),
      title: name,
      data: { name, places, imageUrl: `${assetRoot}/${image}` },
      sortOrder: index,
    })),
    {
      type: "site-settings" as const,
      key: "global",
      title: "Pengaturan Jam Wisata",
      data: {
        brandName: "Jam Wisata",
        tagline: "Setiap Waktu Bernilai Ibadah",
        whatsapp: "6281809627499",
        email: "jamwisata99@gmail.com",
        address: "Jl. Cibangkong No. 28A Gatot Subroto, Bandung, Jawa Barat 40273",
        legal: "Jam Wisata Brand of Fajar Indah Gemilang PPIU Nomor 534 Tahun 2019",
        instagram: "https://www.instagram.com/jamwisata",
        youtube: "https://www.youtube.com/@jamwisata",
      },
      sortOrder: 0,
    },
    {
      type: "homepage" as const,
      key: "hero",
      title: "Hero Homepage",
      data: {
        eyebrow: "Umrah & Wisata Halal",
        headline: "Setiap Waktu Bernilai Ibadah.",
        description: "Jam Wisata hadir menemani setiap langkah menuju Baitullah dengan layanan yang amanah, profesional, dan penuh perhatian.",
      },
      sortOrder: 0,
    },
  ];

  for (const entry of entries) {
    const existing = await database.query.contentEntries.findFirst({
      where: and(eq(schema.contentEntries.type, entry.type), eq(schema.contentEntries.key, entry.key)),
      columns: { id: true },
    });
    if (existing) continue;
    await database.insert(schema.contentEntries).values({
      ...entry,
      status: "published",
      publishedAt: new Date(),
    });
  }

  console.log(`CMS seed selesai: ${data.umrahPackages.length} paket dan ${entries.length} konten pendukung.`);
}

seed().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
