import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MetallicGold } from "@/components/metallic-gold";
import { colors } from "@/theme";
import { GlassSurface } from "@/components/glass";

const steps = ["Data Jamaah", "Dokumen", "Pembayaran", "Konfirmasi"];

export function RegistrationStepper({ current }: { current: number }) {
  return <View style={styles.root}>{steps.map((label, index) => {
    const number = index + 1;
    const completed = number < current;
    const active = number === current;
    return <View key={label} style={styles.item}>
      <View style={styles.trackRow}>
        {index > 0 ? <View style={[styles.line, completed && styles.lineDone]} /> : <View style={styles.linePlaceholder} />}
        {completed ? <MetallicGold style={styles.circle}><Ionicons name="checkmark" size={15} color={colors.navyDeep} /></MetallicGold> : <GlassSurface variant={active ? "gold" : "pearl"} radius={15} glow={active} style={styles.circle}><Text style={[styles.number, active && styles.numberActive]}>{number}</Text></GlassSurface>}
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
  circle: { width: 30, height: 30, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  number: { color: colors.muted, fontFamily: "Montserrat_700Bold", fontSize: 13 },
  numberActive: { color: colors.navyDeep },
  line: { flex: 1, height: 1, backgroundColor: "rgba(10,29,58,0.14)" },
  lineDone: { backgroundColor: colors.gold },
  linePlaceholder: { flex: 1 },
  label: { minHeight: 30, marginTop: 7, paddingHorizontal: 2, color: "#8B929D", fontFamily: "Montserrat_500Medium", fontSize: 10, lineHeight: 13, textAlign: "center" },
  labelActive: { color: colors.navy, fontFamily: "Montserrat_700Bold" },
});
