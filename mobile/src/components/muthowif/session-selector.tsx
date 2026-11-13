import { ScrollView, StyleSheet, Text, View } from "react-native";

import { colors, typography } from "@/theme";
import type { MuthowifSession } from "@/types";
import { Chip } from "@/components/ui";

const labels: Record<MuthowifSession["type"], string> = { thawaf: "Thawaf", sai: "Sa'i", kajian: "Kajian", ziarah: "Ziarah", briefing: "Briefing", other: "Panduan" };
export const sessionTypeTitle = (type: MuthowifSession["type"]) => type === "other" ? "Panduan Ibadah" : `${type === "kajian" || type === "briefing" ? "" : "Panduan "}${labels[type]}`;

export function SessionSelector({ value, onChange, disabled }: { value: MuthowifSession["type"]; onChange: (value: MuthowifSession["type"]) => void; disabled?: boolean }) {
  return <View style={styles.root}><Text style={styles.heading}>Pilih Sesi Panduan</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.list, disabled && styles.disabled]}>{(Object.keys(labels) as MuthowifSession["type"][]).map((type) => <Chip key={type} label={labels[type]} active={value === type} onPress={() => { if (!disabled) onChange(type); }} />)}</ScrollView></View>;
}
const styles = StyleSheet.create({ root: { gap: 11 }, heading: { color: colors.navy, fontFamily: typography.bold, fontSize: 17 }, list: { gap: 8, paddingRight: 18 }, disabled: { opacity: .55 } });
