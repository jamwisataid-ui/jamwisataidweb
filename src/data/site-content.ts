import type { LucideIcon } from "lucide-react";
import {
  BookOpenText,
  Building2,
  CalendarDays,
  Compass,
  HeartHandshake,
  Hotel,
  Plane,
  Sparkles,
  UsersRound,
} from "lucide-react";

export type ProgramCategory = "Reguler" | "Plus" | "Family" | "Private";

export type Program = {
  slug: string;
  name: string;
  category: ProgramCategory;
  badge?: string;
  image: string;
  departureDate: string;
  duration: string;
  airline: string;
  makkahHotel: string;
  madinahHotel: string;
  capacity: string;
  mentor: string;
  price: number;
  destinations: string[];
  summary: string;
};

export type PlannerOption = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

export type PlannerOptionContent = Omit<PlannerOption, "icon">;

export type TestimonialVideo = {
  id: string;
  title: string;
  subtitle: string;
};

const assetRoot = "/sites/jamwisata-com-2868cc8a/root-8a5edab2";

export const contact = {
  phone: "+62 818-0962-7499",
  phoneHref: "tel:+6281809627499",
  email: "jamwisata99@gmail.com",
  address: "Jl. Cibangkong No. 28A, Bandung 40273",
  maps: "https://maps.app.goo.gl/gVK4okTQSEtzyX9w5",
  instagram: "https://www.instagram.com/jamwisata/",
  whatsapp:
    "https://wa.me/6281809627499?text=Assalamu%E2%80%99alaikum%2C%20saya%20ingin%20berkonsultasi%20mengenai%20perjalanan%20Umrah%20bersama%20Jam%20Wisata.",
};

export const programs: Program[] = [
  {
    slug: "umrah-premium-9-hari",
    name: "Umrah Premium 9 Hari",
    category: "Reguler",
    badge: "Program pilihan",
    image: `${assetRoot}/umrah-1.png`,
    departureDate: "15 Agustus 2026",
    duration: "9 hari",
    airline: "Garuda Indonesia",
    makkahHotel: "Pullman Zamzam Makkah",
    madinahHotel: "Concorde Al Madinah",
    capacity: "Kapasitas dikonfirmasi tim",
    mentor: "Pembimbing profesional",
    price: 33_900_000,
    destinations: ["Makkah", "Madinah"],
    summary:
      "Program ibadah dengan akomodasi pilihan dan pendampingan yang disiapkan sejak manasik hingga kepulangan.",
  },
  {
    slug: "umrah-plus-turki-eksklusif",
    name: "Umrah Plus Turki Eksklusif",
    category: "Plus",
    badge: "Umrah plus",
    image: `${assetRoot}/umrah-2.png`,
    departureDate: "8 Desember 2026",
    duration: "Durasi dikonfirmasi tim",
    airline: "Saudia",
    makkahHotel: "Nada Ajyad Makkah",
    madinahHotel: "Jawharat Al Rasheed",
    capacity: "Kapasitas dikonfirmasi tim",
    mentor: "Pembimbing profesional",
    price: 36_900_000,
    destinations: ["Makkah", "Madinah", "Istanbul"],
    summary:
      "Perjalanan Umrah yang dilanjutkan dengan pengalaman wisata halal di Turki dalam satu pendampingan terarah.",
  },
  {
    slug: "umrah-awal-tahun-2027",
    name: "Umrah Awal Tahun 2027",
    category: "Family",
    badge: "Awal tahun",
    image: `${assetRoot}/umrah-3.png`,
    departureDate: "23 Januari 2027",
    duration: "Durasi dikonfirmasi tim",
    airline: "Garuda Indonesia",
    makkahHotel: "Pullman Zamzam Makkah",
    madinahHotel: "Concorde Al Madinah",
    capacity: "Kapasitas dikonfirmasi tim",
    mentor: "Pendamping jamaah",
    price: 33_900_000,
    destinations: ["Makkah", "Madinah"],
    summary:
      "Pilihan perjalanan awal tahun untuk jamaah dan keluarga yang menginginkan persiapan lebih tenang.",
  },
];

export const plannerOptions: PlannerOption[] = [
  {
    id: "first",
    title: "Umrah pertama kali",
    description: "Bimbingan yang jelas untuk setiap tahapan.",
    icon: Compass,
  },
  {
    id: "parents",
    title: "Bersama orang tua",
    description: "Kenyamanan dan ritme perjalanan menjadi prioritas.",
    icon: HeartHandshake,
  },
  {
    id: "plus",
    title: "Umrah plus / wisata",
    description: "Ibadah yang dilengkapi perjalanan halal.",
    icon: Plane,
  },
  {
    id: "private",
    title: "Private / khusus",
    description: "Perjalanan lebih personal dan fleksibel.",
    icon: Sparkles,
  },
  {
    id: "family",
    title: "Bersama keluarga",
    description: "Program yang ramah bagi kebutuhan keluarga.",
    icon: UsersRound,
  },
  {
    id: "learning",
    title: "Masih belajar",
    description: "Pahami pilihan sebelum menentukan program.",
    icon: BookOpenText,
  },
];

