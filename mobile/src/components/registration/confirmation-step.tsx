import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Package } from "@/types";
import type { RegistrationDraft } from "@/lib/registration-draft";
import { colors } from "@/theme";

const rupiah = (value?: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value ?? 0);
const roomLabel = { quad: "Quad · 4 orang", triple: "Triple · 3 orang", double: "Double · 2 orang" };

function Summary({ icon, title, rows }: { icon: keyof typeof Ionicons.glyphMap; title: string; rows: Array<[string, string]> }) {
  return <View style={styles.card}><View style={styles.heading}><View style={styles.icon}><Ionicons name={icon} size={19} color={colors.navy} /></View><Text style={styles.cardTitle}>{title}</Text></View>{rows.map(([label, value]) => <View key={label} style={styles.row}><Text style={styles.label}>{label}</Text><Text style={styles.value}>{value || "—"}</Text></View>)}</View>;
}

export function ConfirmationStep({ packageItem, draft }: { packageItem?: Package; draft: RegistrationDraft }) {
  const payerName = draft.payerSameAsPilgrim ? draft.fullName : draft.payerName;
  return <View style={styles.root}><View><Text style={styles.title}>Konfirmasi Pendaftaran</Text><Text style={styles.copy}>Pastikan data sudah benar. Setelah dikirim, admin Jam Wisata akan memeriksa pendaftaran Anda.</Text></View><Summary icon="person-outline" title="Data Jamaah" rows={[["Nama", draft.fullName], ["WhatsApp", draft.whatsapp], ["Email", draft.email || "Tidak diisi"], ["Paspor", draft.passportNumber || "Belum diisi"]]} /><Summary icon="airplane-outline" title="Paket" rows={[["Program", packageItem?.name ?? "Paket Umroh"], ["Keberangkatan", packageItem?.departureDate ?? "—"], ["Tipe kamar", roomLabel[draft.roomType]], ["Harga", rupiah(packageItem?.priceFrom)]]} /><Summary icon="wallet-outline" title="Pembayaran" rows={[["Pembayar", payerName], ["Status", "Menunggu konfirmasi admin"], ["Target DP", rupiah(Math.min(packageItem?.priceFrom ?? 0, 5_000_000))]]} /><View style={styles.notice}><Ionicons name="information-circle" size={21} color={colors.gold} /><Text style={styles.noticeText}>Mengirim formulir ini belum mencatat pembayaran. Nomor booking akan dibuat dengan status menunggu review admin.</Text></View></View>;
}

const styles = StyleSheet.create({ root: { gap: 15 }, title: { color: colors.navy, fontFamily: "PlayfairDisplay_700Bold", fontSize: 23 }, copy: { marginTop: 6, color: colors.muted, fontFamily: "DMSans_400Regular", fontSize: 13.5, lineHeight: 20 }, card: { borderRadius: 17, padding: 15, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, gap: 10 }, heading: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 2 }, icon: { width: 34, height: 34, borderRadius: 11, backgroundColor: "#F5E6C9", alignItems: "center", justifyContent: "center" }, cardTitle: { color: colors.navy, fontFamily: "DMSans_700Bold", fontSize: 16 }, row: { flexDirection: "row", justifyContent: "space-between", gap: 15 }, label: { color: colors.muted, fontFamily: "DMSans_400Regular", fontSize: 12.5 }, value: { flex: 1, color: colors.ink, fontFamily: "DMSans_500Medium", fontSize: 12.5, textAlign: "right" }, notice: { flexDirection: "row", gap: 9, padding: 13, backgroundColor: "#FFF5E3", borderRadius: 13 }, noticeText: { flex: 1, color: colors.muted, fontFamily: "DMSans_400Regular", fontSize: 12, lineHeight: 18 } });
