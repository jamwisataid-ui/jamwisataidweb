# Needs Validation Runbook

Gunakan hanya environment disposable atau read-only owner observation. Jangan memakai akun/data jamaah asli.

## P0 — Identity and capability lifecycle

1. **Activation race and session revocation**
   - Siapkan PostgreSQL disposable dan pilgrim dummy.
   - Buat activation token dummy.
   - Jalankan dua activation request dengan barrier pada saat lookup.
   - Hasil aman: tepat satu request mengonsumsi token; session lama revoked saat PIN berubah.

2. **Refresh rotation race**
   - Gunakan satu refresh token dummy untuk dua request sinkron.
   - Hasil aman: tepat satu replacement session berhasil.

3. **Muthowif login rate limiting**
   - Gunakan muthowif dummy.
   - Kirim enam password salah dari satu caller dalam sandbox.
   - Hasil aman: response seragam dan attempt berikutnya dibatasi tanpa user enumeration.

4. **Proxy IP trust**
   - Jalankan exact Caddy/nginx config pada isolated loopback.
   - Variasikan incoming `X-Forwarded-For`.
   - Hasil aman: application menerima IP authoritative dari trusted proxy, bukan value caller.

## P0 — LiveKit and mobile activation

5. **Custom scheme interception**
   - Dua aplikasi disposable mengklaim `jamwisata`.
   - Buka token aktivasi dummy.
   - Bila dispatch ambigu, migrasikan ke verified HTTPS App/Universal Links.

6. **Publisher revocation**
   - LiveKit lokal, room dummy, publisher token dummy.
   - End session lalu coba terus/reconnect publish.
   - Hasil aman: publisher terputus dan token lama tidak dapat kembali publish.

7. **Session state transition**
   - Buat session `ended` dan `cancelled` dummy.
   - Panggil action `start` sebagai assigned muthowif.
   - Hasil aman: terminal state tidak berubah.

## P1 — Private data

8. **R2 bucket policy**
   - Buat object dummy pada prefix private.
   - Coba GET/HEAD tanpa signed URL dan lewat custom domain/CDN.
   - Hasil aman: denied; signed URL expiry pendek; logging tersedia.

9. **Multipart body cap**
   - Gunakan ingress/runtime lokal dengan memory cap.
   - Upload dummy sedikit di atas 10 MiB.
   - Hasil aman: request ditolak sebelum full buffering.

10. **Guest draft and account-switch cache**
    - Gunakan dua identitas dummy pada shared test device.
    - Isi draft/cache A, ganti ke B tanpa explicit logout, paksa offline/error.
    - Hasil aman: data A tidak pernah tampil.

## P1 — Release

11. **GitHub/EAS/R2 controls**
    - Review tag/branch protection, protected environment approval, runner egress, token rotation, dan R2 IAM scope.
    - Jalankan canary workflow disposable untuk melihat step mana menerima secret.

12. **APK provenance**
    - Verifikasi package `com.jamwisata.mobile`, versionCode, signature certificate fingerprint, dan SHA-256.
    - Promote immutable versioned object; update pointer latest hanya setelah approval.

## P1 — Demo account

13. **Google review account**
    - Owner menjalankan query read-only untuk account dengan WhatsApp `081290002026`.
    - Pastikan pilgrim, registrations, bookings, documents, payments, notifications, dan LiveKit assignments semuanya synthetic.
    - Jangan menyalin PII ke laporan; cukup simpan boolean/assertion dan synthetic record IDs.

## P2 — Anonymous ingestion

14. **Traffic/referral growth**
    - Periksa edge rate limits dan retention jobs.
    - Pada DB dummy, kirim sejumlah kecil duplicate requests dan verifikasi dedup/quota.

## Tooling blocker

Official Cloudflare validators saat ini mengembalikan `OS no-follow and nonblocking input protection is unavailable` pada Windows. Jalankan ulang validators dari Linux sandbox yang mendukung kontrol tersebut sebelum mempromosikan kandidat ke `confirmed`.
