import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Animated, Image, Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius, shadow, typography } from "@/theme";
import type { LiveMuthowifSession } from "@/types";

import fallbackImage from "../../../assets/onboarding/live-muthowif.jpg";

function LiveBadge() {
  const [pulse] = useState(() => new Animated.Value(0.55));
  useEffect(() => {
    const animation = Animated.loop(Animated.sequence([
      Animated.timing(pulse, { toValue: 1, duration: 850, useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 0.55, duration: 850, useNativeDriver: true }),
    ]));
    animation.start();
    return () => animation.stop();
  }, [pulse]);
  return <View style={styles.badge}><Animated.View style={[styles.dot, { opacity: pulse }]} /><Text style={styles.badgeText}>LIVE</Text></View>;
}

function dateLabel(value: string) {
  return new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

export function LiveSessionCard({ item, joining, onJoin }: { item: LiveMuthowifSession; joining?: boolean; onJoin: (item: LiveMuthowifSession) => void }) {
  const isLive = item.status === "live";
  const isEnded = item.status === "ended";
  const buttonLabel = isLive ? (item.canJoin ? "Gabung Sekarang" : "Sesi Penuh") : isEnded ? "Siaran Berakhir" : "Lihat Jadwal";
  return <View style={styles.card}>
    <View style={styles.main}>
      <Image alt="" source={item.image ? { uri: item.image } : fallbackImage} resizeMode="cover" style={styles.image} />
      <View style={styles.info}>
        {isLive ? <LiveBadge /> : <View style={styles.scheduleBadge}><Text style={styles.scheduleBadgeText}>{isEnded ? "SELESAI" : "TERJADWAL"}</Text></View>}
        <Text numberOfLines={2} style={styles.title}>{item.title}</Text>
        <Text numberOfLines={1} style={styles.muthowif}>{item.muthowif.name}</Text>
        <Text numberOfLines={1} style={styles.meta}>{item.rombonganName}</Text>
        <Text style={styles.meta}>{dateLabel(item.startsAt)}</Text>
        <View style={styles.listeners}><Ionicons name="headset-outline" size={15} color={colors.navy} /><Text style={styles.listenerText}>{item.listenerCount} / {item.capacity} jamaah</Text></View>
      </View>
    </View>
    <Pressable accessibilityRole="button" disabled={joining || (isLive && !item.canJoin) || isEnded} onPress={() => onJoin(item)} style={({ pressed }) => [styles.button, (pressed || joining || (isLive && !item.canJoin) || isEnded) && styles.buttonDisabled]}><Ionicons name={isLive ? "headset" : "calendar-outline"} size={18} color={colors.white} /><Text style={styles.buttonText}>{joining ? "Menghubungkan..." : buttonLabel}</Text></Pressable>
  </View>;
}

const styles = StyleSheet.create({
  card: { padding: 13, borderRadius: radius.card, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.white, gap: 12, ...shadow },
  main: { flexDirection: "row", gap: 13 },
  image: { width: 104, minHeight: 128, borderRadius: 13, backgroundColor: colors.goldPale },
  info: { flex: 1, alignItems: "flex-start", minWidth: 0 },
  badge: { height: 23, flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 8, borderRadius: 8, backgroundColor: "#22C55E", marginBottom: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.white },
  badgeText: { color: colors.white, fontFamily: typography.bold, fontSize: 10, letterSpacing: 0.6 },
  scheduleBadge: { minHeight: 23, justifyContent: "center", paddingHorizontal: 8, borderRadius: 8, backgroundColor: colors.goldPale, marginBottom: 6 },
  scheduleBadgeText: { color: colors.goldDark, fontFamily: typography.bold, fontSize: 9.5, letterSpacing: 0.5 },
  title: { color: colors.navy, fontFamily: typography.bold, fontSize: 16, lineHeight: 20, marginBottom: 3 },
  muthowif: { color: colors.navy, fontFamily: typography.semibold, fontSize: 12.5, marginBottom: 3 },
  meta: { color: colors.muted, fontFamily: typography.body, fontSize: 10.5, lineHeight: 16 },
  listeners: { marginTop: 5, flexDirection: "row", alignItems: "center", gap: 5 },
  listenerText: { color: colors.navy, fontFamily: typography.semibold, fontSize: 11 },
  button: { minHeight: 44, borderRadius: 11, backgroundColor: colors.navy, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  buttonDisabled: { opacity: 0.52 },
  buttonText: { color: colors.white, fontFamily: typography.bold, fontSize: 14 },
});
