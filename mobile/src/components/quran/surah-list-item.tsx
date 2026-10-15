import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { revelationLabel, type QuranSurah } from "@/lib/quran";
import { colors, typography } from "@/theme";
import { SurahNumberBadge } from "./surah-number-badge";

export function SurahListItem({ surah, onPress }: { surah: QuranSurah; onPress: () => void }) {
  return <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.pressed]}><SurahNumberBadge number={surah.id} /><View style={styles.copy}><Text style={styles.name}>{surah.transliteration}</Text><Text numberOfLines={2} style={styles.meta}>{surah.translation} · {surah.total_verses} ayat · {revelationLabel(surah.type)}</Text></View><Text style={styles.arabic}>{surah.name}</Text><Ionicons name="chevron-forward" size={17} color="#9A9FA8" /></Pressable>;
}

const styles = StyleSheet.create({ row: { minHeight: 72, marginHorizontal: 18, paddingVertical: 10, flexDirection: "row", alignItems: "center", gap: 12, borderBottomWidth: 1, borderBottomColor: colors.line }, pressed: { opacity: .62 }, copy: { flex: 1 }, name: { color: colors.navy, fontFamily: typography.quranLatin, fontWeight: "700", fontSize: 17.5 }, meta: { marginTop: 3, color: colors.muted, fontFamily: typography.quranLatin, fontSize: 13, lineHeight: 18 }, arabic: { maxWidth: 76, color: colors.gold, fontFamily: "ReemKufi_400Regular", fontSize: 18, textAlign: "right", writingDirection: "rtl" } });
