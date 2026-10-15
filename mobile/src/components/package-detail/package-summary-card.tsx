import { StyleSheet, Text, View } from "react-native";

import { colors, shadow } from "@/theme";
import { MetallicGold } from "@/components/metallic-gold";
import type { Package } from "@/types";

const money = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 });

function destinationLabel(item: Package) {
  const places = item.destination?.length ? item.destination : item.packageType === "plus" ? ["Makkah", "Madinah", "Program Plus"] : ["Makkah", "Madinah"];
  return `${item.durationDays ? `${item.durationDays} hari · ` : ""}${places.join(" · ")}`;
}

export function PackageSummaryCard({ item }: { item: Package }) {
  return (
    <View style={styles.card}>
      <View style={styles.headingRow}>
        <View style={styles.headingCopy}>
          <Text style={styles.eyebrow}>{item.badge || (item.packageType === "plus" ? "UMROH PLUS" : "PAKET UMROH")}</Text>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.destination}>{destinationLabel(item)}</Text>
        </View>
      </View>
      <MetallicGold style={styles.pricePill}>
        <Text adjustsFontSizeToFit numberOfLines={1} style={styles.price}>{item.priceFrom ? `Rp ${money.format(item.priceFrom)}` : "Hubungi kami"}</Text>
        {item.priceFrom ? <Text style={styles.person}>/jamaah</Text> : null}
      </MetallicGold>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginTop: -30, marginHorizontal: 18, padding: 19, gap: 16, borderRadius: 23, backgroundColor: colors.white, borderWidth: 1, borderColor: "#EEE8DE", ...shadow },
  headingRow: { flexDirection: "row", gap: 12 },
  headingCopy: { flex: 1, gap: 5 },
  eyebrow: { color: colors.gold, fontFamily: "Montserrat_700Bold", fontSize: 10, letterSpacing: 1.5 },
  title: { color: colors.navy, fontFamily: "Cinzel_700Bold", fontSize: 24, lineHeight: 29 },
  destination: { color: colors.muted, fontFamily: "Montserrat_400Regular", fontSize: 14, lineHeight: 20 },
  pricePill: { alignSelf: "flex-start", minHeight: 50, maxWidth: "100%", paddingHorizontal: 15, borderRadius: 15, flexDirection: "row", alignItems: "baseline", gap: 5, overflow: "hidden" },
  price: { flexShrink: 1, color: colors.navy, fontFamily: "Montserrat_700Bold", fontSize: 24, lineHeight: 31 },
  person: { color: colors.royal, fontFamily: "Montserrat_500Medium", fontSize: 12 },
});
