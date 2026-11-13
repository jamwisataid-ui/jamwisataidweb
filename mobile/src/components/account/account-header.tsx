import { Image, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import heroImage from "../../../assets/home/hero-makkah-cinematic.jpg";
import { colors } from "@/theme";
import { GlassSurface } from "@/components/glass";

/** Dark header for the account tab; the profile/guest card overlaps its bottom edge by 51px. */
export function AccountHeader() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.header, { paddingTop: insets.top + 22, height: insets.top + 170 }]}>
      <Image alt="" source={heroImage} resizeMode="cover" style={styles.image} />
      <LinearGradient colors={["rgba(6,21,43,0.6)", "rgba(6,21,43,0.95)"]} style={StyleSheet.absoluteFill} />
      <GlassSurface variant="dark" radius={16} glow={false} style={styles.titleGlass}><Text style={styles.eyebrow}>AREA JAMAAH</Text><Text accessibilityRole="header" style={styles.title}>Akun Saya</Text></GlassSurface>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 22, gap: 4, overflow: "hidden", backgroundColor: colors.navyDeep },
  image: { position: "absolute", top: 0, right: -200, bottom: 0, width: 780, opacity: 0.4 },
  titleGlass: { alignSelf: "flex-start", paddingHorizontal: 14, paddingVertical: 10, gap: 2 },
  eyebrow: { color: colors.gold, fontFamily: "Cinzel_600SemiBold", fontSize: 10, letterSpacing: 3 },
  title: { color: colors.white, fontFamily: "Cinzel_700Bold", fontSize: 26, lineHeight: 32 },
});
