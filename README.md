# Jam Wisata

Website resmi Jaris Ammar Madani — Jam Wisata, pendamping perjalanan Umrah dan wisata halal dengan pengalaman digital yang premium, tenang, informatif, dan personal.

> **Setiap Waktu Bernilai Ibadah.**

## Tentang proyek

Website ini dibangun sebagai ekosistem digital Jam Wisata, bukan marketplace paket perjalanan. Pengunjung dapat memahami pendekatan layanan, melihat program secara transparan, memakai Journey Planner untuk menemukan pilihan yang lebih sesuai, lalu berkonsultasi dengan tim melalui WhatsApp.

Konten utama disimpan di PostgreSQL Neon dan dibaca dari Server Components. Data lokal bertipe tetap tersedia sebagai fallback agar halaman tetap dapat dirender saat database tidak tersedia.

## Fitur utama

- Homepage premium dengan hero, trust strip, program pilihan, layanan, destinasi halal, testimoni video, galeri, artikel, FAQ, dan CTA konsultasi.
- Journey Planner enam langkah di `/journey-planner` dengan rekomendasi program berdasarkan kebutuhan jamaah.
- Detail program dinamis di `/program/[slug]` dengan harga, jadwal, hotel, fasilitas, dan ringkasan konsultasi sticky.
- Konten program dan koleksi editorial tersimpan di PostgreSQL Neon.
- Navigasi mobile aksesibel, focus state yang terlihat, semantic HTML, dan dukungan `prefers-reduced-motion`.
- Video YouTube baru dimuat setelah interaksi dan menggunakan domain `youtube-nocookie.com`.
- Responsive image melalui `next/image`, metadata SEO, Open Graph, dan halaman 404 bermerek.

## Stack

- Next.js 16 App Router
- React 19 dan TypeScript strict
- Tailwind CSS 4
- PostgreSQL Neon melalui `pg`
- Next Font: Cinzel, Cormorant Garamond, Montserrat, Playfair Display, dan Reem Kufi
- Lucide React
- Playwright
- Docker multi-stage

## Memulai

Prasyarat:

- Node.js 24
- npm
- Database PostgreSQL/Neon untuk konten production

Clone dan instal dependency:

```bash
git clone https://github.com/jamwisataid-ui/jamwisataidweb.git
cd jamwisataidweb
npm ci
```

Salin konfigurasi environment:

```bash
Copy-Item .env.example .env.local
```

Isi `DATABASE_URL` di `.env.local` dengan connection string PostgreSQL. File `.env.local` tidak dilacak Git.

Seed schema dan konten awal:

```bash
npm run db:seed
```

Jalankan development server:

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

## Perintah

| Perintah | Kegunaan |
| --- | --- |
| `npm run dev` | Menjalankan development server |
| `npm run build` | Membuat production build |
| `npm run start` | Menjalankan production server |
| `npm run lint` | Memeriksa kode dengan ESLint |
| `npm run typecheck` | Memeriksa TypeScript tanpa emit |
| `npm run check` | Menjalankan lint, typecheck, dan build |
| `npm run db:seed` | Membuat schema dan melakukan upsert konten awal |
| `npx playwright test` | Menjalankan smoke test browser |

Seed bersifat idempotent: perintah dapat dijalankan ulang untuk memperbarui konten awal tanpa membuat duplikasi.

## Arsitektur data

Database menggunakan dua tabel:

- `jw_programs` — data program terstruktur: slug, kategori, tanggal, maskapai, hotel, kapasitas, harga, destinasi, dan status publikasi.
- `jw_content` — koleksi JSON untuk Journey Planner, destinasi, galeri, artikel, FAQ, dan video testimonial.

Koneksi database berada di [src/lib/db.ts](src/lib/db.ts). Schema dan seed berada di [scripts/seed-jamwisata.mjs](scripts/seed-jamwisata.mjs).

Untuk mengubah konten awal, perbarui seed lalu jalankan kembali `npm run db:seed`. Untuk production, isi `DATABASE_URL` pada environment platform deployment.

## Struktur penting

```text
src/
  app/
    journey-planner/       Halaman wizard rekomendasi
    program/[slug]/        Detail program dinamis
    globals.css            Design tokens dan global UI system
  components/jamwisata/    Komponen homepage, header, planner, dan interaksi
  data/site-content.ts     Tipe domain dan fallback content
  lib/db.ts                Data access layer PostgreSQL
public/sites/              Aset foto dan identitas Jam Wisata
scripts/seed-jamwisata.mjs Schema dan seed database
tests/website.spec.ts      Smoke test responsif dan interaksi utama
```

## Quality check

Sebelum push atau deploy:

```bash
npm run check
```

Untuk pengujian browser, jalankan `npm run dev` pada terminal pertama lalu:

```bash
npx playwright test
```

## Docker

Production:

```bash
docker compose up app --build
```

Development:

```bash
docker compose up dev --build
```

Container production menggunakan port `3000`; development menggunakan port `3001` secara default.

## Keamanan

- Jangan commit `.env.local`, credential database, token, atau private key.
- Gunakan environment variable pada Vercel/Docker untuk `DATABASE_URL` production.
- Rotasi credential segera jika connection string pernah terekspos di tempat publik.

Hak atas merek, logo, foto, video, dan materi Jam Wisata dimiliki oleh pemilik masing-masing.
