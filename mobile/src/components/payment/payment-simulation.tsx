import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { PaymentMethod } from "./payment-types";
import { colors } from "@/theme";

const descriptions: Record<Exclude<PaymentMethod["id"], "bank_transfer">, string> = {
  virtual_account: "Nantinya aplikasi menampilkan nomor Virtual Account dan batas waktu pembayaran dari payment gateway.",
  card: "Nantinya Anda diarahkan ke halaman pembayaran kartu yang disediakan payment gateway.",
  ewallet: "Nantinya Anda memilih dompet digital dan menyelesaikan pembayaran melalui payment gateway.",
};

export function PaymentSimulation({ method }: { method: PaymentMethod }) {
  if (method.id === "bank_transfer") return null;
  return <View style={styles.box} accessibilityRole="summary">
    <View style={styles.heading}><Ionicons name="eye-outline" size={20} color={colors.navy} /><Text style={styles.title}>Simulasi {method.name}</Text></View>
    <Text style={styles.copy}>{descriptions[method.id]}</Text>
    <Text style={styles.notice}>Ini hanya pratinjau. Belum ada transaksi, nomor pembayaran, atau perubahan status tagihan. Gunakan Transfer Bank untuk pembayaran saat ini.</Text>
  </View>;
}

const styles = StyleSheet.create({
  box: { gap: 10, padding: 16, borderRadius: 17, backgroundColor: "#F8F1DC", borderWidth: 1, borderColor: "#F0D59C" },
  heading: { flexDirection: "row", alignItems: "center", gap: 8 },
  title: { flex: 1, color: colors.navy, fontFamily: "Montserrat_700Bold", fontSize: 16 },
  copy: { color: colors.ink, fontFamily: "Montserrat_400Regular", fontSize: 13, lineHeight: 20 },
  notice: { color: colors.muted, fontFamily: "Montserrat_500Medium", fontSize: 12, lineHeight: 18 },
});
