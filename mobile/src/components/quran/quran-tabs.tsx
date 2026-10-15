import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "@/theme";

export type QuranTab = "surah" | "juz" | "bookmark";
const tabs: Array<{ key: QuranTab; label: string }> = [{ key: "surah", label: "Surah" }, { key: "juz", label: "Juz" }, { key: "bookmark", label: "Bookmark" }];

export function QuranTabs({ value, onChange }: { value: QuranTab; onChange: (tab: QuranTab) => void }) {
  return <View style={styles.wrap}>{tabs.map((tab) => <Pressable key={tab.key} accessibilityRole="tab" accessibilityState={{ selected: value === tab.key }} onPress={() => onChange(tab.key)} style={[styles.tab, value === tab.key && styles.active]}><Text style={[styles.label, value === tab.key && styles.activeLabel]}>{tab.label}</Text></Pressable>)}</View>;
}

const styles = StyleSheet.create({
  wrap: { marginHorizontal: 18, padding: 4, flexDirection: "row", gap: 5, borderRadius: 17, backgroundColor: "#EEEAE2" },
  tab: { flex: 1, minHeight: 38, borderRadius: 13, alignItems: "center", justifyContent: "center" }, active: { backgroundColor: colors.navy },
  label: { color: colors.navy, fontFamily: "DMSans_700Bold", fontSize: 13 }, activeLabel: { color: colors.white },
});
