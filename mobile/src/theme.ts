export const colors = {
  navy: "#0A1D3A",
  navyDeep: "#06152B",
  royal: "#1E3A5F",
  gold: "#D4AF37",
  goldDark: "#B8860B",
  softGold: "#E8C967",
  goldPale: "#F8F1DC",
  /** Gold for small text on white surfaces; keep this darker than decorative gold. */
  goldText: "#8C6708",
  ivory: "#FFFFFF",
  white: "#FFFFFF",
  ink: "#333333",
  muted: "#68707A",
  line: "#E3DFD4",
  /** Hairline gold borders on light surfaces. */
  goldLine: "rgba(184,134,11,0.22)",
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
  navy: ["#06152B", "#0A1D3A", "#1E3A5F"] as const,
  /** Dark luxury card surface (top-left royal → bottom-right deep navy). */
  navyCard: ["#1E3A5F", "#0A1D3A", "#06152B"] as const,
  navyCardLocations: [0, 0.6, 1] as const,
  gold: ["#8C6708", "#B8860B", "#D4AF37", "#F5D97A", "#D4AF37", "#B8860B", "#8C6708"] as const,
  goldLocations: [0, 0.18, 0.4, 0.58, 0.76, 0.92, 1] as const,
  goldHighlight: ["rgba(255,235,170,0.46)", "rgba(255,235,170,0.10)", "transparent", "rgba(11,27,43,0.16)"] as const,
  goldHighlightLocations: [0, 0.3, 0.66, 1] as const,
  goldSoft: ["#E8C967", "#D4AF37", "#B8860B"] as const,
} as const;

export const radius = { input: 12, button: 12, card: 20, large: 24, sheet: 30, pill: 999 } as const;

export const shadow = { shadowColor: "#071A35", shadowOpacity: 0.06, shadowRadius: 14, shadowOffset: { width: 0, height: 6 }, elevation: 2 } as const;

export const shadowDark = { shadowColor: "#06152B", shadowOpacity: 0.22, shadowRadius: 24, shadowOffset: { width: 0, height: 10 }, elevation: 8 } as const;
