import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { MetallicGold } from "@/components/metallic-gold";
import { colors, shadow } from "@/theme";
import { FadeInView, PressableScale } from "@/components/motion";

type IconName = keyof typeof Ionicons.glyphMap;
type Item = { label: string; icon: IconName; href: string; requiresLogin?: boolean; live?: boolean };

const items: Item[] = [
  { label: "Paket Umroh", icon: "airplane-outline", href: "/(tabs)/packages" },
  { label: "Jadwal", icon: "calendar-outline", href: "/schedule" },
  { label: "Al-Qur'an", icon: "book-outline", href: "/quran" },
  { label: "Doa & Dzikir", icon: "sparkles-outline", href: "/duas" },
  { label: "Waktu Sholat", icon: "time-outline", href: "/prayer-times" },
  { label: "Asmaul Husna", icon: "star-outline", href: "/asmaul-husna" },
  { label: "Dokumen", icon: "document-text-outline", href: "/documents", requiresLogin: true },
  { label: "Muthowif", icon: "headset-outline", href: "/live-muthowif", live: true },
];

function QuickMenuItem({ item, guest, index }: { item: Item; guest: boolean; index: number }) {
  const locked = guest && item.requiresLogin;
  return (
    <FadeInView delay={120 + index * 40} style={styles.item}>
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={locked ? `${item.label}, perlu masuk` : item.label}
      onPress={() => router.push(item.href as never)}
      pressedScale={0.93}
      style={styles.itemInner}
    >
      <View style={[styles.ring, item.live && styles.ringLive]}>
        {item.live ? <View style={styles.liveFill}><LinearGradient colors={["#1E3A5F", "#06152B"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} /></View> : null}
        <Ionicons name={item.icon} size={23} color={item.live ? colors.softGold : colors.goldDark} />
        {item.live ? <MetallicGold style={styles.liveTag}><Text style={styles.liveText}>LIVE</Text></MetallicGold> : null}
        {locked ? <View style={styles.lock}><Ionicons name="lock-closed" size={9} color={colors.softGold} /></View> : null}
      </View>
      <Text numberOfLines={2} style={[styles.label, item.live && styles.labelStrong]}>{item.label}</Text>
    </PressableScale>
    </FadeInView>
  );
}

export function QuickMenuGrid({ guest }: { guest: boolean }) {
  return <View style={styles.grid}>{items.map((item, index) => <QuickMenuItem key={item.label} item={item} guest={guest} index={index} />)}</View>;
}

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", rowGap: 16 },
  item: { width: "25%", paddingHorizontal: 3 },
  itemInner: { alignItems: "center", gap: 8 },
  ring: { width: 56, height: 56, borderRadius: 28, alignItems: "center", justifyContent: "center", backgroundColor: colors.white, borderWidth: 1, borderColor: "rgba(184,134,11,0.35)", ...shadow },
  ringLive: { borderColor: colors.gold, backgroundColor: colors.navy },
  liveFill: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, borderRadius: 28, overflow: "hidden" },
  liveTag: { position: "absolute", top: -5, right: -8, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 999 },
  liveText: { color: colors.navyDeep, fontFamily: "Montserrat_700Bold", fontSize: 8, letterSpacing: 1 },
  lock: { position: "absolute", right: -2, bottom: -2, width: 20, height: 20, borderRadius: 10, alignItems: "center", justifyContent: "center", backgroundColor: colors.navy, borderWidth: 2, borderColor: colors.ivory },
  label: { minHeight: 30, color: colors.royal, fontFamily: "Montserrat_500Medium", fontSize: 11, lineHeight: 15, textAlign: "center" },
  labelStrong: { color: colors.navy, fontFamily: "Montserrat_600SemiBold" },
});
