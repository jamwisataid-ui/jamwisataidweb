import { Image, StyleSheet, Text } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Package } from "@/types";
import { Button, Card, Empty, Screen, Section } from "@/components/ui";
import { colors } from "@/theme";

const rp = (value?: number) => value ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value) : "Hubungi kami";
export default function PackageDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const query = useQuery({ queryKey: ["package", slug], queryFn: () => api<Package>(`/packages/${slug}`), enabled: Boolean(slug) });
  const item = query.data;
  if (!item) return <Screen><Empty>Detail paket sedang dimuat.</Empty></Screen>;
  return <Screen><Image source={{ uri: item.image }} style={styles.image} alt={item.name} /><Text style={styles.badge}>{item.badge || "PAKET PERJALANAN"}</Text><Text style={styles.title}>{item.name}</Text><Text style={styles.meta}>{item.durationDays ? `${item.durationDays} hari` : "Durasi menyesuaikan"} · {item.departureDate || "Jadwal tersedia"}</Text><Card><Text style={styles.price}>{rp(item.priceFrom)}</Text><Text style={styles.meta}>Harga mulai per jamaah</Text></Card>{item.makkahHotel || item.madinahHotel || item.plusHotels?.length ? <Section title="Akomodasi"><Card>{item.makkahHotel ? <Text style={styles.hotel}>Makkah · {item.makkahHotel.name}</Text> : null}{item.madinahHotel ? <Text style={styles.hotel}>Madinah · {item.madinahHotel.name}</Text> : null}{item.plusHotels?.map((hotel) => <Text key={`${hotel.destination}-${hotel.name}`} style={styles.hotel}>{hotel.destination} · {hotel.name}</Text>)}</Card></Section> : null}{item.highlights?.length ? <Section title="Keunggulan"><Card>{item.highlights.map((value) => <Text key={value} style={styles.list}>• {value}</Text>)}</Card></Section> : null}<Button label={item.status === "available" || item.status === "limited" ? "Ajukan pendaftaran" : "Pendaftaran belum tersedia"} disabled={!item.departureId || !["available", "limited"].includes(item.status)} onPress={() => item.departureId && router.push(`/register/${item.departureId}`)} /></Screen>;
}
const styles = StyleSheet.create({ image: { height: 235, marginHorizontal: -20, marginTop: -20, backgroundColor: "#DDE3E8" }, badge: { color: colors.gold, fontFamily: "DMSans_700Bold", fontSize: 11, letterSpacing: 1 }, title: { color: colors.navy, fontFamily: "PlayfairDisplay_700Bold", fontSize: 30, lineHeight: 37 }, meta: { color: colors.muted, fontFamily: "DMSans_400Regular" }, price: { color: colors.navy, fontFamily: "DMSans_700Bold", fontSize: 24 }, hotel: { color: colors.ink, fontFamily: "DMSans_500Medium", lineHeight: 22 }, list: { color: colors.muted, fontFamily: "DMSans_400Regular", lineHeight: 22 } } as const);
