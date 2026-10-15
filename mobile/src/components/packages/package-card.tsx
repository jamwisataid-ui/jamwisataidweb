import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { colors, shadow } from "@/theme";
import type { Package } from "@/types";

const money = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 });

const statusContent: Record<string, { label: string; tone: "navy" | "gold" | "red" }> = {
  available: { label: "Tersedia", tone: "navy" },
  limited: { label: "Kursi Terbatas", tone: "red" },
  "sold-out": { label: "Pendaftaran Ditutup", tone: "red" },
  "coming-soon": { label: "Segera Hadir", tone: "navy" },
};

function PackageBadge({ item }: { item: Package }) {
  const status = statusContent[item.status];
  const label = item.badge || (item.packageType === "plus" ? "Plus" : status?.label || "Umroh");
  const tone = item.badge ? "gold" : item.packageType === "plus" ? "navy" : status?.tone || "navy";
  return <View style={[styles.badge, styles[`${tone}Badge`]]}><Text style={[styles.badgeText, tone === "navy" && styles.lightBadgeText]}>{label}</Text></View>;
}

function PackageMetaRow({ icon, text }: { icon: keyof typeof Ionicons.glyphMap; text: string }) {
  return <View style={styles.metaRow}><Ionicons name={icon} size={16} color={colors.gold} /><Text numberOfLines={1} style={styles.metaText}>{text}</Text></View>;
}

function hotelLabel(name: string, star?: number) {
  return star ? `${name} (${star} bintang)` : name;
}

export function PackageCard({ item }: { item: Package }) {
  const destinations = item.destination?.length ? item.destination.join(" · ") : item.packageType === "plus" ? "Makkah · Madinah · Program Plus" : "Makkah · Madinah";
  const hotels = [
    item.makkahHotel ? hotelLabel(item.makkahHotel.name, item.makkahHotel.star) : undefined,
    item.madinahHotel ? hotelLabel(item.madinahHotel.name, item.madinahHotel.star) : undefined,
    item.plusHotels?.[0] ? hotelLabel(item.plusHotels[0].name, item.plusHotels[0].star) : undefined,
  ].filter((value): value is string => Boolean(value)).slice(0, 2);
  const disabled = item.status === "sold-out";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Lihat detail ${item.name}`}
      onPress={() => router.push({ pathname: "/package/[slug]", params: { slug: item.id } })}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.imageFrame}>
        <Image source={{ uri: item.image }} resizeMode="cover" style={styles.image} alt={item.name} />
        <PackageBadge item={item} />
      </View>

      <View style={styles.content}>
        <Text numberOfLines={2} style={styles.name}>{item.name}</Text>
        <Text numberOfLines={2} style={styles.destination}>
          {item.durationDays ? `${item.durationDays} hari · ` : ""}{destinations}
        </Text>

        <View style={styles.metaList}>
          {item.airline ? <PackageMetaRow icon="airplane-outline" text={item.airline} /> : null}
          {hotels.map((hotel, index) => <PackageMetaRow key={`${hotel}-${index}`} icon="business-outline" text={hotel} />)}
          {!item.airline && hotels.length === 0 ? <PackageMetaRow icon="calendar-outline" text={item.departureDate || "Jadwal segera tersedia"} /> : null}
        </View>

        <View style={styles.footer}>
          <View style={styles.priceBlock}>
            <Text style={styles.price}>{item.priceFrom ? `Rp ${money.format(item.priceFrom)}` : "Hubungi kami"}</Text>
            {item.priceFrom ? <Text style={styles.perPerson}>/jamaah</Text> : null}
          </View>
          <View style={[styles.detailButton, disabled && styles.disabledButton]}>
            <Text style={styles.detailButtonText}>{disabled ? "Lihat Paket" : "Lihat Detail"}</Text>
            <Ionicons name="arrow-forward" size={15} color={colors.navy} />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export function PackageCardSkeleton() {
  return (
    <View style={styles.skeletonCard}>
      <View style={styles.skeletonImage} />
      <View style={styles.skeletonContent}>
        <View style={[styles.skeletonLine, { width: "76%", height: 18 }]} />
        <View style={[styles.skeletonLine, { width: "58%" }]} />
        <View style={[styles.skeletonLine, { width: "88%", marginTop: 7 }]} />
        <View style={[styles.skeletonLine, { width: "68%" }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { width: "100%", borderRadius: 20, overflow: "hidden", backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, ...shadow },
  pressed: { opacity: 0.86 },
  imageFrame: { width: "100%", aspectRatio: 16 / 7, backgroundColor: "#DCE3E8" },
  image: { width: "100%", height: "100%" },
  badge: { position: "absolute", top: 11, right: 11, minHeight: 29, paddingHorizontal: 12, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  goldBadge: { backgroundColor: colors.softGold },
  navyBadge: { backgroundColor: colors.navy },
  redBadge: { backgroundColor: "#FCE2DE" },
  badgeText: { color: colors.navy, fontFamily: "Montserrat_700Bold", fontSize: 11 },
  lightBadgeText: { color: colors.white },
  content: { padding: 16, gap: 7 },
  name: { color: colors.navy, fontFamily: "Cinzel_700Bold", fontSize: 20, lineHeight: 25 },
  destination: { color: colors.muted, fontFamily: "Montserrat_500Medium", fontSize: 13, lineHeight: 19 },
  metaList: { gap: 6, paddingTop: 5 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  metaText: { flex: 1, color: colors.ink, fontFamily: "Montserrat_400Regular", fontSize: 13, lineHeight: 19 },
  footer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10, marginTop: 9, paddingTop: 13, borderTopWidth: 1, borderTopColor: "#EFEAE1" },
  priceBlock: { flex: 1, flexDirection: "row", alignItems: "baseline", flexWrap: "wrap", gap: 3 },
  price: { color: "#B42318", fontFamily: "Montserrat_700Bold", fontSize: 18, lineHeight: 23 },
  perPerson: { color: colors.muted, fontFamily: "Montserrat_400Regular", fontSize: 11 },
  detailButton: { minHeight: 40, paddingHorizontal: 15, borderRadius: 12, backgroundColor: colors.softGold, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 },
  disabledButton: { backgroundColor: "#E8E2D7" },
  detailButtonText: { color: colors.navy, fontFamily: "Montserrat_700Bold", fontSize: 12.5 },
  skeletonCard: { width: "100%", borderRadius: 20, overflow: "hidden", backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line },
  skeletonImage: { width: "100%", aspectRatio: 16 / 7, backgroundColor: "#E4E7E6" },
  skeletonContent: { padding: 16, gap: 11 },
  skeletonLine: { height: 12, borderRadius: 6, backgroundColor: "#EAE6DE" },
});
