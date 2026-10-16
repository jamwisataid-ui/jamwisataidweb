# Audit dan Tahapan Penyelesaian Aplikasi Mobile

Dokumen ini mencatat kondisi fitur berdasarkan implementasi dan integrasi backend yang ada. Status **berfungsi** berarti route, state UI, dan API sudah tersedia serta memiliki regression coverage. Fitur yang bergantung pada layanan/perangkat tetap memerlukan uji perangkat nyata sebelum rilis store.

## Tahap pengerjaan

1. **Paket dan pendaftaran** — selesai. Multi-keberangkatan, pilihan tanggal, harga keberangkatan, validasi status, detail paket, dan pendaftaran sudah konsisten.
2. **Area jamaah dan alur setelah login** — selesai di kode. Profil, dokumen, pembayaran transfer, notifikasi, itinerary, dan hub ibadah dirapikan agar setiap aksi memiliki loading, error, dan tujuan yang jelas.
3. **LIVE MUTHOWIF dan komunikasi realtime** — selesai di kode. Akses rombongan, token terbatas, kapasitas room realtime, permission mikrofon, reconnect, heartbeat, listener count, dan konfigurasi background audio sudah diperkuat. Acceptance audio saat layar terkunci tetap harus diuji pada Android/iPhone fisik.
4. **Release hardening Android/iOS** — terakhir. Push notification production, build perangkat, accessibility, performa, offline recovery, observability, dan checklist distribusi store.

## Status fitur

| Area | Status | Catatan |
| --- | --- | --- |
| Splash, onboarding, dan guest flow | Berfungsi | User dapat masuk aplikasi tanpa login; onboarding hanya tampil pertama kali. |
| Beranda, pencarian, daftar/detail paket | Berfungsi | Data berasal dari backend yang sama dengan website. |
| Multi-keberangkatan | Berfungsi | Semua departure aktif dapat dipilih dan pilihan tetap terbawa sampai pendaftaran. |
| Pendaftaran jamaah | Berfungsi | Akun baru dibuat saat diperlukan; akun lama memakai profil tersimpan. |
| Dokumen jamaah | Berfungsi | Kondisi kosong, upload, ganti, preview, download, review status, dan Buku Vaksin tersedia. |
| Pembayaran transfer bank | Berfungsi | Menampilkan rekening resmi, sisa tagihan, dan pengiriman bukti melalui WhatsApp; status hanya berubah setelah konfirmasi admin. |
| VA, kartu, dan e-wallet | Belum diaktifkan | UI disabled dengan keterangan yang jelas karena payment gateway belum tersedia. |
| Itinerary | Berfungsi | Mengikuti pendaftaran user dan mempunyai cache offline terakhir. |
| Notifikasi dalam aplikasi | Berfungsi | Read state dan deep link internal sudah terhubung. Push production diverifikasi pada Tahap 4. |
| Jadwal sholat | Berfungsi | Data lokasi/timezone, cache, waktu berikutnya, arah kiblat berbasis derajat, dan tanggal Hijriyah tersedia. |
| Mushaf Qur'an | Berfungsi | 114 surah offline, pencarian, juz, bookmark, dan last read tersedia. |
| Doa dan dzikir | Berfungsi | Dataset offline, kategori, detail, dan favorit tersedia. |
| LIVE MUTHOWIF | Berfungsi di kode, perlu acceptance perangkat | Token subscriber-only, pembatasan rombongan, reconnect otomatis, status koneksi, kapasitas aktual LiveKit, dan cache jadwal tersedia. |
| Panel Muthowif | Berfungsi di kode, perlu acceptance perangkat | Permission mikrofon, publish audio, mute, reconnect, heartbeat, listener count realtime, quality, metadata sesi, dan end-live tersedia. |

## Batasan yang disengaja

- Aplikasi tidak menandai pembayaran sebagai lunas dari sisi frontend.
- Virtual Account, kartu, dan e-wallet tidak dibuat seolah aktif sebelum payment gateway benar-benar terhubung.
- Arah kiblat saat ini menampilkan bearing berdasarkan lokasi; layar kompas native penuh masuk tahap release hardening jika diperlukan.
- Kalender Hijriyah saat ini menampilkan tanggal aktif; navigasi kalender bulanan belum menjadi blocker flow jamaah.
