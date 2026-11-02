import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/theme";

export function HomeSectionHeader({ title, actionLabel, onAction }: { title: string; actionLabel?: string; onAction?: () => void }) {
  return (
    <View style={styles.row}>
      <Text accessibilityRole="header" style={styles.title}>{title.toLocaleUpperCase("id-ID")}</Text>
      {actionLabel && onAction ? <Pressable accessibilityRole="button" onPress={onAction} hitSlop={10}><Text style={styles.action}>{actionLabel}</Text></Pressable> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  title: { color: colors.navy, fontFamily: "Cinzel_600SemiBold", fontSize: 12.5, letterSpacing: 2.8 },
  action: { color: colors.goldText, fontFamily: "Montserrat_600SemiBold", fontSize: 12.5 },
});
