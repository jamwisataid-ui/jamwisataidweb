import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Building2,
  Clock,
  Compass,
  Heart,
  HeartHandshake,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";

import { FounderLetterSection } from "@/components/sites/jamwisata-com-2868cc8a/root-8a5edab2/FounderLetterSection";
import { ModernProofFooter } from "@/components/sites/jamwisata-com-2868cc8a/root-8a5edab2/ModernProofFooter";
import { PremiumHeader } from "@/components/sites/jamwisata-com-2868cc8a/root-8a5edab2/PremiumHeader";
import { WhatsAppConcierge } from "@/components/sites/jamwisata-com-2868cc8a/root-8a5edab2/WhatsAppConcierge";

export const metadata: Metadata = {
  title: "Tentang Kami | Jam Wisata — Setiap Waktu Bernilai Ibadah",
  description:
    "Mengenal lebih dalam Jam Wisata. Filosofi nama, visi, misi, 6 nilai perusahaan, dan komitmen pelayanan ibadah umrah berlandaskan sunnah.",
};

const filosofiItems = [
  {
    title: "Jaris",
    meaning: "Karunia & Anugerah",
    desc: "Dalam bahasa Arab, Jaris bermakna karunia atau pemberian. Bagi kami, setiap kesempatan melangkahkan kaki ke Baitullah adalah anugerah istimewa dari Allah SWT yang menuntut kesungguhan dan amanah terbaik.",
    accent: "Gold",
  },
  {
    title: "Ammar",
    meaning: "Memakmurkan & Hidup",
    desc: "Ammar berarti panjang umur dan memakmurkan, terinspirasi dari sahabat mulia Ammar bin Yasir. Jam Wisata bertekad menghadirkan kebermanfaatan yang terus hidup dan mengalirkan pahala kebaikan bagi umat.",
    accent: "Silver",
  },
  {
    title: "Madani",
    meaning: "Peradaban & Akhlak",
    desc: "Terinspirasi dari Kota Madinah yang dibangun Rasulullah ﷺ sebagai pusat ilmu, akhlak santun, dan peradaban Islam. Kami menghadirkan standar pelayanan yang beradab, disiplin, dan penuh ketulusan.",
    accent: "Gold",
  },
  {
    title: "Wisata",
    meaning: "Perjalanan Menuju Allah",
    desc: "Bagi kami, wisata bukan sekadar berpindah tempat, melainkan perjalanan yang menghadirkan pengalaman spiritual, pembelajaran mendalam, serta transformasi hati menjadi lebih dekat kepada Allah SWT.",
    accent: "Silver",
  },
];

const coreValues = [
  {
    icon: ShieldCheck,
    name: "Amanah",
    desc: "Menjaga kepercayaan jamaah dengan kejujuran, transparansi biaya, dan tanggung jawab penuh di setiap tahap perjalanan.",
  },
  {
    icon: Star,
    name: "Profesional",
    desc: "Bekerja dengan standar mutu tinggi, disiplin waktu, serta orientasi pada kenyamanan dan keselamatan jamaah.",
  },
  {
    icon: HeartHandshake,
    name: "Pelayanan",
    desc: "Melayani dengan ketulusan hati, empati, keramahan, dan siap mendampingi kebutuhan jamaah dari persiapan hingga kepulangan.",
  },
  {
    icon: Heart,
    name: "Keikhlasan",
    desc: "Menjadikan setiap pekerjaan dan pendampingan sebagai ladang ibadah semata-mata mengharapkan ridha Allah SWT.",
  },
  {
    icon: BookOpen,
    name: "Sunnah",
    desc: "Berpegang teguh pada tuntunan Al-Qur'an dan As-Sunnah sesuai pemahaman Rasulullah ﷺ dalam seluruh rangkaian manasik & ibadah.",
  },
  {
    icon: Sparkles,
    name: "Kebermanfaatan",
    desc: "Menebar kebaikan seluas-luasnya untuk jamaah, keluarga, masyarakat, dan kemajuan peradaban umat.",
  },
];

