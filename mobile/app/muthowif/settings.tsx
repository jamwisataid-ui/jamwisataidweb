import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MuthowifBottomNav } from "@/components/muthowif/muthowif-bottom-nav";
import { MuthowifHeader } from "@/components/muthowif/muthowif-header";
import { useAuthStore } from "@/lib/auth-store";
import { colors, typography } from "@/theme";

export default function MuthowifSettingsScreen() {
  const user = useAuthStore((value) => value.user);
  const signOut = useAuthStore((value) => value.signOut);
  return <SafeAreaView edges={["top", "bottom"]} style={styles.safe}><MuthowifHeader /><View style={styles.content}><Text style={styles.title}>Pengaturan</Text><View style={styles.card}><Text style={styles.label}>Akun Muthowif</Text><Text style={styles.value}>{user?.fullName}</Text><Text style={styles.meta}>{user?.email}</Text></View><View style={styles.card}><Text style={styles.label}>Audio Siaran</Text><Text style={styles.meta}>Gunakan headset yang stabil. Volume perangkat hanya mengatur monitoring, bukan level mikrofon jamaah.</Text></View><Pressable style={styles.logout} onPress={() => void signOut().then(() => router.replace("/muthowif/login" as never))}><Text style={styles.logoutText}>Keluar dari Panel</Text></Pressable></View><MuthowifBottomNav active="settings" /></SafeAreaView>;
}
const styles = StyleSheet.create({ safe: { flex: 1, width: "100%", maxWidth: 480, alignSelf: "center", backgroundColor: colors.ivory }, content: { flex: 1, padding: 18, gap: 14 }, title: { color: colors.navy, fontFamily: typography.bold, fontSize: 22 }, card: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, borderRadius: 15, padding: 16, gap: 5 }, label: { color: colors.navy, fontFamily: typography.bold, fontSize: 14 }, value: { color: colors.navy, fontFamily: typography.semibold, fontSize: 16 }, meta: { color: colors.muted, fontFamily: typography.body, fontSize: 12, lineHeight: 19 }, logout: { marginTop: "auto", height: 50, alignItems: "center", justifyContent: "center", borderRadius: 14, backgroundColor: "#FFF0EE", borderWidth: 1, borderColor: "#F2C4BD" }, logoutText: { color: colors.danger, fontFamily: typography.bold } });
