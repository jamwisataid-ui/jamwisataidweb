import { Linking, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button, Card, Screen, Title } from "@/components/ui";
import { colors } from "@/theme";

export default function WorshipScreen() {
  return <Screen><Title subtitle="Pendamping ibadah yang mudah dibaca selama perjalanan.">Ibadah</Title><Card><View style={styles.icon}><Ionicons name="book" size={28} color={colors.gold} /></View><Text style={styles.title}>Panduan Umroh</Text><Text style={styles.copy}>Buka panduan manasik dan urutan ibadah resmi Jam Wisata. Konten doa, Al-Qur’an, dan dzikir offline akan tersedia pada tahap berikutnya.</Text><Button label="Buka panduan" onPress={() => Linking.openURL("https://jamwisata.id/panduan-umroh")} /></Card></Screen>;
}
const styles = StyleSheet.create({ icon: { width: 56, height: 56, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: "#F8F1DC" }, title: { color: colors.navy, fontFamily: "Cinzel_700Bold", fontSize: 22 }, copy: { color: colors.muted, fontFamily: "Montserrat_400Regular", lineHeight: 22 } } as const);
