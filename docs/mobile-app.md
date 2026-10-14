# Jam Wisata Mobile

Aplikasi React Native berada di folder `mobile/` dan memakai backend Next.js yang sama melalui endpoint versioned `/api/mobile/v1`. Data jamaah, paket, keberangkatan, pembayaran, itinerary, dan dokumen tetap memakai database utama.

## Menjalankan lokal

1. Jalankan migrasi `npm run db:migrate` pada backend.
2. Salin `mobile/.env.example` menjadi `mobile/.env` dan arahkan `EXPO_PUBLIC_API_URL` ke alamat backend yang dapat diakses emulator/perangkat.
3. Jalankan `npm run mobile:install`.
4. Jalankan development build dengan `npm run mobile:start`, lalu `npm --prefix mobile run android` atau `npm --prefix mobile run ios`.

Untuk Android emulator, alamat backend lokal biasanya `http://10.0.2.2:3000/api/mobile/v1`. Perangkat fisik harus memakai IP LAN atau URL HTTPS development.

## Aktivasi jamaah

Admin membuka detail jamaah, lalu memilih **Buat link aktivasi**. Link berlaku 24 jam, hanya dapat dipakai sekali, dan dibagikan melalui WhatsApp. Jamaah membuka link, membuat PIN 6 angka, kemudian masuk dengan nomor WhatsApp dan PIN tersebut. Token mentah tidak disimpan di database.

## Scope milestone core

- Aktivasi, login PIN, refresh token, logout, dan pencabutan akses.
- Daftar/detail paket, termasuk Hotel Program Plus dan itinerary.
- Permintaan pendaftaran berstatus `pending` sampai direview admin.
- Perjalanan, pembayaran read-only, dokumen private, dan notifikasi.
- Hub Ibadah mengarah ke Panduan Umroh existing.

Push notification native sudah memiliki registrasi device token. Pengiriman FCM/APNs terjadwal, konten ibadah offline lengkap, muthowif, lokasi, dan LiveKit masuk milestone lanjutan.
