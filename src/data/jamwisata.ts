import type { TravelPackage } from "@/types/jamwisata";

const assetRoot = "/sites/jamwisata-com-2868cc8a/root-8a5edab2";

export const umrahPackages: TravelPackage[] = [
  {
    id: "umrah-bintang-5",
    slug: "umroh-bintang-5",
    name: "Umroh Bintang 5",
    category: "umrah",
    packageType: "bintang-5",
    badge: "Paket pilihan",
    image: `${assetRoot}/umrah-1.png`,
    departureDate: "15 Agustus 2026",
    departureMonth: "2026-08",
    airline: "Garuda Indonesia",
    departureAirport: "Soekarno-Hatta (CGK)",
    makkahHotel: { name: "Pullman Zamzam Makkah" },
    madinahHotel: { name: "Concorde Al Madinah" },
    facilities: ["Visa umrah", "Manasik", "Transportasi"],
    priceFrom: 33_900_000,
    currency: "IDR",
    status: "available",
    detailUrl: "https://jamwisata.com/transaksi/paket-umrah",
    whatsappMessage:
      "Assalamu’alaikum, saya tertarik dengan Paket Umroh Bintang 5 dan ingin mendapatkan informasi lengkap mengenai jadwal, fasilitas, serta cara pendaftarannya.",
  },
  {
    id: "umrah-plus-turki",
    slug: "umroh-plus-turki-eksklusif",
    name: "Umroh Plus Turki Eksklusif",
    category: "umrah",
    packageType: "plus",
    badge: "Umrah Plus",
    image: `${assetRoot}/umrah-2.png`,
    departureDate: "8 Desember 2026",
    departureMonth: "2026-12",
    airline: "Saudia",
    departureAirport: "Soekarno-Hatta (CGK)",
    makkahHotel: { name: "Nada Ajyad Makkah" },
    madinahHotel: { name: "Jawharat Al Rasheed" },
    facilities: ["Visa umrah", "Manasik", "Transportasi"],
    destination: ["Makkah", "Madinah", "Istanbul"],
    priceFrom: 36_900_000,
    currency: "IDR",
    status: "available",
    detailUrl: "https://jamwisata.com/transaksi/paket-umrah",
    whatsappMessage:
      "Assalamu’alaikum, saya tertarik dengan Paket Umroh Plus Turki Eksklusif dan ingin mengetahui jadwal, fasilitas, serta cara pendaftarannya.",
  },
  {
    id: "umrah-awal-2027",
    slug: "umroh-awal-tahun-2027",
    name: "Umroh Awal Tahun 2027",
    category: "umrah",
    packageType: "reguler",
    badge: "Awal Tahun",
    image: `${assetRoot}/umrah-3.png`,
    departureDate: "23 Januari 2027",
    departureMonth: "2027-01",
    airline: "Garuda Indonesia",
    departureAirport: "Soekarno-Hatta (CGK)",
    makkahHotel: { name: "Pullman Zamzam Makkah" },
    madinahHotel: { name: "Concorde Al Madinah" },
    facilities: ["Visa umrah", "Manasik", "Transportasi"],
    priceFrom: 33_900_000,
    currency: "IDR",
    status: "available",
    detailUrl: "https://jamwisata.com/transaksi/paket-umrah",
    whatsappMessage:
      "Assalamu’alaikum, saya tertarik dengan Paket Umroh Awal Tahun 2027 dan ingin mengetahui informasi lengkapnya.",
  },
];

export const formatIDR = (value: number) =>
  new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(value);

export const whatsappHref = (message: string, source: string) =>
  `https://wa.me/6281809627499?text=${encodeURIComponent(`${message}\n\nSumber: jamwisata.id — ${source}`)}`;
