import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text } from "react-native";
import { colors } from "@/theme";

export function FavoriteButton({ active, onPress }: { active: boolean; onPress: () => void }) {
  return <Pressable accessibilityLabel={active ? "Hapus dari favorit" : "Tambah ke favorit"} onPress={onPress} style={[styles.button, active && styles.active]}><Ionicons name={active ? "bookmark" : "bookmark-outline"} size={18} color={active ? colors.navy : colors.muted} /><Text style={styles.label}>{active ? "Tersimpan" : "Favorit"}</Text></Pressable>;
}
const styles = StyleSheet.create({ button: { minHeight: 42, paddingHorizontal: 14, flexDirection: "row", alignItems: "center", gap: 7, borderRadius: 14, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.white }, active: { borderColor: colors.gold, backgroundColor: "#FFF4DB" }, label: { color: colors.navy, fontFamily: "DMSans_700Bold", fontSize: 12.5 } });
