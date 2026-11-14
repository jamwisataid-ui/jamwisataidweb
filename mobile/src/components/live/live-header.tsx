import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, typography } from "@/theme";

export function LiveHeader() {
  const goBack = () => router.canGoBack() ? router.back() : router.replace("/(tabs)");
  return <View style={styles.header}><Pressable accessibilityLabel="Kembali" accessibilityRole="button" onPress={goBack} style={styles.action}><Ionicons name="arrow-back" size={23} color={colors.white} /></Pressable><Text style={styles.title}>LIVE MUTHOWIF</Text><View style={styles.action} /></View>;
}

const styles = StyleSheet.create({
  header: { minHeight: 62, paddingHorizontal: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: colors.navy },
  action: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  title: { color: colors.white, fontFamily: typography.heading, fontSize: 19, letterSpacing: 0.5 },
});
