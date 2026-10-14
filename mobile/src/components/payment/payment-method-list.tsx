import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { PaymentMethod } from "./payment-types";
import { colors } from "@/theme";

const icons: Record<PaymentMethod["id"], keyof typeof Ionicons.glyphMap> = { bank_transfer: "business", virtual_account: "qr-code", card: "card", ewallet: "wallet" };
const tones: Record<PaymentMethod["id"], string> = { bank_transfer: colors.navy, virtual_account: "#175D8D", card: "#D06A34", ewallet: "#2479A9" };

export function PaymentMethodList({ methods, selected, onSelect }: { methods: PaymentMethod[]; selected: string | null; onSelect: (method: PaymentMethod) => void }) {
  return <View style={styles.list}>{methods.map((method) => {
    const active = selected === method.id;
    return <Pressable key={method.id} accessibilityRole="radio" accessibilityState={{ checked: active, disabled: !method.enabled }} disabled={!method.enabled} onPress={() => onSelect(method)} style={[styles.item, active && styles.active, !method.enabled && styles.disabled]}><View style={[styles.icon, { backgroundColor: tones[method.id] }]}><Ionicons name={icons[method.id]} size={21} color={colors.white} /></View><View style={styles.copy}><Text style={styles.name}>{method.name}</Text>{method.description ? <Text style={styles.description}>{method.description}</Text> : null}</View><View style={[styles.radio, active && styles.radioActive]}>{active ? <View style={styles.dot} /> : null}</View></Pressable>;
  })}</View>;
}

const styles = StyleSheet.create({ list: { gap: 10 }, item: { minHeight: 60, flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 14, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line }, active: { borderWidth: 2, borderColor: colors.gold, backgroundColor: "#FFF8E9", paddingHorizontal: 13, paddingVertical: 8 }, disabled: { opacity: .52 }, icon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" }, copy: { flex: 1 }, name: { color: colors.ink, fontFamily: "DMSans_700Bold", fontSize: 14 }, description: { color: colors.muted, fontFamily: "DMSans_400Regular", fontSize: 11.5, marginTop: 2 }, radio: { width: 21, height: 21, borderRadius: 11, borderWidth: 1.5, borderColor: "#AAB1BC", alignItems: "center", justifyContent: "center" }, radioActive: { borderColor: colors.navy }, dot: { width: 9, height: 9, borderRadius: 5, backgroundColor: colors.navy } });
