import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Image, Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import kaaba from "../../assets/splash/kaaba-masjidil-haram.jpg";
import { MetallicGold } from "@/components/metallic-gold";
import { IconRing, NavyCard } from "@/components/ui";
import { useNextPrayer } from "@/lib/use-next-prayer";
import { colors, shadow, shadowDark } from "@/theme";

type WorshipItem = { title: string; description: string; icon: keyof typeof Ionicons.glyphMap; href?: string; external?: string; live?: boolean };

const items: WorshipItem[] = [
  { title: "Mushaf Qur'an", description: "Baca 114 surah, simpan bookmark, dan lanjutkan bacaan terakhir secara offline.", icon: "book-outline", href: "/quran" },
  { title: "Doa & Dzikir", description: "Doa perjalanan, tanah suci, dzikir pagi-petang, dan bacaan favorit.", icon: "sparkles-outline", href: "/duas" },
  { title: "Live Muthowif", description: "Dengarkan panduan ibadah langsung sesuai rombongan jamaah.", icon: "headset-outline", href: "/live-muthowif", live: true },
  { title: "Panduan Umroh", description: "Buka panduan manasik resmi Jam Wisata dari website.", icon: "compass-outline", external: "https://jamwisata.id/panduan-umroh" },
];

function WorshipCard({ item }: { item: WorshipItem }) {
  const open = () => item.href ? router.push(item.href as never) : item.external ? void Linking.openURL(item.external) : undefined;
  return (
    <Pressable accessibilityRole="button" onPress={open} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <IconRing name={item.icon} size={50} />
      <View style={styles.copy}>
        <View style={styles.titleRow}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          {item.live ? <MetallicGold style={styles.live}><Text style={styles.liveText}>LIVE</Text></MetallicGold> : null}
        </View>
        <Text style={styles.description}>{item.description}</Text>
      </View>
      <Ionicons name={item.external ? "open-outline" : "chevron-forward"} size={18} color={colors.goldDark} />
    </Pressable>
  );
}

function NextPrayerCard() {
  const next = useNextPrayer();
  return (
    <Pressable accessibilityRole="button" onPress={() => router.push("/prayer-times")} style={styles.prayerWrap}>
      <NavyCard style={styles.prayerCard}>
        <IconRing dark name="moon" size={46} />
        <View style={styles.copy}>
          <Text style={styles.prayerEyebrow}>SHOLAT BERIKUTNYA{next ? ` · ${next.city.toLocaleUpperCase("id-ID")}` : ""}</Text>
          <Text style={styles.prayerName}>{next ? `${next.name} ${next.time}` : "Jadwal Sholat"}</Text>
          <Text style={styles.prayerMeta}>{next ? next.remaining : "Waktu sholat, tanggal Hijriyah, dan arah kiblat."}</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.gold} />
      </NavyCard>
    </Pressable>
  );
}

export default function WorshipScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.hero, { paddingTop: insets.top + 24 }]}>
          <Image alt="" source={kaaba} resizeMode="cover" style={styles.heroImage} />
          <LinearGradient colors={["rgba(6,21,43,0.55)", "rgba(6,21,43,0.95)"]} style={StyleSheet.absoluteFill} />
          <Text style={styles.eyebrow}>PENDAMPING IBADAH JAMAAH</Text>
          <Text accessibilityRole="header" style={styles.title}>Ibadah</Text>
          <Text style={styles.subtitle}>Al-Qur&apos;an, jadwal sholat, doa, dan panduan perjalanan dalam satu tempat.</Text>
        </View>
        <View style={styles.body}>
          <NextPrayerCard />
          {items.map((item) => <WorshipCard item={item} key={item.title} />)}
          <Text style={styles.note}>Semua fitur ibadah dapat dibuka sebagai tamu. Live Muthowif mengikuti akses rombongan saat Anda sudah masuk.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, width: "100%", maxWidth: 480, alignSelf: "center", backgroundColor: colors.ivory },
  scroll: { paddingBottom: 28 },
  hero: { minHeight: 250, paddingHorizontal: 22, paddingBottom: 70, gap: 6, overflow: "hidden", backgroundColor: colors.navyDeep },
  heroImage: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, opacity: 0.4 },
  eyebrow: { color: colors.gold, fontFamily: "Cinzel_600SemiBold", fontSize: 10, letterSpacing: 3 },
  title: { color: colors.white, fontFamily: "Cinzel_700Bold", fontSize: 30, lineHeight: 37 },
  subtitle: { color: "rgba(255,255,255,0.86)", fontFamily: "CormorantGaramond_500Medium_Italic", fontSize: 17, lineHeight: 22 },
  body: { marginTop: -46, paddingHorizontal: 18, gap: 12 },
  prayerWrap: { borderRadius: 20, ...shadowDark },
  prayerCard: { flexDirection: "row", alignItems: "center", gap: 14, padding: 16 },
  prayerEyebrow: { color: colors.gold, fontFamily: "Montserrat_600SemiBold", fontSize: 10, letterSpacing: 1.4 },
  prayerName: { color: colors.white, fontFamily: "Cinzel_700Bold", fontSize: 19 },
  prayerMeta: { color: "rgba(255,255,255,0.72)", fontFamily: "Montserrat_400Regular", fontSize: 11.5 },
  card: { flexDirection: "row", alignItems: "center", gap: 14, padding: 14, borderRadius: 20, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.goldLine, ...shadow },
  pressed: { opacity: 0.75 },
  copy: { flex: 1, gap: 3 },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  cardTitle: { color: colors.navy, fontFamily: "Cinzel_600SemiBold", fontSize: 15 },
  live: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 999 },
  liveText: { color: colors.navyDeep, fontFamily: "Montserrat_700Bold", fontSize: 8.5, letterSpacing: 1 },
  description: { color: colors.muted, fontFamily: "Montserrat_400Regular", fontSize: 11.5, lineHeight: 16 },
  note: { marginTop: 4, color: colors.muted, fontFamily: "Montserrat_400Regular", fontSize: 11.5, lineHeight: 17, textAlign: "center" },
});
