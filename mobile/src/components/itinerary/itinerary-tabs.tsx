import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/theme";

export type ItineraryTab = "schedule" | "important";

export function ItineraryTabs({ value, onChange }: { value: ItineraryTab; onChange: (value: ItineraryTab) => void }) {
  return <View style={styles.frame}>{([{ key: "schedule", label: "Jadwal Perjalanan" }, { key: "important", label: "Informasi Penting" }] as const).map((item) => <Pressable accessibilityRole="tab" accessibilityState={{ selected: value === item.key }} key={item.key} onPress={() => onChange(item.key)} style={[styles.tab, value === item.key && styles.active]}><Text style={[styles.text, value === item.key && styles.activeText]}>{item.label}</Text></Pressable>)}</View>;
}

const styles = StyleSheet.create({
  frame: { marginHorizontal: 18, padding: 4, minHeight: 46, borderRadius: 23, flexDirection: "row", backgroundColor: "#EEEAE2" },
  tab: { flex: 1, minHeight: 38, borderRadius: 19, alignItems: "center", justifyContent: "center", paddingHorizontal: 10 },
  active: { backgroundColor: colors.navy },
  text: { color: colors.navy, fontFamily: "Montserrat_700Bold", fontSize: 12.5, textAlign: "center" },
  activeText: { color: colors.white },
});
