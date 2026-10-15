import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/theme";

export function QuranEmptyState({ bookmark = false }: { bookmark?: boolean }) {
  return <View style={styles.wrap}><View style={styles.icon}><Ionicons name={bookmark ? "bookmark-outline" : "search-outline"} size={27} color={colors.gold} /></View><Text style={styles.title}>{bookmark ? "Belum ada bookmark" : "Surah tidak ditemukan"}</Text><Text style={styles.body}>{bookmark ? "Tandai ayat saat membaca agar mudah ditemukan kembali." : "Coba gunakan nama, nomor, atau arti surah yang lain."}</Text></View>;
}

const styles = StyleSheet.create({ wrap: { paddingHorizontal: 38, paddingTop: 70, alignItems: "center" }, icon: { width: 58, height: 58, borderRadius: 20, alignItems: "center", justifyContent: "center", backgroundColor: "#FFF3D9" }, title: { marginTop: 14, color: colors.navy, fontFamily: "DMSans_700Bold", fontSize: 17 }, body: { marginTop: 6, color: colors.muted, fontFamily: "DMSans_400Regular", fontSize: 13, lineHeight: 19, textAlign: "center" } });
