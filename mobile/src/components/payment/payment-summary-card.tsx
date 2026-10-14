import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/theme";

const rupiah = (value: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);

const statusLabels = { unpaid: "Belum dibayar", pending: "Menunggu", processing: "Diproses", paid: "Lunas", failed: "Gagal", expired: "Kedaluwarsa", partial: "Dibayar sebagian" };

export function PaymentSummaryCard({ amount, packageName, bookingNumber, status }: { amount: number; packageName: string; bookingNumber: string; status: keyof typeof statusLabels }) {
  return <View style={styles.card}><View style={styles.circle}><Text style={styles.number}>1</Text></View><View style={styles.content}><View style={styles.labelRow}><Text style={styles.label}>{status === "paid" ? "Pembayaran" : "Total Pembayaran"}</Text><Text style={[styles.status, status === "paid" && styles.paid]}>{statusLabels[status]}</Text></View><Text style={styles.amount}>{rupiah(amount)}</Text><Text numberOfLines={1} style={styles.meta}>{packageName} · {bookingNumber}</Text></View></View>;
}

const styles = StyleSheet.create({ card: { flexDirection: "row", gap: 13, padding: 17, borderRadius: 18, backgroundColor: "#FAF7F1", borderWidth: 1, borderColor: colors.line }, circle: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.navy, alignItems: "center", justifyContent: "center" }, number: { color: colors.white, fontFamily: "DMSans_700Bold", fontSize: 15 }, content: { flex: 1, minWidth: 0 }, labelRow: { flexDirection: "row", justifyContent: "space-between", gap: 8 }, label: { color: colors.muted, fontFamily: "DMSans_500Medium", fontSize: 13 }, status: { color: colors.danger, fontFamily: "DMSans_700Bold", fontSize: 11 }, paid: { color: colors.success }, amount: { color: colors.navy, fontFamily: "DMSans_700Bold", fontSize: 25, marginTop: 2 }, meta: { color: colors.muted, fontFamily: "DMSans_400Regular", fontSize: 11.5, marginTop: 5 } });
