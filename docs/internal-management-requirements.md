# Dashboard Manajemen Internal Jam Wisata

Status: Draft requirement terkonfirmasi sebagian

Terakhir diperbarui: 29 Agustus 2026

## 1. Executive Summary

### Problem Statement

Operasional jamaah, pembayaran, dokumen, agen, transaksi, dan stok perlengkapan perlu dikelola dari satu dashboard yang terintegrasi dengan CMS Jam Wisata. Dokumen transaksi juga harus konsisten, dapat diaudit, dan tidak berubah ketika data master diperbarui.

### Proposed Solution

Tambahkan mode **Manajemen Internal** pada dashboard yang sama dengan CMS. Sistem menyediakan pengelolaan jamaah, pembayaran, agen, stok, invoice PDF, dan kwitansi PDF dengan identitas visual navy-gold Jam Wisata serta penyimpanan dokumen privat.

### Success Criteria

- Seluruh jamaah memiliki profil, dokumen, paket, pembayaran, dan riwayat keberangkatan yang terhubung.
- Jatuh tempo pelunasan dihitung otomatis H-30 dari tanggal keberangkatan.
- Nomor invoice dan kwitansi unik serta tidak mengalami duplikasi saat dibuat bersamaan.
- PDF yang sudah diterbitkan dapat diunduh ulang secara identik meskipun data master berubah.
- Komisi agen hanya berubah menjadi sah ketika jamaah terkait berstatus lunas.

## 2. User Experience & Functionality

### User Persona

Sistem menggunakan satu role pengguna, yaitu **Admin Jam Wisata**. Beberapa akun admin dapat dibuat, tetapi seluruh akun memiliki akses yang sama.

### User Stories

#### Data Jamaah

Sebagai admin, saya ingin menyimpan seluruh data dan dokumen jamaah agar progres administrasi dan perjalanan dapat dipantau dari satu profil.

Acceptance criteria:

- Field minimum: nama, nomor WhatsApp, dan email.
- KTP dan KK wajib diunggah.
- Jamaah wajib memiliki minimal satu dokumen tambahan: Akta Lahir, Buku Nikah, atau Ijazah.
- Sistem mendukung lebih dari satu dokumen tambahan.
- Dokumen disimpan pada bucket R2 privat dan hanya dapat dibuka oleh pengguna yang telah login.
- Profil menampilkan riwayat paket, pembayaran, dokumen, dan keberangkatan secara kronologis.
- Penggantian dokumen tidak menghilangkan jejak dokumen sebelumnya dari audit log.
- Validasi yang gagal tidak mengosongkan input form.

#### Pembayaran

Sebagai admin, saya ingin mencatat tagihan dan pembayaran jamaah agar piutang serta status pelunasan selalu akurat.

Acceptance criteria:

- Nilai DP default adalah Rp5.000.000 dan disimpan sebagai pengaturan sistem, bukan angka yang tersebar di source code.
- Batas pelunasan default dihitung H-30 dari tanggal keberangkatan.
- Sistem mendukung diskon dan harga khusus per pendaftaran.
- Sistem mendukung pembayaran DP, cicilan, dan pelunasan.
- Sistem mendukung pembatalan serta refund penuh atau sebagian.
- Status minimum: Belum Bayar, DP, Cicilan, Lunas, dan Refund.
- Pembatalan perjalanan disimpan sebagai status pendaftaran, terpisah dari status pembayaran.
- Setiap pembayaran dan refund menjadi transaksi ledger; nilai historis tidak diedit secara diam-diam.
- Harga final pendaftaran disimpan sebagai snapshot sehingga perubahan harga paket tidak mengubah tagihan jamaah lama.

#### Agen dan Referral

Sebagai admin, saya ingin menghubungkan jamaah dengan agen asal agar referral dan komisi dapat dihitung secara konsisten.

Acceptance criteria:

