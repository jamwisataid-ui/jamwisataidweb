import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { Button, Empty, GuestGate, Screen, Title } from "@/components/ui";
import { APP_DOWNLOAD_ACTION, notificationDeepLink, notificationDownloadUrl } from "@/lib/notification-links";
import { colors } from "@/theme";

type Notification = { id: string; title: string; body: string; kind: string; deepLink?: string | null; readAt?: string | null; createdAt: string };

export default function NotificationsScreen() {
  const tokens = useAuthStore((state) => state.tokens);
  const client = useQueryClient();
  const query = useQuery({ queryKey: ["notifications"], queryFn: () => api<Notification[]>("/notifications"), enabled: Boolean(tokens) });
  const [openingId, setOpeningId] = useState<string | null>(null);
  const read = async (item: Notification) => {
    if (openingId) return;
    setOpeningId(item.id);
    try {
      if (!item.readAt) await api(`/notifications/${item.id}`, { method: "PATCH" });
      await client.invalidateQueries({ queryKey: ["notifications"] });
      const destination = notificationDeepLink(item.deepLink);
      const downloadUrl = notificationDownloadUrl(item.deepLink);
      if (destination) router.push(destination as never);
      else if (downloadUrl) await Linking.openURL(downloadUrl);
    } finally { setOpeningId(null); }
  };
  if (!tokens) return <Screen><Title subtitle="Kabar penting terkait persiapan dan perjalanan jamaah.">Notifikasi</Title><GuestGate body="Masuk untuk menerima pembaruan pendaftaran, dokumen, pembayaran, dan keberangkatan Anda." next="/(tabs)/notifications" /></Screen>;
  return <Screen><Title subtitle="Informasi penting terkait akun dan perjalanan Anda.">Notifikasi</Title>{query.isPending ? <Empty>Memuat notifikasi…</Empty> : query.isError ? <View style={styles.error}><Text style={styles.errorTitle}>Notifikasi belum dapat dimuat</Text><Text style={styles.body}>Periksa koneksi Anda, lalu coba kembali.</Text><Button secondary label="Coba Lagi" onPress={() => void query.refetch()} /></View> : query.data?.length ? query.data.map((item) => { const isDownload = item.deepLink === APP_DOWNLOAD_ACTION; const canDownload = Boolean(notificationDownloadUrl(item.deepLink)); return <Pressable accessibilityRole="button" disabled={openingId !== null} key={item.id} onPress={() => void read(item)} style={[styles.item, !item.readAt && styles.unread, openingId === item.id && styles.opening]}><View style={[styles.dot, item.readAt && { opacity: 0 }]} /><View style={{ flex: 1, gap: 5 }}><Text style={styles.title}>{item.title}</Text><Text style={styles.body}>{item.body}</Text><Text style={styles.date}>{new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(new Date(item.createdAt))}</Text>{isDownload && !canDownload ? <Text style={styles.pendingDownload}>APK sedang disiapkan</Text> : null}</View>{canDownload ? <Text style={styles.open}>Unduh APK</Text> : notificationDeepLink(item.deepLink) ? <Text style={styles.open}>Buka</Text> : null}</Pressable>; }) : <Empty>Belum ada notifikasi.</Empty>}</Screen>;
}
const styles = StyleSheet.create({ item: { flexDirection: "row", alignItems: "flex-start", gap: 12, backgroundColor: colors.white, borderRadius: 17, padding: 15, borderWidth: 1, borderColor: colors.line }, unread: { borderColor: "#EDC47D", backgroundColor: "#FFFCF5" }, opening: { opacity: .55 }, dot: { width: 9, height: 9, borderRadius: 9, backgroundColor: colors.gold, marginTop: 6 }, title: { color: colors.navy, fontFamily: "Montserrat_700Bold", fontSize: 15 }, body: { color: colors.muted, fontFamily: "Montserrat_400Regular", lineHeight: 20 }, date: { color: "#959CA6", fontFamily: "Montserrat_400Regular", fontSize: 11 }, open: { alignSelf: "center", color: colors.navy, fontFamily: "Montserrat_700Bold", fontSize: 11 }, pendingDownload: { color: colors.goldDark, fontFamily: "Montserrat_600SemiBold", fontSize: 11 }, error: { padding: 17, gap: 10, borderRadius: 16, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.white }, errorTitle: { color: colors.navy, fontFamily: "Montserrat_700Bold", fontSize: 17 } } as const);
