import { Pressable, StyleSheet, Text, View } from "react-native";

export function HomeSectionHeader({ title, actionLabel, onAction }: { title: string; actionLabel?: string; onAction?: () => void }) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {actionLabel && onAction ? <Pressable accessibilityRole="button" onPress={onAction} hitSlop={8}><Text style={styles.action}>{actionLabel}</Text></Pressable> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  title: { color: "#021730", fontFamily: "PlayfairDisplay_700Bold", fontSize: 21 },
  action: { color: "#B67720", fontFamily: "DMSans_700Bold", fontSize: 13 },
});
