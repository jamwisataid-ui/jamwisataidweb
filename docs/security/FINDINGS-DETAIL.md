# Findings Detail

Semua record di bawah berstatus `needs_validation`; severity final belum diberikan sesuai aturan skill.

## Identity dan session lifecycle

### NV-01 — Login muthowif tanpa throttle source-visible

Route `src/app/api/mobile/v1/auth/muthowif/login/route.ts` langsung melakukan user lookup dan password verification. Tidak terlihat `auth_rate_limits`, lockout, atau backoff. Validasi harus memastikan apakah WAF/ingress sudah melindungi route; jika tidak, gunakan limiter per caller dan account dengan response seragam.

### NV-02 — Activation/PIN reset non-atomic dan sesi lama bertahan

`src/app/api/mobile/v1/auth/activate/route.ts` melakukan lookup token, account upsert, `usedAt` update, dan session creation secara terpisah. PIN replacement juga tidak mencabut sessions akun lama. Perbaikan yang disarankan: conditional token consume dan seluruh credential/session transition dalam satu transaction.

### NV-03 — Refresh rotation race

`rotateMobileSession()` memilih refresh session yang belum revoked, lalu melakukan update dan create secara terpisah. Uji concurrency disposable diperlukan; jika dua replacement lahir, gunakan row lock/conditional update dengan satu pemenang.

### NV-04 — Forwarded IP trust

Rate key membaca first `X-Forwarded-For`. Efektif hanya bila edge membuang value dari caller. Pastikan exact production proxy chain dan trusted-hop strategy.

### NV-05 — Custom scheme activation

Token 24 jam default dikirim melalui `jamwisata://activate?token=...`. Gunakan verified HTTPS links yang hanya dapat diklaim aplikasi resmi.

## Mobile data lifecycle

### NV-06 — Shared guest registration draft

Guest memakai namespace literal `guest`, sehingga PII draft untuk departure sama dapat muncul pada pengguna berikutnya di perangkat bersama. Hindari persistence guest sensitif atau gunakan nonce + expiry + explicit discard.

### NV-07 — Journey/Live cache tidak dibersihkan pada signIn

`signOut` membersihkan cache, tetapi direct account switch melalui `signIn` tidak. Namespace per account dan purge sebelum menulis session baru.

## Documents dan object storage

### NV-08 — Full buffering sebelum upload limit

`request.formData()`/`File.arrayBuffer()` terjadi sebelum 10 MiB validation. Tambahkan hard cap pada ingress/runtime dan streaming/early rejection.

### NV-09 — R2 private policy tidak source-visible

Owner check dan signed URL application-side sudah benar. Owner tetap harus memastikan object tidak bisa dibaca melalui public bucket/custom domain tanpa signature.

## Live Muthowif

### NV-10 — Publisher token mungkin hidup setelah end-session

Token publisher berumur delapan jam. End action hanya mengubah DB; tidak terlihat close room/remove participant/revoke provider capability.

### NV-11 — Terminal session dapat di-start kembali

PATCH `start` tidak memeriksa current state. Tambahkan transition table dan conditional update; `cancelled/ended` harus terminal kecuali admin recovery eksplisit.

## Release and supply chain

### NV-12 — Job-wide release secrets + mutable tools

Expo/R2 secrets dipasang job-wide sementara job menjalankan npm lifecycle, action tags, `eas-version: latest`, dan runtime `pip install awscli`. Scope secret per step dan pin immutable inputs.

### NV-13 — APK identity tidak diverifikasi

Workflow hanya mengecek file sebagai ZIP sebelum menimpa `latest`. Wajib verifikasi `apksigner`, package ID, versionCode, certificate SHA-256, serta artifact digest.

## Deployment data and anonymous surfaces

### NV-14 — Akun demo review belum dapat dipastikan synthetic

Credential tidak ada di tracked source. Owner harus memastikan seluruh pilgrim/booking/document/payment yang terhubung ke akun demo adalah dummy dan tidak terhubung ke jamaah asli.

### NV-15 — Anonymous ingestion dapat menambah row persisten

Traffic/referral endpoint tidak memperlihatkan limiter/dedup/retention application-level. Periksa WAF dan tambahkan bounded quota/retention.

## Negative coverage yang penting

- Tidak ditemukan owner ID dari request dipakai untuk membaca documents/payments/notifications/profile jamaah lain.
- Jamaah LiveKit tidak bisa publish menurut grant source.
- Upload memiliki MIME allowlist, declared-size check, dan signature sniffing.
- Activation token punya 256-bit entropy, hash-at-rest, expiry, used/revoked fields.
- Tidak ditemukan secret nyata atau credential akun demo dalam tracked repository.
- Prior High pending-registration LiveKit sudah diperbaiki menjadi active-only.
