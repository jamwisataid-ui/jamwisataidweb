import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { nextPrayer, prayerRows } from "@/lib/prayer-times";
import { colors } from "@/theme";
import type { PrayerTimes } from "@/types";
import { MetallicGold } from "@/components/metallic-gold";

export function PrayerTimeList({ data, now }: { data: PrayerTimes; now: Date }) {
  const next = nextPrayer(data.times, data.location.timezone, now);
  return <View style={styles.list}>{prayerRows.map((item) => { const active = item.key === next.key; const content = <><View style={[styles.icon, active && styles.activeIcon]}><Ionicons name={item.icon} size={20} color={colors.navy} /></View><View style={styles.nameWrap}><Text style={styles.name}>{item.name}</Text>{active ? <Text style={styles.next}>BERIKUTNYA{next.tomorrow ? " · BESOK" : ""}</Text> : null}</View><Text style={styles.time}>{data.times[item.key]}</Text></>; return active ? <MetallicGold key={item.key} style={[styles.row, styles.active]}>{content}</MetallicGold> : <View key={item.key} style={styles.row}>{content}</View>; })}</View>;
}

const styles = StyleSheet.create({
  list: { marginHorizontal: 18 }, row: { minHeight: 55, paddingHorizontal: 12, flexDirection: "row", alignItems: "center", gap: 11, borderBottomWidth: 1, borderBottomColor: "#EEE9DF" }, active: { marginVertical: 4, minHeight: 58, borderBottomWidth: 0, borderRadius: 14, overflow: "hidden" },
  icon: { width: 34, height: 34, borderRadius: 11, alignItems: "center", justifyContent: "center", backgroundColor: "#F5F0E7" }, activeIcon: { backgroundColor: "rgba(255,255,255,.34)" },
  nameWrap: { flex: 1 }, name: { color: colors.navy, fontFamily: "Montserrat_700Bold", fontSize: 15 }, next: { marginTop: 1, color: colors.navy, fontFamily: "Montserrat_700Bold", fontSize: 8.5, letterSpacing: .65 }, time: { color: colors.navy, fontFamily: "Montserrat_700Bold", fontSize: 16, fontVariant: ["tabular-nums"] },
});
