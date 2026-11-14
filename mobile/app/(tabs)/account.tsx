import { useState } from "react";
import { Image, Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import emblem from "../../assets/splash/logo-emblem.png";
import { NavyCard } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AccountError, AccountSkeleton } from "@/components/account/account-state";
import { AccountHeader } from "@/components/account/account-header";
import { AccountMenuItem } from "@/components/account/account-menu-item";
import { LogoutConfirmationModal } from "@/components/account/logout-confirmation-modal";
import { ProfileSummaryCard } from "@/components/account/profile-summary-card";
import { MetallicGold } from "@/components/metallic-gold";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { colors, shadowDark } from "@/theme";
import type { AccountProfile } from "@/types";
import { FadeInView } from "@/components/motion";

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

  const openWebsite = (path: string) => Linking.openURL(`https://jamwisata.id${path}`);

  return <View style={styles.safe}><ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}><AccountHeader />{!tokens ? <View style={styles.guestContent}><View style={styles.guestWrap}><NavyCard style={styles.guestCard}><View style={styles.guestRow}><Image alt="" source={emblem} resizeMode="contain" style={styles.guestEmblem} /><View style={styles.guestCopy}><Text style={styles.guestTitle}>Masuk ke Area Jamaah</Text><Text style={styles.guestBody}>Akses profil, dokumen, pembayaran, itinerary, dan notifikasi perjalanan Anda.</Text></View></View><Pressable accessibilityRole="button" onPress={() => router.push("/login?next=%2F(tabs)%2Faccount" as never)} style={styles.login}><MetallicGold style={styles.loginFill}><Text style={styles.loginText}>MASUK / DAFTAR</Text><Ionicons name="arrow-forward" size={17} color={colors.navyDeep} /></MetallicGold></Pressable></NavyCard></View><Text style={styles.guestNote}>Anda tetap dapat melihat paket dan memakai panduan ibadah tanpa masuk.</Text><View style={[styles.menu, styles.guestMenu]}><AccountMenuItem icon="help-circle-outline" title="Pertanyaan & Bantuan" subtitle="FAQ dan hubungi admin" onPress={() => router.push("/help")} /><AccountMenuItem icon="shield-checkmark-outline" title="Kebijakan Privasi" subtitle="Cara kami melindungi data Anda" onPress={() => openWebsite("/privacy")} /><AccountMenuItem icon="trash-outline" title="Hapus Akun" subtitle="Ajukan penghapusan akun dan data" danger last onPress={() => openWebsite("/hapus-akun")} /></View></View> : profile.isLoading ? <AccountSkeleton /> : profile.isError || !profile.data ? <AccountError onRetry={() => profile.refetch()} onLogout={() => setConfirmLogout(true)} /> : <><ProfileSummaryCard profile={profile.data} /><FadeInView delay={120} style={styles.menu}><AccountMenuItem icon="person-outline" title="Profil Saya" subtitle="Data personal jamaah" onPress={() => router.push("/account/profile")} /><AccountMenuItem icon="document-text-outline" title="Dokumen Saya" subtitle="Paspor, KTP, visa, dan dokumen lainnya" onPress={() => router.push("/documents")} /><AccountMenuItem icon="wallet-outline" title="Pembayaran" subtitle="Status dan riwayat pembayaran" onPress={() => router.push("/payments")} /><AccountMenuItem icon="map-outline" title="Itinerary Saya" subtitle="Jadwal keberangkatan dan perjalanan" onPress={() => router.push("/journey")} /><AccountMenuItem icon="notifications-outline" title="Notifikasi" subtitle="Informasi terbaru" badge={unread} onPress={() => router.push("/(tabs)/notifications")} /><AccountMenuItem icon="help-circle-outline" title="Pertanyaan & Bantuan" subtitle="FAQ dan hubungi admin" onPress={() => router.push("/help")} /><AccountMenuItem icon="shield-checkmark-outline" title="Kebijakan Privasi" subtitle="Cara kami melindungi data Anda" onPress={() => openWebsite("/privacy")} /><AccountMenuItem icon="trash-outline" title="Hapus Akun" subtitle="Ajukan penghapusan akun dan data" danger onPress={() => openWebsite("/hapus-akun")} /><AccountMenuItem icon="log-out-outline" title="Keluar" danger last onPress={() => setConfirmLogout(true)} /></FadeInView></>}</ScrollView><LogoutConfirmationModal visible={confirmLogout} busy={loggingOut} onCancel={() => setConfirmLogout(false)} onConfirm={logout} /></View>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, width: "100%", maxWidth: 480, alignSelf: "center", backgroundColor: colors.ivory },
  content: { paddingBottom: 32, gap: 20 },
  menu: { marginHorizontal: 18, overflow: "hidden", borderWidth: 1, borderColor: colors.goldLine, borderRadius: 20, backgroundColor: colors.white },
  guestContent: { gap: 14 },
  guestWrap: { marginTop: -51, marginHorizontal: 18, borderRadius: 20, ...shadowDark },
  guestCard: { padding: 18, gap: 16 },
  guestRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  guestEmblem: { width: 52, height: 52 },
  guestCopy: { flex: 1, gap: 4 },
  guestTitle: { color: colors.white, fontFamily: "Cinzel_700Bold", fontSize: 16, lineHeight: 21 },
  guestBody: { color: "rgba(255,255,255,0.74)", fontFamily: "Montserrat_400Regular", fontSize: 12, lineHeight: 17 },
  login: { height: 48, borderRadius: 12, overflow: "hidden" },
  loginFill: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, borderRadius: 12, borderWidth: 1, borderColor: "rgba(255,236,170,0.55)" },
  loginText: { color: colors.navyDeep, fontFamily: "Montserrat_700Bold", fontSize: 13, letterSpacing: 0.8 },
  guestNote: { marginHorizontal: 28, color: colors.muted, fontFamily: "Montserrat_400Regular", fontSize: 11.5, lineHeight: 17, textAlign: "center" },
  guestMenu: { marginTop: 2 },
});
