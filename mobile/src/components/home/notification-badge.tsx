import { StyleSheet, Text, View } from "react-native";

export function NotificationBadge({ count }: { count: number }) {
  if (count < 1) return null;

  return (
    <View style={styles.badge}>
      <Text style={styles.text}>{count > 9 ? "9+" : count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    right: -3,
    top: -4,
    minWidth: 17,
    height: 17,
    paddingHorizontal: 4,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D84444",
    borderWidth: 2,
    borderColor: "#0A1D3A",
  },
  text: {
    color: "#FFFFFF",
    fontFamily: "Montserrat_700Bold",
    fontSize: 9,
    lineHeight: 11,
  },
});
