import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/theme";
import type { PackageDeparture } from "@/types";

const money = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 });

export function PackageDeparturePicker({ departures, value, onChange }: { departures: PackageDeparture[]; value: string; onChange: (id: string) => void }) {
  if (!departures.length) return null;
  return <View style={styles.section}><Text style={styles.title}>Pilih Keberangkatan</Text><Text style={styles.hint}>Pilih tanggal sebelum melanjutkan pendaftaran.</Text><View style={styles.list}>{departures.map((item) => {
    const selected = value === item.id;
    return <Pressable key={item.id} disabled={!item.selectable} onPress={() => onChange(item.id)} style={[styles.row, selected && styles.selected, !item.selectable && styles.disabled]}>
      <Ionicons name={selected ? "radio-button-on" : "radio-button-off"} size={22} color={selected ? colors.gold : colors.muted} />
      <View style={styles.copy}><Text style={styles.date}>{item.dateLabel}</Text><Text style={styles.meta}>{item.price ? `Rp ${money.format(item.price)}` : "Harga menyusul"}{item.remainingQuota != null ? ` · Sisa ${item.remainingQuota} kursi` : ""}</Text></View>
      <Text style={[styles.status, item.status === "limited" && styles.limited]}>{item.status === "available" ? "Tersedia" : item.status === "limited" ? "Terbatas" : item.status === "coming-soon" ? "Segera" : "Penuh"}</Text>
    </Pressable>;
  })}</View></View>;
}

const styles = StyleSheet.create({
  section: { marginHorizontal: 18, marginTop: 18, gap: 5 }, title: { color: colors.navy, fontFamily: "Montserrat_700Bold", fontSize: 17 }, hint: { color: colors.muted, fontFamily: "Montserrat_400Regular", fontSize: 12, lineHeight: 18 }, list: { gap: 9, marginTop: 7 },
  row: { minHeight: 66, padding: 13, borderWidth: 1, borderColor: "#E2DDD3", borderRadius: 14, backgroundColor: colors.white, flexDirection: "row", alignItems: "center", gap: 10 }, selected: { borderColor: colors.gold, backgroundColor: "#FFF8E5" }, disabled: { opacity: .48 }, copy: { flex: 1, gap: 3 }, date: { color: colors.navy, fontFamily: "Montserrat_700Bold", fontSize: 14 }, meta: { color: colors.muted, fontFamily: "Montserrat_400Regular", fontSize: 11 }, status: { color: "#16804A", fontFamily: "Montserrat_700Bold", fontSize: 10 }, limited: { color: "#A76700" },
});
