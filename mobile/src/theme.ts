export const colors = {
  navy: "#0B2A55",
  navyDeep: "#061B38",
  royal: "#134A80",
  gold: "#D4AF37",
  goldDark: "#C9971F",
  softGold: "#EDCB66",
  goldPale: "#F8F1DC",
  /** Gold for small text on white surfaces; keep this darker than decorative gold. */
  goldText: "#8C6708",
  /** Page background (light grey, per client reference). */
  ivory: "#E6E7EA",
  white: "#FFFFFF",
  /** Dark navy text on light surfaces. */
  navyText: "#0B2246",
  /** Bright gold hairline for pills, header buttons and borders. */
  goldBorder: "#E2BC55",
  notification: "#E53935",
  ink: "#333333",
  muted: "#68707A",
  line: "#E3DFD4",
  /** Hairline gold borders on light surfaces. */
  goldLine: "rgba(214,180,100,0.30)",
  /** Hairline gold borders on dark surfaces. */
  goldLineDark: "rgba(212,175,55,0.4)",
  silver: "#C0C0C0",
  success: "#26714A",
  danger: "#B42318",
} as const;

export const typography = {
  body: "Montserrat_400Regular",
  medium: "Montserrat_500Medium",
  semibold: "Montserrat_600SemiBold",
  bold: "Montserrat_700Bold",
  heading: "Cinzel_700Bold",
  headingSemibold: "Cinzel_600SemiBold",
  editorial: "CormorantGaramond_500Medium",
  editorialSemibold: "CormorantGaramond_600SemiBold",
  editorialItalic: "CormorantGaramond_500Medium_Italic",
  editorialSemiboldItalic: "CormorantGaramond_600SemiBold_Italic",
  quranLatin: "Georgia",
  quranArabic: "QPCUthmaniHafs",
} as const;

export const gradients = {
  navy: ["#061B38", "#0B2A55", "#134A80"] as const,
  /** Dark luxury card surface (top-left royal → bottom-right deep navy). */
  navyCard: ["#0E3466", "#0A2850", "#061B38"] as const,
  navyCardLocations: [0, 0.48, 1] as const,
  /** Glossy vertical gold (buttons, active tab). Render top → bottom. */
  gold: ["#FCE9A8", "#F2D06B", "#E2B640", "#D1A12B"] as const,
  goldLocations: [0, 0.3, 0.62, 1] as const,
  goldHighlight: ["rgba(255,255,255,0.55)", "rgba(255,255,255,0)", "rgba(255,255,255,0)", "rgba(150,105,10,0.22)"] as const,
  goldHighlightLocations: [0, 0.18, 0.8, 1] as const,
  goldSoft: ["#FBE29A", "#EBC459", "#D6A93A"] as const,
  /** Cream service tile (diagonal 160deg). */
  tile: ["#FFFFFF", "#FEFBF3", "#F6ECD3"] as const,
  tileLocations: [0, 0.45, 1] as const,
  card: ["#FFFFFF", "#FAFAF8"] as const,
  tabBar: ["#0F3463", "#0A2850"] as const,
} as const;

export const radius = { input: 12, button: 12, card: 15, tile: 15, large: 24, sheet: 30, pill: 999 } as const;

export const shadow = { shadowColor: "#14233C", shadowOpacity: 0.1, shadowRadius: 18, shadowOffset: { width: 0, height: 6 }, elevation: 3 } as const;

/** Soft warm shadow under cream icon tiles. */
export const shadowTile = { shadowColor: "#785F28", shadowOpacity: 0.14, shadowRadius: 10, shadowOffset: { width: 0, height: 5 }, elevation: 3 } as const;

/** Gold glow for navy cards, gold buttons and the tab bar. iOS only; Android uses elevation. */
export const glowGold = { shadowColor: "#E8C35A", shadowOpacity: 0.55, shadowRadius: 12, shadowOffset: { width: 0, height: 0 }, elevation: 6 } as const;

export const shadowDark = { shadowColor: "#061B38", shadowOpacity: 0.22, shadowRadius: 24, shadowOffset: { width: 0, height: 10 }, elevation: 8 } as const;
