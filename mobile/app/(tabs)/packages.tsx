import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Package } from "@/types";
import { Empty, Screen, Title } from "@/components/ui";
import { colors, shadow } from "@/theme";

export default function PackagesScreen() {
  const query = useQuery({ queryKey: ["packages"], queryFn: () => api<Package[]>("/packages") });
  return <Screen><Title subtitle="Pilih program perjalanan sesuai kebutuhan Anda.">Paket perjalanan</Title>{query.isError ? <Empty>Paket belum dapat dimuat. Tarik ulang atau coba beberapa saat lagi.</Empty> : query.data?.map((item) => <Pressable key={item.id} onPress={() => router.push(`/package/${item.slug}`)} style={styles.card}><Image source={{ uri: item.image }} style={styles.image} alt={item.name} /><View style={styles.body}><Text style={styles.badge}>{item.badge || (item.packageType === "plus" ? "UMROH PLUS" : "UMROH")}</Text><Text style={styles.name}>{item.name}</Text><Text style={styles.meta}>{item.durationDays ? `${item.durationDays} hari` : "Durasi menyesuaikan"} · {item.departureDate || "Jadwal tersedia"}</Text></View></Pressable>)}</Screen>;
}
const styles = StyleSheet.create({ card: { backgroundColor: colors.white, borderRadius: 20, overflow: "hidden", borderWidth: 1, borderColor: colors.line, ...shadow }, image: { width: "100%", height: 175, backgroundColor: "#DCE3E8" }, body: { padding: 16, gap: 7 }, badge: { color: colors.gold, fontFamily: "DMSans_700Bold", fontSize: 11, letterSpacing: 1 }, name: { color: colors.navy, fontFamily: "PlayfairDisplay_700Bold", fontSize: 21 }, meta: { color: colors.muted, fontFamily: "DMSans_400Regular" } } as const);
