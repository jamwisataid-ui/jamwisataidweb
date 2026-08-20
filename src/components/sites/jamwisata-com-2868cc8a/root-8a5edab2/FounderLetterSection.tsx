import Image from "next/image";
import { Quote } from "lucide-react";

export function FounderLetterSection() {
  return (
    <section className="relative isolate overflow-hidden bg-[#03152D] text-[#F6F3ED] py-20 sm:py-24 lg:py-28 border-b border-[#D7A348]/25">
      {/* Subtle Background Glows & Patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_30%,rgba(215,163,72,0.08)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_85%_70%,rgba(6,26,47,0.8)_0%,transparent_100%)] pointer-events-none" />
      
      {/* Subtle geometric line pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #D7A348 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="jam-container relative z-10">
        {/* Top Editorial Bar: Logo & Section Index Badge */}
        <div className="flex items-center justify-between pb-8 mb-10 border-b border-[#D7A348]/20">
          <div className="flex items-center gap-3">
            <div className="relative size-8 sm:size-9">
              <Image
                src="/images/logo-emblem.png"
                alt="Jam Wisata Emblem"
                fill
                sizes="36px"
                className="object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#E0B55B]">
                Jam Wisata
              </span>
              <span className="text-[9px] tracking-wider text-[#94A3B8] uppercase">
                Official Corporate Profile
              </span>
            </div>
          </div>

          {/* Decorative Geometric 07 Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D7A348]/40 bg-[#061A2F]/90 px-3.5 py-1 text-[11px] font-bold tracking-widest text-[#E0B55B] backdrop-blur-md shadow-sm">
            <span className="size-1.5 rounded-full bg-[#E0B55B] animate-pulse" />
            <span className="font-[family-name:var(--font-cinzel)] font-bold">07</span>
            <span className="text-[10px] uppercase tracking-wider text-slate-300 font-medium">Editorial</span>
          </div>
        </div>

        {/* Continuous Editorial 3-Part Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 xl:gap-10 items-stretch">
          
          {/* ================= AREA 1: FOUNDER IDENTITY ================= */}
          <div className="lg:col-span-3 flex flex-col justify-between">
            <div>
              {/* Serif Headline */}
              <div className="font-[family-name:var(--font-cinzel)] tracking-tight">
                <span className="block text-xs sm:text-sm font-extrabold uppercase tracking-[0.25em] text-[#D7A348]">
                  Pesan Dari Pimpinan
                </span>
                <h2 className="mt-1 text-3xl sm:text-4xl lg:text-4xl font-bold leading-none text-white">
                  FOUNDER <br />
                  <span className="text-gradient-gold-rich">LETTER</span>
                </h2>
              </div>

              <div className="w-12 h-0.5 bg-gradient-to-r from-[#D7A348] to-transparent mt-4 mb-6" />

              <p className="text-xs leading-relaxed text-slate-300 font-light hidden lg:block">
                Dedikasi tulus mendampingi setiap langkah jamaah menuju Baitullah dengan hati dan integritas.
              </p>
            </div>

            {/* Founder Portrait & Circular Gold Decorative Halo */}
            <div className="relative mt-6 lg:mt-auto pt-6 flex flex-col items-center lg:items-start">
              <div className="relative w-full max-w-[280px] aspect-[4/5] flex items-end justify-center">
                {/* Decorative subtle gold circular outline behind portrait */}
                <div className="absolute inset-0 m-auto size-52 sm:size-56 rounded-full border border-[#D7A348]/25 bg-radial from-[#D7A348]/10 to-transparent -z-10 pointer-events-none" />
                <div className="absolute inset-0 m-auto size-44 sm:size-48 rounded-full border border-dashed border-[#E0B55B]/20 -z-10 pointer-events-none" />

                {/* Portrait Frame */}
                <div className="relative w-full h-full overflow-hidden rounded-2xl border border-[#D7A348]/40 shadow-2xl bg-[#061A2F]">
                  <Image
                    src="/sites/jamwisata-com-2868cc8a/root-8a5edab2/nanang-suharna-founder.png"
                    alt="Nanang Suharna — Founder & CEO Jam Wisata"
                    fill
                    sizes="(min-width: 1024px) 25vw, 280px"
                    className="object-cover object-top"
                  />
                  {/* Subtle gradient blend into bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#03152D]/90 via-transparent to-black/10" />
                </div>
              </div>

              {/* Elegant Dark Navy + Gold Outline Nameplate */}
              <div className="w-full max-w-[280px] mt-3 rounded-xl border border-[#D7A348]/40 bg-[#061A2F]/90 px-4 py-3 shadow-lg backdrop-blur-md text-center lg:text-left">
                <h3 className="font-[family-name:var(--font-cinzel)] text-sm sm:text-base font-bold text-white tracking-wide">
                  Nanang Suharna
                </h3>
                <p className="mt-0.5 text-[11px] font-semibold text-[#E0B55B] tracking-wider uppercase">
                  Founder &amp; CEO Jam Wisata
                </p>
              </div>
            </div>
          </div>

          {/* ================= AREA 2: PERSONAL LETTER ================= */}
          <div className="lg:col-span-5 flex flex-col justify-between lg:px-4 lg:border-l lg:border-r border-[#D7A348]/20 relative">
            <div className="space-y-4 text-xs sm:text-[13px] leading-relaxed text-[#F6F3ED]/90 font-[family-name:var(--font-montserrat)] font-light">
              {/* Bismillah Header in Gold Italic Serif */}
              <div className="pb-2">
                <p className="font-[family-name:var(--font-cormorant)] text-2xl sm:text-3xl italic text-[#E0B55B] font-medium tracking-wide">
                  Bismillahirrahmanirrahim
                </p>
                <div className="w-16 h-px bg-gradient-to-r from-[#D7A348] via-[#E0B55B] to-transparent mt-2" />
              </div>

              <p className="font-semibold text-white text-sm sm:text-base pt-1">
                Assalamu’alaikum Warahmatullahi Wabarakatuh,
              </p>

              <p>
                Alhamdulillah, segala puji bagi Allah SWT yang telah memberikan nikmat iman, kesehatan dan kesempatan kepada kita untuk terus berkarya dan melayani umat.
              </p>

              <p>
                Jam Wisata hadir dari sebuah niat tulus untuk menjadi bagian dari perjalanan suci Anda. Kami percaya, setiap langkah menuju Baitullah adalah panggilan hati, dan kami ingin memastikan perjalanan tersebut menjadi pengalaman yang <strong className="text-[#E0B55B] font-semibold">aman, nyaman, dan penuh makna</strong>.
              </p>

              <p>
                Dengan izin Allah, kami berkomitmen memberikan pelayanan terbaik yang terintegrasi, profesional dan berlandaskan nilai-nilai Islam. Kami tidak hanya mengantarkan Anda ke Tanah Suci, tetapi juga mendampingi <strong className="text-[#E0B55B] font-semibold">dengan hati</strong>, agar ibadah Anda lebih khusyuk dan mendapatkan keberkahan.
              </p>

              <p>
                Terima kasih telah mempercayakan perjalanan ibadah Anda bersama Jam Wisata. Semoga Allah mudahkan langkah kita semua menuju Tanah Suci dan menerima setiap amal ibadah kita.
              </p>

              <p className="font-semibold text-white pt-1">
                Wassalamu’alaikum Warahmatullahi Wabarakatuh.
              </p>
            </div>

            {/* Handwritten Signature & Name Closing */}
            <div className="mt-8 pt-5 border-t border-[#D7A348]/15 flex items-end justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#94A3B8]">
                  Hormat Kami,
                </p>
                {/* Elegant Gold Signature Representation */}
                <div className="mt-1 font-[family-name:var(--font-cormorant)] text-2xl sm:text-3xl italic font-bold text-[#E0B55B] tracking-wide">
                  Nanang Suharna
                </div>
                <p className="text-[11px] text-slate-300 font-medium">
                  Founder &amp; CEO Jam Wisata
                </p>
              </div>

              {/* Islamic Pattern Accent */}
              <div className="text-[#D7A348]/40 text-xl select-none" aria-hidden="true">
                ✦ ✦ ✦
              </div>
            </div>
          </div>

          {/* ================= AREA 3: BAITULLAH VISUAL & QUOTE CARD ================= */}
          <div className="lg:col-span-4 relative min-h-[420px] sm:min-h-[500px] lg:min-h-full flex flex-col justify-end overflow-hidden rounded-[24px] border border-[#D7A348]/30">
            {/* Background Makkah / Ka'bah Photo with Gradient Mask Flow */}
            <div className="absolute inset-0">
              <Image
                src="/jamwisata-makkah.png"
                alt="Masjidil Haram dan Menara Jam Makkah saat Golden Hour"
                fill
                sizes="(min-width: 1024px) 35vw, 100vw"
                className="object-cover object-center"
              />
              {/* Left-to-right gradient mask and dark overlay blend */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#03152D] via-transparent to-black/30" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#03152D] via-[#03152D]/40 to-transparent" />
            </div>

            {/* Top Tag: Baitullah Anchor */}
            <div className="absolute top-4 right-4 z-10">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-[#03152D]/85 border border-[#D7A348]/35 px-2.5 py-1 text-[10px] font-bold tracking-wider text-[#E0B55B] backdrop-blur-md uppercase">
                Makkah Al-Mukarramah
              </span>
            </div>

            {/* Floating Quote Card at Bottom Right */}
            <div className="relative z-10 m-4 sm:m-5 rounded-[20px] border border-[#D7A348]/35 bg-[#03152D]/90 p-5 sm:p-6 backdrop-blur-md shadow-2xl">
              <Quote className="size-7 text-[#E0B55B] mb-2.5 opacity-90" />
              <p className="font-[family-name:var(--font-cormorant)] text-base sm:text-lg italic leading-snug text-[#F6F3ED]">
                &ldquo;Kami tidak hanya mengantarkan Anda ke Tanah Suci, tetapi juga mendampingi <span className="text-[#E0B55B] font-semibold not-italic">dengan hati</span>, agar ibadah Anda lebih khusyuk dan mendapatkan keberkahan.&rdquo;
              </p>
              <div className="mt-3 pt-2.5 border-t border-[#D7A348]/20 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#E0B55B]">
                  Komitmen Jam Wisata
                </span>
                <span className="text-[10px] text-slate-300 font-medium">
                  Pelayanan Ibadah Terpercaya
                </span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
