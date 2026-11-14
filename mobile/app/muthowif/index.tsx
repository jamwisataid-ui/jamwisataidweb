import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MuthowifBottomNav } from "@/components/muthowif/muthowif-bottom-nav";
import { MuthowifHeader } from "@/components/muthowif/muthowif-header";
import { api } from "@/lib/api";
import { colors, typography } from "@/theme";
import type { MuthowifSession } from "@/types";

export default function MuthowifHomeScreen() {
  const query = useQuery({ queryKey: ["muthowif-sessions"], queryFn: () => api<MuthowifSession[]>("/muthowif/sessions") });
  return <SafeAreaView edges={["top", "bottom"]} style={styles.safe}><MuthowifHeader /><ScrollView contentContainerStyle={styles.content}><Text style={styles.eyebrow}>RUANG KERJA MUTHOWIF</Text><Text style={styles.title}>Assalamu’alaikum</Text><Text style={styles.copy}>Kelola panduan ibadah dan pantau sesi rombongan dari satu tempat.</Text><View style={styles.card}><Text style={styles.cardTitle}>Sesi Ditugaskan</Text><Text style={styles.count}>{query.data?.filter((item) => item.status !== "ended").length ?? 0}</Text><Text style={styles.meta}>Sesi aktif dan mendatang</Text><Pressable onPress={() => router.push("/muthowif/live" as never)} style={styles.button}><Text style={styles.buttonText}>Buka Panel Live →</Text></Pressable></View></ScrollView><MuthowifBottomNav active="home" /></SafeAreaView>;
}
const styles = StyleSheet.create({ safe: { flex: 1, width: "100%", maxWidth: 480, alignSelf: "center", backgroundColor: colors.ivory }, content: { padding: 20, gap: 10 }, eyebrow: { color: colors.goldDark, fontFamily: typography.bold, fontSize: 11, letterSpacing: 1.5 }, title: { color: colors.navy, fontFamily: typography.heading, fontSize: 27 }, copy: { color: colors.muted, fontFamily: typography.body, lineHeight: 21, marginBottom: 12 }, card: { backgroundColor: colors.white, borderRadius: 18, borderWidth: 1, borderColor: colors.line, padding: 18, gap: 5 }, cardTitle: { color: colors.navy, fontFamily: typography.bold, fontSize: 17 }, count: { color: colors.navy, fontFamily: typography.bold, fontSize: 40 }, meta: { color: colors.muted, fontFamily: typography.body, fontSize: 12 }, button: { marginTop: 12, height: 46, borderRadius: 13, backgroundColor: colors.navy, alignItems: "center", justifyContent: "center" }, buttonText: { color: colors.white, fontFamily: typography.bold } });
