import { StyleSheet, Text, View } from "react-native";
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
        <View style={[styles.circle, (active || completed) && styles.circleActive]}><Text style={[styles.number, (active || completed) && styles.numberActive]}>{completed ? "✓" : number}</Text></View>
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
  circle: { width: 34, height: 34, borderRadius: 17, borderWidth: 1, borderColor: "#D7DBE0", backgroundColor: "#F4F1EA", alignItems: "center", justifyContent: "center" },
  circleActive: { backgroundColor: colors.navy, borderColor: colors.navy },
  number: { color: colors.muted, fontFamily: "DMSans_700Bold", fontSize: 13 },
  numberActive: { color: colors.white },
  line: { flex: 1, height: 2, backgroundColor: "#D8DCE2" },
  lineDone: { backgroundColor: colors.gold },
  linePlaceholder: { flex: 1 },
  label: { minHeight: 30, marginTop: 7, paddingHorizontal: 2, color: "#8B929D", fontFamily: "DMSans_500Medium", fontSize: 10, lineHeight: 13, textAlign: "center" },
  labelActive: { color: colors.navy, fontFamily: "DMSans_700Bold" },
});
