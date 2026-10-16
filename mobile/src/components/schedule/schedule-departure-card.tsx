import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import type { PackageDepartureSelection } from "@/lib/package-departures";
import { colors, shadow } from "@/theme";

const money = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });
const statusLabel = {
  available: "Tersedia",
  limited: "Kursi Terbatas",
  "sold-out": "Kuota Penuh",
  "coming-soon": "Segera Dibuka",
} as const;
const dateLabel = (value: string) => {
  const date = new Date(`${value}T00:00:00+07:00`);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("id-ID", { dateStyle: "long", timeZone: "Asia/Jakarta" }).format(date);
};

export function ScheduleDepartureCard({ item }: { item: PackageDepartureSelection }) {
  const { packageItem, departure } = item;
  const seats = departure.remainingQuota && departure.remainingQuota > 0 ? `${departure.remainingQuota}${departure.quota ? ` / ${departure.quota}` : ""} kursi tersisa` : null;

  return <Pressable
    accessibilityLabel={`Lihat ${packageItem.name}, keberangkatan ${departure.dateLabel}`}
    accessibilityRole="button"
    onPress={() => router.push({ pathname: "/package/[slug]", params: { slug: packageItem.slug || packageItem.id, departureId: departure.id } })}
    style={({ pressed }) => [styles.card, pressed && styles.pressed]}
  >
    <Image alt={packageItem.name} resizeMode="cover" source={{ uri: packageItem.image }} style={styles.image} />
    <View style={styles.content}>
      <View style={styles.topRow}>
        <Text style={styles.date}>{departure.dateLabel}</Text>
        <View style={[styles.badge, departure.status === "limited" && styles.badgeLimited, departure.status === "sold-out" && styles.badgeClosed]}>
          <Text style={styles.badgeText}>{statusLabel[departure.status]}</Text>
        </View>
      </View>
      <Text numberOfLines={2} style={styles.title}>{packageItem.name}</Text>
      <View style={styles.meta}><Ionicons color={colors.goldDark} name="airplane-outline" size={15} /><Text numberOfLines={1} style={styles.metaText}>{packageItem.airline || packageItem.departureAirport || "Informasi penerbangan menyusul"}</Text></View>
      {departure.returnDate ? <View style={styles.meta}><Ionicons color={colors.goldDark} name="return-down-back-outline" size={15} /><Text style={styles.metaText}>Pulang {dateLabel(departure.returnDate)}</Text></View> : null}
      <View style={styles.footer}><View><Text style={styles.price}>{departure.price ? money.format(departure.price) : "Hubungi kami"}</Text>{seats ? <Text style={styles.seats}>{seats}</Text> : null}</View><Ionicons color={colors.navy} name="arrow-forward" size={20} /></View>
    </View>
  </Pressable>;
}

const styles = StyleSheet.create({
  card: { flexDirection: "row", minHeight: 174, overflow: "hidden", borderRadius: 19, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.white, ...shadow },
  pressed: { opacity: .8 },
  image: { width: "34%", minHeight: 174, backgroundColor: "#D9E1E7" },
  content: { flex: 1, minWidth: 0, padding: 14, gap: 7 },
  topRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  date: { flex: 1, color: colors.goldDark, fontFamily: "Montserrat_700Bold", fontSize: 12 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 9, backgroundColor: colors.goldPale },
  badgeLimited: { backgroundColor: "#FFF0D7" },
  badgeClosed: { backgroundColor: "#FDE7E3" },
  badgeText: { color: colors.navy, fontFamily: "Montserrat_700Bold", fontSize: 9 },
  title: { color: colors.navy, fontFamily: "Cinzel_700Bold", fontSize: 17, lineHeight: 21 },
  meta: { flexDirection: "row", alignItems: "center", gap: 6 },
  metaText: { flex: 1, color: colors.muted, fontFamily: "Montserrat_400Regular", fontSize: 11.5 },
  footer: { marginTop: "auto", paddingTop: 9, borderTopWidth: 1, borderTopColor: colors.line, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  price: { color: colors.danger, fontFamily: "Montserrat_700Bold", fontSize: 15 },
  seats: { marginTop: 2, color: colors.muted, fontFamily: "Montserrat_400Regular", fontSize: 9.5 },
});