- Setiap agen memiliki link referral unik.
- Agen asal tetap melekat pada pendaftaran jamaah dan tidak berubah akibat perubahan data agen.
- Pilihan nominal komisi hanya Rp500.000 atau Rp1.000.000.
- Nominal default dapat ditentukan per agen.
- Admin dapat melakukan override nominal pada pendaftaran/transaksi tertentu.
- Komisi berstatus pending sebelum jamaah lunas.
- Komisi baru berstatus sah/earned setelah status pembayaran jamaah menjadi Lunas.
- Pembayaran komisi dicatat terpisah dari status komisi sah.

#### Stok Perlengkapan

Sebagai admin, saya ingin melihat stok aktual dan histori pergerakannya agar distribusi perlengkapan dapat dipertanggungjawabkan.

Item awal:

1. Koper bagasi
2. Koper kabin
3. Kain ihram
4. Seragam
5. Kerudung
6. Tas multifungsi
7. ID card
8. Cover koper
9. Cover paspor
10. Name tag

Acceptance criteria:

- Mendukung transaksi stok masuk dan stok keluar.
- Stok tersedia dihitung dari ledger pergerakan, bukan angka yang diedit langsung.
- Setiap pergerakan mencatat item, jumlah, waktu, keterangan, dan admin yang melakukan aksi.
- Histori tidak dapat dihapus permanen melalui antarmuka normal.
- Struktur data mendukung distribusi barang kepada jamaah pada tahap berikutnya.

#### Invoice PDF

Sebagai admin, saya ingin menerbitkan invoice PDF yang mengikuti identitas Jam Wisata agar tagihan terlihat profesional dan konsisten.

Acceptance criteria:

- Invoice dibuat sebagai dokumen tagihan sebelum pembayaran diterima.
- Field minimum: customer, tanggal, nomor invoice, description, quantity, harga satuan, total per baris, total akhir, dan rekening pembayaran.
- Mendukung beberapa line item dalam satu invoice.
- Layout mengikuti referensi existing: portrait, header navy-gold, logo Jam Wisata, kontak perusahaan, watermark/ornamen, tabel transaksi, panel rekening, dan total yang dominan.
- PDF dibuat server-side sebagai PDF asli; bukan halaman HTML yang hanya dipanggil melalui browser print.
- Teks transaksi tetap selectable dan font yang digunakan di-embed pada PDF.
- Background/ornamen menggunakan aset beresolusi tinggi tanpa menjadikan seluruh halaman sebagai screenshot.
- Dokumen mendukung halaman lanjutan ketika line item tidak muat pada satu halaman.
- Contoh pola nomor existing adalah `9932/Jamw/0826`; pola final masih configurable.

#### Kwitansi PDF

Sebagai admin, saya ingin menerbitkan kwitansi setelah menerima pembayaran agar jamaah memperoleh bukti transaksi resmi.

Acceptance criteria:

- Kwitansi hanya dibuat dari pembayaran yang sudah diterima/terkonfirmasi.
- Field minimum: nama pembayar, tanggal, nomor kwitansi, metode pembayaran, keterangan, quantity, nominal, terbilang, total, serta nama/tanda tangan bagian keuangan.
- Terbilang dibuat otomatis dari total pembayaran dalam Bahasa Indonesia.
- Layout mengikuti referensi existing: landscape, header navy-gold, judul besar, identitas transaksi, tabel, panel terbilang, total, alamat/kontak, dan area tanda tangan keuangan.
- PDF dibuat server-side sebagai PDF asli dan teks transaksi tetap selectable.
- Contoh pola nomor existing adalah `0064280826`; pola final masih configurable.

#### Penomoran dan Snapshot Dokumen

Sebagai admin, saya ingin nomor dan isi dokumen transaksi tetap konsisten agar invoice serta kwitansi dapat diaudit.

Acceptance criteria:

