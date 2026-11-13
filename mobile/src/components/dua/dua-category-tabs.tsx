import { StyleSheet, View } from "react-native";
import { Chip } from "@/components/ui";

export type DuaTab = "dua" | "dhikr" | "selected" | "favorite";
const tabs: Array<{ key: DuaTab; label: string }> = [{ key: "dua", label: "Doa" }, { key: "dhikr", label: "Dzikir" }, { key: "selected", label: "Pilihan" }, { key: "favorite", label: "Favorit" }];

export function DuaCategoryTabs({ value, onChange }: { value: DuaTab; onChange: (value: DuaTab) => void }) {
  return <View style={styles.content}>{tabs.map((tab) => <View key={tab.key} style={styles.tab}><Chip label={tab.label} active={value === tab.key} onPress={() => onChange(tab.key)} /></View>)}</View>;
}

const styles = StyleSheet.create({ content: { paddingHorizontal: 18, gap: 7, flexDirection: "row" }, tab: { flex: 1, minWidth: 0 } });
