# Security Audit Report — JAM WISATA

Tanggal audit: 13 November 2026  
Source ref: `7fc620502727920c476f8a67f4f90640c83b13cf`  
Mode: Cloudflare Security Audit Skill — full audit, source-only

## Ringkasan eksekutif

Audit mencakup `mobile/` (Expo React Native), `src/` (Next.js web/admin/mobile API), `deploy/`, `.github/workflows/`, Docker, konfigurasi Expo/EAS, serta pola environment/secrets.

Host Windows saat ini tidak menyediakan sandbox OS yang memenuhi seluruh syarat skill: network namespace tanpa egress, target/toolchain read-only, scratch-only writes, environment allowlist kosong, batas resource lengkap, dan promosi artefak no-follow yang race-safe. Karena itu tidak ada target-controlled code, endpoint live, provider, database production, atau akun demo yang dijalankan. Kandidat yang membutuhkan bukti runtime secara disiplin diberi status `needs_validation`.

### Jumlah temuan

| Verdict / severity | Jumlah |
|---|---:|
| Confirmed Critical | 0 |
| Confirmed High | 0 |
| Confirmed Medium | 0 |
| Confirmed Low | 0 |
| Needs validation | 15 |
| Rejected / resolved dari audit sebelumnya | 6 |

Tidak ada Critical/High yang boleh diklaim terkonfirmasi pada run ini karena eksekusi validasi terisolasi tidak tersedia. Karena itu tidak ada perbaikan source yang dipaksakan atas dasar severity spekulatif. Kandidat dengan prioritas validasi tertinggi tercantum di bawah.

## Prioritas validasi dan rencana perbaikan

1. **Aktivasi/PIN reset tidak atomik dan sesi lama tidak dicabut**  
   Validasi dengan PostgreSQL disposable dan dua request konkuren. Jika terbukti, consume token + update credential + revoke sessions + create replacement session harus satu transaksi dengan conditional update/row lock.

2. **Login muthowif tanpa throttle source-visible**  
   Tambahkan limiter DB/edge per IP + normalized email, dummy password verification untuk user tak dikenal, response seragam, dan backoff. Pastikan proxy IP tepercaya.

3. **Custom-scheme activation bearer**  
   Migrasikan invitation ke verified HTTPS Android App Links/iOS Universal Links. Pendekkan TTL dan pertahankan single-use atomic consumption.

4. **LiveKit publisher capability setelah sesi berakhir**  
   End-session harus menutup room/menghapus publisher atau memakai token jauh lebih pendek dengan server-side reauthorization. State transition `ended/cancelled` juga harus terminal.

5. **Release credentials dan APK promotion**  
   Scope secret per step, pakai protected environment, pin actions/tooling secara immutable, verifikasi APK package/version/signing certificate/digest, lalu promote immutable artifact sebelum update pointer `latest`.

6. **R2 document policy**  
   Pastikan bucket tidak public, tidak ada custom domain publik untuk prefix private, signed URL berumur pendek, dan akses tanpa signature ke object dummy ditolak.

## Mandatory-focus results

### `/api/mobile/v1/*` dan IDOR

Endpoint personal yang diaudit mengikat resource ke principal dari session:

- Documents: list/upload memakai `pilgrim.id`; download mencari kombinasi `document.id + pilgrim.id`.
- Payments: detail/preference mencari kombinasi `registrationId + pilgrimId`.
- Notifications: update memakai `notification.id + pilgrim.id`.
- Devices: delete memakai `pushToken + account.id`.
- Profile/journey/registrations: principal berasal dari `requireMobileSession`, bukan body/user-supplied owner ID.
- Muthowif control/token: session harus assigned ke `user.id` muthowif.

Tidak ditemukan IDOR source-visible pada route personal tersebut. Ini negative coverage, bukan klaim bahwa deployment bebas bug.

### `/auth/activate`

Token dibuat dengan `randomBytes(32)`, disimpan sebagai SHA-256, berlaku 24 jam, dan query activation mewajibkan `usedAt/revokedAt` kosong. Jadi token tidak terlihat dapat ditebak dan punya expiry/single-use intent. Risiko tersisa adalah atomicity race serta sesi lama saat PIN diganti.

### PIN 6 angka

Login jamaah memiliki bucket lima percobaan per sepuluh menit dan dummy PIN verification. Respons invalid credential dibuat seragam. Efektivitas bucket masih bergantung pada trusted proxy header. Login muthowif belum terlihat memakai limiter serupa.

### Upload dokumen jamaah

Allowlist: JPG, PNG, WebP, PDF; maksimum 10 MiB; magic-byte validation tersedia. Download melakukan owner check lalu menghasilkan signed URL 10 menit. Dua hal belum terbukti: body besar mungkin dibuffer sebelum limit, dan bucket policy R2 harus diverifikasi di provider.

### LiveKit

Token jamaah ber-TTL lima menit, room-scoped, `canSubscribe: true`, `canPublish: false`, `canPublishData: false`, dan hanya untuk registration `active`. Token publisher memerlukan muthowif role + assignment. Risiko lifecycle token publisher setelah end-session masih perlu validasi.

### Secrets

Scan tracked source tidak menemukan credential DB/R2/LiveKit/Expo nyata, private key, keystore, `.p8`, mobile provision, atau provider config secret. Yang terlihat adalah placeholder `.env.example` dan secret references GitHub Actions. Local secret files tidak dibaca.

### Akun demo Google review

Nomor `081290002026` tidak ditemukan di tracked source. PIN `123456` hanya muncul sebagai fixture unit test. Karena akun berada di database runtime, status synthetic/non-real harus diverifikasi owner dengan query read-only; audit tidak login ke akun tersebut.

## Perbaikan audit sebelumnya yang terlihat di current source

- LIVE MUTHOWIF sekarang hanya menerima registration `active`, bukan `pending`.
- Login jamaah memakai response seragam, dummy verification, dan rate bucket; victim-account forced lockout lama sudah dihapus.
- Public referral lead tidak lagi langsung menautkan kontak anonim ke pilgrim existing.
- Registration duplicate/capacity check sekarang menggunakan PostgreSQL advisory lock di dalam transaksi.
- Account query cache dan registration draft authenticated sudah dibersihkan/namespaced saat account transition.
- Remaining quota dihitung server-side dari capacity dan registration aktif.

## Keterbatasan

- Official validator Cloudflare menolak input pada Windows karena proteksi no-follow/nonblocking tidak tersedia; JSON tetap diperiksa dengan parser lokal, tetapi ini bukan pengganti validator resmi.
- Verifier agent terpisah gagal karena usage limit layanan. Kandidat tidak dipromosikan menjadi confirmed.
- Tidak dilakukan dependency fetch, build, unit test target, DB migration, request live, provider call, atau load test.

Detail lengkap ada di `FINDINGS-DETAIL.md`; langkah owner-observed ada di `NEEDS-VALIDATION.md`; data mesin ada di `findings.json`.
