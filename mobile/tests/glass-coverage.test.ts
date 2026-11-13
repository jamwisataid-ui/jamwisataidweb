import { describe, expect, it } from "vitest";

const sources = {
  // @ts-expect-error Vite injects import.meta.glob for Vitest source fixtures.
  ...import.meta.glob("../app/**/*.tsx", { query: "?raw", import: "default", eager: true }),
  // @ts-expect-error Vite injects import.meta.glob for Vitest source fixtures.
  ...import.meta.glob("../src/components/**/*.tsx", { query: "?raw", import: "default", eager: true }),
} as Record<string, string>;
const source = (relativePath: string) => sources[`../${relativePath}`] ?? "";

const routeCoverage: Record<string, string[]> = {
  "app/(tabs)/index.tsx": ["HomeHeader", "HighlightCard", "QuickMenuGrid"],
  "app/(tabs)/packages.tsx": ["PackageFilterTabs", "CircleButton"],
  "app/(tabs)/worship.tsx": ["MetallicGold", "IconRing", "NavyCard"],
  "app/(tabs)/notifications.tsx": ["Title", "Button"],
  "app/(tabs)/account.tsx": ["AccountHeader", "NavyCard", "MetallicGold"],
  "app/search.tsx": ["AppBar"],
  "app/package/[slug].tsx": ["PackageHero", "PackageDetailTabs", "StickyRegistrationCTA"],
  "app/schedule.tsx": ["Title"],
  "app/register/[departureId].tsx": ["AppBar", "RegistrationStepper", "RegistrationFooter"],
  "app/payment/[registrationId].tsx": ["AppBar", "MetallicGold", "GlassSurface"],
  "app/payments.tsx": ["Title", "GlassSurface"],
  "app/prayer-times.tsx": ["CircleButton", "LocationSelector", "PrayerUtilityGrid"],
  "app/quran/index.tsx": ["AppBar", "QuranTabs", "SurahNumberBadge"],
  "app/quran/[surah].tsx": ["AppBar"],
  "app/duas/index.tsx": ["AppBar", "DuaCategoryTabs"],
  "app/duas/[collection]/index.tsx": ["AppBar", "NavyCard", "DhikrReader"],
  "app/duas/[collection]/[item].tsx": ["AppBar", "FavoriteButton"],
  "app/asmaul-husna.tsx": ["AppBar", "NavyCard"],
  "app/live-muthowif/index.tsx": ["LiveHeader", "LiveInfoBanner", "LiveTabs"],
  "app/live-muthowif/[sessionId].tsx": ["GlassSurface"],
  "app/muthowif/index.tsx": ["MuthowifHeader", "MuthowifBottomNav", "Button"],
  "app/muthowif/login.tsx": ["CircleButton", "NavyCard", "Button"],
  "app/muthowif/live.tsx": ["MuthowifHeader", "MuthowifBottomNav", "GlassSurface"],
  "app/muthowif/jamaah.tsx": ["MuthowifHeader", "MuthowifBottomNav"],
  "app/muthowif/settings.tsx": ["MuthowifHeader", "MuthowifBottomNav"],
  "app/account/profile.tsx": ["AppBar", "ProfileAvatar"],
  "app/documents.tsx": ["Title", "GlassSurface"],
  "app/journey.tsx": ["AppBar", "ItineraryTabs", "GlassSurface"],
  "app/help.tsx": ["AppBar", "GlassSurface"],
  "app/onboarding.tsx": ["GlassSurface"],
  "app/login.tsx": ["Button", "GlassSurface"],
  "app/activate.tsx": ["Title", "Button"],
  "app/index.tsx": ["Redirect"],
};

describe("glossy liquid-glass design system", () => {
  it("exposes the four required variants from one component", () => {
    const glass = source("src/components/glass.tsx");
    for (const variant of ["dark", "gold", "pearl", "navyOrb"]) {
      expect(glass).toContain(variant);
    }
  });

  it("keeps metallic gold as a wrapper around the central glass surface", () => {
    const metallic = source("src/components/metallic-gold.tsx");
    expect(metallic).toContain("GlassSurface");
    expect(metallic).toContain('variant="gold"');
    expect(metallic).not.toContain("LinearGradient");
  });

  it.each(Object.entries(routeCoverage))("audits glossy coverage for %s", (route, markers) => {
    const routeSource = source(route);
    expect(markers.some((marker) => routeSource.includes(marker))).toBe(true);
  });
});
