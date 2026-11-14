import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { colors, shadow } from "@/theme";

export function LogoutConfirmationModal({ visible, busy, onCancel, onConfirm }: { visible: boolean; busy: boolean; onCancel: () => void; onConfirm: () => void }) {
  return <Modal transparent visible={visible} animationType="fade" onRequestClose={onCancel}><View style={styles.overlay}><View style={styles.dialog}><Text style={styles.title}>Keluar dari akun?</Text><Text style={styles.body}>Data pribadi tidak akan tampil sampai Anda masuk kembali. Paket dan panduan tetap bisa digunakan sebagai tamu.</Text><View style={styles.actions}><Pressable disabled={busy} onPress={onCancel} style={styles.cancel}><Text style={styles.cancelText}>Batal</Text></Pressable><Pressable disabled={busy} onPress={onConfirm} style={styles.confirm}>{busy ? <ActivityIndicator color={colors.white} /> : <Text style={styles.confirmText}>Keluar</Text>}</Pressable></View></View></View></Modal>;
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(2,23,48,.54)", justifyContent: "center", padding: 24 },
  dialog: { width: "100%", maxWidth: 420, alignSelf: "center", padding: 20, gap: 12, borderRadius: 22, backgroundColor: colors.white, ...shadow },
  title: { color: colors.navy, fontFamily: "Montserrat_700Bold", fontSize: 20 },
  body: { color: colors.muted, fontFamily: "Montserrat_400Regular", fontSize: 14, lineHeight: 21 },
  actions: { flexDirection: "row", gap: 10, marginTop: 5 },
  cancel: { flex: 1, height: 48, borderRadius: 14, borderWidth: 1, borderColor: colors.line, alignItems: "center", justifyContent: "center" },
  confirm: { flex: 1, height: 48, borderRadius: 14, backgroundColor: colors.danger, alignItems: "center", justifyContent: "center" },
  cancelText: { color: colors.navy, fontFamily: "Montserrat_700Bold" },
  confirmText: { color: colors.white, fontFamily: "Montserrat_700Bold" },
});
