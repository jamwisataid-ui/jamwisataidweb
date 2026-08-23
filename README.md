# Jam Wisata Website & CMS

Website resmi dan content management system Jam Wisata, biro perjalanan Umrah dan wisata halal dengan semangat **“Setiap Waktu Bernilai Ibadah.”** Proyek ini mempertahankan pengalaman publik yang telah disetujui klien sekaligus menambahkan dashboard privat untuk mengelola paket, jadwal, artikel, testimonial, galeri, destinasi, FAQ, layanan, serta konten homepage.

## Fitur

- Website publik responsif dengan filter paket, detail program, harga, jadwal, SEO, dan konsultasi WhatsApp.
- CMS privat di `/admin` dengan satu akun administrator.
- Workflow draft dan publish manual; draft tidak tampil di website publik.
- Paket lengkap: keberangkatan, maskapai, hotel, harga, seat, fasilitas, itinerary, dan SEO.
- Artikel rich text menggunakan TipTap.
- Testimonial YouTube, galeri gambar, destinasi halal, FAQ, layanan, homepage, dan pengaturan situs.
- Neon PostgreSQL melalui Drizzle ORM, UploadThing untuk media, dan Resend untuk email.
- Cache publik otomatis diinvalidasi setelah konten diterbitkan.
- Audit log untuk aktivitas editorial.

## Stack

Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Neon, Drizzle ORM, Better Auth, UploadThing, TipTap, Zod, Sonner, Resend, dan Playwright.

## Persyaratan

- Node.js 24.x dan npm
- Database Neon PostgreSQL
- Akun UploadThing untuk upload media
- Akun Resend bila reset password melalui email digunakan

## Instalasi Lokal

```bash
git clone https://github.com/jamwisataid-ui/jamwisataidweb.git
cd jamwisataidweb
npm ci
Copy-Item .env.example .env.local
```

Isi `.env.local`, lalu siapkan database dan admin:

```bash
npm run db:migrate
npm run db:seed
npm run admin:create -- --email=admin@jamwisata.id --name="Admin Jam Wisata"
npm run dev
```

Website tersedia di `http://localhost:3000`, sedangkan CMS berada di `http://localhost:3000/admin`.

## Environment Variables

| Variable | Wajib | Kegunaan |
| --- | --- | --- |
| `DATABASE_URL` | Ya | Neon pooled connection untuk aplikasi |
| `DATABASE_URL_UNPOOLED` | Disarankan | Direct connection untuk migrasi Drizzle |
| `BETTER_AUTH_SECRET` | Ya | Secret sesi, minimal 32 karakter acak |
| `BETTER_AUTH_URL` | Ya | Origin autentikasi |
| `NEXT_PUBLIC_APP_URL` | Ya | URL publik aplikasi |
| `UPLOADTHING_TOKEN` | Produksi | Upload gambar CMS |
| `RESEND_API_KEY` | Opsional | Pengiriman email reset password |
| `EMAIL_FROM` | Opsional | Pengirim terverifikasi di Resend |

Jangan commit `.env.local`. Gunakan secret manager penyedia hosting untuk production.

## Perintah

| Perintah | Kegunaan |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Menjalankan hasil build |
| `npm run lint` | ESLint |
| `npm run typecheck` | Pemeriksaan TypeScript |
| `npm run check` | Lint, typecheck, dan build |
| `npm run db:generate` | Membuat SQL migration |
| `npm run db:migrate` | Menerapkan migration ke Neon |
| `npm run db:check` | Memeriksa migration |
| `npm run db:studio` | Membuka Drizzle Studio |
| `npm run db:seed` | Mengisi konten awal secara idempotent |
| `npm run admin:create -- --email=... --name=...` | Membuat admin dan password sementara |

## Struktur Utama

```text
src/
  app/admin/             Dashboard CMS dan login
  app/api/auth/          Better Auth route handler
  app/api/uploadthing/   UploadThing route handler
  app/artikel/           Artikel publik dari CMS
  components/admin/      Form dan navigasi CMS
  components/sites/      Tampilan publik Jam Wisata
  db/schema/             Schema auth dan konten Drizzle
  lib/cms/               Query, validasi, dan Server Actions CMS
drizzle/                 SQL migration terversi
scripts/                 Seed CMS dan bootstrap admin
```

## Workflow Editorial

1. Masuk ke `/admin`.
2. Tambah atau edit konten.
3. Pilih **Simpan Draft** untuk pekerjaan internal.
4. Pilih **Terbitkan** setelah informasi diverifikasi.
5. Cache halaman terkait otomatis diinvalidasi.

Gunakan hanya data, harga, jadwal, legalitas, statistik, foto, dan testimonial yang telah diverifikasi. CMS tidak membuat urgency, rating, atau klaim secara otomatis.

## Deployment

Tambahkan seluruh environment variable production, jalankan migration terhadap database production, kemudian build aplikasi. `next.config.ts` sudah mengizinkan sumber gambar UploadThing dan thumbnail YouTube.

```bash
npm run db:migrate
npm run build
```

Setelah deployment, ubah `BETTER_AUTH_URL` dan `NEXT_PUBLIC_APP_URL` ke domain production.

## Keamanan

- Registrasi publik dimatikan; bootstrap admin hanya melalui script lokal.
- Seluruh Server Action CMS memverifikasi sesi dan role admin.
- Endpoint upload hanya menerima admin terautentikasi.
- Rate limit login disimpan di database.
- Secret dan kredensial tidak boleh masuk Git.

## Lisensi

Kode tersedia berdasarkan [MIT License](LICENSE). Hak merek, logo, foto, video, dan materi Jam Wisata tetap dimiliki pemilik masing-masing.
