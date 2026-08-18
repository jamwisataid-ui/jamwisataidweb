import type { TravelPackage } from "@/types/jamwisata";

const assetRoot = "/sites/jamwisata-com-2868cc8a/root-8a5edab2";

export const umrahPackages: TravelPackage[] = [
  {
    id: "umrah-9-hari",
    slug: "umroh-9-hari-reguler",
    name: "Umroh 9 Hari",
    category: "umrah",
    packageType: "reguler",
    badge: "Quad All In",
    image: `${assetRoot}/umrah-1.png`,
    durationDays: 9,
    departureDate: "10 Oktober 2026",
    departureMonth: "2026-10",
    airline: "Qatar Airways",
    departureAirport: "Soekarno-Hatta (CGK) — Transit Doha",
    makkahHotel: { name: "Pullman Zamzam Makkah" },
    madinahHotel: { name: "Hotel Bintang 4 Madinah" },
    facilities: ["Visa umrah", "Manasik", "Handling bandara", "Perlengkapan"],
    priceFrom: 33_900_000,
    currency: "IDR",
    status: "available",
    detailUrl: "https://jamwisata.com/transaksi/paket-umrah",
    whatsappMessage:
      "Assalamu’alaikum, saya tertarik dengan Paket Umroh 9 Hari (10 Oktober 2026) dan ingin berkonsultasi mengenai jadwal, fasilitas, serta pendaftarannya.",
  },
  {
    id: "umrah-12-hari-turkey",
    slug: "umroh-12-hari-plus-turkey",
    name: "Umroh 12 Hari + Turkey",
    category: "umrah",
    packageType: "plus",
    badge: "Quad All In",
    image: `${assetRoot}/umrah-2.png`,
    durationDays: 12,
    departureDate: "8 Desember 2026",
    departureMonth: "2026-12",
    airline: "Saudia",
    departureAirport: "Soekarno-Hatta (CGK)",
    makkahHotel: { name: "Nada Ajyad Makkah" },
    madinahHotel: { name: "Jawharat Al Rasheed" },
    facilities: ["Visa umrah & turki", "Manasik", "Holiday Inn Bursa", "Ramada"],
    destination: ["Makkah", "Madinah", "Istanbul", "Bursa", "Cappadocia"],
    priceFrom: 36_900_000,
    currency: "IDR",
    status: "available",
    detailUrl: "https://jamwisata.com/transaksi/paket-umrah",
    whatsappMessage:
      "Assalamu’alaikum, saya tertarik dengan Paket Umroh 12 Hari + Turkey (8 Desember 2026) dan ingin mengetahui detail fasilitas serta pendaftarannya.",
  },
  {
    id: "umrah-bintang-5",
    slug: "umroh-bintang-5-eksklusif",
    name: "Umroh Bintang 5 Eksklusif",
    category: "umrah",
    packageType: "bintang-5",
    badge: "Pilihan Utama",
    image: `${assetRoot}/umrah-3.png`,
    durationDays: 9,
    departureDate: "20 Januari 2027",
    departureMonth: "2027-01",
    airline: "Garuda Indonesia",
    departureAirport: "Soekarno-Hatta (CGK)",
    makkahHotel: { name: "Pullman Zamzam Makkah" },
    madinahHotel: { name: "Concorde Al Madinah" },
    facilities: ["Hotel Bintang 5 Dekat Masjid", "Visa umrah", "Manasik"],
    priceFrom: 35_900_000,
    currency: "IDR",
    status: "available",
    detailUrl: "https://jamwisata.com/transaksi/paket-umrah",
    whatsappMessage:
      "Assalamu’alaikum, saya tertarik dengan Paket Umroh Bintang 5 Eksklusif Jam Wisata dan ingin mengetahui ketersediaan seat serta fasilitasnya.",
  },
];

export const formatIDR = (value: number) =>
  new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(value);

export const whatsappHref = (message: string, source: string) =>
  `https://wa.me/6281809627499?text=${encodeURIComponent(`${message}\n\nSumber: jamwisata.id — ${source}`)}`;
