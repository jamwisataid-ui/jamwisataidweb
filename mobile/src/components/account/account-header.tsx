import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { colors } from "@/theme";

export function AccountHeader() {
  return <View style={styles.header}><Pressable accessibilityLabel="Kembali" hitSlop={10} onPress={() => router.canGoBack() ? router.back() : router.replace("/(tabs)")} style={styles.back}><Ionicons name="arrow-back" size={24} color={colors.white} /></Pressable><Text style={styles.title}>Area Jamaah</Text><View style={styles.back} /></View>;
}

const styles = StyleSheet.create({
  header: { height: 112, backgroundColor: "#003B6F", flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", paddingHorizontal: 18, paddingTop: 20 },
  back: { width: 42, height: 42, alignItems: "center", justifyContent: "center" },
  title: { color: colors.white, fontFamily: "DMSans_700Bold", fontSize: 21, paddingTop: 8 },
});
