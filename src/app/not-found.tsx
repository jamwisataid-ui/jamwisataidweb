import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="jw-site grid min-h-screen place-items-center bg-[var(--jw-navy)] px-5 text-center text-white">
      <div className="max-w-xl">
        <p className="jw-eyebrow justify-center text-[var(--jw-gold)]">Halaman tidak ditemukan</p>
        <h1 className="font-display text-5xl sm:text-7xl">Perjalanan ini belum tersedia.</h1>
        <p className="mt-5 text-sm leading-7 text-white/60">Kembali ke beranda untuk melihat program dan informasi perjalanan Jam Wisata.</p>
        <Link href="/" className="jw-button jw-button-gold mt-8"><ArrowLeft className="size-4" /> Kembali ke beranda</Link>
      </div>
    </main>
  );
}
