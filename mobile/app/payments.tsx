import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Button, Card, Empty, GuestGate, Screen, Section, Title } from "@/components/ui";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { colors } from "@/theme";

type Bill = {
  registrationId: string;
  bookingNumber: string;
  packageName: string;
  total: number;
  paid: number;
  outstanding: number;
  status: "unpaid" | "partial" | "paid";
  selectedMethod?: string | null;
};
type PaymentData = {
  summary: { billed: number; paid: number; refunded: number; outstanding: number };
  bills: Bill[];
  transactions: Array<{ id: string; paidAt: string; amount: number; allocatedAmount: number; method: string; reference?: string | null; bookingNumber?: string }>;
};
const rp = (value: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
const statusLabel = { unpaid: "Belum dibayar", partial: "Dibayar sebagian", paid: "Lunas" };

function BillCard({ bill }: { bill: Bill }) {
  return <Card><View style={styles.billHeader}><View style={styles.billCopy}><Text style={styles.packageName}>{bill.packageName}</Text><Text style={styles.meta}>{bill.bookingNumber}</Text></View><View style={[styles.badge, bill.status === "paid" && styles.badgePaid]}><Text style={[styles.badgeText, bill.status === "paid" && styles.badgeTextPaid]}>{statusLabel[bill.status]}</Text></View></View><View style={styles.billAmounts}><View><Text style={styles.label}>Sisa tagihan</Text><Text style={[styles.billAmount, bill.outstanding > 0 && styles.outstanding]}>{rp(bill.outstanding)}</Text></View>{bill.paid > 0 ? <View style={styles.paidBlock}><Text style={styles.label}>Terbayar</Text><Text style={styles.paid}>{rp(bill.paid)}</Text></View> : null}</View><Pressable accessibilityRole="button" onPress={() => router.push(`/payment/${bill.registrationId}` as never)} style={styles.payButton}><Text style={styles.payButtonText}>{bill.status === "paid" ? "Lihat Pembayaran" : bill.selectedMethod ? "Lihat Instruksi Pembayaran" : "Pilih Cara Pembayaran"}</Text><Ionicons name="arrow-forward" size={18} color={colors.white} /></Pressable></Card>;
}

export default function PaymentsScreen() {
  const tokens = useAuthStore((state) => state.tokens);
  const query = useQuery({ queryKey: ["payments"], queryFn: () => api<PaymentData>("/payments"), enabled: Boolean(tokens) });
  const data = query.data;
  if (!tokens) return <Screen><Title subtitle="Ringkasan tagihan dan pembayaran jamaah.">Pembayaran</Title><GuestGate body="Masuk untuk melihat total tagihan, sisa pembayaran, dan riwayat transaksi Anda." next="/payments" /></Screen>;
  return <Screen><Title subtitle="Pilih tagihan untuk melihat metode dan instruksi pembayaran resmi.">Pembayaran</Title>{data ? <><View style={styles.grid}><Card><Text style={styles.label}>Total tagihan</Text><Text style={styles.amount}>{rp(data.summary.billed)}</Text></Card><Card><Text style={styles.label}>Sisa</Text><Text style={[styles.amount, data.summary.outstanding > 0 && styles.outstanding]}>{rp(data.summary.outstanding)}</Text></Card></View><View style={styles.notice}><Ionicons name="shield-checkmark-outline" size={20} color={colors.navy} /><Text style={styles.noticeText}>Transfer dilakukan ke rekening resmi yang tampil pada detail tagihan. Status berubah setelah pembayaran dikonfirmasi admin.</Text></View><Section title="Tagihan Paket">{data.bills.length ? data.bills.map((bill) => <BillCard key={bill.registrationId} bill={bill} />) : <Empty>Belum ada tagihan paket.</Empty>}</Section><Section title="Riwayat Pembayaran">{data.transactions.length ? data.transactions.map((item) => <Card key={item.id}><View style={styles.row}><View style={styles.billCopy}><Text style={styles.transaction}>{item.bookingNumber || "Pembayaran"}</Text><Text style={styles.meta}>{new Intl.DateTimeFormat("id-ID", { dateStyle: "long" }).format(new Date(item.paidAt))} · {item.method}</Text></View><Text style={styles.paid}>{rp(item.allocatedAmount)}</Text></View></Card>) : <Empty>Belum ada pembayaran terkonfirmasi.</Empty>}</Section></> : query.isError ? <Card><Ionicons name="cloud-offline-outline" size={30} color={colors.gold} /><Text style={styles.errorTitle}>Data pembayaran belum dapat dimuat</Text><Text style={styles.meta}>Periksa koneksi Anda, lalu coba kembali.</Text><Button secondary label="Coba Lagi" onPress={() => void query.refetch()} /></Card> : <Empty>Data pembayaran sedang dimuat.</Empty>}</Screen>;
}

const styles = StyleSheet.create({
  grid: { gap: 10 },
  label: { color: colors.muted, fontFamily: "Montserrat_500Medium", fontSize: 12 },
  amount: { color: colors.navy, fontFamily: "Montserrat_700Bold", fontSize: 21 },
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  billHeader: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  billCopy: { flex: 1, minWidth: 0, gap: 3 },
  packageName: { color: colors.navy, fontFamily: "Montserrat_700Bold", fontSize: 15 },
  transaction: { color: colors.navy, fontFamily: "Montserrat_700Bold" },
  meta: { color: colors.muted, fontFamily: "Montserrat_400Regular", fontSize: 11.5 },
  badge: { paddingHorizontal: 9, paddingVertical: 5, borderRadius: 10, backgroundColor: "#FDE7E3" },
  badgePaid: { backgroundColor: "#E2F4E9" },
  badgeText: { color: colors.danger, fontFamily: "Montserrat_700Bold", fontSize: 10 },
  badgeTextPaid: { color: colors.success },
  billAmounts: { marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.line, flexDirection: "row", justifyContent: "space-between", gap: 12 },
  billAmount: { marginTop: 2, color: colors.navy, fontFamily: "Montserrat_700Bold", fontSize: 19 },
  paidBlock: { alignItems: "flex-end" },
  paid: { color: colors.success, fontFamily: "Montserrat_700Bold" },
  outstanding: { color: colors.danger },
  notice: { flexDirection: "row", alignItems: "flex-start", gap: 9, padding: 13, borderRadius: 14, backgroundColor: colors.goldPale },
  noticeText: { flex: 1, color: colors.muted, fontFamily: "Montserrat_400Regular", fontSize: 12, lineHeight: 18 },
  errorTitle: { color: colors.navy, fontFamily: "Montserrat_700Bold", fontSize: 17 },
  payButton: { marginTop: 14, minHeight: 44, paddingHorizontal: 15, borderRadius: 13, backgroundColor: colors.navy, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  payButtonText: { color: colors.white, fontFamily: "Montserrat_700Bold", fontSize: 13 },
} as const);
