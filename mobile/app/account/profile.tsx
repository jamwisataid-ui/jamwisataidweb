import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { ProfileAvatar } from "@/components/account/profile-avatar";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { colors } from "@/theme";
import type { AccountProfile } from "@/types";
import { Pressable } from "react-native";

const gender: Record<string, string> = { male: "Laki-laki", female: "Perempuan", laki_laki: "Laki-laki", perempuan: "Perempuan" };
function date(value?: string | null) { return value ? new Intl.DateTimeFormat("id-ID", { dateStyle: "long" }).format(new Date(`${value}T00:00:00`)) : "Belum diisi"; }

function ProfileRow({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value?: string | null }) {
  return <View style={styles.row}><View style={styles.icon}><Ionicons name={icon} size={20} color={colors.navy} /></View><View style={styles.rowCopy}><Text style={styles.label}>{label}</Text><Text selectable style={styles.value}>{value || "Belum diisi"}</Text></View></View>;
}

export default function ProfileScreen() {
  const tokens = useAuthStore((state) => state.tokens);
  const query = useQuery({ queryKey: ["me"], queryFn: () => api<AccountProfile>("/me"), enabled: Boolean(tokens) });
  const profile = query.data;
  return <SafeAreaView style={styles.safe}><View style={styles.header}><Pressable onPress={() => router.back()} style={styles.back}><Ionicons name="arrow-back" size={23} color={colors.navy} /></Pressable><Text style={styles.title}>Profil Saya</Text><View style={styles.back} /></View><ScrollView contentContainerStyle={styles.content}>{!tokens ? <Text style={styles.empty}>Masuk untuk melihat profil jamaah.</Text> : query.isLoading ? <Text style={styles.empty}>Memuat data profil…</Text> : query.isError || !profile ? <Text style={styles.empty}>Data profil belum dapat dimuat.</Text> : <><View style={styles.summary}><ProfileAvatar name={profile.fullName} /><View style={{ flex: 1, gap: 4 }}><Text style={styles.name}>{profile.fullName}</Text><Text style={styles.number}>No. Jamaah: {profile.jamaahNumber || "Belum terdaftar paket"}</Text></View></View><View style={styles.list}><ProfileRow icon="call-outline" label="Nomor WhatsApp" value={profile.whatsapp} /><ProfileRow icon="mail-outline" label="Email" value={profile.email} /><ProfileRow icon="calendar-outline" label="Tanggal lahir" value={date(profile.birthDate)} /><ProfileRow icon="people-outline" label="Jenis kelamin" value={profile.gender ? gender[profile.gender] || profile.gender : null} /><ProfileRow icon="flag-outline" label="Kewarganegaraan" value={profile.nationality} /><ProfileRow icon="id-card-outline" label="Nomor paspor" value={profile.passportNumber} /><ProfileRow icon="time-outline" label="Masa berlaku paspor" value={date(profile.passportExpiry)} /></View><View style={styles.note}><Ionicons name="information-circle-outline" size={20} color={colors.gold} /><Text style={styles.noteText}>Untuk perubahan data identitas sensitif, hubungi admin Jam Wisata agar data pendaftaran tetap sesuai dokumen resmi.</Text></View></>}</ScrollView></SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, width: "100%", maxWidth: 480, alignSelf: "center", backgroundColor: colors.ivory },
  header: { height: 60, paddingHorizontal: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  back: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  title: { color: colors.navy, fontFamily: "DMSans_700Bold", fontSize: 21 },
  content: { padding: 18, paddingBottom: 40, gap: 18 },
  summary: { padding: 16, flexDirection: "row", alignItems: "center", gap: 14, borderRadius: 20, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line },
  name: { color: colors.navy, fontFamily: "DMSans_700Bold", fontSize: 19 },
  number: { color: colors.muted, fontFamily: "DMSans_400Regular", fontSize: 12 },
  list: { overflow: "hidden", borderRadius: 18, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.white },
  row: { minHeight: 67, marginLeft: 15, paddingRight: 15, flexDirection: "row", alignItems: "center", gap: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
  icon: { width: 38, height: 38, borderRadius: 13, backgroundColor: "#FFF4DF", alignItems: "center", justifyContent: "center" },
  rowCopy: { flex: 1, gap: 2 },
  label: { color: colors.muted, fontFamily: "DMSans_400Regular", fontSize: 11.5 },
  value: { color: colors.navy, fontFamily: "DMSans_500Medium", fontSize: 14.5 },
  note: { padding: 15, flexDirection: "row", gap: 10, borderRadius: 15, backgroundColor: "#FFF8E9" },
  noteText: { flex: 1, color: colors.muted, fontFamily: "DMSans_400Regular", fontSize: 12.5, lineHeight: 19 },
  empty: { padding: 22, color: colors.muted, fontFamily: "DMSans_400Regular", textAlign: "center" },
});
