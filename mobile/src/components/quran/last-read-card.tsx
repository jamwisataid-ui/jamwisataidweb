import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "@/theme";
import { MetallicGold } from "@/components/metallic-gold";

export function LastReadCard({ surah, ayah, onPress }: { surah: string; ayah: number; onPress: () => void }) {
  return <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && { opacity: .75 }]}><MetallicGold style={styles.icon}><Ionicons name="book" size={20} color={colors.navy} /></MetallicGold><View style={styles.copy}><Text style={styles.eyebrow}>TERAKHIR DIBACA</Text><Text style={styles.title}>{surah} · Ayat {ayah}</Text></View><Text style={styles.continue}>Lanjutkan</Text><Ionicons name="arrow-forward" size={17} color={colors.navy} /></Pressable>;
}

const styles = StyleSheet.create({ card: { marginHorizontal: 18, marginTop: 14, padding: 13, flexDirection: "row", alignItems: "center", gap: 10, borderRadius: 16, borderWidth: 1, borderColor: "#EBCB91", backgroundColor: "#F8F1DC" }, icon: { width: 40, height: 40, borderRadius: 13, alignItems: "center", justifyContent: "center" }, copy: { flex: 1 }, eyebrow: { color: colors.muted, fontFamily: "Montserrat_700Bold", fontSize: 9.5, letterSpacing: .8 }, title: { marginTop: 2, color: colors.navy, fontFamily: "Montserrat_700Bold", fontSize: 13.5 }, continue: { color: colors.navy, fontFamily: "Montserrat_700Bold", fontSize: 11.5 } });
