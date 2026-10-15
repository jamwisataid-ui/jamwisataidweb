import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { colors } from "@/theme";

const whatsappUrl = "https://wa.me/6281809627499?text=Assalamu%27alaikum%2C%20saya%20membutuhkan%20bantuan%20terkait%20aplikasi%20JAM%20WISATA.";

function HelpRow({ icon, title, subtitle, onPress }: { icon: keyof typeof Ionicons.glyphMap; title: string; subtitle: string; onPress?: () => void }) {
  const body = <><View style={styles.icon}><Ionicons name={icon} size={22} color={colors.navy} /></View><View style={styles.copy}><Text style={styles.rowTitle}>{title}</Text><Text style={styles.subtitle}>{subtitle}</Text></View>{onPress ? <Ionicons name="open-outline" size={18} color={colors.muted} /> : null}</>;
  return onPress ? <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && { opacity: .65 }]}>{body}</Pressable> : <View style={styles.row}>{body}</View>;
}

export default function HelpScreen() {
  return <SafeAreaView style={styles.safe}><View style={styles.header}><Pressable onPress={() => router.back()} style={styles.back}><Ionicons name="arrow-back" size={23} color={colors.navy} /></Pressable><Text style={styles.title}>Pertanyaan & Bantuan</Text><View style={styles.back} /></View><ScrollView contentContainerStyle={styles.content}><View style={styles.hero}><View style={styles.heroIcon}><Ionicons name="headset-outline" size={30} color={colors.navy} /></View><Text style={styles.heroTitle}>Kami siap membantu</Text><Text style={styles.heroText}>Hubungi tim Jam Wisata jika Anda memerlukan bantuan pendaftaran, dokumen, pembayaran, atau perjalanan.</Text></View><View style={styles.list}><HelpRow icon="logo-whatsapp" title="WhatsApp Admin" subtitle="+62 818-0962-7499" onPress={() => Linking.openURL(whatsappUrl)} /><HelpRow icon="location-outline" title="Kantor Jam Wisata" subtitle="Jl. Cibangkong No. 28A Gatot Subroto, Bandung 40273" /></View><View style={styles.faq}><Text style={styles.faqTitle}>Pertanyaan umum</Text><Text style={styles.question}>Apakah melihat paket harus masuk akun?</Text><Text style={styles.answer}>Tidak. Anda dapat melihat paket dan memakai panduan ibadah sebagai tamu. Akun diperlukan saat mendaftar paket dan membuka data pribadi.</Text><Text style={styles.question}>Bagaimana memperbarui dokumen?</Text><Text style={styles.answer}>Buka Area Jamaah → Dokumen Saya, lalu pilih dokumen yang ingin diunggah atau diganti.</Text></View></ScrollView></SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, width: "100%", maxWidth: 480, alignSelf: "center", backgroundColor: colors.ivory },
  header: { height: 60, paddingHorizontal: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  back: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  title: { color: colors.navy, fontFamily: "Montserrat_700Bold", fontSize: 20 },
  content: { padding: 18, paddingBottom: 40, gap: 18 },
  hero: { padding: 22, alignItems: "center", gap: 9, borderRadius: 20, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line },
  heroIcon: { width: 60, height: 60, borderRadius: 30, alignItems: "center", justifyContent: "center", backgroundColor: "#F8F1DC" },
  heroTitle: { color: colors.navy, fontFamily: "Montserrat_700Bold", fontSize: 20 },
  heroText: { color: colors.muted, fontFamily: "Montserrat_400Regular", fontSize: 13.5, lineHeight: 21, textAlign: "center" },
  list: { overflow: "hidden", borderRadius: 18, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.white },
  row: { minHeight: 76, marginLeft: 15, paddingRight: 15, flexDirection: "row", alignItems: "center", gap: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
  icon: { width: 42, height: 42, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: "#F8F1DC" },
  copy: { flex: 1, gap: 3 },
  rowTitle: { color: colors.navy, fontFamily: "Montserrat_700Bold", fontSize: 15 },
  subtitle: { color: colors.muted, fontFamily: "Montserrat_400Regular", fontSize: 12.5, lineHeight: 18 },
  faq: { padding: 18, gap: 8, borderRadius: 18, backgroundColor: colors.white },
  faqTitle: { color: colors.navy, fontFamily: "Montserrat_700Bold", fontSize: 18, marginBottom: 3 },
  question: { color: colors.navy, fontFamily: "Montserrat_700Bold", fontSize: 14, marginTop: 5 },
  answer: { color: colors.muted, fontFamily: "Montserrat_400Regular", fontSize: 13, lineHeight: 20 },
});
