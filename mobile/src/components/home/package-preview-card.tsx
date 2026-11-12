import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Image, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type { Package } from "@/types";
import { colors } from "@/theme";
import { GlassSurface } from "@/components/glass";
import { PressableScale } from "@/components/motion";

const shortRupiah = (value?: number) => {
  if (!value) return "Hubungi kami";
  if (value >= 1_000_000) return `Rp ${(value / 1_000_000).toLocaleString("id-ID", { maximumFractionDigits: 1 })} jt`;
  return `Rp ${value.toLocaleString("id-ID")}`;
};

export const PACKAGE_PREVIEW_WIDTH = 304;

export function PackagePreviewCard({ item }: { item: Package }) {
  const badgeLabel = item.packageType === "plus" ? "UMROH PLUS" : item.badge?.toLocaleUpperCase("id-ID") || "REGULER";
  const durationLabel = item.durationDays ? `${item.durationDays} HARI` : null;

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={`Lihat detail ${item.name}`}
      onPress={() => router.push({ pathname: "/package/[slug]", params: { slug: item.id } })}
      pressedScale={0.96}
      style={styles.card}
    >
      <Image source={{ uri: item.image }} resizeMode="cover" style={StyleSheet.absoluteFill} alt={item.name} />
      <LinearGradient
        colors={["rgba(6,21,43,0.94)", "rgba(6,21,43,0.65)", "rgba(6,21,43,0.15)"]}
        locations={[0, 0.58, 1]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={StyleSheet.absoluteFill}
      />
      <View pointerEvents="none" style={styles.topRim} />
      <View style={styles.body}>
        <View style={styles.top}>
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{badgeLabel}</Text>
            </View>
            {durationLabel ? (
              <View style={styles.durationBadge}>
                <Ionicons name="time-outline" size={11} color={colors.softGold} />
                <Text style={styles.durationText}>{durationLabel}</Text>
              </View>
            ) : null}
          </View>
          <Text numberOfLines={2} style={styles.title}>{item.name}</Text>
        </View>

        <View style={styles.bottomRow}>
          <View>
            <Text style={styles.fromLabel}>Mulai dari</Text>
            <Text style={styles.price}>{shortRupiah(item.priceFrom)}</Text>
          </View>
          <GlassSurface variant="gold" radius={8} style={styles.actionBtn}>
            <View style={styles.actionBtnInner}>
              <Text style={styles.actionBtnText}>Detail</Text>
              <Ionicons name="arrow-forward" size={13} color={colors.navyDeep} />
            </View>
          </GlassSurface>
        </View>
      </View>
    </PressableScale>
  );
}

export function PackagePreviewSkeleton() {
  return (
    <View style={[styles.card, styles.skeleton]}>
      <View style={styles.body}>
        <View style={styles.skeletonLine} />
        <View style={[styles.skeletonLine, { width: "62%" }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: PACKAGE_PREVIEW_WIDTH,
    height: 168,
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: colors.navyDeep,
    borderWidth: 1.2,
    borderColor: "rgba(245,217,122,0.75)",
    shadowColor: "#D4AF37",
    shadowOpacity: 0.3,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  topRim: {
    position: "absolute",
    top: 0,
    left: 2,
    right: 2,
    height: 1.2,
    backgroundColor: "rgba(255,255,255,0.45)",
    zIndex: 2,
  },
  body: {
    flex: 1,
    padding: 18,
    justifyContent: "space-between",
  },
  top: { gap: 8 },
  badgeRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  badge: {
    backgroundColor: "rgba(212,175,55,0.18)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 0.8,
    borderColor: colors.gold,
  },
  badgeText: {
    color: colors.softGold,
    fontFamily: "Cinzel_600SemiBold",
    fontSize: 9,
    letterSpacing: 1.5,
  },
  durationBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(6,21,43,0.6)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 0.8,
    borderColor: "rgba(255,255,255,0.2)",
  },
  durationText: {
    color: colors.white,
    fontFamily: "Montserrat_500Medium",
    fontSize: 9.5,
  },
  title: {
    color: colors.white,
    fontFamily: "Cinzel_600SemiBold",
    fontSize: 16.5,
    lineHeight: 22,
    maxWidth: "80%",
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  fromLabel: {
    color: "rgba(255,255,255,0.72)",
    fontFamily: "Montserrat_400Regular",
    fontSize: 10.5,
  },
  price: {
    color: colors.softGold,
    fontFamily: "Montserrat_700Bold",
    fontSize: 16,
    lineHeight: 20,
  },
  actionBtn: {
    borderRadius: 8,
  },
  actionBtnInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  actionBtnText: {
    color: colors.navyDeep,
    fontFamily: "Montserrat_700Bold",
    fontSize: 11,
    letterSpacing: 0.5,
  },
  skeleton: { backgroundColor: "#E6E2D8" },
  skeletonLine: { height: 12, width: "90%", borderRadius: 6, backgroundColor: "#D9D3C6" },
});
