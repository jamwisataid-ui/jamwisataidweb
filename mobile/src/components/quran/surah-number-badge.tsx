import { StyleSheet, Text, View } from "react-native";
import { colors, typography } from "@/theme";

export function SurahNumberBadge({ number, label }: { number?: number; label?: string }) {
  return <View style={styles.outer}><View style={styles.inner}><Text adjustsFontSizeToFit numberOfLines={1} style={styles.number}>{label ?? number}</Text></View></View>;
}

const styles = StyleSheet.create({ outer: { width: 48, height: 48, padding: 3, borderRadius: 24, borderWidth: 1.5, borderColor: colors.gold, backgroundColor: "#F8F1DC" }, inner: { flex: 1, borderRadius: 20, borderWidth: 1, borderColor: "#D4AF37", alignItems: "center", justifyContent: "center" }, number: { color: colors.navy, fontFamily: typography.quranLatin, fontWeight: "700", fontSize: 13 } });
