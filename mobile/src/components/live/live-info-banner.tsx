import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { MetallicGold } from "@/components/metallic-gold";
import { colors, shadow, typography } from "@/theme";
import { GlassSurface } from "@/components/glass";

export function LiveInfoBanner() {
  return <MetallicGold style={styles.banner}><GlassSurface variant="navyOrb" radius={24} style={styles.icon}><Ionicons name="radio" size={27} color={colors.softGold} /></GlassSurface><View style={styles.copy}><Text style={styles.eyebrow}>PANDUAN IBADAH</Text><Text style={styles.title}>Secara Langsung dari Ustadz Pembimbing</Text></View><Ionicons name="radio-outline" size={58} color="rgba(6,21,43,0.13)" style={styles.watermark} /></MetallicGold>;
}

const styles = StyleSheet.create({
  banner: { minHeight: 94, borderRadius: 18, padding: 16, flexDirection: "row", alignItems: "center", gap: 13, overflow: "hidden", ...shadow },
  icon: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center" },
  copy: { flex: 1, gap: 3, zIndex: 1 },
  eyebrow: { color: colors.navyDeep, fontFamily: typography.bold, fontSize: 10, letterSpacing: 1.2 },
  title: { color: colors.navyDeep, fontFamily: typography.heading, fontSize: 16, lineHeight: 21 },
  watermark: { position: "absolute", right: -5, bottom: -9 },
});