- Invoice dan kwitansi memiliki sequence terpisah.
- Konfigurasi nomor mendukung prefix, suffix, padding, nomor awal, token bulan/tahun, dan kebijakan reset.
- Pengambilan nomor dilakukan secara atomik di database.
- Nomor yang sudah diterbitkan tidak dapat dipakai ulang.
- Dokumen yang dibatalkan berstatus Void/Batal dan tidak dihapus dari urutan.
- Saat terbit, sistem menyimpan snapshot customer, perusahaan, line item, harga, diskon, rekening, total, dan versi template.
- PDF final disimpan pada object storage privat beserta object key, checksum, waktu terbit, dan pembuatnya.
- Download ulang mengambil file snapshot yang sama, bukan membuat ulang dari data master terbaru.
- Koreksi dokumen yang sudah terbit dilakukan melalui pembatalan dan penerbitan dokumen baru yang saling mereferensikan.

### Design Requirements

- Dashboard dan PDF menggunakan DNA Jam Wisata: navy, gold, putih, ornamen Islami yang terkontrol, serta tipografi profesional.
- Mode CMS dan Manajemen Internal tetap berada dalam shell dashboard yang sama.
- Form dan tabel harus nyaman digunakan pada desktop, tablet, dan ponsel.
- Ukuran teks dashboard tetap terbaca oleh pengguna yang lebih tua.
- Invoice mempertahankan komposisi portrait dan kwitansi mempertahankan komposisi landscape; ukuran cetak final menunggu konfirmasi client.

### Non-Goals Versi Awal

- Akuntansi double-entry, buku besar, neraca, dan rekonsiliasi bank otomatis.
- Portal login khusus agen.
- Aplikasi mobile native.
- Integrasi otomatis dengan bank, maskapai, hotel, atau sistem visa.
- Pengambilan keputusan keuangan oleh AI.

## 3. AI System Requirements

AI tidak digunakan untuk status pembayaran, nominal transaksi, komisi, penomoran dokumen, atau perhitungan stok. Seluruh aturan tersebut harus deterministik dan dapat diaudit.

AI dapat dipertimbangkan pada fase lanjutan untuk OCR dokumen atau ringkasan operasional, tetapi hasilnya wajib dikonfirmasi admin sebelum mengubah data.

## 4. Technical Specifications

### Architecture Overview

- Dashboard: Next.js dan TypeScript pada shell admin existing.
- Database: PostgreSQL/Neon dengan Drizzle ORM.
- Dokumen jamaah dan PDF transaksi: Cloudflare R2 bucket privat.
- Akses file: signed URL berumur pendek setelah verifikasi session admin.
- Generator PDF: library server-side yang menghasilkan binary PDF secara langsung; teknologi final dipilih saat implementasi.

### Data Model Minimum

- `pilgrims`
- `pilgrim_documents`
- `pilgrim_history`
- `registrations`
- `registration_price_snapshots`
- `payments`
- `refunds`
- `agents`
- `referral_attributions`
- `commissions`
- `inventory_items`
- `inventory_movements`
- `document_sequences`
- `invoices`
- `invoice_snapshots`
- `receipts`
- `receipt_snapshots`
- `generated_documents`
- `audit_logs`

### Core Data Rules

- Nominal rupiah disimpan sebagai integer/bigint, bukan floating point.
- Status pembayaran dihitung dari harga final, pembayaran sah, dan refund.
- Deadline pembayaran disimpan pada pendaftaran dan berasal dari tanggal keberangkatan dikurangi 30 hari.
- Referral attribution disimpan sebagai snapshot pada pendaftaran.
- Komisi memiliki nominal snapshot dan tidak membaca ulang nominal default agen setelah transaksi dibuat.
- Stok tersedia adalah agregasi seluruh inventory movement.
- Snapshot invoice/kwitansi bersifat immutable setelah diterbitkan.

### PDF Persistence Flow

