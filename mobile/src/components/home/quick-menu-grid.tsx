import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { GlassSurface } from "@/components/glass";
import { colors } from "@/theme";
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
  const variant = item.live ? "navyOrb" : "pearl";

  return (
    <FadeInView delay={100 + index * 30} style={styles.item}>
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel={locked ? `${item.label}, perlu masuk` : item.label}
        onPress={() => router.push(item.href as never)}
        pressedScale={0.93}
        style={styles.itemInner}
      >
        <View style={styles.ringWrap}>
          <GlassSurface variant={variant} radius={31} style={styles.ring}>
            <View style={styles.ringInner}>
              <Ionicons name={item.icon} size={25} color={item.live ? colors.softGold : colors.goldDark} />
            </View>
          </GlassSurface>
          {item.live ? (
            <View style={styles.liveTagWrap}>
              <GlassSurface variant="gold" radius={999} style={styles.liveTag}>
                <View style={styles.liveTagInner}>
                  <Text style={styles.liveText}>LIVE</Text>
                </View>
              </GlassSurface>
            </View>
          ) : null}
          {locked ? (
            <View style={styles.lock}>
              <Ionicons name="lock-closed" size={9} color={colors.softGold} />
            </View>
          ) : null}
        </View>
        <Text numberOfLines={2} style={[styles.label, item.live && styles.labelStrong]}>
          {item.label}
        </Text>
      </PressableScale>
    </FadeInView>
  );
}

export function QuickMenuGrid({ guest }: { guest: boolean }) {
  return (
    <View style={styles.grid}>
      {items.map((item, index) => (
        <QuickMenuItem key={item.label} item={item} guest={guest} index={index} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", rowGap: 20 },
  item: { width: "25%", paddingHorizontal: 3 },
  itemInner: { alignItems: "center", gap: 8 },
  ringWrap: {
    width: 62,
    height: 62,
    alignItems: "center",
    justifyContent: "center",
  },
  ring: {
    width: 62,
    height: 62,
    borderRadius: 31,
  },
  ringInner: {
    width: 62,
    height: 62,
    alignItems: "center",
    justifyContent: "center",
  },
  liveTagWrap: {
    position: "absolute",
    top: -4,
    right: -4,
    zIndex: 10,
  },
  liveTag: {
    borderRadius: 999,
  },
  liveTagInner: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  liveText: {
    color: colors.navyDeep,
    fontFamily: "Montserrat_700Bold",
    fontSize: 8,
    letterSpacing: 0.8,
  },
  lock: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.navyDeep,
    borderWidth: 1.5,
    borderColor: colors.ivory,
    zIndex: 10,
  },
  label: { minHeight: 28, color: colors.royal, fontFamily: "Montserrat_500Medium", fontSize: 11.5, lineHeight: 14.5, textAlign: "center" },
  labelStrong: { color: colors.navy, fontFamily: "Montserrat_600SemiBold" },
});
