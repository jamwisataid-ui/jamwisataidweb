# HeaderHero specification

## Overview
- Target: `src/components/sites/jamwisata-com-2868cc8a/root-8a5edab2/HeaderHero.tsx`
- Screenshot: `docs/design-references/jamwisata-com-2868cc8a/root-8a5edab2/desktop-1440.png`
- Interaction model: static navigation with hover/dropdown affordances.

## Computed styles
- Body uses Poppins, 14px/20px, `#333`.
- Combined live header is 1440x240px, relative, transparent, no shadow.
- Main container is 1170px centered (`135px` side margins at 1440px).
- Hero H1 is 70px/77px, weight 600, white, 755px wide, 154px high.
- H1 top is 485px in the full document.
- Brand navy is `#0c1244`; white surfaces and teal `#46bea1` are supporting colors.

## DOM and content
- Utility strip: “Setiap Waktu Bernilai Ibadah”, email, phone, operating hours.
- Main navigation: logo; Home; Layanan; Hubungi Kami; Tentang Kami; Blog; Login / Registrasi.
- Hero title: “Travel Umrah Terbaik Jam Wisata”.
- Hero copy: “Mendampingi para Jamaah Umrah dengan pelayanan terbaik, Amanah dalam setiap perjalanan.”
- Three value points: Penawaran Harga Terbaik; Pemesanan Mudah & Cepat; Travel Resmi Terpercaya.
- CTA: “Kontak Kami”.

## Assets
- `/sites/jamwisata-com-2868cc8a/root-8a5edab2/logo.png`
- `/sites/jamwisata-com-2868cc8a/root-8a5edab2/hero.jpg`

## Responsive behavior
- Desktop: two-level header and 1170px content container.
- Tablet/mobile: utility information condenses; navigation becomes a compact stacked/mobile treatment; H1 scales down and hero remains readable.
- Buttons and links must have visible focus and hover states.
