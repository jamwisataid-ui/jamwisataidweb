import { StyleSheet, Text, View } from "react-native";
import type { AccountProfile } from "@/types";
import { jamaahNumber, journeySummary } from "@/lib/account";
import { colors, shadow } from "@/theme";
import { ProfileAvatar } from "./profile-avatar";

export function ProfileSummaryCard({ profile }: { profile: AccountProfile }) {
  const journey = journeySummary(profile);
  return <View style={styles.card}><ProfileAvatar name={profile.fullName} /><View style={styles.copy}><Text numberOfLines={2} style={styles.name}>{profile.fullName}</Text><Text style={styles.number}>No. Jamaah: {jamaahNumber(profile)}</Text>{journey ? <View style={styles.journey}><Text numberOfLines={1} style={styles.journeyText}>{journey}</Text></View> : null}</View></View>;
}

const styles = StyleSheet.create({
  card: { marginTop: -51, marginHorizontal: 18, minHeight: 108, padding: 16, flexDirection: "row", alignItems: "center", gap: 14, backgroundColor: colors.white, borderRadius: 21, borderWidth: 1, borderColor: colors.line, ...shadow },
  copy: { flex: 1, gap: 5 },
  name: { color: colors.navy, fontFamily: "DMSans_700Bold", fontSize: 19, lineHeight: 24 },
  number: { color: colors.muted, fontFamily: "DMSans_400Regular", fontSize: 12.5 },
  journey: { alignSelf: "flex-start", maxWidth: "100%", marginTop: 3, paddingHorizontal: 9, paddingVertical: 5, borderRadius: 10, backgroundColor: "#FFF2D8" },
  journeyText: { color: colors.navy, fontFamily: "DMSans_500Medium", fontSize: 11.5 },
});
