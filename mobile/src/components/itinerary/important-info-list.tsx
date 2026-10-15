import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { colors } from "@/theme";
import type { Journey } from "@/types";

type Info = { icon: keyof typeof Ionicons.glyphMap; label: string; value: string; note?: string };

function statusLabel(status: string) {
  if (status === "pending") return "Menunggu konfirmasi admin";
  if (status === "confirmed") return "Pendaftaran dikonfirmasi";
  if (status === "cancelled") return "Pendaftaran dibatalkan";
  return status.replaceAll("_", " ");
}

export function ImportantInfoList({ journey }: { journey: Journey }) {
  const makkah = journey.hotels.find((hotel) => hotel.city.toLowerCase().includes("makk"));
  const madinah = journey.hotels.find((hotel) => hotel.city.toLowerCase().includes("mad"));
  const info: Info[] = [
    { icon: "calendar-outline", label: "Keberangkatan", value: journey.departure.dateLabel, note: journey.departure.departureAirport || undefined },
    { icon: "airplane-outline", label: "Maskapai", value: journey.departure.airline || "Menunggu informasi" },
    ...(makkah ? [{ icon: "business-outline" as const, label: "Hotel Makkah", value: makkah.hotelName, note: journey.rooms.makkah ? `Kamar ${journey.rooms.makkah}` : undefined }] : []),
    ...(madinah ? [{ icon: "business-outline" as const, label: "Hotel Madinah", value: madinah.hotelName, note: journey.rooms.madinah ? `Kamar ${journey.rooms.madinah}` : undefined }] : []),
    { icon: "receipt-outline", label: "Nomor Booking", value: journey.bookingNumber, note: journey.rooms.type ? `Tipe kamar ${journey.rooms.type.toUpperCase()}` : undefined },
    { icon: "shield-checkmark-outline", label: "Status Pendaftaran", value: statusLabel(journey.status) },
  ];
  return <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}><View style={styles.intro}><Text style={styles.title}>{journey.package.name}</Text><Text style={styles.subtitle}>Informasi berasal dari data perjalanan yang dikonfirmasi Jam Wisata.</Text></View>{info.map((item) => <View key={item.label} style={styles.card}><View style={styles.icon}><Ionicons name={item.icon} size={20} color={colors.navy} /></View><View style={styles.copy}><Text style={styles.label}>{item.label}</Text><Text style={styles.value}>{item.value}</Text>{item.note ? <Text style={styles.note}>{item.note}</Text> : null}</View></View>)}</ScrollView>;
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: 20, paddingTop: 22, paddingBottom: 42, gap: 11 },
  intro: { marginBottom: 8, gap: 5 },
  title: { color: colors.navy, fontFamily: "Cinzel_700Bold", fontSize: 20, lineHeight: 26 },
  subtitle: { color: colors.muted, fontFamily: "Montserrat_400Regular", fontSize: 13, lineHeight: 19 },
  card: { minHeight: 76, padding: 14, flexDirection: "row", alignItems: "center", gap: 13, borderRadius: 16, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.white },
  icon: { width: 42, height: 42, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: "#F8F1DC" },
  copy: { flex: 1, gap: 2 },
  label: { color: colors.muted, fontFamily: "Montserrat_500Medium", fontSize: 11.5 },
  value: { color: colors.navy, fontFamily: "Montserrat_700Bold", fontSize: 14.5, lineHeight: 20, textTransform: "capitalize" },
  note: { color: colors.muted, fontFamily: "Montserrat_400Regular", fontSize: 12, lineHeight: 17 },
});
