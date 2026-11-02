import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";

import { MetallicGold } from "@/components/metallic-gold";
import { NavyCard } from "@/components/ui";
import { flattenPackageDepartures } from "@/lib/package-departures";
import { colors, shadowDark } from "@/theme";
import type { AccountProfile, Package } from "@/types";

const consultUrl = "https://wa.me/6281809627499?text=Assalamu%27alaikum%2C%20saya%20ingin%20konsultasi%20paket%20umroh%20JAM%20WISATA.";

function daysUntil(isoDate: string) {
  const target = new Date(`${isoDate}T00:00:00+07:00`).getTime();
  return Math.ceil((target - Date.now()) / 86_400_000);
}

function formatDate(isoDate: string) {
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jakarta" }).format(new Date(`${isoDate}T00:00:00+07:00`));
}

function GoldAction({ label, icon, onPress }: { label: string; icon: keyof typeof Ionicons.glyphMap; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.goldAction, pressed && { opacity: 0.85 }]}>
      <MetallicGold style={styles.goldFill}><Text style={styles.goldText}>{label}</Text><Ionicons name={icon} size={15} color={colors.navyDeep} /></MetallicGold>
    </Pressable>
  );
}

function OutlineAction({ label, icon, onPress }: { label: string; icon: keyof typeof Ionicons.glyphMap; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.outlineAction, pressed && { opacity: 0.75 }]}>
      <Ionicons name={icon} size={15} color={colors.softGold} />
      <Text style={styles.outlineText}>{label}</Text>
    </Pressable>
  );
}

/** Signed-in pilgrim with a registered journey: countdown to departure. */
function JourneyCard({ profile }: { profile: AccountProfile }) {
  const journey = profile.journey!;
  const days = daysUntil(journey.departureDate);
  return (
    <NavyCard style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.copy}>
          <Text style={styles.eyebrow}>PERJALANAN ANDA</Text>
          <Text style={styles.title}>Berangkat {formatDate(journey.departureDate)}</Text>
          <Text style={styles.meta}>{profile.jamaahNumber ? `No. Jamaah ${profile.jamaahNumber}` : journey.status}</Text>
        </View>
        {days >= 0 ? (
          <View accessibilityLabel={`${days} hari lagi`} style={styles.countdown}>
            <Text style={styles.countdownValue}>{days}</Text>
            <Text style={styles.countdownLabel}>HARI</Text>
          </View>
        ) : null}
      </View>
      <View style={styles.actions}>
        <GoldAction label="ITINERARY" icon="arrow-forward" onPress={() => router.push("/journey")} />
        <OutlineAction label="Dokumen" icon="document-text-outline" onPress={() => router.push("/documents")} />
      </View>
    </NavyCard>
  );
}

/** Guests (or pilgrims without a journey): nearest open departure. */
function NearestDepartureCard({ packages }: { packages?: Package[] }) {
  const today = new Date().toISOString().slice(0, 10);
  const nearest = flattenPackageDepartures(packages).find(({ departure }) => departure.selectable && departure.departureDate >= today);
  return (
    <NavyCard style={styles.card}>
      <View style={styles.copy}>
        <Text style={styles.eyebrow}>{nearest ? "KEBERANGKATAN TERDEKAT" : "UMROH BERSAMA JAM WISATA"}</Text>
        <Text style={styles.title}>{nearest ? (/^\d{4}-\d{2}-\d{2}$/.test(nearest.departure.departureDate) ? formatDate(nearest.departure.departureDate) : nearest.departure.dateLabel) : "Setiap Waktu Bernilai Ibadah"}</Text>
        <Text numberOfLines={1} style={styles.meta}>
          {nearest ? `${nearest.packageItem.name}${typeof nearest.departure.remainingQuota === "number" ? ` · sisa ${nearest.departure.remainingQuota} kursi` : ""}` : "Jadwal keberangkatan sedang diperbarui."}
        </Text>
      </View>
      <View style={styles.actions}>
        <GoldAction label="LIHAT JADWAL" icon="arrow-forward" onPress={() => router.push("/schedule")} />
        <OutlineAction label="Konsultasi" icon="logo-whatsapp" onPress={() => void Linking.openURL(consultUrl)} />
      </View>
    </NavyCard>
  );
}

export function HighlightCard({ profile, packages }: { profile?: AccountProfile; packages?: Package[] }) {
  return <View style={styles.wrap}>{profile?.journey?.departureDate ? <JourneyCard profile={profile} /> : <NearestDepartureCard packages={packages} />}</View>;
}

const styles = StyleSheet.create({
  wrap: { borderRadius: 20, ...shadowDark },
  card: { minHeight: 168, padding: 18, gap: 14, justifyContent: "space-between" },
  topRow: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  copy: { flex: 1, gap: 4 },
  eyebrow: { color: colors.gold, fontFamily: "Cinzel_600SemiBold", fontSize: 10, letterSpacing: 2.8 },
  title: { color: colors.white, fontFamily: "Cinzel_600SemiBold", fontSize: 18, lineHeight: 24 },
  meta: { color: "rgba(255,255,255,0.74)", fontFamily: "Montserrat_400Regular", fontSize: 12 },
  countdown: { width: 66, height: 66, borderRadius: 33, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "rgba(212,175,55,0.6)", backgroundColor: "rgba(212,175,55,0.08)" },
  countdownValue: { color: colors.softGold, fontFamily: "Cinzel_700Bold", fontSize: 22, lineHeight: 26 },
  countdownLabel: { color: "rgba(255,255,255,0.75)", fontFamily: "Montserrat_600SemiBold", fontSize: 9, letterSpacing: 1.5 },
  actions: { flexDirection: "row", gap: 10 },
  goldAction: { flex: 1, height: 44, borderRadius: 12, overflow: "hidden" },
  goldFill: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, borderRadius: 12, borderColor: "rgba(255,236,170,0.55)", borderWidth: 1 },
  goldText: { color: colors.navyDeep, fontFamily: "Montserrat_700Bold", fontSize: 12.5, letterSpacing: 0.6 },
  outlineAction: { height: 44, paddingHorizontal: 14, borderRadius: 12, flexDirection: "row", alignItems: "center", gap: 7, borderWidth: 1, borderColor: "rgba(212,175,55,0.45)" },
  outlineText: { color: colors.softGold, fontFamily: "Montserrat_600SemiBold", fontSize: 12.5 },
});
