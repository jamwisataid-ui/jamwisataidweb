import { router } from "expo-router";
import { StyleSheet, Text } from "react-native";

import { colors, typography } from "@/theme";
import { CircleButton } from "@/components/ui";
import { GlassSurface } from "@/components/glass";

export function MuthowifHeader({ onSettings }: { onSettings?: () => void }) {
  return <GlassSurface variant="dark" radius={0} glow={false} style={styles.root}><CircleButton dark icon="arrow-back" label="Kembali" onPress={() => router.back()} /><Text style={styles.title}>PANEL MUTHOWIF</Text><CircleButton dark icon="settings-outline" label="Pengaturan" onPress={onSettings ?? (() => router.push("/muthowif/settings" as never))} /></GlassSurface>;
}
const styles = StyleSheet.create({ root: { minHeight: 64, paddingHorizontal: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, title: { color: colors.white, fontFamily: typography.bold, fontSize: 18, letterSpacing: .5 } });