1. Admin meninjau draft transaksi.
2. Server memvalidasi data dan session.
3. Database mengalokasikan nomor secara atomik.
4. Server menyimpan snapshot transaksi dalam satu database transaction.
5. Generator membuat binary PDF dari snapshot.
6. PDF diunggah ke bucket R2 privat.
7. Checksum dan object key disimpan pada record dokumen.
8. Admin memperoleh signed download URL berumur pendek.

Jika upload PDF gagal, dokumen masuk status generation-failed dan dapat dicoba ulang menggunakan snapshot serta nomor yang sama; nomor tidak dikembalikan ke sequence.

### Security & Privacy

- Bucket dokumen jamaah dan PDF tidak boleh public.
- Nama jamaah, nomor identitas, atau nomor paspor tidak digunakan sebagai object key.
- File upload divalidasi berdasarkan ukuran, MIME type, signature/magic bytes, dan checksum.
- Credential R2 hanya tersedia pada server.
- Seluruh akses, perubahan, penerbitan, pembatalan, dan download dokumen penting masuk audit log.
- Dokumen contoh customer tidak disimpan di repository.
- Backup, retensi, dan prosedur penghapusan data perlu ditetapkan sebelum produksi.

### Verification Requirements

- Unit test perhitungan H-30, status pembayaran, refund, komisi, stok, dan terbilang.
- Concurrency test memastikan sedikitnya 50 permintaan nomor bersamaan tidak menghasilkan duplikasi.
- Regression test memastikan perubahan harga paket, agen, rekening, dan template tidak mengubah snapshot lama.
- PDF comparison test memeriksa field, orientasi, overflow tabel, font, dan branding.
- Test download memastikan pengguna tanpa session tidak dapat mengambil dokumen R2.
- Responsive test dashboard pada desktop, tablet, dan ponsel.

## 5. Risks & Roadmap

### MVP

- Fondasi database, audit log, dan penyimpanan R2 privat.
- Data jamaah, dokumen, riwayat, paket, dan keberangkatan.
- Pembayaran, diskon, harga khusus, pembatalan, refund, dan deadline H-30.
- Agen, referral, serta komisi Rp500.000/Rp1.000.000.
- Ledger stok dengan 10 item awal.
- Invoice dan kwitansi PDF berbasis snapshot.

### V1.1

- Export laporan per periode.
- Reminder jatuh tempo dan dokumen belum lengkap.
- Distribusi perlengkapan per jamaah.
- Penyempurnaan template dan versi dokumen.

### V2.0

- Portal agen.
- OCR dokumen jamaah.
- Akuntansi penuh dan integrasi eksternal jika diminta client.

### Open Decisions untuk Dikonfirmasi ke Client

1. Format final nomor invoice dan kwitansi, nomor awal, serta reset bulanan/tahunan/tidak pernah.
2. PDF dipertahankan pada rasio custom existing atau disesuaikan ke ukuran cetak standar A4 portrait/landscape.
3. Daftar rekening aktif dan apakah rekening disimpan global atau dapat dipilih per invoice.
4. Nama/jabatan penanda tangan, penggunaan gambar tanda tangan, dan stempel pada kwitansi.
5. Nasib komisi yang sudah sah apabila jamaah kemudian dibatalkan atau menerima refund.
6. Aturan status untuk refund sebagian dibanding refund penuh.
7. Metode pembayaran yang tersedia dan apakah pembayaran memerlukan proses verifikasi admin.
8. Kebutuhan migrasi data jamaah, transaksi, agen, dan stok lama.

### Technical Risks

- Format nomor yang belum final dapat menyebabkan migrasi ulang jika ditanam langsung ke kode.
- PDF lama berubah jika sistem hanya meregenerasi dari master data; karena itu snapshot dan file final wajib disimpan.
- Penyimpanan dokumen jamaah dan transaksi secara public dapat membocorkan data pribadi.
- Komisi dapat salah hitung jika refund setelah pelunasan belum memiliki aturan yang disepakati.
- Template existing memiliki rasio halaman non-standar; keputusan ukuran cetak perlu dikunci sebelum implementasi generator PDF.
