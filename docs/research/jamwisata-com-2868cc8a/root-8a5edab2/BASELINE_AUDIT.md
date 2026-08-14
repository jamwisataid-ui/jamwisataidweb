# Baseline audit — jamwisata.com

Captured on 13 August 2026 with a real browser at 1440 px, 768 px, and 390 px.

## Evidence snapshot

- Desktop page height: 8,450 px.
- Tablet page height: 10,273 px.
- Mobile page height: 18,660 px, or about 2.2 times the desktop length.
- Header height: 240 px desktop, 220 px tablet, and 190 px mobile.
- Header is `position: relative` and does not change after scrolling 900 px.
- Visible links: 225 desktop, 216 tablet, and 212 mobile.
- Runtime content: 27 unique images, 7 YouTube embeds, 3 carousels, 2 forms, and 6 buttons.
- Primary typeface: Poppins across almost the entire interface.
- Dominant brand color: navy `rgb(12, 18, 68)` / `#0c1244`.
- Live page contains current departures for 2026–2027, including Umroh Bintang 5, Umroh Plus Turki Eksklusif, Umroh Awal Tahun 2027, Autumn in Japan, and West Europe 6 Negara.

Reference screenshots:

- `desktop-1440.png`
- `tablet-768.png`
- `mobile-390.png`

## What already works

- Strong amount of real content and operational detail.
- Clear navy identity and usable existing logo assets.
- Package data contains useful trust signals: dates, hotels, airlines, airport, remaining seats, and price.
- Real testimonial videos and journey documentation are available.
- Legal pages, privacy information, office address, and contact details already exist.

## Main UX problems

### Conversion path

- The first screen does not make one primary action dominant.
- Package discovery, company information, promo, testimonial, gallery, article, newsletter, and chat compete for attention.
- Two forms and several contact patterns create unnecessary choice instead of one predictable WhatsApp consultation path.

### Information density

- Carousels duplicate many slide nodes in the DOM and make the page feel longer than its real content warrants.
- Mobile stacking produces an 18,660 px journey before the footer.
- Facilities, package lists, gallery, testimonials, and articles all use similarly weighted blocks, so users cannot quickly tell what matters most.

### Navigation and responsive behavior

- A tall, non-sticky header consumes valuable space and does not help users return to package or contact actions.
- The mobile page preserves nearly as many visible links as desktop instead of prioritizing a short mobile journey.
- Important package facts are spread across dense card content and become harder to compare on narrow screens.

### Visual system

- Poppins is used for nearly every role, weakening editorial hierarchy.
- Too many gray values and isolated green/red utility colors dilute the navy identity.
- Repeated equal cards and carousels create a template-like rhythm.
- Whitespace, heading scale, image treatment, and button hierarchy need a more deliberate system.

### Performance and accessibility risks

- Seven embedded YouTube frames and multiple carousels can delay mobile rendering.
- Repeated image nodes increase transfer and layout work.
- The current audit found no sticky navigation behavior; keyboard/focus and form-validation states require explicit implementation in the rebuild.

## Redesign opportunities

- Compress the journey into one persuasive narrative: credibility, relevant package, proof, then consultation.
- Lazy-load video only after a poster is activated.
- Replace most carousels with responsive grids or horizontal mobile scrollers.
- Introduce one persistent WhatsApp action with package-aware prefilled messages.
- Keep real 2026–2027 package facts rather than using the sample prices and dates shown in the visual reference.
