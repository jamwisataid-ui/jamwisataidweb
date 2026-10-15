import { ScrollView, Pressable, StyleSheet, Text, View } from "react-native";

import { colors, typography } from "@/theme";
import type { MuthowifSession } from "@/types";

const labels: Record<MuthowifSession["type"], string> = { thawaf: "Thawaf", sai: "Sa'i", kajian: "Kajian", ziarah: "Ziarah", briefing: "Briefing", other: "Panduan" };
export const sessionTypeTitle = (type: MuthowifSession["type"]) => type === "other" ? "Panduan Ibadah" : `${type === "kajian" || type === "briefing" ? "" : "Panduan "}${labels[type]}`;

export function SessionSelector({ value, onChange, disabled }: { value: MuthowifSession["type"]; onChange: (value: MuthowifSession["type"]) => void; disabled?: boolean }) {
  return <View style={styles.root}><Text style={styles.heading}>Pilih Sesi Panduan</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.list}>{(Object.keys(labels) as MuthowifSession["type"][]).map((type) => <Pressable key={type} disabled={disabled} onPress={() => onChange(type)} style={[styles.item, value === type && styles.active, disabled && styles.disabled]}><Text style={[styles.label, value === type && styles.activeLabel]}>{labels[type]}</Text></Pressable>)}</ScrollView></View>;
}
const styles = StyleSheet.create({ root: { gap: 11 }, heading: { color: colors.navy, fontFamily: typography.bold, fontSize: 17 }, list: { gap: 8, paddingRight: 18 }, item: { minWidth: 92, height: 48, paddingHorizontal: 16, alignItems: "center", justifyContent: "center", borderRadius: 14, backgroundColor: "#F1EFE8", borderWidth: 1, borderColor: colors.line }, active: { backgroundColor: colors.navy, borderColor: colors.gold }, disabled: { opacity: .55 }, label: { color: colors.navy, fontFamily: typography.semibold, fontSize: 13 }, activeLabel: { color: colors.white } });
