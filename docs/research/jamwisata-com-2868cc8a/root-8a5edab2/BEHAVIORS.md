# Behavior plan

## Existing behavior observed

- The live header remains relative and visually unchanged between scroll position 0 and 900 px.
- The live page contains three carousel instances.
- Desktop, tablet, and mobile layouts primarily become taller through stacking; mobile retains almost the full link inventory.
- WhatsApp is exposed through a floating third-party chat interface with a name/phone/message form.

## Proposed behavior

### Navigation

- Initial: transparent/light navigation integrated with the hero.
- Scrolled: compact white surface, navy text, tinted shadow, and persistent WhatsApp CTA.
- Mobile: accessible menu disclosure plus a fixed bottom consultation action; no duplicate full desktop menu.

### Package discovery

- Interaction model: click-driven Umrah/Wisata category switch.
- Changing category updates the package grid without page navigation.
- “Lihat detail” expands essential facts inline or routes to a real detail destination; no dead `#` links.
- “Konsultasi paket” opens WhatsApp with the package and departure date already included.

### Motion and states

- Hover: image scale capped around 1.03, CTA translation 1–2 px, 200–300 ms easing.
- Pressed: `scale(0.98)` or `translateY(1px)`.
- Focus: visible high-contrast focus ring on every link, button, tab, and disclosure.
- Reduced motion: disable non-essential reveals and smooth scrolling.
- Loading: local skeletons for any future CMS package feed.
- Empty: a composed “jadwal sedang diperbarui” state with WhatsApp consultation.
- Error: inline message and retry action; no browser alert.

### Media

- Gallery images use descriptive alt text and responsive sizes.
- Testimonial video starts only after the visitor activates its poster.
- Carousels are not autoplayed; user motion is always controllable.
