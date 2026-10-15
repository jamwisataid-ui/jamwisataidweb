import { StyleSheet, Text, View } from "react-native";
import { profileInitials } from "@/lib/account";
import { colors } from "@/theme";

export function ProfileAvatar({ name }: { name: string }) {
  const initials = profileInitials(name);
  return <View style={styles.avatar}><Text style={styles.initials}>{initials}</Text></View>;
}

const styles = StyleSheet.create({
  avatar: { width: 62, height: 62, borderRadius: 31, borderWidth: 2, borderColor: "#E8B659", backgroundColor: "#FFF2D8", alignItems: "center", justifyContent: "center" },
  initials: { color: colors.navy, fontFamily: "DMSans_700Bold", fontSize: 20 },
});
