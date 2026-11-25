import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import lockup from "../../../assets/home/v3/logo-lockup-putih.png";
import { useNextPrayer } from "@/lib/use-next-prayer";
import { colors, glowGold } from "@/theme";

/**
 * Header overlay for Beranda v3 (client reference). Children are positioned absolutely
 * with y measured from the top of a 390×844 artboard; `top` shifts everything on taller/shorter screens.
 */

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toLocaleUpperCase("id-ID") ?? "").join("");
}

function HeaderButton({ icon, label, onPress, style, children }: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void; style: object; children?: React.ReactNode }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} hitSlop={6} onPress={onPress} style={({ pressed }) => [styles.headerButton, style, pressed && { opacity: 0.8 }]}>
      <Ionicons name={icon} size={18} color="#F2CE5E" />
      {children}
    </Pressable>
  );
}

function PrayerPill({ top }: { top: number }) {
  const next = useNextPrayer();
  if (!next) return null;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Sholat berikutnya ${next.name} pukul ${next.time} di ${next.city}`}
      onPress={() => router.push("/prayer-times")}
      style={[styles.prayer, { top }]}
    >
      <Ionicons name="moon" size={15} color="#F2CE5E" />
      <Text numberOfLines={1} style={styles.prayerText}>{next.name} <Text style={styles.prayerTime}>{next.time}</Text> · {next.city} · {next.remaining}</Text>
      <Ionicons name="chevron-forward" size={12} color="rgba(255,255,255,0.85)" />
    </Pressable>
  );
}

export function HomeHeader({ top, name, unreadCount, guest, verified }: { top: number; name?: string | null; unreadCount: number; guest: boolean; verified?: boolean }) {
  const y = (value: number) => top + value;
  return (
    <>
      <Image alt="Jaris Ammar Madani — JAM WISATA" source={lockup} resizeMode="contain" style={[styles.lockup, { top: y(92) }]} />

      {guest ? (
        <>
          <HeaderButton icon="search-outline" label="Cari paket" onPress={() => router.push("/search")} style={{ top: y(102), right: 122 }} />
          <Pressable accessibilityRole="button" accessibilityLabel="Masuk" onPress={() => router.push("/login")} style={({ pressed }) => [styles.headerButton, styles.login, { top: y(102) }, pressed && { opacity: 0.8 }]}>
            <Ionicons name="person-outline" size={17} color="#F2CE5E" />
            <Text style={styles.loginText}>Masuk</Text>
          </Pressable>
          <Text style={[styles.salam, { top: y(144) }]}>Assalamu&apos;alaikum,</Text>
          <Text style={[styles.welcome, { top: y(165) }]}>SELAMAT DATANG</Text>
          <PrayerPill top={y(200)} />
        </>
      ) : (
        <>
          <HeaderButton icon="search-outline" label="Cari paket" onPress={() => router.push("/search")} style={{ top: y(102), right: 63 }} />
          <HeaderButton icon="notifications-outline" label={unreadCount ? `Notifikasi, ${unreadCount} belum dibaca` : "Notifikasi"} onPress={() => router.push("/(tabs)/notifications")} style={{ top: y(102), right: 16 }}>
            {unreadCount > 0 ? <View style={styles.dot} /> : null}
          </HeaderButton>
          <View style={[styles.avatar, { top: y(153) }]}><Text style={styles.avatarText}>{initials(name || "Jamaah")}</Text></View>
          <Text style={[styles.salam, styles.salamSmall, { top: y(149) }]}>Assalamu&apos;alaikum,</Text>
          <Text numberOfLines={1} style={[styles.name, { top: y(163) }]}>{name || "Jamaah Jam Wisata"}</Text>
          {verified ? (
            <View style={[styles.verified, { top: y(189) }]}>
              <View style={styles.verifiedCheck}><Ionicons name="checkmark" size={8} color="#F2CE5E" /></View>
              <Text style={styles.verifiedText}>Jamaah Terverifikasi</Text>
            </View>
          ) : null}
          <PrayerPill top={y(210)} />
        </>
      )}
    </>
  );
}

const textShadow = { textShadowColor: "rgba(0,10,30,0.55)", textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 };

const styles = StyleSheet.create({
  lockup: { position: "absolute", left: 21, width: 185, height: 55 },
  headerButton: { position: "absolute", width: 37, height: 37, borderRadius: 19, alignItems: "center", justifyContent: "center", borderWidth: 1.6, borderColor: colors.goldBorder, backgroundColor: "rgba(4,22,52,0.42)", ...glowGold, shadowOpacity: 0.45, shadowRadius: 8, elevation: 0 },
  login: { right: 16, width: 95, height: 35, borderRadius: 18, flexDirection: "row", gap: 7 },
  loginText: { color: colors.white, fontFamily: "Montserrat_500Medium", fontSize: 14 },
  dot: { position: "absolute", top: 6, right: 7, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.notification },
  salam: { position: "absolute", left: 23, color: colors.softGold, fontFamily: "CormorantGaramond_600SemiBold_Italic", fontSize: 17, lineHeight: 20, ...textShadow },
  salamSmall: { left: 74, fontSize: 15, lineHeight: 17 },
  welcome: { position: "absolute", left: 23, color: colors.white, fontFamily: "Cinzel_700Bold", fontSize: 19.5, lineHeight: 24, ...textShadow },
  avatar: { position: "absolute", left: 21, width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: colors.goldBorder, backgroundColor: "#0B2A55" },
  avatarText: { color: "#F2CE5E", fontFamily: "Cinzel_700Bold", fontSize: 16 },
  name: { position: "absolute", left: 74, right: 120, color: colors.white, fontFamily: "CormorantGaramond_700Bold", fontSize: 22, lineHeight: 24, ...textShadow },
  verified: { position: "absolute", left: 74, height: 16, paddingLeft: 3, paddingRight: 8, borderRadius: 8, flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#F2D06B" },
  verifiedCheck: { width: 11, height: 11, borderRadius: 6, alignItems: "center", justifyContent: "center", backgroundColor: "#0B2A55" },
  verifiedText: { color: "#0B1F3F", fontFamily: "Montserrat_700Bold", fontSize: 8.5 },
  prayer: { position: "absolute", left: 17, maxWidth: 300, height: 26, paddingLeft: 9, paddingRight: 8, borderRadius: 13, flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "rgba(3,16,40,0.58)", borderWidth: 1, borderColor: "rgba(226,188,85,0.6)" },
  prayerText: { flexShrink: 1, color: colors.white, fontFamily: "Montserrat_400Regular", fontSize: 11 },
  prayerTime: { color: "#F2CE5E", fontFamily: "Montserrat_700Bold" },
});
