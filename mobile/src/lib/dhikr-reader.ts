/** Number of repetitions for a dhikr, read from notes like "Dibaca 3x" (first count wins). */
export function repeatCount(notes?: string | null) {
  const match = notes?.match(/(\d+)\s*x/i);
  const value = match ? Number(match[1]) : 1;
  return Number.isFinite(value) && value > 0 ? value : 1;
}

export type DhikrMode = "arabic" | "latin" | "full";

export const dhikrModes: Array<{ key: DhikrMode; label: string }> = [
  { key: "arabic", label: "Arab" },
  { key: "latin", label: "+ Latin" },
  { key: "full", label: "Lengkap" },
];

export const dhikrFontSizes = [24, 28, 32, 36] as const;
