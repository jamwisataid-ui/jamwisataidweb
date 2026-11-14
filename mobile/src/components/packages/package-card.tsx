import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Image, StyleSheet, Text, View } from "react-native";

import { colors, shadow } from "@/theme";
import { MetallicGold } from "@/components/metallic-gold";
import type { Package } from "@/types";
import { PressableScale } from "@/components/motion";

const money = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 });

const statusContent: Record<string, { label: string; tone: "navy" | "gold" | "red" }> = {
  available: { label: "Tersedia", tone: "navy" },
  limited: { label: "Kursi Terbatas", tone: "red" },
  "sold-out": { label: "Pendaftaran Ditutup", tone: "red" },
  "coming-soon": { label: "Segera Hadir", tone: "navy" },
};

function PackageBadge({ item }: { item: Package }) {
  const status = statusContent[item.status];
  const hasNoSeats = item.departures?.some((departure) => departure.remainingQuota === 0);
  const label = item.badge || (item.packageType === "plus" ? "Plus" : hasNoSeats && item.status === "sold-out" ? "Sisa 0 pax" : status?.label || "Umroh");
  const tone = item.badge ? "gold" : item.packageType === "plus" ? "navy" : status?.tone || "navy";
  return <View style={[styles.badge, tone === "red" && styles.redBadge]}><Text style={[styles.badgeText, tone === "red" && styles.redBadgeText]}>{label.toLocaleUpperCase("id-ID")}</Text></View>;
}

function PackageMetaRow({ icon, text }: { icon: keyof typeof Ionicons.glyphMap; text: string }) {
  return <View style={styles.metaRow}><Ionicons name={icon} size={15} color={colors.goldDark} /><Text numberOfLines={1} style={styles.metaText}>{text}</Text></View>;
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
  const displayedDeparture = item.departures?.find((departure) => departure.selectable) ?? item.departures?.[0];
  const scheduleLabel = item.departures && item.departures.length > 1
    ? `${item.departures.length} jadwal · mulai ${item.departures[0].dateLabel}`
    : item.departureDate || "Jadwal segera tersedia";
  const scheduleWithSeats = displayedDeparture?.remainingQuota == null
    ? scheduleLabel
    : `${scheduleLabel} · Sisa ${displayedDeparture.remainingQuota} pax`;

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={`Lihat detail ${item.name}`}
      onPress={() => router.push({ pathname: "/package/[slug]", params: { slug: item.id } })}
      pressedScale={0.985}
      style={styles.shadowShell}
    >
      <View style={styles.card}>
        <View style={styles.imageFrame}>
          <Image source={{ uri: item.image }} resizeMode="cover" style={styles.image} alt={item.name} />
          <LinearGradient colors={["transparent", "rgba(6,21,43,0.55)"]} locations={[0.5, 1]} style={StyleSheet.absoluteFill} />
          <PackageBadge item={item} />
          {item.durationDays ? <Text style={styles.imageCaption}>{item.durationDays} hari{item.departures?.[0]?.dateLabel ? ` · mulai ${item.departures[0].dateLabel}` : ""}</Text> : null}
        </View>

        <View style={styles.content}>
          <Text numberOfLines={1} style={styles.eyebrow}>{destinations.toLocaleUpperCase("id-ID")}</Text>
          <Text numberOfLines={2} style={styles.name}>{item.name}</Text>

          <View style={styles.metaList}>
            <PackageMetaRow icon="calendar-outline" text={scheduleWithSeats} />
            {item.airline ? <PackageMetaRow icon="airplane-outline" text={item.airline} /> : null}
            {hotels.map((hotel, index) => <PackageMetaRow key={`${hotel}-${index}`} icon="business-outline" text={hotel} />)}
          </View>

          <View style={styles.footer}>
            <View style={styles.priceBlock}>
              <Text style={styles.perPerson}>{item.priceFrom ? "mulai dari / jamaah" : "Harga paket"}</Text>
              <Text style={styles.price}>{item.priceFrom ? `Rp ${money.format(item.priceFrom)}` : "Hubungi kami"}</Text>
            </View>
            {disabled ? <View style={[styles.arrow, styles.disabledButton]}><Ionicons name="arrow-forward" size={18} color={colors.muted} /></View> : <MetallicGold style={styles.arrow}><Ionicons name="arrow-forward" size={18} color={colors.navyDeep} /></MetallicGold>}
          </View>
        </View>
      </View>
    </PressableScale>
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
  shadowShell: { width: "100%", borderRadius: 20, ...shadow },
  card: { width: "100%", borderRadius: 20, overflow: "hidden", backgroundColor: colors.white, borderWidth: 1, borderColor: colors.goldLine },
  pressed: { opacity: 0.86 },
  imageFrame: { width: "100%", aspectRatio: 16 / 8.5, backgroundColor: colors.navyDeep },
  image: { width: "100%", height: "100%" },
  badge: { position: "absolute", top: 14, left: 14, minHeight: 26, paddingHorizontal: 12, borderRadius: 999, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(6,21,43,0.6)", borderWidth: 1, borderColor: "rgba(212,175,55,0.6)" },
  redBadge: { backgroundColor: "rgba(255,240,238,0.95)", borderColor: "rgba(180,35,24,0.35)" },
  badgeText: { color: colors.softGold, fontFamily: "Cinzel_600SemiBold", fontSize: 9.5, letterSpacing: 1.8 },
  redBadgeText: { color: colors.danger, fontFamily: "Montserrat_700Bold", letterSpacing: 0.6 },
  imageCaption: { position: "absolute", left: 14, bottom: 12, color: colors.white, fontFamily: "Montserrat_500Medium", fontSize: 11.5 },
  content: { padding: 18, gap: 6 },
  eyebrow: { color: colors.goldText, fontFamily: "Cinzel_600SemiBold", fontSize: 9.5, letterSpacing: 2.2 },
  name: { color: colors.navy, fontFamily: "Cinzel_600SemiBold", fontSize: 19, lineHeight: 24 },
  metaList: { gap: 6, paddingTop: 5 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  metaText: { flex: 1, color: colors.muted, fontFamily: "Montserrat_400Regular", fontSize: 12.5, lineHeight: 18 },
  footer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10, marginTop: 8, paddingTop: 12, borderTopWidth: 1, borderTopColor: "rgba(184,134,11,0.2)" },
  priceBlock: { flex: 1, gap: 1 },
  price: { color: colors.navy, fontFamily: "Montserrat_700Bold", fontSize: 19, lineHeight: 24 },
  perPerson: { color: colors.muted, fontFamily: "Montserrat_400Regular", fontSize: 10.5 },
  arrow: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center", overflow: "hidden" },
  disabledButton: { backgroundColor: "#E8E2D7" },
  skeletonCard: { width: "100%", borderRadius: 20, overflow: "hidden", backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line },
  skeletonImage: { width: "100%", aspectRatio: 16 / 7, backgroundColor: "#E4E7E6" },
  skeletonContent: { padding: 16, gap: 11 },
  skeletonLine: { height: 12, borderRadius: 6, backgroundColor: "#EAE6DE" },
});