const asmaulHusna = [
  { name: "Ar-Rahman", meaning: "Maha Pengasih" },
  { name: "Ar-Rahim", meaning: "Maha Penyayang" },
  { name: "Al-Wakil", meaning: "Maha Memelihara" },
  { name: "Al-Latif", meaning: "Maha Lembut" },
  { name: "As-Salam", meaning: "Maha Memberi Kedamaian" },
  { name: "Al-Karim", meaning: "Maha Mulia" },
];

export default function TentangKamiPage() {
  return (
    <main className="jam-page min-h-screen bg-white text-[#333333]">
      <PremiumHeader />

      {/* Hero Banner Section */}
      <section className="relative isolate overflow-hidden bg-[#021224] text-white pt-32 sm:pt-36 lg:pt-40 pb-20 sm:pb-24 lg:pb-28 border-b border-[#D5A12B]/30">
        <Image
          src="/hero-makkah-cinematic.png"
          alt="Masjidil Haram dan Ka'bah"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-25 pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#021224] via-[#021224]/85 to-[#021224]/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(213,161,43,0.15)_0%,transparent_70%)]" />

        <div className="jam-container relative z-10">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs font-semibold text-slate-300">
            <Link href="/" className="inline-flex items-center gap-1.5 hover:text-[#E8C967] transition">
              <ArrowLeft className="size-3.5" /> Beranda
            </Link>
            <span className="text-[#D5A12B]">/</span>
            <span className="text-white font-bold">Tentang Kami</span>
          </nav>

          <div className="max-w-[840px]">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#D5A12B]/40 bg-[#061A2F]/80 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-[#F5D97A] backdrop-blur-md shadow-xs ring-1 ring-[#D5A12B]/20">
              <Building2 className="size-3.5 text-[#E8C967]" /> Profil Resmi Jam Wisata
            </span>

            <h1 className="mt-5 font-[family-name:var(--font-cinzel)] text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-white tracking-tight">
              Mengantarkan Langkah, Menemani Perjalanan Hati
            </h1>

            <p className="mt-4 font-[family-name:var(--font-cormorant)] text-lg sm:text-2xl italic text-[#F5D97A] leading-relaxed">
              &ldquo;Setiap Waktu Bernilai Ibadah&rdquo;
            </p>

            <p className="mt-5 text-sm sm:text-base leading-relaxed text-slate-200 font-[family-name:var(--font-montserrat)] max-w-[720px]">
              Jam Wisata hadir bukan sekadar sebagai penyelenggara perjalanan, melainkan sebagai sahabat terpercaya yang membimbing langkah dan menata kekhusyukan hati jamaah menuju Baitullah.
            </p>
          </div>
        </div>
      </section>

      {/* Founder Letter Section */}
      <FounderLetterSection />

      {/* Section 1: Brand Story & Visi Misi */}
      <section className="bg-white py-16 sm:py-20 lg:py-24 border-b border-[#061A2F]/8">
        <div className="jam-container">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-14 items-center">
            {/* Left: Ka'bah Visual Anchor */}
            <div className="lg:col-span-5">
              <figure className="relative min-h-[400px] sm:min-h-[480px] w-full overflow-hidden rounded-[24px] shadow-lg border border-[#061A2F]/10">
                <Image
                  src="/why-choose-kabah.jpg"
                  alt="Pintu Kiswah Ka'bah dan Jamaah Umrah"
                  fill
                  sizes="(min-width:1024px) 40vw, 100vw"
                  className="object-cover object-center"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#021224]/95 via-[#021224]/50 to-transparent p-6 text-white">
                  <p className="font-[family-name:var(--font-cormorant)] text-base sm:text-lg italic text-[#F5D97A]">
                    &ldquo;Sebuah perjalanan menuju Baitullah bukan sekadar perpindahan tempat, tetapi perjalanan hati menuju ridha Allah.&rdquo;
                  </p>
                </div>
              </figure>
            </div>

            {/* Right: Story & Vision */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-white px-2.5 py-1 text-xs font-extrabold uppercase tracking-wider text-[#D5A12B] border border-[#D5A12B]/30 w-fit">
                Kisah &amp; Komitmen Kami
              </span>

              <h2 className="mt-3 font-[family-name:var(--font-cinzel)] text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-[#061A2F]">
                Lahir dari Kerinduan Melayani Tamu Allah
              </h2>

              <div className="w-16 h-1 bg-gradient-gold-rich rounded-full mt-3.5 mb-5" />

              <p className="text-sm sm:text-base leading-relaxed text-[#59616D]">
                Jam Wisata lahir dari kepedulian mendalam untuk menghadirkan perjalanan ibadah yang amanah, nyaman, dan penuh keberkahan. Kami percaya bahwa setiap perjalanan menuju Baitullah adalah karunia Allah yang menuntut kesungguhan, keterbukaan, dan pelayanan terbaik.
              </p>

              {/* Visi & Misi Box */}
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-[#061A2F]/10 bg-slate-50/60 p-5 shadow-2xs">
                  <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#061A2F]">
                    <span className="grid size-7 place-items-center rounded-lg bg-[#061A2F] text-[#E8C967]">
                      <Compass className="size-4" />
                    </span>
                    <span>Visi Kami</span>
                  </div>
                  <p className="mt-3 text-xs sm:text-[13px] leading-relaxed text-[#59616D]">
                    Menjadi penyelenggara perjalanan ibadah terpercaya yang mengantarkan jamaah menuju Baitullah dengan pelayanan terbaik, berlandaskan sunnah, dan membawa keberkahan untuk umat.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#061A2F]/10 bg-slate-50/60 p-5 shadow-2xs">
                  <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#061A2F]">
                    <span className="grid size-7 place-items-center rounded-lg bg-[#061A2F] text-[#E8C967]">
                      <BookOpen className="size-4" />
                    </span>
                    <span>Misi Utama</span>
                  </div>
                  <p className="mt-3 text-xs sm:text-[13px] leading-relaxed text-[#59616D]">
                    Menyelenggarakan perjalanan ibadah sesuai sunnah, memberikan pendampingan ilmu berkelanjutan, serta melayani dengan standar kenyamanan dan transparansi tinggi.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Filosofi Nama Perusahaan (Jaris Ammar Madani Wisata) */}
      <section className="bg-slate-50/70 py-16 sm:py-20 lg:py-24 border-b border-[#061A2F]/8">
        <div className="jam-container">
          <div className="mx-auto max-w-[760px] text-center">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-[#D5A12B] border border-[#D5A12B]/30 shadow-2xs">
              Filosofi Nama
            </span>
            <h2 className="mt-3 font-[family-name:var(--font-cinzel)] text-2xl sm:text-3xl lg:text-4xl font-bold text-[#061A2F]">
              Makna di Balik Jaris Ammar Madani
            </h2>
            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#64748B]">
              Sebuah perjalanan penuh karunia Allah yang menghadirkan keberkahan, membangun peradaban, dan mengantarkan manusia semakin dekat kepada-Nya.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filosofiItems.map((item) => (
              <div
                key={item.title}
                className="group relative flex flex-col justify-between rounded-2xl border border-[#061A2F]/10 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-[#D5A12B]/40"
              >
                <div>
                  <span className="inline-block rounded-lg bg-[#061A2F] px-3 py-1 text-xs font-extrabold tracking-wider text-[#F5D97A] uppercase">
                    {item.title}
                  </span>
                  <h3 className="mt-3 font-[family-name:var(--font-cinzel)] text-lg font-bold text-[#061A2F]">
                    {item.meaning}
                  </h3>
                  <p className="mt-2.5 text-xs leading-relaxed text-[#59616D]">
                    {item.desc}
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-[#061A2F]/6 flex items-center justify-between text-[11px] font-bold text-[#D5A12B]">
                  <span>Pilar Brand</span>
                  <span>✦</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Makna Jam & Jarum Jam 09.09 (99 Asmaul Husna) */}
      <section className="relative isolate overflow-hidden bg-[#021224] text-white py-16 sm:py-20 lg:py-24 border-b border-[#D5A12B]/30">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(213,161,43,0.1)_0%,transparent_70%)] pointer-events-none" />

        <div className="jam-container relative z-10">
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
            {/* Left: Clock Philosophy Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[380px] rounded-3xl border border-[#D5A12B]/40 bg-[#061A2F]/80 p-7 sm:p-8 backdrop-blur-md shadow-2xl text-center">
                <div className="mx-auto grid size-20 place-items-center rounded-2xl bg-gradient-to-b from-[#F5D97A] via-[#D4AF37] to-[#8C6708] p-[1.5px] shadow-[0_8px_24px_rgba(212,175,55,0.35)]">
                  <span className="grid size-full place-items-center rounded-[14px] bg-[#021224] text-[#F5D97A]">
                    <Clock className="size-10 text-[#F5D97A]" strokeWidth={1.7} />
                  </span>
                </div>

                <h3 className="mt-5 font-[family-name:var(--font-cinzel)] text-2xl font-bold text-gradient-gold-rich">
                  Pukul 09.09
                </h3>
                <p className="mt-1 text-xs font-semibold tracking-widest text-slate-300 uppercase">
                  Simbol 99 Asmaul Husna
                </p>

                <div className="my-5 h-px w-16 bg-[#D5A12B]/40 mx-auto" />

                <p className="text-xs leading-relaxed text-slate-200">
                  Logo jam bukan sekadar ornamen penunjuk waktu. Ia melambangkan bahwa setiap perjalanan memiliki waktunya. Ketika waktunya tiba, Allah akan memanggil hamba-Nya ke Baitullah.
                </p>

                <div className="mt-6 rounded-xl border border-white/10 bg-[#021224]/90 p-3 text-[11px] text-[#F5D97A] font-semibold">
                  Waktu adalah amanah. Setiap detik bernilai ibadah.
                </div>
              </div>
            </div>

            {/* Right: Asmaul Husna Inspiration Grid */}
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-[#061A2F] px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-[#F5D97A] border border-[#D5A12B]/30">
                Inspirasi Pelayanan
              </span>

              <h2 className="mt-3 font-[family-name:var(--font-cinzel)] text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-white">
                Berlandaskan Sifat-Sifat Mulia Allah
              </h2>

              <p className="mt-4 text-xs sm:text-sm leading-relaxed text-slate-300">
                Angka 09.09 menegaskan bahwa seluruh proses pelayanan Jam Wisata dijiwai oleh Asmaul Husna untuk menghadirkan rasa tenang, kasih sayang, dan perlindungan bagi jamaah:
              </p>

              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                {asmaulHusna.map((asma) => (
                  <div
                    key={asma.name}
                    className="rounded-xl border border-white/10 bg-[#061A2F]/60 p-3.5 backdrop-blur-xs transition hover:border-[#D5A12B]/40"
                  >
                    <p className="font-[family-name:var(--font-cinzel)] text-sm font-bold text-[#F5D97A]">
                      {asma.name}
                    </p>
                    <p className="mt-0.5 text-[11px] text-slate-300 font-medium">
                      {asma.meaning}
                    </p>
                  </div>
                ))}
              </div>

              {/* Ayat Quran Banner */}
              <div className="mt-8 rounded-2xl border border-[#D5A12B]/35 bg-gradient-to-r from-[#021224] to-[#0A2745] p-5">
                <p className="font-serif text-lg font-bold text-gradient-gold-rich" dir="rtl">
                  وَأَتِمُّوا الْحَجَّ وَالْعُمْرَةَ لِلَّهِ
                </p>
                <p className="mt-2 text-xs text-slate-200 leading-relaxed">
                  &ldquo;Dan sempurnakanlah ibadah Haji dan Umrah karena Allah.&rdquo; <strong className="text-[#E8C967]">(QS. Al-Baqarah : 196)</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: 6 Nilai Perusahaan (Core Values) */}
      <section className="bg-white py-16 sm:py-20 lg:py-24 border-b border-[#061A2F]/8">
        <div className="jam-container">
          <div className="mx-auto max-w-[760px] text-center">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-[#D5A12B] border border-[#D5A12B]/30 shadow-2xs">
              Nilai Utama
            </span>
            <h2 className="mt-3 font-[family-name:var(--font-cinzel)] text-2xl sm:text-3xl lg:text-4xl font-bold text-[#061A2F]">
              6 Nilai yang Selalu Kami Pegang Teguh
            </h2>
            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#64748B]">
              Pedoman integritas dan etos kerja yang menjadi landasan setiap langkah pelayanan kami kepada tamu-tamu Allah.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {coreValues.map((val) => {
              const IconComponent = val.icon;
              return (
                <div
                  key={val.name}
                  className="rounded-2xl border border-[#061A2F]/10 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#D5A12B]/40 hover:shadow-md"
                >
                  <div className="grid size-11 place-items-center rounded-xl bg-[#061A2F] text-[#E8C967] shadow-sm">
                    <IconComponent className="size-5.5" />
                  </div>
                  <h3 className="mt-4 font-[family-name:var(--font-cinzel)] text-lg font-bold text-[#061A2F]">
                    {val.name}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#59616D]">
                    {val.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 5: Janji Kami & Pendekatan */}
      <section className="bg-slate-50/80 py-16 sm:py-20 lg:py-24">
        <div className="jam-container">
          <div className="mx-auto max-w-[880px] rounded-3xl border border-[#D5A12B]/30 bg-white p-8 sm:p-12 shadow-sm text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#061A2F] px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-[#F5D97A]">
              Janji Pelayanan
            </span>

            <h2 className="mt-5 font-[family-name:var(--font-cinzel)] text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-[#061A2F]">
              &ldquo;Setiap Jamaah adalah Tamu Allah yang Harus Kami Muliakan.&rdquo;
            </h2>

            <div className="w-14 h-1 bg-gradient-gold-rich rounded-full my-4 mx-auto" />

            <p className="text-xs sm:text-sm leading-relaxed text-[#59616D] max-w-[680px] mx-auto">
              Kami berjanji akan selalu menjaga amanah, memberikan pelayanan terbaik, dan menghadirkan perjalanan ibadah yang penuh makna dan keberkahan bagi Anda dan keluarga tercinta.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <a
                href="https://wa.me/6281809627499?text=Assalamu%E2%80%99alaikum%2C%20saya%20ingin%20berkonsultasi%20mengenai%20paket%20ibadah%20umrah%20Jam%20Wisata."
                target="_blank"
                rel="noopener noreferrer"
                className="lift-soft sheen-gold flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-gold-rich px-7 text-xs font-extrabold uppercase tracking-wider text-[#061A2F] shadow-md transition hover:scale-105"
              >
                <MessageCircle className="size-4" />
                <span>Konsultasi Perjalanan</span>
              </a>

              <Link
                href="/#paket-umrah"
                className="flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-[#061A2F]/20 hover:border-[#D5A12B] bg-white px-6 text-xs font-bold text-[#061A2F] transition hover:-translate-y-0.5"
              >
                <span>Lihat Program Paket</span>
                <ArrowRight className="size-3.5 text-[#D5A12B]" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <ModernProofFooter />
      <WhatsAppConcierge />
    </main>
  );
}
