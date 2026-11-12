import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import heroImage from "../../../assets/home/hero-makkah-cinematic.jpg";
import emblem from "../../../assets/splash/logo-emblem.png";
import { CircleButton } from "@/components/ui";
import { GlassSurface } from "@/components/glass";
import { useNextPrayer } from "@/lib/use-next-prayer";
import { colors } from "@/theme";

/** Height of the dark header area below the safe-area inset; the highlight card overlaps its bottom. */
export const HOME_HEADER_HEIGHT = 250;

function NextPrayerChip() {
  const next = useNextPrayer();
  if (!next) return null;
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`Sholat berikutnya ${next.name} pukul ${next.time} di ${next.city}`} onPress={() => router.push("/prayer-times")} style={styles.chipWrap}>
      <GlassSurface variant="dark" radius={999} style={styles.chip}>
        <View style={styles.chipInner}>
          <Ionicons name="moon" size={13} color={colors.gold} />
          <Text numberOfLines={1} style={styles.chipText}>{next.name} <Text style={styles.chipStrong}>{next.time}</Text> · {next.city} · {next.remaining}</Text>
        </View>
      </GlassSurface>
    </Pressable>
  );
}

export function HomeHeader({ name, unreadCount, guest }: { name?: string | null; unreadCount: number; guest: boolean }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.root, { paddingTop: insets.top + 14, height: insets.top + HOME_HEADER_HEIGHT }]}>
      <Image alt="" source={heroImage} resizeMode="cover" style={styles.image} />
      <LinearGradient colors={["rgba(6,21,43,0.86)", "rgba(6,21,43,0.4)", "rgba(6,21,43,0.94)"]} locations={[0, 0.45, 1]} style={StyleSheet.absoluteFill} />
      <View style={styles.row}>
        <Image alt="" source={emblem} resizeMode="contain" style={styles.emblem} />
        <View style={styles.greeting}>
          <Text style={styles.salam}>Assalamu&apos;alaikum,</Text>
          <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8} style={styles.name}>{name || "Selamat Datang"}</Text>
        </View>
        <CircleButton dark icon="search-outline" label="Cari paket" onPress={() => router.push("/search")} />
        {guest ? (
          <Pressable accessibilityRole="button" onPress={() => router.push("/login")} style={({ pressed }) => [pressed && { opacity: 0.75 }]}>
            <GlassSurface variant="dark" baseGoldTint radius={999} style={styles.login}>
              <View style={styles.loginInner}>
                <Ionicons name="person-outline" size={15} color={colors.softGold} />
                <Text style={styles.loginText}>Masuk</Text>
              </View>
            </GlassSurface>
          </Pressable>
        ) : (
          <CircleButton dark icon="notifications-outline" label={unreadCount ? `Notifikasi, ${unreadCount} belum dibaca` : "Notifikasi"} onPress={() => router.push("/(tabs)/notifications")}>
            {unreadCount > 0 ? <View style={styles.dot} /> : null}
          </CircleButton>
        )}
      </View>
      <NextPrayerChip />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { paddingHorizontal: 20, gap: 16, overflow: "hidden", backgroundColor: colors.navyDeep },
  image: { position: "absolute", top: 0, right: -140, bottom: 0, width: 760, opacity: 0.62 },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  emblem: { width: 42, height: 42 },
  greeting: { flex: 1, minWidth: 0 },
  salam: { color: colors.softGold, fontFamily: "CormorantGaramond_500Medium_Italic", fontSize: 16 },
  name: { color: colors.white, fontFamily: "Cinzel_600SemiBold", fontSize: 15 },
  login: { height: 40, borderRadius: 999 },
  loginInner: { height: 40, paddingHorizontal: 14, flexDirection: "row", alignItems: "center", gap: 6 },
  loginText: { color: colors.softGold, fontFamily: "Montserrat_600SemiBold", fontSize: 12.5 },
  dot: { position: "absolute", top: 10, right: 11, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.gold, borderWidth: 2, borderColor: colors.navy },
  chipWrap: { alignSelf: "flex-start", maxWidth: "100%" },
  chip: { height: 34, borderRadius: 999 },
  chipInner: { height: 34, paddingLeft: 12, paddingRight: 16, flexDirection: "row", alignItems: "center", gap: 7 },
  chipText: { flexShrink: 1, color: "rgba(255,255,255,0.86)", fontFamily: "Montserrat_400Regular", fontSize: 12 },
  chipStrong: { color: colors.softGold, fontFamily: "Montserrat_600SemiBold" },
});
