import { StyleSheet, Text, View } from "react-native";

import { hijriMonths } from "@/lib/prayer-times";
import { colors } from "@/theme";
import type { PrayerTimes } from "@/types";

export function PrayerDateHeader({ data }: { data: PrayerTimes }) {
  const gregorian = new Intl.DateTimeFormat("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${data.date.iso}T12:00:00Z`));
  const hijri = `${data.date.hijri.day} ${hijriMonths[data.date.hijri.month - 1] ?? data.date.hijri.monthName} ${data.date.hijri.year} H`;
  return <View style={styles.root}><Text style={styles.gregorian}>{gregorian}</Text><Text style={styles.hijri}>{hijri}</Text></View>;
}

const styles = StyleSheet.create({ root: { paddingTop: 18, paddingBottom: 14, alignItems: "center", gap: 2 }, gregorian: { color: colors.navy, fontFamily: "Montserrat_700Bold", fontSize: 14.5 }, hijri: { color: colors.goldText, fontFamily: "CormorantGaramond_500Medium_Italic", fontSize: 16 } });
