import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenText,
  Clock3,
  HeartHandshake,
  Hotel,
  Mail,
  MapPin,
  MessageCircle,
  Plane,
  Quote,
} from "lucide-react";

import { contact, formatRupiah, services, trustValues } from "@/data/site-content";
import { getSiteContent } from "@/lib/db";
import { FAQList, PlannerTeaser, ProgramGrid, TestimonialVideos } from "./HomeInteractive";
import { SectionHeader } from "./SectionHeader";
import { SiteHeader } from "./SiteHeader";

const assetRoot = "/sites/jamwisata-com-2868cc8a/root-8a5edab2";
export async function HomePage() {
  const { programs, plannerOptions, destinations, gallery, articles, faqs, videos } = await getSiteContent();
  const featured = programs[0];
  return (
    <div className="jw-site">
      <a href="#main-content" className="skip-link">Lewati ke konten utama</a>
      <SiteHeader />
      <main id="main-content">
        <section id="beranda" className="jw-hero">
          <Image src={`${assetRoot}/hero.jpg`} alt="Masjidil Haram dan Ka'bah" fill priority sizes="100vw" className="object-cover object-[58%_center]" />
          <div className="jw-hero-overlay" />
          <div className="jw-pattern absolute inset-0 opacity-[0.035]" />
          <div className="jw-container relative grid min-h-[720px] items-center gap-10 py-16 lg:grid-cols-[1.15fr_.65fr] lg:py-20">
            <div className="max-w-[760px] text-white">
              <p className="jw-eyebrow text-[var(--jw-gold)] before:bg-[var(--jw-gold)]">Layanan Umrah Premium</p>
              <h1 className="max-w-[760px] font-display text-[clamp(2.45rem,5.2vw,4.8rem)] leading-[1.03] tracking-[-0.035em] text-balance">
                Setiap langkah menuju Baitullah <span className="text-[var(--jw-gold)]">layak dibimbing sepenuh hati.</span>
              </h1>
              <p className="mt-6 max-w-[650px] text-[15px] leading-7 text-white/74 sm:text-lg sm:leading-8">Kami membantu mempersiapkan perjalanan ibadah Anda agar berjalan aman, nyaman, terarah, dan penuh makna—sejak persiapan hingga kepulangan.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="#program" className="jw-button jw-button-gold">Lihat program Umrah <ArrowRight className="size-4" /></Link>
                <a href={contact.whatsapp} target="_blank" rel="noreferrer" className="jw-button jw-button-outline-light"><MessageCircle className="size-4" /> Konsultasi gratis</a>
              </div>
              <div className="mt-10 grid max-w-[720px] gap-4 border-t border-white/20 pt-7 sm:grid-cols-3">
                {[
                  [BookOpenText, "Informasi transparan", "Rincian program disampaikan jelas"],
                  [HeartHandshake, "Pendampingan menyeluruh", "Sebelum, saat, dan setelah"],
                  [Quote, "Fokus pada ibadah", "Perjalanan disusun lebih tenang"],
                ].map(([Icon, title, text]) => (
                  <div key={String(title)} className="flex gap-3"><Icon className="mt-0.5 size-5 shrink-0 text-[var(--jw-gold)]" /><div><p className="text-xs font-semibold">{String(title)}</p><p className="mt-1 text-[10px] leading-4 text-white/55">{String(text)}</p></div></div>
                ))}
              </div>
            </div>
            <aside className="jw-departure-card" aria-label="Program keberangkatan pilihan">
              <p className="jw-eyebrow !mb-3 !text-[9px]">Program terdekat</p>
              <p className="font-editorial text-[30px] leading-none text-[var(--jw-navy)]">{featured.departureDate}</p>
              <p className="mt-2 text-xs font-medium text-[var(--jw-muted)]">{featured.duration} · {featured.name}</p>
              <div className="mt-6 space-y-4 border-y border-[var(--jw-navy)]/10 py-5 text-xs">
                <p className="flex gap-3"><Plane className="size-4 text-[var(--jw-gold-dark)]" /><span><span className="block text-[10px] text-[var(--jw-muted)]">Maskapai</span><strong className="text-[var(--jw-navy)]">{featured.airline}</strong></span></p>
                <p className="flex gap-3"><Hotel className="size-4 text-[var(--jw-gold-dark)]" /><span><span className="block text-[10px] text-[var(--jw-muted)]">Hotel Makkah</span><strong className="text-[var(--jw-navy)]">{featured.makkahHotel}</strong></span></p>
                <p className="flex gap-3"><Hotel className="size-4 text-[var(--jw-gold-dark)]" /><span><span className="block text-[10px] text-[var(--jw-muted)]">Hotel Madinah</span><strong className="text-[var(--jw-navy)]">{featured.madinahHotel}</strong></span></p>
              </div>
              <p className="mt-5 text-[10px] font-medium tracking-wide text-[var(--jw-muted)] uppercase">Harga mulai</p>
              <p className="mt-1 font-editorial text-[34px] text-[var(--jw-gold-dark)]">Rp{formatRupiah(featured.price)}<span className="ml-1 font-sans text-[10px] text-[var(--jw-muted)]">/pax</span></p>
              <Link href={`/program/${featured.slug}`} className="jw-button jw-button-navy mt-5 w-full">Lihat detail program <ArrowRight className="size-4" /></Link>
              <p className="mt-4 text-center text-[10px] leading-4 text-[var(--jw-muted)]">Ketersediaan seat dan rincian akhir dikonfirmasi langsung oleh tim Jam Wisata.</p>
            </aside>
          </div>
        </section>

        <section className="relative z-10 -mt-7 pb-10 sm:-mt-10">
          <div className="jw-container grid overflow-hidden rounded-[22px] border border-[var(--jw-navy)]/8 bg-white shadow-[0_20px_60px_rgba(10,29,58,.1)] sm:grid-cols-2 xl:grid-cols-4">
            {trustValues.map(({ title, description, icon: Icon }, index) => (
              <article key={title} className={`flex gap-4 p-6 ${index ? "border-t border-[var(--jw-navy)]/8 sm:border-t-0 sm:border-l" : ""}`}>
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[var(--jw-cream)] text-[var(--jw-gold-dark)]"><Icon className="size-5" /></span>
                <div><h2 className="text-xs font-semibold text-[var(--jw-navy)]">{title}</h2><p className="mt-1.5 text-[10px] leading-4 text-[var(--jw-muted)]">{description}</p></div>
              </article>
            ))}
          </div>
        </section>

        <section className="jw-section bg-[var(--jw-cream)]">
          <div className="jw-container grid items-end gap-10 lg:grid-cols-[.75fr_1.25fr]">
            <div>
              <SectionHeader eyebrow="Journey Planner" title="Mari temukan program yang paling tepat untuk Anda." description="Jawab satu pertanyaan awal, lalu lanjutkan proses singkat agar rekomendasi kami lebih sesuai dengan kebutuhan perjalanan Anda." />
              <Link href="/journey-planner" className="jw-button jw-button-navy mt-7">Mulai rencanakan perjalanan <ArrowRight className="size-4" /></Link>
              <p className="mt-3 flex items-center gap-2 text-[10px] text-[var(--jw-muted)]"><Clock3 className="size-3.5 text-[var(--jw-gold-dark)]" /> Membutuhkan waktu kurang dari 1 menit.</p>
            </div>
            <PlannerTeaser options={plannerOptions} />
          </div>
        </section>

        <section id="program" className="jw-section bg-white">
          <div className="jw-container">
            <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
              <SectionHeader eyebrow="Program Umrah pilihan" title="Program terbaik untuk kebutuhan perjalanan Anda." description="Setiap program menampilkan informasi utama secara terbuka agar lebih mudah dipahami dan dibandingkan." />
              <Link href="/journey-planner" className="jw-text-link">Bantu saya memilih <ArrowRight className="size-4" /></Link>
            </div>
            <ProgramGrid programs={programs} />
          </div>
        </section>

        <section id="keberangkatan" className="border-y border-[var(--jw-navy)]/10 bg-[var(--jw-cream)] py-10">
          <div className="jw-container grid items-center gap-6 lg:grid-cols-[.7fr_1.3fr]">
            <div><p className="jw-eyebrow">Jadwal perjalanan</p><h2 className="font-editorial text-3xl text-[var(--jw-navy)]">Keberangkatan berikutnya</h2></div>
            <div className="grid gap-4 rounded-2xl bg-white p-5 shadow-sm sm:grid-cols-[1fr_auto_auto] sm:items-center sm:p-6">
              <div><p className="font-editorial text-2xl text-[var(--jw-navy)]">{featured.departureDate}</p><p className="mt-1 text-xs text-[var(--jw-muted)]">{featured.name} · {featured.airline}</p></div>
              <div className="text-xs"><span className="block text-[10px] text-[var(--jw-muted)]">Ketersediaan</span><strong className="text-[var(--jw-gold-dark)]">Konfirmasi tim</strong></div>
              <Link href={`/program/${featured.slug}`} className="jw-button jw-button-outline">Lihat jadwal <ArrowRight className="size-4" /></Link>
            </div>
          </div>
        </section>

        <section id="tentang" className="jw-section bg-white">
          <div className="jw-container grid items-center gap-12 lg:grid-cols-[1.05fr_.95fr] lg:gap-20">
            <div className="relative min-h-[520px]">
              <div className="absolute inset-x-0 top-0 h-[86%] overflow-hidden rounded-[28px]">
                <Image src={`${assetRoot}/about.jpg`} alt="Suasana jamaah beribadah di Masjidil Haram" fill sizes="(min-width:1024px) 50vw,100vw" className="object-cover" />
                <div className="absolute inset-0 bg-[var(--jw-navy)]/12" />
              </div>
              <div className="absolute right-0 bottom-0 max-w-[300px] rounded-2xl border border-white/60 bg-[var(--jw-navy)] p-6 text-white shadow-xl sm:right-8">
                <p className="font-quote text-2xl leading-snug italic">“Kami tidak hanya mengantarkan, tetapi mendampingi setiap langkah.”</p>
                <p className="mt-4 text-[10px] font-semibold tracking-[0.12em] text-[var(--jw-gold)] uppercase">Janji Jam Wisata</p>
              </div>
            </div>
            <div>
              <SectionHeader eyebrow="Mengapa Jam Wisata" title="Perjalanan yang baik dimulai dari persiapan yang dipercaya." description="Jam Wisata hadir sebagai pendamping perjalanan menuju Baitullah—menggabungkan profesionalisme, pelayanan, ilmu, dan nilai-nilai Islam agar jamaah dapat beribadah dengan lebih tenang." />
              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                {[
                  ["Amanah & transparan", "Informasi program disampaikan secara jelas."],
                  ["Persiapan menyeluruh", "Manasik dan kebutuhan perjalanan dipandu bertahap."],
                  ["Pendamping profesional", "Tim hadir sebelum, selama, dan setelah perjalanan."],
                  ["Nyaman & terencana", "Akomodasi dan perjalanan dipersiapkan dengan baik."],
                ].map(([title, text]) => <div key={title} className="border-t border-[var(--jw-gold)]/50 pt-4"><h3 className="text-sm font-semibold text-[var(--jw-navy)]">{title}</h3><p className="mt-2 text-xs leading-5 text-[var(--jw-muted)]">{text}</p></div>)}
              </div>
              <a href="https://jamwisata.com" target="_blank" rel="noreferrer" className="jw-text-link mt-8">Tentang Jam Wisata <ArrowRight className="size-4" /></a>
            </div>
          </div>
        </section>

        <section className="jw-section bg-[var(--jw-cream)]">
          <div className="jw-container">
            <SectionHeader eyebrow="Pengalaman layanan" title="Semua yang Anda butuhkan, dipersiapkan untuk perjalanan yang nyaman." />
            <div className="mt-10 grid gap-5 lg:grid-cols-[1.05fr_.95fr]">
              <article className="relative min-h-[480px] overflow-hidden rounded-[26px] bg-[var(--jw-navy)] p-8 text-white sm:p-10">
                <Image src={`${assetRoot}/promo.jpg`} alt="Suasana Masjidil Haram" fill sizes="(min-width:1024px) 55vw,100vw" className="object-cover opacity-45" />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--jw-navy)] via-[var(--jw-navy)]/50 to-transparent" />
                <div className="relative flex h-full flex-col justify-end"><HeartHandshake className="size-8 text-[var(--jw-gold)]" /><h3 className="mt-5 max-w-lg font-editorial text-4xl leading-tight">Pendampingan dari persiapan hingga kepulangan.</h3><p className="mt-4 max-w-lg text-sm leading-7 text-white/65">Perhatian tidak berhenti ketika pesawat berangkat. Tim membantu jamaah memahami tahapan, kebutuhan, dan ritme perjalanan.</p></div>
              </article>
              <div className="grid gap-5 sm:grid-cols-2">
                {services.map(({ title, description, icon: Icon }) => <article key={title} className="rounded-2xl border border-[var(--jw-navy)]/8 bg-white p-6"><span className="grid size-11 place-items-center rounded-full bg-[var(--jw-cream)] text-[var(--jw-gold-dark)]"><Icon className="size-5" /></span><h3 className="mt-6 font-editorial text-2xl text-[var(--jw-navy)]">{title}</h3><p className="mt-3 text-xs leading-6 text-[var(--jw-muted)]">{description}</p></article>)}
              </div>
            </div>
          </div>
        </section>

        <section className="jw-section relative overflow-hidden bg-[var(--jw-navy)] text-white">
          <div className="jw-pattern absolute inset-0 opacity-[0.03]" />
          <div className="jw-container relative">
            <SectionHeader eyebrow="Wisata halal" title="Jelajahi dunia dengan nyaman dan halal." description="Rangkaian perjalanan pilihan bagi jamaah yang ingin mengenal sejarah, budaya, dan destinasi baru dengan pendampingan yang terarah." />
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {destinations.map((destination, index) => <article key={destination.name} className={`group relative min-h-[390px] overflow-hidden rounded-[22px] ${index === 1 ? "md:translate-y-8" : ""}`}><Image src={destination.image} alt={`Destinasi halal ${destination.name}`} fill sizes="(min-width:768px) 33vw,100vw" className="object-cover transition duration-500 group-hover:scale-[1.035]" /><div className="absolute inset-0 bg-gradient-to-t from-[var(--jw-navy)] via-transparent to-transparent" /><div className="absolute right-6 bottom-6 left-6"><p className="text-[10px] tracking-[0.12em] text-[var(--jw-gold)] uppercase">{destination.label}</p><h3 className="mt-2 font-editorial text-3xl">{destination.name}</h3></div></article>)}
            </div>
          </div>
        </section>

        <section id="testimoni" className="jw-section bg-white">
          <div className="jw-container">
            <SectionHeader eyebrow="Cerita jamaah" title="Pengalaman jamaah, diceritakan langsung oleh mereka." description="Dengarkan pengalaman nyata jamaah yang telah menjalani perjalanan bersama Jam Wisata." />
            <TestimonialVideos videos={videos} />
          </div>
        </section>

        <section id="galeri" className="jw-section bg-[var(--jw-cream)]">
          <div className="jw-container">
            <SectionHeader eyebrow="Jejak perjalanan" title="Momen perjalanan jamaah." description="Dokumentasi ibadah, kebersamaan, dan perjalanan yang menjadi bagian dari kisah setiap jamaah." />
            <div className="mt-10 grid auto-rows-[190px] grid-cols-2 gap-3 md:auto-rows-[240px] md:grid-cols-4">
              {gallery.map((item, index) => <figure key={item.image} className={`group relative overflow-hidden rounded-2xl ${index === 0 ? "col-span-2 row-span-2" : ""} ${index === 3 ? "md:col-span-2" : ""}`}><Image src={item.image} alt={item.alt} fill sizes="(min-width:768px) 50vw,100vw" className="object-cover transition duration-500 group-hover:scale-[1.035]" /><div className="absolute inset-0 bg-[var(--jw-navy)]/0 transition group-hover:bg-[var(--jw-navy)]/12" /></figure>)}
            </div>
          </div>
        </section>

        <section id="artikel" className="jw-section bg-white">
          <div className="jw-container">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><SectionHeader eyebrow="Artikel & informasi" title="Bekal ilmu sebelum berangkat." description="Informasi yang membantu jamaah memahami ibadah, persiapan, dan perjalanan dengan lebih baik." /><a href="https://jamwisata.com" className="jw-text-link">Lihat semua artikel <ArrowRight className="size-4" /></a></div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {articles.map((article) => <article key={article.title} className="group"><div className="relative aspect-[16/10] overflow-hidden rounded-2xl"><Image src={article.image} alt="" fill sizes="(min-width:768px) 33vw,100vw" className="object-cover transition duration-500 group-hover:scale-[1.035]" /></div><p className="mt-5 text-[10px] font-semibold tracking-[0.12em] text-[var(--jw-gold-dark)] uppercase">{article.category}</p><h3 className="mt-2 font-editorial text-2xl leading-snug text-[var(--jw-navy)]">{article.title}</h3><p className="mt-3 text-[10px] text-[var(--jw-muted)]">{article.date}</p></article>)}
            </div>
          </div>
        </section>

        <section className="jw-section bg-[var(--jw-cream)]">
          <div className="jw-container grid gap-12 lg:grid-cols-[.65fr_1.35fr] lg:gap-20">
            <SectionHeader eyebrow="Pertanyaan umum" title="Informasi sebelum berangkat." description="Jawaban singkat untuk membantu Anda memahami proses perjalanan bersama Jam Wisata." />
            <FAQList faqs={faqs} />
          </div>
        </section>

        <section id="kontak" className="bg-[var(--jw-cream)] px-4 pb-14 sm:px-0 sm:pb-20">
          <div className="jw-container relative overflow-hidden rounded-[28px] bg-[var(--jw-navy)] px-7 py-14 text-white sm:px-12 lg:px-16 lg:py-20">
            <Image src={`${assetRoot}/promo.jpg`} alt="" fill sizes="1280px" className="object-cover opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--jw-navy)] via-[var(--jw-navy)]/90 to-[var(--jw-navy)]/45" />
            <div className="jw-pattern absolute inset-0 opacity-[0.035]" />
            <div className="relative max-w-3xl"><p className="jw-eyebrow text-[var(--jw-gold)]">Mulai dari percakapan</p><h2 className="font-display text-[clamp(2.2rem,5vw,4rem)] leading-[1.05]">Siap merencanakan perjalanan bersama Jam Wisata?</h2><p className="mt-5 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">Kami siap membantu Anda mempersiapkan perjalanan menuju Baitullah dengan lebih tenang dan terarah.</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><a href={contact.whatsapp} target="_blank" rel="noreferrer" className="jw-button jw-button-gold"><MessageCircle className="size-4" /> Konsultasi via WhatsApp</a><Link href="#program" className="jw-button jw-button-outline-light">Lihat program Umrah</Link></div></div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-[#06152b] text-white">
      <div className="jw-container grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.25fr_.75fr_.75fr_1.1fr]">
        <div><Image src={`${assetRoot}/logo.png`} alt="Jam Wisata" width={500} height={116} className="h-auto w-[190px] brightness-0 invert" /><p className="mt-5 font-editorial text-2xl text-[var(--jw-gold)]">Setiap Waktu Bernilai Ibadah.</p><p className="mt-3 max-w-sm text-xs leading-6 text-white/50">Pendamping perjalanan menuju Baitullah yang menggabungkan profesionalisme, pelayanan, ilmu, dan nilai-nilai Islam.</p><a href={contact.instagram} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-xs text-white/60 hover:text-white"><span className="grid size-5 place-items-center rounded-full border border-[var(--jw-gold)] text-[9px] text-[var(--jw-gold)]">IG</span> @jamwisata</a></div>
        <FooterColumn title="Jam Wisata" links={[["Tentang Kami", "/#tentang"], ["Journey Planner", "/journey-planner"], ["Galeri", "/#galeri"], ["FAQ", "/#faq"]]} />
        <FooterColumn title="Program" links={[["Umrah Reguler", "/#program"], ["Umrah Plus", "/#program"], ["Private Umrah", contact.whatsapp], ["Wisata Halal", "/#destinasi"]]} />
        <div><h2 className="text-xs font-semibold tracking-[0.1em] uppercase">Kontak</h2><div className="mt-5 space-y-4 text-xs leading-5 text-white/50"><a href={contact.phoneHref} className="flex gap-3 hover:text-white"><MessageCircle className="size-4 shrink-0 text-[var(--jw-gold)]" />{contact.phone}</a><a href={`mailto:${contact.email}`} className="flex gap-3 hover:text-white"><Mail className="size-4 shrink-0 text-[var(--jw-gold)]" />{contact.email}</a><a href={contact.maps} target="_blank" rel="noreferrer" className="flex gap-3 hover:text-white"><MapPin className="size-4 shrink-0 text-[var(--jw-gold)]" />{contact.address}</a></div></div>
      </div>
      <div className="border-t border-white/8"><div className="jw-container flex flex-col gap-3 py-5 text-[10px] text-white/35 sm:flex-row sm:items-center sm:justify-between"><p>© {new Date().getFullYear()} Jaris Ammar Madani — Jam Wisata.</p><div className="flex gap-5"><a href="https://jamwisata.com" className="hover:text-white">Kebijakan privasi</a><a href="https://jamwisata.com" className="hover:text-white">Syarat & ketentuan</a></div></div></div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: readonly (readonly [string, string])[] }) {
  return <nav aria-label={title}><h2 className="text-xs font-semibold tracking-[0.1em] uppercase">{title}</h2><ul className="mt-5 space-y-3 text-xs text-white/50">{links.map(([label, href]) => <li key={label}><Link href={href} className="hover:text-white">{label}</Link></li>)}</ul></nav>;
}