export const trustValues = [
  {
    title: "Pendampingan profesional",
    description: "Jamaah dibimbing sejak persiapan hingga kepulangan.",
    icon: UsersRound,
  },
  {
    title: "Informasi jelas & amanah",
    description: "Rincian perjalanan disampaikan secara terbuka.",
    icon: BookOpenText,
  },
  {
    title: "Hotel strategis & nyaman",
    description: "Akomodasi dipilih untuk mendukung ritme ibadah.",
    icon: Hotel,
  },
  {
    title: "Perjalanan terencana",
    description: "Jadwal, dokumen, dan kebutuhan disiapkan terarah.",
    icon: CalendarDays,
  },
];

export const services = [
  {
    title: "Manasik & bimbingan ibadah",
    description: "Persiapan ilmu agar jamaah memahami setiap rangkaian.",
    icon: BookOpenText,
  },
  {
    title: "Hotel pilihan",
    description: "Akomodasi dipertimbangkan untuk kenyamanan dan mobilitas.",
    icon: Building2,
  },
  {
    title: "Perjalanan udara",
    description: "Pilihan penerbangan disampaikan transparan pada setiap program.",
    icon: Plane,
  },
  {
    title: "Pendamping jamaah",
    description: "Tim membantu kebutuhan jamaah selama perjalanan berlangsung.",
    icon: HeartHandshake,
  },
];

export const destinations = [
  { name: "Turki", image: `${assetRoot}/tour-1.png`, label: "Sejarah & peradaban" },
  { name: "Jepang", image: `${assetRoot}/tour-2.png`, label: "Budaya & perjalanan halal" },
  { name: "Eropa Barat", image: `${assetRoot}/tour-3.png`, label: "Rangkaian destinasi pilihan" },
];

export const gallery = [
  { image: `${assetRoot}/about.jpg`, alt: "Suasana jamaah di Masjidil Haram" },
  { image: `${assetRoot}/hero.jpg`, alt: "Perjalanan jamaah menuju Tanah Suci" },
  { image: `${assetRoot}/umrah-1.png`, alt: "Suasana ibadah di Masjidil Haram" },
  { image: `${assetRoot}/tour-1.png`, alt: "Dokumentasi perjalanan halal Jam Wisata" },
  { image: `${assetRoot}/promo.jpg`, alt: "Momen ibadah di sekitar Ka'bah" },
];

export const articles = [
  {
    title: "Persiapan yang Perlu Dilakukan Sebelum Berangkat Umrah",
    category: "Persiapan",
    date: "Panduan Jam Wisata",
    image: `${assetRoot}/article-1.webp`,
  },
  {
    title: "Memahami Manasik agar Ibadah Lebih Tenang dan Terarah",
    category: "Manasik",
    date: "Panduan Jam Wisata",
    image: `${assetRoot}/article-2.jpg`,
  },
  {
    title: "Hal yang Perlu Diperhatikan Saat Mendampingi Orang Tua",
    category: "Tips perjalanan",
    date: "Panduan Jam Wisata",
    image: `${assetRoot}/article-3.jpg`,
  },
];

export const faqs = [
  [
    "Apa saja yang termasuk dalam paket Umrah?",
    "Cakupan setiap program berbeda. Rincian penerbangan, hotel, transportasi, konsumsi, visa, perlengkapan, dan pendampingan tersedia pada halaman program dan akan dijelaskan kembali oleh tim kami.",
  ],
  [
    "Dokumen apa yang perlu disiapkan?",
    "Umumnya jamaah menyiapkan paspor, dokumen identitas, foto, dan dokumen kesehatan sesuai ketentuan yang berlaku. Tim Jam Wisata akan memberikan daftar terbaru setelah Anda memilih program.",
  ],
  [
    "Apakah ada manasik sebelum keberangkatan?",
    "Ya. Jadwal dan format manasik mengikuti program keberangkatan agar jamaah memiliki bekal ibadah dan informasi perjalanan yang memadai.",
  ],
  [
    "Bagaimana jika saya berangkat bersama orang tua?",
    "Sampaikan kondisi dan kebutuhan orang tua saat konsultasi. Tim kami akan membantu menilai pilihan program, ritme perjalanan, hotel, dan dukungan yang paling sesuai.",
  ],
  [
    "Apakah tersedia perjalanan private?",
    "Kebutuhan private atau rombongan khusus dapat dikonsultasikan dengan tim. Rekomendasi akan disesuaikan dengan jumlah peserta, waktu, dan kebutuhan perjalanan.",
  ],
] as const;

export const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(value);
