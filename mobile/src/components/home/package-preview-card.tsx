import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import type { Package } from "@/types";
import { colors, shadow } from "@/theme";

const rupiah = (value?: number) => value
  ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value)
  : "Hubungi kami";

function Meta({ icon, children }: { icon: keyof typeof Ionicons.glyphMap; children: string }) {
  return <View style={styles.metaRow}><Ionicons name={icon} size={14} color={colors.gold} /><Text numberOfLines={1} style={styles.meta}>{children}</Text></View>;
}

export function PackagePreviewCard({ item }: { item: Package }) {
  const hotel = item.makkahHotel?.name || item.madinahHotel?.name || item.plusHotels?.[0]?.name;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push(`/package/${item.slug}`)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <Image source={{ uri: item.image }} resizeMode="cover" style={styles.image} alt={item.name} />
      <View style={styles.body}>
        <Text style={styles.badge}>{item.badge || (item.packageType === "plus" ? "UMROH PLUS" : "PAKET UMROH")}</Text>
        <Text numberOfLines={2} style={styles.title}>{item.name}</Text>
        <View style={styles.metaList}>
          <Meta icon="time-outline">{item.durationDays ? `${item.durationDays} hari` : "Durasi menyesuaikan"}</Meta>
          {item.airline ? <Meta icon="airplane-outline">{item.airline}</Meta> : null}
          {hotel ? <Meta icon="business-outline">{hotel}</Meta> : null}
        </View>
        <Text style={styles.price}>{rupiah(item.priceFrom)}</Text>
      </View>
    </Pressable>
  );
}

export function PackagePreviewSkeleton() {
  return <View style={styles.skeleton}><View style={styles.skeletonImage} /><View style={styles.skeletonBody}><View style={styles.skeletonLine} /><View style={[styles.skeletonLine, { width: "72%" }]} /><View style={[styles.skeletonLine, { width: "48%" }]} /></View></View>;
}

const styles = StyleSheet.create({
  card: { flexDirection: "row", minHeight: 164, borderRadius: 19, overflow: "hidden", backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, ...shadow },
  pressed: { opacity: 0.8 },
  image: { width: "39%", minHeight: 164, backgroundColor: "#D9E1E7" },
  body: { flex: 1, padding: 14, gap: 7 },
  badge: { color: colors.gold, fontFamily: "DMSans_700Bold", fontSize: 9.5, letterSpacing: 1.1 },
  title: { color: colors.navy, fontFamily: "PlayfairDisplay_700Bold", fontSize: 18, lineHeight: 22 },
  metaList: { gap: 4 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  meta: { flex: 1, color: colors.muted, fontFamily: "DMSans_400Regular", fontSize: 11.5 },
  price: { color: colors.navy, fontFamily: "DMSans_700Bold", fontSize: 15, marginTop: "auto" },
  skeleton: { flexDirection: "row", minHeight: 164, borderRadius: 19, overflow: "hidden", backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line },
  skeletonImage: { width: "39%", backgroundColor: "#E6E9E8" },
  skeletonBody: { flex: 1, padding: 16, gap: 12 },
  skeletonLine: { height: 12, width: "90%", borderRadius: 6, backgroundColor: "#E9E5DD" },
});
