import { StyleSheet, Text, View } from "react-native";
import { colors, typography } from "@/theme";

export function ArabicTextBlock({ arabic, latin }: { arabic: string; latin?: string }) {
  return <View style={styles.wrap}><Text selectable style={styles.arabic}>{arabic}</Text>{latin ? <><View style={styles.line} /><Text selectable style={styles.latin}>{latin}</Text></> : null}</View>;
}
const styles = StyleSheet.create({ wrap: { padding: 18, borderRadius: 19, backgroundColor: colors.white }, arabic: { color: colors.navy, fontFamily: typography.quranArabic, fontSize: 29, lineHeight: 52, textAlign: "right", writingDirection: "rtl" }, line: { height: 1, marginVertical: 16, backgroundColor: colors.line }, latin: { color: colors.ink, fontFamily: typography.quranLatin, fontSize: 14, lineHeight: 23, fontStyle: "italic" } });
