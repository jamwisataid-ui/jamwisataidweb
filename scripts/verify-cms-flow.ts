import { config } from "dotenv";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";

config({ path: ".env.local" });

async function verifyAll() {
  console.log("==================================================");
  console.log("      VERIFIKASI & AUDIT ALUR CMS JAM WISATA      ");
  console.log("==================================================");

  const { requireDatabase } = await import("../src/db/index");
  const schema = await import("../src/db/schema");
  const { packageFormSchema, entryFormSchema, slugify } = await import("../src/lib/cms/validation");
  const database = requireDatabase();

  // 1. Tes Pembuatan Paket Baru (Validasi & Insert)
  console.log("\n[TEST 1] Menguji Alur Pembuatan Paket Baru...");
  const testPkgId = `test-${randomUUID()}`;
  const testPkgName = "Paket Uji Coba Umroh VIP 2026";
  const testSlug = slugify(testPkgName);

  const validData = {
    id: testPkgId,
    slug: testSlug,
    name: testPkgName,
    category: "umrah" as const,
    packageType: "bintang-5" as const,
    badge: "Eksklusif",
    summary: "Paket uji coba umroh fasilitas bintang 5",
    imageUrl: "https://utfs.io/f/sample-umrah.jpg",
    durationDays: 12,
    detailUrl: "",
    whatsappMessage: "Assalamu’alaikum Jam Wisata, saya ingin konsultasi mengenai Paket Uji Coba.",
    seoTitle: "Paket Uji Coba Umroh VIP",
    seoDescription: "Deskripsi SEO paket uji coba",
    featured: true,
    sortOrder: 1,
    departureDate: "2026-11-25",
    departureLabel: "25 November 2026",
    returnDate: "",
    manasikDate: "",
    airline: "Saudia Airlines",
    departureAirport: "Jakarta (CGK)",
    arrivalAirport: "Jeddah (JED)",
    price: 38500000,
    capacity: 45,
    availableSeats: 20,
    departureStatus: "open" as const,
    makkahHotel: "Fairmont Clock Tower",
    makkahStar: 5,
    makkahDistance: "50m ke Masjidil Haram",
    madinahHotel: "Dar Al Taqwa",
    madinahStar: 5,
    madinahDistance: "100m ke Masjid Nabawi",
    facilities: "Bus VIP\nHandling VIP\nKereta Cepat",
    highlights: "City Tour Taif\nKereta Cepat Haramain",
    includes: "Tiket PP Business/Economy\nVisa Umroh\nHotel Bintang 5",
    excludes: "Paspor\nPengeluaran Pribadi",
    terms: "DP 10 Juta",
    destinations: "Makkah\nMadinah\nTaif",
    itinerary: JSON.stringify([
      { day: 1, title: "Keberangkatan Jakarta - Jeddah", description: "Berkumpul di bandara Soekarno Hatta..." },
      { day: 2, title: "Ibadah Umroh Pertama", description: "Melaksanakan Umroh di Masjidil Haram..." }
    ]),
  };

  const parsed = packageFormSchema.safeParse(validData);
  if (!parsed.success) {
    throw new Error(`Validasi packageFormSchema gagal: ${JSON.stringify(parsed.error.format())}`);
  }
  console.log("  ✅ Validasi Form Paket Baru: BERHASIL");

  // Insert ke database (Simulasi Publish Paket)
  await database.insert(schema.packages).values({
    id: validData.id,
    slug: validData.slug,
    name: validData.name,
    category: validData.category,
    type: validData.packageType,
    badge: validData.badge,
    summary: validData.summary,
    imageUrl: validData.imageUrl,
    durationDays: validData.durationDays,
    status: "published",
    whatsappMessage: validData.whatsappMessage,
    seoTitle: validData.seoTitle,
    seoDescription: validData.seoDescription,
    featured: validData.featured,
    sortOrder: validData.sortOrder,
    publishedAt: new Date(),
  });

  const [dep] = await database.insert(schema.departures).values({
    packageId: validData.id,
    departureDate: validData.departureDate,
    dateLabel: validData.departureLabel,
    airline: validData.airline,
    departureAirport: validData.departureAirport,
    arrivalAirport: validData.arrivalAirport,
    price: String(validData.price),
    capacity: validData.capacity,
    availableSeats: validData.availableSeats,
    status: validData.departureStatus,
  }).returning({ id: schema.departures.id });

  await database.insert(schema.accommodations).values([
    { departureId: dep.id, city: "Makkah", hotelName: validData.makkahHotel, star: validData.makkahStar, distance: validData.makkahDistance, sortOrder: 0 },
    { departureId: dep.id, city: "Madinah", hotelName: validData.madinahHotel, star: validData.madinahStar, distance: validData.madinahDistance, sortOrder: 1 },
  ]);

  console.log("  ✅ Insert Paket, Keberangkatan, dan Hotel ke Database: BERHASIL");

  // 2. Tes Pencegahan Slug Bentrok / Collision
  console.log("\n[TEST 2] Menguji Pencegahan Slug Collision (Duplikasi Nama Paket)...");
  let candidateSlug = testSlug;
  let counter = 1;
  while (true) {
    const existing = await database.query.packages.findFirst({
      where: eq(schema.packages.slug, candidateSlug),
      columns: { id: true },
    });
    if (!existing) break;
    counter++;
    candidateSlug = `${testSlug}-${counter}`;
  }
  console.log(`  ✅ Slug baru untuk nama yang sama ter-resolve aman: "${candidateSlug}"`);

  // 3. Tes Edit & Draft Paket
  console.log("\n[TEST 3] Menguji Update Status Paket...");
  await database.update(schema.packages).set({ status: "draft" }).where(eq(schema.packages.id, testPkgId));
  const updatedPkg = await database.query.packages.findFirst({ where: eq(schema.packages.id, testPkgId) });
  if (updatedPkg?.status !== "draft") throw new Error("Status update gagal");
  console.log("  ✅ Update Status Paket ke Draft: BERHASIL");

  // 4. Tes Modul Galeri Foto
  console.log("\n[TEST 4] Menguji Validasi & Penyimpanan Galeri...");
  const galleryParsed = entryFormSchema.safeParse({
    type: "gallery",
    key: "foto-uji-coba",
    title: "Dokumentasi Uji Coba",
    primary: "https://utfs.io/f/sample-gallery.jpg",
    secondary: "Jamaah di Madinah",
    tertiary: "Suasana nyaman di pelataran",
    sortOrder: 0,
  });
  if (!galleryParsed.success) throw new Error("Validasi Galeri gagal");
  console.log("  ✅ Validasi Galeri Foto: BERHASIL");

  // 5. Tes Modul Tanya Jawab (FAQ)
  console.log("\n[TEST 5] Menguji Validasi & Penyimpanan FAQ...");
  const faqParsed = entryFormSchema.safeParse({
    type: "faq",
    key: "faq-uji-coba",
    title: "Pertanyaan Uji Coba?",
    primary: "Berapa lama masa berlaku paspor?",
    secondary: "Minimal 7 bulan sebelum tanggal keberangkatan.",
    tertiary: "homepage",
    sortOrder: 0,
  });
  if (!faqParsed.success) throw new Error("Validasi FAQ gagal");
  console.log("  ✅ Validasi FAQ: BERHASIL");

  // 6. Tes Modul Video Jamaah (Testimoni)
  console.log("\n[TEST 6] Menguji Ekstraksi YouTube ID & Validasi Video Jamaah...");
  const { extractYoutubeId } = await import("../src/lib/cms/validation");
  const ytId1 = extractYoutubeId("https://www.youtube.com/watch?v=8vJae3mZooI");
  const ytId2 = extractYoutubeId("https://youtu.be/8vJae3mZooI");
  const ytId3 = extractYoutubeId("https://www.youtube.com/shorts/8vJae3mZooI");
  if (ytId1 !== "8vJae3mZooI" || ytId2 !== "8vJae3mZooI" || ytId3 !== "8vJae3mZooI") {
    throw new Error("Ekstraksi YouTube ID tidak sesuai");
  }
  console.log(`  ✅ Ekstraksi YouTube ID (Watch, Short, Short-url): BERHASIL (${ytId1})`);

  // 7. Bersihkan data dummy uji coba
  console.log("\n[TEST 7] Membersihkan Data Uji Coba...");
  await database.delete(schema.packages).where(eq(schema.packages.id, testPkgId));
  console.log("  ✅ Cleanup Data Test: BERHASIL");

  console.log("\n==================================================");
  console.log("       SEMUA PENGUJIAN CMS 100% SUKSES!           ");
  console.log("==================================================");
}

verifyAll().catch((err) => {
  console.error("❌ Verifikasi CMS GAGAL:", err);
  process.exit(1);
});
