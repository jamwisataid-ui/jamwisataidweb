# PackagesServices specification

## Overview
- Target: `src/components/sites/jamwisata-com-2868cc8a/root-8a5edab2/PackagesServices.tsx`
- Screenshot: `docs/design-references/jamwisata-com-2868cc8a/root-8a5edab2/desktop-1440.png`
- Interaction model: static cards with linked CTAs.

## Computed styles
- Desktop containers are 1140–1170px centered.
- Section H2 is 32px/38.4px, weight 600, `#424242`.
- Umrah heading begins around y=1915; facilities y=2762; wisata y=3569.
- Existing layout uses white cards, subtle gray borders, and navy headings/actions.

## Content
- About heading: “Memberikan Pelayanan Umrah Yang Terbaik Untuk Para Jamaah”.
- About copy: Jam Wisata has experience departing jamaah and protects satisfaction and trust.
- Umrah packages:
  - UMROH BINTANG 5 — departures 15 Aug 2026, 3 Oct 2026, 23 Jan 2027 — from IDR 33.900.000 — 145 seats.
  - Umroh Plus Turki Eksklusif — 8 Dec 2026 — from IDR 36.900.000 — 35 seats.
  - Umroh Awal Tahun 2027 — 23 Jan 2027 — from IDR 33.900.000 — 28 seats.
- Facilities: Konsumsi, Visa Haji & Umrah, Perlengkapan Umrah, TL/Muthawif, Hotel, Transportasi, Tim Profesional Saudi, Tiket Pesawat, Dokumentasi.
- Wisata packages: Autumn in Japan (IDR 26.900.000), Trip 3 Negara, Malaysia/Singapura/Thailand, West Europe 6 Negara (IDR 40.900.000).
- Promo banner: “Dapatkan harga dan Paket umrah terbaik.”

## Assets
- `about.jpg`, `about-badge.png`, `umrah-1.png` through `umrah-3.png`, `tour-1.png` through `tour-4.png`, `promo.jpg` under the page asset namespace.

## Responsive behavior
- Desktop: 3-card Umrah grid and 4-card tourism grid.
- Tablet: 2 columns.
- Mobile: single column, no horizontal overflow; cards preserve visible price and CTA.
