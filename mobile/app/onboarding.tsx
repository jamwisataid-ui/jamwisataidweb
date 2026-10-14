import { StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { Button, Screen } from "@/components/ui";
import { useAuthStore } from "@/lib/auth-store";
import { colors } from "@/theme";

const points = [
  { icon: "map" as const, title: "Perjalanan lebih tenang", body: "Jadwal, hotel, itinerary, dan informasi keberangkatan tersedia dalam satu aplikasi." },
  { icon: "document-text" as const, title: "Dokumen selalu terhubung", body: "Unggah dan periksa kelengkapan dokumen jamaah tanpa data ganda." },
  { icon: "notifications" as const, title: "Informasi tidak terlewat", body: "Terima kabar penting dari tim Jam Wisata selama persiapan perjalanan." },
];

export default function OnboardingScreen() {
  const complete = useAuthStore((state) => state.completeOnboarding);
  const next = async () => { await complete(); router.replace("/(tabs)"); };
  return <Screen><View style={styles.brand}><Text style={styles.kicker}>JARIS AMMAR MADANI</Text><Text style={styles.logo}>JAM WISATA</Text><Text style={styles.tagline}>Setiap Waktu Bernilai Ibadah</Text></View><View style={styles.intro}><Text style={styles.title}>Teman perjalanan ibadah Anda</Text><Text style={styles.copy}>Dirancang sederhana agar nyaman digunakan jamaah dan keluarga.</Text></View><View style={styles.points}>{points.map((point) => <View key={point.title} style={styles.point}><View style={styles.icon}><Ionicons name={point.icon} size={24} color={colors.gold} /></View><View style={{ flex: 1 }}><Text style={styles.pointTitle}>{point.title}</Text><Text style={styles.pointBody}>{point.body}</Text></View></View>)}</View><Button label="Lihat aplikasi" onPress={next} /><Button secondary label="Masuk ke akun jamaah" onPress={() => router.push("/login")} /></Screen>;
}
const styles = StyleSheet.create({ brand: { backgroundColor: colors.navy, marginHorizontal: -20, marginTop: -20, padding: 28, minHeight: 210, justifyContent: "flex-end", borderBottomLeftRadius: 34, borderBottomRightRadius: 34 }, kicker: { color: colors.softGold, fontFamily: "DMSans_700Bold", fontSize: 11, letterSpacing: 2 }, logo: { color: colors.white, fontFamily: "PlayfairDisplay_700Bold", fontSize: 38 }, tagline: { color: colors.softGold, fontFamily: "DMSans_400Regular" }, intro: { gap: 7 }, title: { color: colors.navy, fontFamily: "PlayfairDisplay_700Bold", fontSize: 28 }, copy: { color: colors.muted, fontFamily: "DMSans_400Regular", lineHeight: 21 }, points: { gap: 17 }, point: { flexDirection: "row", gap: 13, alignItems: "flex-start" }, icon: { width: 48, height: 48, borderRadius: 16, alignItems: "center", justifyContent: "center", backgroundColor: "#FFF0D5" }, pointTitle: { color: colors.navy, fontFamily: "DMSans_700Bold", fontSize: 15 }, pointBody: { color: colors.muted, fontFamily: "DMSans_400Regular", lineHeight: 20, marginTop: 3 } } as const);
