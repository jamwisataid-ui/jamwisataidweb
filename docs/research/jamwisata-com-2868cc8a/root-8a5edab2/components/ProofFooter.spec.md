# ProofFooter specification

## Overview
- Target: `src/components/sites/jamwisata-com-2868cc8a/root-8a5edab2/ProofFooter.tsx`
- Screenshot: `docs/design-references/jamwisata-com-2868cc8a/root-8a5edab2/desktop-1440.png`
- Interaction model: embedded media links, static gallery/articles, form controls.

## Computed styles
- Testimonial block begins around y=4699 and is 710px high with 50px top padding.
- Gallery heading begins around y=5867 in a 1170px container.
- Article block begins around y=6687 and is 699px high in a 1170px container.
- Newsletter is 1110x154px, navy background with image, 40px 30px padding, 8px radius.
- Footer is approximately 512px high on desktop.

## Content
- Testimonials: three YouTube embeds and quotes from Inggit Imaniar, Richie, and Pak Tatang.
- Gallery: five original Jam Wisata journey images.
- Articles: “Ketahui Keutamaan Kota Makkah”, “Ikuti 10 Hal Ini untuk Persiapan Ibadah Umrah Anda”, “Ini Dia Tips Menjaga Sikap Tawadhu Saat Melaksanakan Ibadah Umrah”.
- Newsletter heading: “Dapatkan Info Terbaru Kami”; email field and submit action.
- Footer: company description, package/service links, legal links, hours, address, phone, and email.

## Assets
- `gallery-1.png` through `gallery-5.png`, `article-1.webp`, `article-2.jpg`, `article-3.jpg`, `newsletter.jpg`.

## Responsive behavior
- Desktop: three testimonial/article columns, gallery strip, multi-column footer.
- Tablet: two columns where useful.
- Mobile: one column, media uses 16:9 aspect ratio, footer groups stack, form controls stay at least 44px high.
