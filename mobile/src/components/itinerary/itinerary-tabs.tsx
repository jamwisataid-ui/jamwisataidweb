import { StyleSheet, View } from "react-native";
import { Chip } from "@/components/ui";

export type ItineraryTab = "schedule" | "important";

export function ItineraryTabs({ value, onChange }: { value: ItineraryTab; onChange: (value: ItineraryTab) => void }) {
  return <View style={styles.frame}>{([{ key: "schedule", label: "Jadwal Perjalanan" }, { key: "important", label: "Informasi Penting" }] as const).map((item) => <View key={item.key} style={styles.tab}><Chip label={item.label} active={value === item.key} onPress={() => onChange(item.key)} /></View>)}</View>;
}

const styles = StyleSheet.create({
  frame: { marginHorizontal: 18, minHeight: 46, gap: 7, flexDirection: "row" },
  tab: { flex: 1 },
});
