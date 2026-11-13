import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text } from "react-native";
import { colors } from "@/theme";
import { GlassSurface } from "@/components/glass";

export function FavoriteButton({ active, onPress }: { active: boolean; onPress: () => void }) {
  return <Pressable accessibilityLabel={active ? "Hapus dari favorit" : "Tambah ke favorit"} onPress={onPress}><GlassSurface variant={active ? "gold" : "pearl"} radius={14} glow={active} style={styles.button}><Ionicons name={active ? "bookmark" : "bookmark-outline"} size={18} color={active ? colors.navyDeep : colors.muted} /><Text style={styles.label}>{active ? "Tersimpan" : "Favorit"}</Text></GlassSurface></Pressable>;
}
const styles = StyleSheet.create({ button: { minHeight: 42, paddingHorizontal: 14, flexDirection: "row", alignItems: "center", gap: 7, borderRadius: 14 }, label: { color: colors.navy, fontFamily: "Montserrat_700Bold", fontSize: 12.5 } });
