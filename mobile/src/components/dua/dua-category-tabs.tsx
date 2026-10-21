import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, typography } from "@/theme";

export type DuaTab = "dua" | "dhikr" | "selected" | "favorite";
const tabs: Array<{ key: DuaTab; label: string }> = [{ key: "dua", label: "Doa" }, { key: "dhikr", label: "Dzikir" }, { key: "selected", label: "Pilihan" }, { key: "favorite", label: "Favorit" }];

export function DuaCategoryTabs({ value, onChange }: { value: DuaTab; onChange: (value: DuaTab) => void }) {
  return <View style={styles.content}>{tabs.map((tab) => <Pressable key={tab.key} accessibilityRole="tab" accessibilityState={{ selected: value === tab.key }} onPress={() => onChange(tab.key)} style={[styles.tab, value === tab.key && styles.active]}><Text numberOfLines={1} style={[styles.label, value === tab.key && styles.activeLabel]}>{tab.label}</Text></Pressable>)}</View>;
}

const styles = StyleSheet.create({ content: { paddingHorizontal: 18, gap: 8, flexDirection: "row" }, tab: { flex: 1, minWidth: 0, minHeight: 40, paddingHorizontal: 6, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: "#EEEAE2" }, active: { backgroundColor: colors.navy }, label: { color: colors.navy, fontFamily: typography.quranLatin, fontWeight: "700", fontSize: 13 }, activeLabel: { color: colors.white } });
