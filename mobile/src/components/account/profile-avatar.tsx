import { StyleSheet, Text, View } from "react-native";
import { profileInitials } from "@/lib/account";
import { colors } from "@/theme";

export function ProfileAvatar({ name }: { name: string }) {
  const initials = profileInitials(name);
  return <View style={styles.avatar}><Text style={styles.initials}>{initials}</Text></View>;
}

const styles = StyleSheet.create({
  avatar: { width: 60, height: 60, borderRadius: 30, borderWidth: 1.5, borderColor: colors.gold, backgroundColor: colors.royal, alignItems: "center", justifyContent: "center" },
  initials: { color: colors.softGold, fontFamily: "Cinzel_700Bold", fontSize: 19 },
});
