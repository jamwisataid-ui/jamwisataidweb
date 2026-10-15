import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AccountError, AccountSkeleton } from "@/components/account/account-state";
import { AccountHeader } from "@/components/account/account-header";
import { AccountMenuItem } from "@/components/account/account-menu-item";
import { LogoutConfirmationModal } from "@/components/account/logout-confirmation-modal";
import { ProfileSummaryCard } from "@/components/account/profile-summary-card";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { colors } from "@/theme";
import type { AccountProfile } from "@/types";

type Notification = { id: string; readAt?: string | null };

export default function AccountScreen() {
  const tokens = useAuthStore((state) => state.tokens);
  const signOut = useAuthStore((state) => state.signOut);
  const client = useQueryClient();
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const profile = useQuery({ queryKey: ["me"], queryFn: () => api<AccountProfile>("/me"), enabled: Boolean(tokens) });
  const notifications = useQuery({ queryKey: ["notifications"], queryFn: () => api<Notification[]>("/notifications"), enabled: Boolean(tokens) });
  const unread = notifications.data?.filter((item) => !item.readAt).length ?? 0;

  async function logout() {
    setLoggingOut(true);
    await api("/auth/logout", { method: "POST" }).catch(() => undefined);
    client.clear();
    await signOut();
    setLoggingOut(false);
    setConfirmLogout(false);
    router.replace("/(tabs)");
  }

  return <SafeAreaView edges={["top"]} style={styles.safe}><ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}><AccountHeader />{!tokens ? <View style={styles.guestContent}><View style={styles.guestCard}><View style={styles.guestIcon}><Ionicons name="person-outline" size={30} color={colors.navy} /></View><Text style={styles.guestTitle}>Masuk ke Area Jamaah</Text><Text style={styles.guestBody}>Akses profil, dokumen, pembayaran, itinerary, dan notifikasi perjalanan Anda.</Text><Pressable onPress={() => router.push("/login?next=%2F(tabs)%2Faccount" as never)} style={styles.login}><Text style={styles.loginText}>Masuk / Daftar</Text><Ionicons name="arrow-forward" size={19} color={colors.navy} /></Pressable><Text style={styles.guestNote}>Anda tetap dapat melihat paket dan memakai panduan ibadah tanpa masuk.</Text></View></View> : profile.isLoading ? <AccountSkeleton /> : profile.isError || !profile.data ? <AccountError onRetry={() => profile.refetch()} onLogout={() => setConfirmLogout(true)} /> : <><ProfileSummaryCard profile={profile.data} /><View style={styles.menu}><AccountMenuItem icon="person-outline" title="Profil Saya" subtitle="Data personal jamaah" onPress={() => router.push("/account/profile")} /><AccountMenuItem icon="document-text-outline" title="Dokumen Saya" subtitle="Paspor, KTP, visa, dan dokumen lainnya" onPress={() => router.push("/documents")} /><AccountMenuItem icon="wallet-outline" title="Pembayaran" subtitle="Status dan riwayat pembayaran" onPress={() => router.push("/payments")} /><AccountMenuItem icon="map-outline" title="Itinerary Saya" subtitle="Jadwal keberangkatan dan perjalanan" onPress={() => router.push("/journey")} /><AccountMenuItem icon="notifications-outline" title="Notifikasi" subtitle="Informasi terbaru" badge={unread} onPress={() => router.push("/(tabs)/notifications")} /><AccountMenuItem icon="help-circle-outline" title="Pertanyaan & Bantuan" subtitle="FAQ dan hubungi admin" onPress={() => router.push("/help")} /><AccountMenuItem icon="log-out-outline" title="Keluar" danger last onPress={() => setConfirmLogout(true)} /></View></>}</ScrollView><LogoutConfirmationModal visible={confirmLogout} busy={loggingOut} onCancel={() => setConfirmLogout(false)} onConfirm={logout} /></SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, width: "100%", maxWidth: 480, alignSelf: "center", backgroundColor: colors.ivory },
  content: { paddingBottom: 32, gap: 20 },
  menu: { marginHorizontal: 18, overflow: "hidden", borderWidth: 1, borderColor: colors.line, borderRadius: 18, backgroundColor: colors.white },
  guestContent: { marginTop: -51, paddingHorizontal: 18, paddingBottom: 40 },
  guestCard: { padding: 22, alignItems: "center", gap: 12, borderWidth: 1, borderColor: colors.line, borderRadius: 21, backgroundColor: colors.white },
  guestIcon: { width: 62, height: 62, borderRadius: 31, alignItems: "center", justifyContent: "center", backgroundColor: "#F8F1DC", borderWidth: 2, borderColor: "#D4AF37" },
  guestTitle: { color: colors.navy, fontFamily: "Montserrat_700Bold", fontSize: 21, textAlign: "center" },
  guestBody: { maxWidth: 330, color: colors.muted, fontFamily: "Montserrat_400Regular", fontSize: 14, lineHeight: 21, textAlign: "center" },
  login: { alignSelf: "stretch", height: 54, marginTop: 5, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9, borderRadius: 16, backgroundColor: colors.gold },
  loginText: { color: colors.navy, fontFamily: "Montserrat_700Bold", fontSize: 16 },
  guestNote: { color: colors.muted, fontFamily: "Montserrat_400Regular", fontSize: 11.5, lineHeight: 17, textAlign: "center" },
});
