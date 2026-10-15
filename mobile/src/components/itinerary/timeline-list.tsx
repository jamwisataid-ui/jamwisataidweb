import { Ionicons } from "@expo/vector-icons";
import { FlatList, StyleSheet, Text, View } from "react-native";

import { getCurrentItineraryDay, type ItineraryDayStatus } from "@/lib/itinerary";
import { colors } from "@/theme";
import type { Journey } from "@/types";

function DayBadge({ day, status }: { day: number; status: ItineraryDayStatus }) {
  return <View style={[styles.badge, status === "current" && styles.badgeCurrent, status === "completed" && styles.badgeCompleted]}>{status === "completed" ? <Ionicons name="checkmark" size={18} color={colors.navy} /> : <><Text style={[styles.badgeLabel, status === "current" && styles.badgeCurrentText]}>Hari</Text><Text style={[styles.badgeDay, status === "current" && styles.badgeCurrentText]}>{day}</Text></>}</View>;
}

export function TimelineList({ journey }: { journey: Journey }) {
  const currentDay = getCurrentItineraryDay(journey.departure.departureDate, journey.itinerary.length);
  return <FlatList data={journey.itinerary} keyExtractor={(item) => item.id || `${item.day}-${item.title}`} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false} ListHeaderComponent={<View style={styles.header}><Text style={styles.packageName}>{journey.package.name}</Text><Text style={styles.tripMeta}>{journey.departure.dateLabel} · {journey.bookingNumber}</Text></View>} ListEmptyComponent={<View style={styles.empty}><Ionicons name="calendar-outline" size={30} color={colors.gold} /><Text style={styles.emptyTitle}>Itinerary belum tersedia</Text><Text style={styles.emptyBody}>Jadwal perjalanan akan muncul setelah ditentukan.</Text></View>} renderItem={({ item, index }) => {
    const status: ItineraryDayStatus = currentDay > journey.itinerary.length ? "completed" : item.day < currentDay ? "completed" : item.day === currentDay ? "current" : "upcoming";
    return <View style={styles.row}><View style={styles.rail}><DayBadge day={item.day} status={status} />{index < journey.itinerary.length - 1 ? <View style={[styles.connector, status === "completed" && styles.connectorCompleted]} /> : null}</View><View style={styles.copy}>{status === "current" ? <View style={styles.today}><Text style={styles.todayText}>HARI INI</Text></View> : null}<Text style={[styles.itemTitle, status === "current" && styles.currentTitle]}>{item.title}</Text>{item.description ? <Text style={styles.description}>{item.description}</Text> : null}</View></View>;
  }} />;
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: 20, paddingTop: 22, paddingBottom: 42 },
  header: { marginBottom: 24, gap: 4 },
  packageName: { color: colors.navy, fontFamily: "Cinzel_700Bold", fontSize: 20, lineHeight: 26 },
  tripMeta: { color: colors.muted, fontFamily: "Montserrat_400Regular", fontSize: 12.5 },
  row: { minHeight: 94, flexDirection: "row", gap: 15 },
  rail: { width: 46, alignItems: "center" },
  badge: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", backgroundColor: "#E8C967", borderWidth: 2, borderColor: "#E8C967" },
  badgeCurrent: { backgroundColor: colors.navy, borderColor: colors.navy },
  badgeCompleted: { backgroundColor: "#E8C967", borderColor: "#E8C967" },
  badgeLabel: { color: colors.navy, fontFamily: "Montserrat_700Bold", fontSize: 9, lineHeight: 10 },
  badgeDay: { color: colors.navy, fontFamily: "Montserrat_700Bold", fontSize: 13, lineHeight: 15 },
  badgeCurrentText: { color: colors.white },
  connector: { flex: 1, width: 2, minHeight: 44, backgroundColor: "#E6D5B3" },
  connectorCompleted: { backgroundColor: colors.softGold },
  copy: { flex: 1, paddingTop: 1, paddingBottom: 24 },
  today: { alignSelf: "flex-start", marginBottom: 5, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, backgroundColor: "#F8F1DC" },
  todayText: { color: colors.navy, fontFamily: "Montserrat_700Bold", fontSize: 9, letterSpacing: .7 },
  itemTitle: { color: colors.navy, fontFamily: "Montserrat_700Bold", fontSize: 17, lineHeight: 23 },
  currentTitle: { fontSize: 18 },
  description: { marginTop: 5, color: colors.muted, fontFamily: "Montserrat_400Regular", fontSize: 13.5, lineHeight: 20 },
  empty: { paddingVertical: 70, alignItems: "center", gap: 9 },
  emptyTitle: { color: colors.navy, fontFamily: "Montserrat_700Bold", fontSize: 17 },
  emptyBody: { maxWidth: 280, color: colors.muted, fontFamily: "Montserrat_400Regular", fontSize: 13.5, lineHeight: 20, textAlign: "center" },
});
