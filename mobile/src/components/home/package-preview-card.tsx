import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Image, StyleSheet, Text, View } from "react-native";

import type { Package } from "@/types";
import { colors } from "@/theme";
import { PressableScale } from "@/components/motion";

const shortRupiah = (value?: number) => {
  if (!value) return "Hubungi kami";
  if (value >= 1_000_000) return `Rp ${(value / 1_000_000).toLocaleString("id-ID", { maximumFractionDigits: 1 })} jt`;
  return `Rp ${value.toLocaleString("id-ID")}`;
};

export const PACKAGE_PREVIEW_WIDTH = 296;

export function PackagePreviewCard({ item }: { item: Package }) {
  const eyebrow = [item.packageType === "plus" ? "UMROH PLUS" : item.badge?.toLocaleUpperCase("id-ID") || "REGULER", item.durationDays ? `${item.durationDays} HARI` : null].filter(Boolean).join(" · ");
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={`Lihat detail ${item.name}`}
      onPress={() => router.push({ pathname: "/package/[slug]", params: { slug: item.id } })}
      style={styles.card}
    >
      <Image source={{ uri: item.image }} resizeMode="cover" style={StyleSheet.absoluteFill} alt={item.name} />
      <LinearGradient colors={["rgba(6,21,43,0.92)", "rgba(6,21,43,0.55)", "rgba(6,21,43,0.08)"]} locations={[0, 0.55, 1]} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={StyleSheet.absoluteFill} />
      <View style={styles.body}>
        <View style={styles.top}>
          <Text numberOfLines={1} style={styles.eyebrow}>{eyebrow}</Text>
          <Text numberOfLines={2} style={styles.title}>{item.name}</Text>
        </View>
        <Text style={styles.from}>mulai <Text style={styles.price}>{shortRupiah(item.priceFrom)}</Text></Text>
      </View>
    </PressableScale>
  );
}

export function PackagePreviewSkeleton() {
  return <View style={[styles.card, styles.skeleton]}><View style={styles.body}><View style={styles.skeletonLine} /><View style={[styles.skeletonLine, { width: "62%" }]} /></View></View>;
}

const styles = StyleSheet.create({
  card: { width: PACKAGE_PREVIEW_WIDTH, height: 156, borderRadius: 20, overflow: "hidden", backgroundColor: colors.navyDeep },
  pressed: { opacity: 0.88 },
  body: { flex: 1, padding: 16, justifyContent: "space-between", maxWidth: "78%" },
  top: { gap: 4 },
  eyebrow: { color: colors.goldText, fontFamily: "Cinzel_600SemiBold", fontSize: 9.5, letterSpacing: 2.2 },
  title: { color: colors.white, fontFamily: "Cinzel_600SemiBold", fontSize: 17, lineHeight: 22 },
  from: { color: "rgba(255,255,255,0.75)", fontFamily: "Montserrat_400Regular", fontSize: 11 },
  price: { color: colors.softGold, fontFamily: "Montserrat_700Bold", fontSize: 16 },
  skeleton: { backgroundColor: "#E6E2D8" },
  skeletonLine: { height: 12, width: "90%", borderRadius: 6, backgroundColor: "#D9D3C6" },
});
