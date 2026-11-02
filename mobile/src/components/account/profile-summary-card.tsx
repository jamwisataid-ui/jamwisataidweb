import { StyleSheet, Text, View } from "react-native";
import type { AccountProfile } from "@/types";
import { jamaahNumber, journeySummary } from "@/lib/account";
import { NavyCard } from "@/components/ui";
import { colors, shadowDark } from "@/theme";
import { ProfileAvatar } from "./profile-avatar";

export function ProfileSummaryCard({ profile }: { profile: AccountProfile }) {
  const journey = journeySummary(profile);
  return (
    <View style={styles.wrap}>
      <NavyCard style={styles.card}>
        <ProfileAvatar name={profile.fullName} />
        <View style={styles.copy}>
          <Text numberOfLines={2} style={styles.name}>{profile.fullName}</Text>
          <Text style={styles.number}>No. Jamaah: {jamaahNumber(profile)}</Text>
          {journey ? <View style={styles.journey}><Text numberOfLines={1} style={styles.journeyText}>{journey}</Text></View> : null}
        </View>
      </NavyCard>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: -51, marginHorizontal: 18, borderRadius: 20, ...shadowDark },
  card: { minHeight: 104, padding: 16, flexDirection: "row", alignItems: "center", gap: 14 },
  copy: { flex: 1, gap: 4 },
  name: { color: colors.white, fontFamily: "Cinzel_700Bold", fontSize: 17, lineHeight: 22 },
  number: { color: "rgba(255,255,255,0.72)", fontFamily: "Montserrat_400Regular", fontSize: 12 },
  journey: { alignSelf: "flex-start", maxWidth: "100%", marginTop: 3, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, borderWidth: 1, borderColor: "rgba(212,175,55,0.5)", backgroundColor: "rgba(212,175,55,0.1)" },
  journeyText: { color: colors.softGold, fontFamily: "Montserrat_600SemiBold", fontSize: 11 },
});
