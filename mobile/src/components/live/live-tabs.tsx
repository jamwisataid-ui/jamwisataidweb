import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, typography } from "@/theme";

export type LiveTab = "active" | "schedule";
export function LiveTabs({ value, onChange }: { value: LiveTab; onChange: (value: LiveTab) => void }) {
  return <View style={styles.tabs}>{([["active", "Siaran Aktif"], ["schedule", "Jadwal Siaran"]] as const).map(([id, label]) => <Pressable key={id} accessibilityRole="tab" accessibilityState={{ selected: value === id }} onPress={() => onChange(id)} style={styles.tab}><Text style={[styles.text, value === id && styles.textActive]}>{label}</Text><View style={[styles.indicator, value === id && styles.indicatorActive]} /></Pressable>)}</View>;
}

const styles = StyleSheet.create({
  tabs: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: colors.line },
  tab: { flex: 1, minHeight: 48, justifyContent: "flex-end", alignItems: "center", gap: 11 },
  text: { color: colors.muted, fontFamily: typography.semibold, fontSize: 14 },
  textActive: { color: colors.navy, fontFamily: typography.bold },
  indicator: { width: "66%", height: 3, borderRadius: 3, backgroundColor: "transparent" },
  indicatorActive: { backgroundColor: colors.navy },
});
