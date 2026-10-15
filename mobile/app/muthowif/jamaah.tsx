import { useQuery } from "@tanstack/react-query";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MuthowifBottomNav } from "@/components/muthowif/muthowif-bottom-nav";
import { MuthowifHeader } from "@/components/muthowif/muthowif-header";
import { api } from "@/lib/api";
import { colors, typography } from "@/theme";
import type { MuthowifSession } from "@/types";

export default function MuthowifJamaahScreen() {
  const query = useQuery({ queryKey: ["muthowif-sessions"], queryFn: () => api<MuthowifSession[]>("/muthowif/sessions") });
  return <SafeAreaView edges={["top", "bottom"]} style={styles.safe}><MuthowifHeader /><ScrollView contentContainerStyle={styles.content}><Text style={styles.title}>Jamaah Rombongan</Text><Text style={styles.copy}>Ringkasan jamaah untuk setiap sesi yang ditugaskan.</Text>{query.data?.map((item) => <View key={item.id} style={styles.card}><Text style={styles.name}>{item.rombongan.name}</Text><Text style={styles.count}>{item.listenerCount} terhubung · {item.rombongan.totalJamaah} terdaftar</Text><Text style={styles.meta}>{item.location || "Lokasi belum ditentukan"}</Text></View>)}</ScrollView><MuthowifBottomNav active="jamaah" /></SafeAreaView>;
}
const styles = StyleSheet.create({ safe: { flex: 1, width: "100%", maxWidth: 480, alignSelf: "center", backgroundColor: colors.ivory }, content: { padding: 18, gap: 12, flexGrow: 1 }, title: { color: colors.navy, fontFamily: typography.bold, fontSize: 22 }, copy: { color: colors.muted, fontFamily: typography.body, lineHeight: 20, marginBottom: 5 }, card: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, borderRadius: 15, padding: 15, gap: 5 }, name: { color: colors.navy, fontFamily: typography.bold, fontSize: 15 }, count: { color: colors.success, fontFamily: typography.semibold, fontSize: 12 }, meta: { color: colors.muted, fontFamily: typography.body, fontSize: 11 } });
