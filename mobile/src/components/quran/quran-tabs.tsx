import { StyleSheet, View } from "react-native";
import { Chip } from "@/components/ui";

export type QuranTab = "surah" | "juz" | "bookmark";
const tabs: Array<{ key: QuranTab; label: string }> = [{ key: "surah", label: "Surah" }, { key: "juz", label: "Juz" }, { key: "bookmark", label: "Bookmark" }];

export function QuranTabs({ value, onChange }: { value: QuranTab; onChange: (tab: QuranTab) => void }) {
  return <View style={styles.wrap}>{tabs.map((tab) => <View key={tab.key} style={styles.tab}><Chip label={tab.label} active={value === tab.key} onPress={() => onChange(tab.key)} /></View>)}</View>;
}

const styles = StyleSheet.create({
  wrap: { marginHorizontal: 18, flexDirection: "row", gap: 7 },
  tab: { flex: 1 },
});
