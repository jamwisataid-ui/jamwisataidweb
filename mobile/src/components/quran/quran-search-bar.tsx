import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TextInput, View } from "react-native";
import { colors, typography } from "@/theme";

export function QuranSearchBar({ value, onChangeText }: { value: string; onChangeText: (value: string) => void }) {
  return <View style={styles.wrap}><Ionicons name="search-outline" size={20} color={colors.muted} /><TextInput accessibilityLabel="Cari surah" autoCorrect={false} onChangeText={onChangeText} placeholder="Cari surah, nomor, atau arti..." placeholderTextColor="#8A909B" returnKeyType="search" style={styles.input} value={value} />{value ? <Ionicons name="close-circle" size={18} color={colors.muted} onPress={() => onChangeText("")} /> : null}</View>;
}

const styles = StyleSheet.create({ wrap: { marginHorizontal: 18, marginTop: 14, minHeight: 48, paddingHorizontal: 14, flexDirection: "row", alignItems: "center", gap: 10, borderRadius: 15, backgroundColor: "#F0EDE6" }, input: { flex: 1, paddingVertical: 0, color: colors.navy, fontFamily: typography.quranLatin, fontSize: 15, outlineStyle: "none" } as never });
