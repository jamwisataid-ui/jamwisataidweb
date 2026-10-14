import { Pressable, StyleSheet, Text, View } from "react-native";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { Empty, GuestGate, Screen, Title } from "@/components/ui";
import { colors } from "@/theme";

type Notification = { id: string; title: string; body: string; kind: string; deepLink?: string | null; readAt?: string | null; createdAt: string };

export default function NotificationsScreen() {
  const tokens = useAuthStore((state) => state.tokens);
  const client = useQueryClient();
  const query = useQuery({ queryKey: ["notifications"], queryFn: () => api<Notification[]>("/notifications"), enabled: Boolean(tokens) });
  const read = async (id: string) => { await api(`/notifications/${id}`, { method: "PATCH" }); await client.invalidateQueries({ queryKey: ["notifications"] }); };
  if (!tokens) return <Screen><Title subtitle="Kabar penting terkait persiapan dan perjalanan jamaah.">Notifikasi</Title><GuestGate body="Masuk untuk menerima pembaruan pendaftaran, dokumen, pembayaran, dan keberangkatan Anda." next="/(tabs)/notifications" /></Screen>;
  return <Screen><Title subtitle="Informasi penting terkait akun dan perjalanan Anda.">Notifikasi</Title>{query.data?.length ? query.data.map((item) => <Pressable key={item.id} onPress={() => read(item.id)} style={[styles.item, !item.readAt && styles.unread]}><View style={[styles.dot, item.readAt && { opacity: 0 }]} /><View style={{ flex: 1, gap: 5 }}><Text style={styles.title}>{item.title}</Text><Text style={styles.body}>{item.body}</Text><Text style={styles.date}>{new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(new Date(item.createdAt))}</Text></View></Pressable>) : <Empty>Belum ada notifikasi.</Empty>}</Screen>;
}
const styles = StyleSheet.create({ item: { flexDirection: "row", gap: 12, backgroundColor: colors.white, borderRadius: 17, padding: 15, borderWidth: 1, borderColor: colors.line }, unread: { borderColor: "#EDC47D", backgroundColor: "#FFFCF5" }, dot: { width: 9, height: 9, borderRadius: 9, backgroundColor: colors.gold, marginTop: 6 }, title: { color: colors.navy, fontFamily: "DMSans_700Bold", fontSize: 15 }, body: { color: colors.muted, fontFamily: "DMSans_400Regular", lineHeight: 20 }, date: { color: "#959CA6", fontFamily: "DMSans_400Regular", fontSize: 11 } } as const);
