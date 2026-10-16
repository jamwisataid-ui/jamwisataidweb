import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";

import { MetallicGold } from "@/components/metallic-gold";
import { Screen, Title } from "@/components/ui";
import { colors } from "@/theme";

type WorshipItem = { title: string; description: string; icon: keyof typeof Ionicons.glyphMap; href?: string; external?: string; featured?: boolean };

const items: WorshipItem[] = [
  { title: "Mushaf Qur'an", description: "Baca 114 surah, simpan bookmark, dan lanjutkan bacaan terakhir secara offline.", icon: "book-outline", href: "/quran", featured: true },
  { title: "Jadwal Sholat", description: "Waktu sholat sesuai lokasi pilihan, tanggal Hijriyah, dan arah kiblat.", icon: "time-outline", href: "/prayer-times" },
  { title: "Doa & Dzikir", description: "Doa perjalanan, tanah suci, dzikir pagi-petang, dan bacaan favorit.", icon: "sparkles-outline", href: "/duas" },
  { title: "LIVE MUTHOWIF", description: "Dengarkan panduan ibadah langsung sesuai rombongan jamaah.", icon: "radio-outline", href: "/live-muthowif" },
  { title: "Panduan Umroh", description: "Buka panduan manasik resmi Jam Wisata dari website.", icon: "compass-outline", external: "https://jamwisata.id/panduan-umroh" },
];

function WorshipCard({ item }: { item: WorshipItem }) {
  const open = () => item.href ? router.push(item.href as never) : item.external ? void Linking.openURL(item.external) : undefined;
  const content = <><View style={styles.icon}><Ionicons name={item.icon} size={24} color={colors.navy} /></View><View style={styles.copy}><Text style={styles.cardTitle}>{item.title}</Text><Text style={styles.description}>{item.description}</Text></View><Ionicons name={item.external ? "open-outline" : "chevron-forward"} size={19} color={colors.muted} /></>;
  return <Pressable accessibilityRole="button" onPress={open} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>{item.featured ? <MetallicGold style={styles.featured}>{content}</MetallicGold> : content}</Pressable>;
}

export default function WorshipScreen() {
  return <Screen><Title subtitle="Al-Qur'an, jadwal sholat, doa, dan panduan perjalanan dalam satu tempat.">Ibadah</Title><View style={styles.intro}><Ionicons name="moon" size={24} color={colors.gold} /><View style={styles.introCopy}><Text style={styles.introTitle}>Pendamping ibadah jamaah</Text><Text style={styles.introBody}>Fitur utama dapat dibuka sebagai tamu. LIVE MUTHOWIF mengikuti akses rombongan saat Anda sudah masuk.</Text></View></View><View style={styles.list}>{items.map((item) => <WorshipCard item={item} key={item.title} />)}</View></Screen>;
}

const styles = StyleSheet.create({
  intro: { flexDirection: "row", alignItems: "flex-start", gap: 12, padding: 16, borderRadius: 17, backgroundColor: colors.navy }, introCopy: { flex: 1, gap: 4 }, introTitle: { color: colors.white, fontFamily: "Montserrat_700Bold", fontSize: 16 }, introBody: { color: "#CFD7E3", fontFamily: "Montserrat_400Regular", fontSize: 12.5, lineHeight: 19 }, list: { gap: 11 }, card: { minHeight: 90, flexDirection: "row", alignItems: "center", gap: 13, borderRadius: 17, overflow: "hidden", backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, padding: 15 }, featured: { flex: 1, alignSelf: "stretch", margin: -15, padding: 15, flexDirection: "row", alignItems: "center", gap: 13 }, pressed: { opacity: .7 }, icon: { width: 48, height: 48, borderRadius: 16, alignItems: "center", justifyContent: "center", backgroundColor: colors.goldPale }, copy: { flex: 1, gap: 4 }, cardTitle: { color: colors.navy, fontFamily: "Cinzel_700Bold", fontSize: 17 }, description: { color: colors.muted, fontFamily: "Montserrat_400Regular", fontSize: 11.5, lineHeight: 17 },
});
