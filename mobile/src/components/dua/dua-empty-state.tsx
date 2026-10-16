import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { colors, typography } from "@/theme";

export function DuaEmptyState() { return <View style={styles.wrap}><View style={styles.icon}><Ionicons name="bookmark-outline" size={28} color={colors.gold} /></View><Text style={styles.title}>Belum ada doa favorit</Text><Text style={styles.body}>Simpan doa atau dzikir agar mudah ditemukan kembali.</Text></View>; }
const styles = StyleSheet.create({ wrap: { paddingHorizontal: 38, paddingTop: 75, alignItems: "center" }, icon: { width: 58, height: 58, borderRadius: 20, alignItems: "center", justifyContent: "center", backgroundColor: "#F8F1DC" }, title: { marginTop: 14, color: colors.navy, fontFamily: typography.quranLatin, fontWeight: "700", fontSize: 17 }, body: { marginTop: 6, color: colors.muted, fontFamily: typography.quranLatin, fontSize: 13, lineHeight: 19, textAlign: "center" } });
