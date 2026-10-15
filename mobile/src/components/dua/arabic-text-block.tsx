import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/theme";

export function ArabicTextBlock({ arabic, latin }: { arabic: string; latin?: string }) {
  return <View style={styles.wrap}><Text selectable style={styles.arabic}>{arabic}</Text>{latin ? <><View style={styles.line} /><Text selectable style={styles.latin}>{latin}</Text></> : null}</View>;
}
const styles = StyleSheet.create({ wrap: { padding: 18, borderRadius: 19, backgroundColor: colors.white }, arabic: { color: colors.navy, fontFamily: "NotoNaskhArabic_400Regular", fontSize: 29, lineHeight: 52, textAlign: "right", writingDirection: "rtl" }, line: { height: 1, marginVertical: 16, backgroundColor: colors.line }, latin: { color: colors.ink, fontFamily: "DMSans_500Medium", fontSize: 14, lineHeight: 23, fontStyle: "italic" } });
