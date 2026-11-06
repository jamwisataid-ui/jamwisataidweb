# Jam Wisata Mobile

Aplikasi React Native berada di folder `mobile/` dan memakai backend Next.js yang sama melalui endpoint versioned `/api/mobile/v1`. Data jamaah, paket, keberangkatan, pembayaran, itinerary, dan dokumen tetap memakai database utama.

## Menjalankan lokal

1. Jalankan migrasi `npm run db:migrate` pada backend.
2. Salin `mobile/.env.example` menjadi `mobile/.env` dan arahkan `EXPO_PUBLIC_API_URL` ke alamat backend yang dapat diakses emulator/perangkat.
3. Jalankan `npm run mobile:install`.
4. Jalankan development build dengan `npm run mobile:start`, lalu `npm --prefix mobile run android` atau `npm --prefix mobile run ios`.

Untuk Android emulator, alamat backend lokal biasanya `http://10.0.2.2:3000/api/mobile/v1`. Perangkat fisik harus memakai IP LAN atau URL HTTPS development.

## Update otomatis Android preview

APK preview memakai EAS Update. Saat aplikasi dibuka, Expo mengecek dan mengunduh pembaruan kode/asset di latar belakang. Pembaruan yang sudah terunduh dipakai saat aplikasi ditutup penuh lalu dibuka lagi. Ini tidak memutus sesi live audio yang sedang berjalan.

### Aktivasi sekali

1. Di proyek Expo `matthmd28s-team/matt`, isi environment **preview** dengan `EXPO_PUBLIC_API_URL=https://www.jamwisata.id/api/mobile/v1` dan `EXPO_PUBLIC_ANDROID_APK_URL=https://www.jamwisata.id/api/mobile/download/android`. SDK 58 membaca environment EAS saat publish OTA; nilai dari `eas.json` saja tidak cukup.
2. Buat Expo access token dengan akses ke proyek tersebut, lalu simpan sebagai secret repository GitHub bernama `EXPO_TOKEN`. Jangan commit token.
3. Dari folder `mobile/`, jalankan `eas build --platform android --profile preview`. Pasang APK hasilnya satu kali pada perangkat. APK lama tidak memiliki URL/channel EAS Update, jadi tidak bisa menerima OTA ini.

Setelah APK baru terpasang, setiap push ke `main` yang mengubah kode mobile akan menjalankan `.github/workflows/mobile-ota.yml`: install dependensi, typecheck, tes, lalu publish update Android ke channel `preview`. Push yang mengubah `app.json`, `eas.json`, dependensi, atau folder native tidak menerbitkan OTA karena berpotensi tidak kompatibel dengan APK terpasang. Untuk perubahan native, naikkan `expo.version`, buat dan pasang APK preview baru. Channel `production` terpisah dan tidak dipublish oleh workflow ini.

## Aktivasi jamaah

Admin membuka detail jamaah, lalu memilih **Buat link aktivasi**. Link berlaku 24 jam, hanya dapat dipakai sekali, dan dibagikan melalui WhatsApp. Jamaah membuka link, membuat PIN 6 angka, kemudian masuk dengan nomor WhatsApp dan PIN tersebut. Token mentah tidak disimpan di database.

## Scope milestone core

- Aktivasi, login PIN, refresh token, logout, dan pencabutan akses.
- Daftar/detail paket, termasuk Hotel Program Plus dan itinerary.
- Permintaan pendaftaran berstatus `pending` sampai direview admin.
- Perjalanan, pembayaran read-only, dokumen private, dan notifikasi.
- Hub Ibadah mengarah ke Panduan Umroh existing.

Push notification native sudah memiliki registrasi device token. Pengiriman FCM/APNs terjadwal, konten ibadah offline lengkap, muthowif, lokasi, dan LiveKit masuk milestone lanjutan.
