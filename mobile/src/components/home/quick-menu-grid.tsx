import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Image, StyleSheet, Text, View, type ImageSourcePropType } from "react-native";

import alQuran from "../../../assets/home/v3/ikon/al-quran.png";
import asmaulHusna from "../../../assets/home/v3/ikon/asmaul-husna.png";
import doaDzikir from "../../../assets/home/v3/ikon/doa-dzikir.png";
import dokumen from "../../../assets/home/v3/ikon/dokumen.png";
import jadwal from "../../../assets/home/v3/ikon/jadwal.png";
import muthowif from "../../../assets/home/v3/ikon/muthowif.png";
import paketUmroh from "../../../assets/home/v3/ikon/paket-umroh.png";
import waktuSholat from "../../../assets/home/v3/ikon/waktu-sholat.png";
import { FadeInView, PressableScale } from "@/components/motion";
import { colors, glowGold, gradients, shadow, shadowTile } from "@/theme";

type Item = { label: string; icon: ImageSourcePropType; size: number; href: string; requiresLogin?: boolean; live?: boolean };

const items: Item[] = [
  { label: "Paket Umroh", icon: paketUmroh, size: 37, href: "/(tabs)/packages" },
  { label: "Jadwal", icon: jadwal, size: 31, href: "/schedule" },
  { label: "Al-Qur'an", icon: alQuran, size: 36, href: "/quran" },
  { label: "Doa & Dzikir", icon: doaDzikir, size: 41, href: "/duas" },
  { label: "Waktu Sholat", icon: waktuSholat, size: 33, href: "/prayer-times" },
  { label: "Asmaul Husna", icon: asmaulHusna, size: 34, href: "/asmaul-husna" },
  { label: "Dokumen", icon: dokumen, size: 33, href: "/documents", requiresLogin: true },
  { label: "Muthowif", icon: muthowif, size: 32, href: "/live-muthowif", live: true },
];

function Tile({ item, guest, index }: { item: Item; guest: boolean; index: number }) {
  const locked = guest && item.requiresLogin;
  return (
    <FadeInView delay={120 + index * 40} style={styles.cell}>
      <PressableScale accessibilityRole="button" accessibilityLabel={locked ? `${item.label}, perlu masuk` : item.label} onPress={() => router.push(item.href as never)} pressedScale={0.93} style={styles.cellInner}>
        <View style={[styles.tile, item.live && styles.tileLive]}>
          <LinearGradient pointerEvents="none" colors={item.live ? ["#134A80", "#0B2A55", "#061B38"] : gradients.tile} locations={item.live ? [0, 0.5, 1] : gradients.tileLocations} start={{ x: 0.2, y: 0 }} end={{ x: 0.8, y: 1 }} style={[StyleSheet.absoluteFill, { borderRadius: 14 }]} />
          <View pointerEvents="none" style={styles.tileEdge} />
          <Image alt="" source={item.icon} style={{ width: item.size, height: item.size }} resizeMode="contain" />
          {locked ? <View style={styles.lock}><Ionicons name="lock-closed" size={8} color="#F2CE5E" /></View> : null}
          {item.live ? <View style={styles.live}><View style={styles.liveDot} /><Text style={styles.liveText}>LIVE</Text></View> : null}
        </View>
        <Text numberOfLines={2} style={[styles.label, item.live && styles.labelLive]}>{item.label}</Text>
      </PressableScale>
    </FadeInView>
  );
}

/** "LAYANAN" card with the eight rounded cream tiles from the client reference. */
export function QuickMenuGrid({ guest }: { guest: boolean }) {
  return (
    <View style={styles.card}>
      <LinearGradient pointerEvents="none" colors={["#FAFAF9", "#F5F5F3"]} style={[StyleSheet.absoluteFill, { borderRadius: 15 }]} />
      <View style={styles.head}>
        <View style={styles.squares}>{[0, 1, 2, 3].map((n) => <View key={n} style={styles.square} />)}</View>
        <Text accessibilityRole="header" style={styles.title}>LAYANAN</Text>
        <LinearGradient colors={["#C9971F", "rgba(226,188,85,0.25)"]} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={styles.rule} />
        <Text numberOfLines={1} style={styles.subtitle}>Ibadah & Persiapan Umroh</Text>
      </View>
      <View style={styles.grid}>{items.map((item, index) => <Tile key={item.label} item={item} guest={guest} index={index} />)}</View>
    </View>
  );
}

export const SERVICES_HEIGHT = 238;

const styles = StyleSheet.create({
  card: { height: SERVICES_HEIGHT, borderRadius: 15, paddingTop: 12, paddingHorizontal: 8, backgroundColor: "#F8F8F6", ...shadow },
  head: { flexDirection: "row", alignItems: "center", height: 20, paddingLeft: 10, paddingRight: 4, gap: 8 },
  squares: { width: 15, height: 15, flexDirection: "row", flexWrap: "wrap", gap: 3 },
  square: { width: 6, height: 6, borderRadius: 1.5, backgroundColor: "#D9AE3C" },
  title: { color: colors.navyText, fontFamily: "Montserrat_700Bold", fontSize: 15, letterSpacing: 0.4 },
  rule: { flex: 1, maxWidth: 95, height: 1.2 },
  subtitle: { marginLeft: "auto", textAlign: "right", color: colors.navyText, fontFamily: "Montserrat_500Medium", fontStyle: "italic", fontSize: 11 },
  grid: { marginTop: 10, flexDirection: "row", flexWrap: "wrap" },
  cell: { width: "25%", height: 89, alignItems: "center" },
  cellInner: { alignItems: "center", gap: 6 },
  tile: { width: 70, height: 56, borderRadius: 15, alignItems: "center", justifyContent: "center", backgroundColor: "#FEFBF3", borderWidth: 1, borderColor: "rgba(214,180,100,0.30)", ...shadowTile },
  tileLive: { backgroundColor: "#0B2A55", borderWidth: 1.5, borderColor: "#D9B04A", ...glowGold, shadowOpacity: 0.5, shadowRadius: 8, elevation: 4 },
  tileEdge: { position: "absolute", top: 1, left: 10, right: 10, height: 1, backgroundColor: "rgba(255,255,255,0.9)" },
  lock: { position: "absolute", left: 38, top: 30, width: 17, height: 17, borderRadius: 9, alignItems: "center", justifyContent: "center", backgroundColor: "#0B2A55", borderWidth: 1.5, borderColor: colors.white },
  live: { position: "absolute", top: -8, right: -9, height: 16, paddingHorizontal: 6, borderRadius: 8, flexDirection: "row", alignItems: "center", gap: 3, backgroundColor: "#EBC459", borderWidth: StyleSheet.hairlineWidth, borderColor: "rgba(150,105,10,0.5)" },
  liveDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: colors.notification },
  liveText: { color: "#0B1F3F", fontFamily: "Montserrat_700Bold", fontSize: 9.5 },
  label: { color: colors.navyText, fontFamily: "Montserrat_500Medium", fontSize: 11.5, lineHeight: 14, textAlign: "center" },
  labelLive: { fontFamily: "Montserrat_700Bold", fontSize: 12 },
});
