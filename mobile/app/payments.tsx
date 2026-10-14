import { StyleSheet, Text, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { Card, Empty, GuestGate, Screen, Section, Title } from "@/components/ui";
import { colors } from "@/theme";

type PaymentData = { summary: { billed: number; paid: number; refunded: number; outstanding: number }; transactions: Array<{ id: string; paidAt: string; amount: number; allocatedAmount: number; method: string; reference?: string | null; bookingNumber?: string }> };
const rp = (value: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);

export default function PaymentsScreen() {
  const tokens = useAuthStore((state) => state.tokens);
  const query = useQuery({ queryKey: ["payments"], queryFn: () => api<PaymentData>("/payments"), enabled: Boolean(tokens) });
  const data = query.data;
  if (!tokens) return <Screen><Title subtitle="Ringkasan tagihan dan pembayaran jamaah.">Pembayaran</Title><GuestGate body="Masuk untuk melihat total tagihan, sisa pembayaran, dan riwayat transaksi Anda." next="/payments" /></Screen>;
  return <Screen><Title subtitle="Ringkasan ini hanya dapat dilihat. Pembayaran tetap dikonfirmasi oleh admin.">Pembayaran</Title>{data ? <><View style={styles.grid}><Card><Text style={styles.label}>Total tagihan</Text><Text style={styles.amount}>{rp(data.summary.billed)}</Text></Card><Card><Text style={styles.label}>Sisa</Text><Text style={[styles.amount, data.summary.outstanding > 0 && { color: colors.danger }]}>{rp(data.summary.outstanding)}</Text></Card></View><Section title="Riwayat">{data.transactions.length ? data.transactions.map((item) => <Card key={item.id}><View style={styles.row}><View style={{ flex: 1, gap: 4 }}><Text style={styles.transaction}>{item.bookingNumber || "Pembayaran"}</Text><Text style={styles.meta}>{new Intl.DateTimeFormat("id-ID", { dateStyle: "long" }).format(new Date(item.paidAt))} · {item.method}</Text></View><Text style={styles.paid}>{rp(item.allocatedAmount)}</Text></View></Card>) : <Empty>Belum ada pembayaran terkonfirmasi.</Empty>}</Section></> : <Empty>Data pembayaran sedang dimuat.</Empty>}</Screen>;
}
const styles = StyleSheet.create({ grid: { gap: 10 }, label: { color: colors.muted, fontFamily: "DMSans_500Medium", fontSize: 12 }, amount: { color: colors.navy, fontFamily: "DMSans_700Bold", fontSize: 21 }, row: { flexDirection: "row", alignItems: "center", gap: 10 }, transaction: { color: colors.navy, fontFamily: "DMSans_700Bold" }, meta: { color: colors.muted, fontFamily: "DMSans_400Regular", fontSize: 12 }, paid: { color: colors.success, fontFamily: "DMSans_700Bold" } } as const);
