import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, typography } from "@/theme";
import { GlassSurface } from "@/components/glass";

export type LiveTab = "active" | "schedule";
export function LiveTabs({ value, onChange }: { value: LiveTab; onChange: (value: LiveTab) => void }) {
  return <View style={styles.tabs}>{([["active", "Siaran Aktif"], ["schedule", "Jadwal Siaran"]] as const).map(([id, label]) => { const active = value === id; return <Pressable key={id} accessibilityRole="tab" accessibilityState={{ selected: active }} onPress={() => onChange(id)} style={styles.tab}><GlassSurface variant={active ? "gold" : "pearl"} radius={18} glow={active} style={styles.surface}><Text style={[styles.text, active && styles.textActive]}>{label}</Text></GlassSurface></Pressable>; })}</View>;
}

const styles = StyleSheet.create({
  tabs: { paddingHorizontal: 18, gap: 8, flexDirection: "row" },
  tab: { flex: 1 }, surface: { minHeight: 40, alignItems: "center", justifyContent: "center" },
  text: { color: colors.muted, fontFamily: typography.semibold, fontSize: 14 },
  textActive: { color: colors.navyDeep, fontFamily: typography.bold },
});
