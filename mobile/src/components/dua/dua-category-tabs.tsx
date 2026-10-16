import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { colors, typography } from "@/theme";

export type DuaTab = "dua" | "dhikr" | "selected" | "favorite";
const tabs: Array<{ key: DuaTab; label: string }> = [{ key: "dua", label: "Doa" }, { key: "dhikr", label: "Dzikir" }, { key: "selected", label: "Pilihan" }, { key: "favorite", label: "Favorit" }];

export function DuaCategoryTabs({ value, onChange }: { value: DuaTab; onChange: (value: DuaTab) => void }) {
  return <ScrollView contentContainerStyle={styles.content} horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>{tabs.map((tab) => <Pressable key={tab.key} accessibilityRole="tab" accessibilityState={{ selected: value === tab.key }} onPress={() => onChange(tab.key)} style={[styles.tab, value === tab.key && styles.active]}><Text style={[styles.label, value === tab.key && styles.activeLabel]}>{tab.label}</Text></Pressable>)}</ScrollView>;
}

const styles = StyleSheet.create({ scroll: { flexGrow: 0 }, content: { paddingHorizontal: 18, gap: 8 }, tab: { minWidth: 82, minHeight: 40, paddingHorizontal: 17, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: "#EEEAE2" }, active: { backgroundColor: colors.navy }, label: { color: colors.navy, fontFamily: typography.quranLatin, fontWeight: "700", fontSize: 13 }, activeLabel: { color: colors.white } });
