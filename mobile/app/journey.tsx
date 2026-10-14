import { StyleSheet, Text, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Journey } from "@/types";
import { Card, Empty, Screen, Section, Title } from "@/components/ui";
import { colors } from "@/theme";

export default function JourneyScreen() {
  const query = useQuery({ queryKey: ["journey"], queryFn: () => api<Journey[]>("/journey") });
  return <Screen><Title subtitle="Jadwal dan informasi program yang terhubung ke pendaftaran Anda.">Perjalanan saya</Title>{query.data?.length ? query.data.map((item) => <View key={item.registrationId} style={{ gap: 18 }}><Card><Text style={styles.status}>{item.status === "pending" ? "MENUNGGU KONFIRMASI ADMIN" : item.status.toUpperCase()}</Text><Text style={styles.name}>{item.package.name}</Text><Text style={styles.meta}>{item.departure.dateLabel} · {item.departure.airline}</Text><Text style={styles.meta}>No. {item.bookingNumber}</Text></Card><Section title="Itinerary">{item.itinerary.map((day) => <View key={day.id} style={styles.day}><View style={styles.number}><Text>{day.day}</Text></View><View style={{ flex: 1 }}><Text style={styles.dayTitle}>{day.title}</Text><Text style={styles.description}>{day.description}</Text></View></View>)}</Section></View>) : <Empty>Belum ada perjalanan yang terhubung ke akun ini.</Empty>}</Screen>;
}
const styles = StyleSheet.create({ status: { color: colors.gold, fontFamily: "DMSans_700Bold", fontSize: 11, letterSpacing: 1 }, name: { color: colors.navy, fontFamily: "PlayfairDisplay_700Bold", fontSize: 23 }, meta: { color: colors.muted, fontFamily: "DMSans_400Regular" }, day: { flexDirection: "row", gap: 13 }, number: { width: 34, height: 34, borderRadius: 17, backgroundColor: "#FFF0D5", alignItems: "center", justifyContent: "center" }, dayTitle: { color: colors.navy, fontFamily: "DMSans_700Bold", fontSize: 15 }, description: { color: colors.muted, fontFamily: "DMSans_400Regular", lineHeight: 20, marginTop: 4 } } as const);
