import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { nextPrayer, prayerRows } from "@/lib/prayer-times";
import { colors } from "@/theme";
import type { PrayerTimes } from "@/types";

export function PrayerTimeList({ data, now }: { data: PrayerTimes; now: Date }) {
  const next = nextPrayer(data.times, data.location.timezone, now);
  return <View style={styles.list}>{prayerRows.map((item) => { const active = item.key === next.key; return <View key={item.key} style={[styles.row, active && styles.active]}><View style={[styles.icon, active && styles.activeIcon]}><Ionicons name={item.icon} size={19} color={active ? colors.softGold : colors.goldDark} /></View><View style={styles.nameWrap}><Text style={[styles.name, active && styles.activeText]}>{item.name}</Text>{active ? <Text style={styles.next}>BERIKUTNYA{next.tomorrow ? " · BESOK" : ""}</Text> : null}</View><Text style={[styles.time, active && styles.activeText]}>{data.times[item.key]}</Text></View>; })}</View>;
}

const styles = StyleSheet.create({
  list: { marginHorizontal: 18, padding: 6, borderRadius: 20, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.goldLine }, row: { minHeight: 52, paddingHorizontal: 12, flexDirection: "row", alignItems: "center", gap: 11, borderRadius: 14 }, active: { backgroundColor: colors.navy },
  icon: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "rgba(184,134,11,0.3)" }, activeIcon: { borderColor: "rgba(212,175,55,0.5)" },
  nameWrap: { flex: 1 }, name: { color: colors.navy, fontFamily: "Montserrat_600SemiBold", fontSize: 14.5 }, next: { marginTop: 1, color: colors.goldText, fontFamily: "Montserrat_700Bold", fontSize: 8.5, letterSpacing: .8 }, time: { color: colors.navy, fontFamily: "Montserrat_600SemiBold", fontSize: 15.5, fontVariant: ["tabular-nums"] }, activeText: { color: colors.softGold, fontFamily: "Montserrat_700Bold" },
});
