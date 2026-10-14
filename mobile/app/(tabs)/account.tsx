import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { Button, Card, Screen, Title } from "@/components/ui";
import { colors } from "@/theme";

type Profile = { id: string; fullName: string; whatsapp: string; email?: string | null; passportNumber?: string | null; passportExpiry?: string | null };
const menus = [{ label: "Perjalanan saya", href: "/journey", icon: "map" }, { label: "Pembayaran", href: "/payments", icon: "wallet" }, { label: "Dokumen", href: "/documents", icon: "document-text" }] as const;

export default function AccountScreen() {
  const signOut = useAuthStore((state) => state.signOut);
  const profile = useQuery({ queryKey: ["me"], queryFn: () => api<Profile>("/me") });
  const logout = async () => { await api("/auth/logout", { method: "POST" }).catch(() => undefined); await signOut(); router.replace("/login"); };
  return <Screen><Title subtitle="Data ini terhubung langsung dengan data jamaah di Jam Wisata.">Akun saya</Title><Card><View style={styles.avatar}><Text>{profile.data?.fullName?.slice(0, 1).toUpperCase() || "J"}</Text></View><Text style={styles.name}>{profile.data?.fullName || "Memuat..."}</Text><Text style={styles.meta}>{profile.data?.whatsapp}</Text><Text style={styles.meta}>{profile.data?.email || "Email belum diisi"}</Text></Card><View style={styles.menu}>{menus.map((item) => <Pressable key={item.label} onPress={() => router.push(item.href)} style={styles.row}><Ionicons name={item.icon} size={22} color={colors.gold} /><Text>{item.label}</Text><Ionicons name="chevron-forward" size={18} color={colors.muted} /></Pressable>)}</View><Button secondary label="Keluar dari aplikasi" onPress={logout} /></Screen>;
}
const styles = StyleSheet.create({ avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: "#FFF0D5", alignItems: "center", justifyContent: "center" }, name: { color: colors.navy, fontFamily: "PlayfairDisplay_700Bold", fontSize: 22 }, meta: { color: colors.muted, fontFamily: "DMSans_400Regular" }, menu: { backgroundColor: colors.white, borderRadius: 18, borderWidth: 1, borderColor: colors.line, overflow: "hidden" }, row: { minHeight: 58, flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 16, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line }, } as const);
