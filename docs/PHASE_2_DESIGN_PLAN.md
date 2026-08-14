# Jam Wisata landing page — Phase 2 design plan

## Design direction

**Calm premium pilgrimage travel**: deep midnight navy, warm ivory, muted Hijaz gold, generous white space, documentary travel photography, and restrained motion.

The supplied image is a useful content-architecture reference, especially its hero, trust rail, package finder, proof sections, and final CTA. The new design should not copy its dense succession of equal cards. Jam Wisata will use fewer, stronger blocks and more editorial asymmetry.

## Visual system

- **Primary:** midnight navy based on the existing `#0c1244`, deepened for large surfaces.
- **Accent:** muted warm gold, reserved for price emphasis, trust details, and primary CTA moments.
- **Background:** warm ivory rather than stark white.
- **Neutral:** one warm gray family; remove scattered cool grays and unrelated accents.
- **Display type:** a characterful serif for spiritual/editorial headings.
- **UI/body type:** a clean sans serif with strong Indonesian readability; avoid using one weight everywhere.
- **Shape:** moderate outer radii, tighter inner controls, and occasional square-edged editorial blocks.
- **Photography:** real Jam Wisata imagery first; consistent crop, color temperature, and overlay treatment.

## Content hierarchy

1. Answer “apakah travel ini resmi dan dapat dipercaya?” within the first screen.
2. Let visitors identify a suitable package within the next screen.
3. Show concrete service proof before general company claims.
4. Use testimonials and gallery as evidence, not decorative filler.
5. End every high-intent section with one clear consultation route.

## Package-card content

Each card should support these fields so Phase 3 can connect without redesigning the component:

- category and package name
- featured/recommended status
- hero image
- departure dates
- duration
- Makkah and Madinah hotels
- airline and departure airport
- destinations/add-ons
- remaining seats
- starting price
- included highlights
- WhatsApp consultation message
- publication status and sort order

## CMS-ready implementation boundary

Phase 2 uses typed local data files and reusable components rather than repeating hardcoded JSX. Phase 3 can replace the local data provider with an API/CMS while keeping the visual components stable.

Planned content entities:

- Package and departure schedule
- Destination
- Facility
- Testimonial/video
- Gallery item
- Article
- Partner/logo
- Company profile and contact settings

No login, database, upload workflow, or dashboard UI is included before Phase 2 approval.

## Acceptance criteria

- Responsive at 390, 768, 1024, and 1440 px without horizontal overflow.
- Primary CTA is visible within the first mobile viewport and remains easy to reach.
- All interactive targets are at least 44 px and keyboard accessible.
- Text/background contrast meets WCAG AA for normal text.
- No dead links, autoplay video, or fake filter controls.
- Images use responsive sizing; YouTube is lazy-instantiated.
- Reduced-motion preference is respected.
- Production build, lint, and TypeScript checks pass.
- Visual QA is completed against approved desktop and mobile references.

## Approval gates

1. **Baseline sign-off:** content inventory, current screenshots, and package facts.
2. **Direction sign-off:** desktop hero plus one package-card system and mobile first screen.
3. **Full landing-page sign-off:** all sections, responsive behavior, and real links.
4. **Launch sign-off:** content proofread, legal/contact data verified, domain/DNS prepared.
5. **CMS discovery:** only after the landing page is approved; confirm roles, editable fields, publishing workflow, and hosting constraints.
