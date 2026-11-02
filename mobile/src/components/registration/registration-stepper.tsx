import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MetallicGold } from "@/components/metallic-gold";
import { colors } from "@/theme";

const steps = ["Data Jamaah", "Dokumen", "Pembayaran", "Konfirmasi"];

export function RegistrationStepper({ current }: { current: number }) {
  return <View style={styles.root}>{steps.map((label, index) => {
    const number = index + 1;
    const completed = number < current;
    const active = number === current;
    return <View key={label} style={styles.item}>
      <View style={styles.trackRow}>
        {index > 0 ? <View style={[styles.line, completed && styles.lineDone]} /> : <View style={styles.linePlaceholder} />}
        {completed ? <MetallicGold style={styles.circle}><Ionicons name="checkmark" size={15} color={colors.navyDeep} /></MetallicGold> : <View style={[styles.circle, active && styles.circleActive]}><Text style={[styles.number, active && styles.numberActive]}>{number}</Text></View>}
        {index < steps.length - 1 ? <View style={[styles.line, number < current && styles.lineDone]} /> : <View style={styles.linePlaceholder} />}
      </View>
      <Text numberOfLines={2} style={[styles.label, active && styles.labelActive]}>{label}</Text>
    </View>;
  })}</View>;
}

const styles = StyleSheet.create({
  root: { flexDirection: "row", paddingHorizontal: 8, paddingVertical: 14 },
  item: { flex: 1, alignItems: "center" },
  trackRow: { flexDirection: "row", alignItems: "center", width: "100%" },
  circle: { width: 30, height: 30, borderRadius: 15, borderWidth: 1, borderColor: "rgba(10,29,58,0.2)", alignItems: "center", justifyContent: "center", overflow: "hidden" },
  circleActive: { backgroundColor: colors.navy, borderColor: colors.gold },
  number: { color: colors.muted, fontFamily: "Montserrat_700Bold", fontSize: 13 },
  numberActive: { color: colors.softGold },
  line: { flex: 1, height: 1, backgroundColor: "rgba(10,29,58,0.14)" },
  lineDone: { backgroundColor: colors.gold },
  linePlaceholder: { flex: 1 },
  label: { minHeight: 30, marginTop: 7, paddingHorizontal: 2, color: "#8B929D", fontFamily: "Montserrat_500Medium", fontSize: 10, lineHeight: 13, textAlign: "center" },
  labelActive: { color: colors.navy, fontFamily: "Montserrat_700Bold" },
});
