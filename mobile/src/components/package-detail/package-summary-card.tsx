import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/theme";
import { NavyCard } from "@/components/ui";
import type { Package } from "@/types";

const money = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 });

function destinationLabel(item: Package) {
  const places = item.destination?.length ? item.destination : item.packageType === "plus" ? ["Makkah", "Madinah", "Program Plus"] : ["Makkah", "Madinah"];
  return `${item.durationDays ? `${item.durationDays} hari · ` : ""}${places.join(" · ")}`;
}

export function PackageSummaryCard({ item, price = item.priceFrom }: { item: Package; price?: number }) {
  return (
    <View style={styles.card}>
      <View style={styles.headingRow}>
        <View style={styles.headingCopy}>
          <Text style={styles.eyebrow}>{item.badge || (item.packageType === "plus" ? "UMROH PLUS" : "PAKET UMROH")}</Text>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.destination}>{destinationLabel(item)}</Text>
        </View>
      </View>
      <NavyCard style={styles.pricePill}>
        <Text style={styles.person}>{price ? "mulai dari / jamaah" : "Harga paket"}</Text>
        <Text adjustsFontSizeToFit numberOfLines={1} style={styles.price}>{price ? `Rp ${money.format(price)}` : "Hubungi kami"}</Text>
      </NavyCard>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginTop: -30, paddingHorizontal: 20, paddingTop: 24, paddingBottom: 6, gap: 16, borderTopLeftRadius: 30, borderTopRightRadius: 30, backgroundColor: colors.ivory },
  headingRow: { flexDirection: "row", gap: 12 },
  headingCopy: { flex: 1, gap: 5 },
  eyebrow: { color: colors.goldText, fontFamily: "Cinzel_600SemiBold", fontSize: 10, letterSpacing: 2.6 },
  title: { color: colors.navy, fontFamily: "Cinzel_700Bold", fontSize: 23, lineHeight: 29 },
  destination: { color: colors.muted, fontFamily: "Montserrat_400Regular", fontSize: 13, lineHeight: 19 },
  pricePill: { paddingVertical: 14, paddingHorizontal: 16, gap: 2 },
  price: { color: colors.softGold, fontFamily: "Montserrat_700Bold", fontSize: 22, lineHeight: 28 },
  person: { color: "rgba(255,255,255,0.72)", fontFamily: "Montserrat_400Regular", fontSize: 11 },
});
