import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { colors, typography } from "@/theme";
import { CircleButton } from "@/components/ui";
import { GlassSurface } from "@/components/glass";

export function LiveHeader() {
  const goBack = () => router.canGoBack() ? router.back() : router.replace("/(tabs)");
  return <GlassSurface variant="dark" radius={0} glow={false} style={styles.header}><CircleButton dark icon="arrow-back" label="Kembali" onPress={goBack} /><Text style={styles.title}>LIVE MUTHOWIF</Text><View style={styles.action} /></GlassSurface>;
}

const styles = StyleSheet.create({
  header: { minHeight: 62, paddingHorizontal: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: colors.navy },
  action: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  title: { color: colors.white, fontFamily: typography.heading, fontSize: 19, letterSpacing: 0.5 },
});
