import { StyleSheet, Text, View } from "react-native";
import { profileInitials } from "@/lib/account";
import { colors } from "@/theme";

export function ProfileAvatar({ name }: { name: string }) {
  const initials = profileInitials(name);
  return <View style={styles.avatar}><Text style={styles.initials}>{initials}</Text></View>;
}

const styles = StyleSheet.create({
  avatar: { width: 62, height: 62, borderRadius: 31, borderWidth: 2, borderColor: "#D4AF37", backgroundColor: "#F8F1DC", alignItems: "center", justifyContent: "center" },
  initials: { color: colors.navy, fontFamily: "Montserrat_700Bold", fontSize: 20 },
});
