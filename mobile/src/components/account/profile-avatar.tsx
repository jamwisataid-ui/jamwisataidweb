import { StyleSheet, Text, View } from "react-native";
import { profileInitials } from "@/lib/account";
import { colors } from "@/theme";
import { GlassSurface } from "@/components/glass";

export function ProfileAvatar({ name }: { name: string }) {
  const initials = profileInitials(name);
  return <GlassSurface variant="navyOrb" radius={30} style={styles.avatar}><Text style={styles.initials}>{initials}</Text></GlassSurface>;
}

const styles = StyleSheet.create({
  avatar: { width: 60, height: 60, borderRadius: 30, alignItems: "center", justifyContent: "center" },
  initials: { color: colors.softGold, fontFamily: "Cinzel_700Bold", fontSize: 19 },
});
