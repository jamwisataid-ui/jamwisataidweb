import { useEffect, useState } from "react";
import { Animated, Easing, Image, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

import kaabaNight from "../../assets/splash/kaaba-night.jpg";
import emblem from "../../assets/splash/logo-emblem.png";
import { MetallicGold } from "@/components/metallic-gold";
import { GoldOrnament } from "@/components/ui";
import { colors } from "@/theme";

/** Source ratio of kaaba-night.jpg (853×1844). */
const IMAGE_RATIO = 1844 / 853;

/**
 * Loading screen shown while fonts, session and first data load.
 * Cinematic night Ka'bah, brand lockup, and a thin metallic progress line — no buttons.
 */
export function BrandSplash({ ready, onFinished }: { ready: boolean; onFinished: () => void }) {
  const { width, height } = useWindowDimensions();
  const compact = height < 720;
  const [progress] = useState(() => new Animated.Value(0.08));
  const [opacity] = useState(() => new Animated.Value(1));
  const [reveal] = useState(() => new Animated.Value(0));
  const [zoom] = useState(() => new Animated.Value(1.08));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(progress, { toValue: 0.86, duration: 1800, useNativeDriver: false }),
      Animated.timing(reveal, { toValue: 1, duration: 900, delay: 120, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(zoom, { toValue: 1, duration: 2600, easing: Easing.out(Easing.quad), useNativeDriver: true }),
    ]).start();
  }, [progress, reveal, zoom]);

  useEffect(() => {
    if (!ready) return;
    Animated.sequence([
      Animated.timing(progress, { toValue: 1, duration: 280, useNativeDriver: false }),
      Animated.delay(200),
      Animated.timing(opacity, { toValue: 0, duration: 360, useNativeDriver: true }),
    ]).start(({ finished }) => { if (finished) onFinished(); });
  }, [onFinished, opacity, progress, ready]);

  const imageWidth = Math.max(width, height / IMAGE_RATIO);
  const imageHeight = imageWidth * IMAGE_RATIO;
  const emblemSize = Math.min(width * (compact ? 0.26 : 0.32), compact ? 104 : 132);
  const progressWidth = Math.min(Math.max(width * 0.34, 120), 150);
  const lift = reveal.interpolate({ inputRange: [0, 1], outputRange: [16, 0] });
  const emblemScale = reveal.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] });

  return (
    <Animated.View accessibilityLabel="Memuat aplikasi Jam Wisata" style={[styles.root, { opacity }]}>
      <StatusBar style="light" />
      <Animated.Image
        alt=""
        source={kaabaNight}
        resizeMode="cover"
        style={[styles.image, { width: imageWidth, height: imageHeight, left: (width - imageWidth) / 2, transform: [{ scale: zoom }] }]}
      />
      <LinearGradient
        colors={["rgba(6,21,43,0.62)", "rgba(6,21,43,0.08)", "rgba(6,21,43,0)", "rgba(6,21,43,0.7)", colors.navyDeep]}
        locations={[0, 0.36, 0.52, 0.82, 1]}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView pointerEvents="none" style={styles.safe}>
        <Animated.View style={[styles.lockup, { top: compact ? "11%" : "15%", opacity: reveal, transform: [{ translateY: lift }] }]}>
          <Animated.View style={{ transform: [{ scale: emblemScale }] }}>
            <Image alt="Emblem Jam Wisata" source={emblem} resizeMode="contain" style={{ width: emblemSize, height: emblemSize }} />
          </Animated.View>
          <Text style={[styles.kicker, compact && styles.kickerCompact]}>Jaris Ammar Madani</Text>
          <Text adjustsFontSizeToFit numberOfLines={1} style={[styles.brand, compact && styles.brandCompact]}>JAM WISATA</Text>
          <View style={styles.ornament}><GoldOrnament width={44} /></View>
          <Text adjustsFontSizeToFit numberOfLines={1} style={styles.tagline}>SETIAP WAKTU BERNILAI IBADAH</Text>
        </Animated.View>
        <View style={styles.progressWrap}>
          <View style={[styles.progressTrack, { width: progressWidth }]}>
            <Animated.View style={[styles.progressFill, { width: progress.interpolate({ inputRange: [0, 1], outputRange: [0, progressWidth] }) }]}>
              <MetallicGold style={styles.progressGold} />
            </Animated.View>
          </View>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, width: "100%", backgroundColor: colors.navyDeep, overflow: "hidden" },
  image: { position: "absolute", bottom: 0 },
  safe: { flex: 1, width: "100%", alignItems: "center" },
  lockup: { position: "absolute", left: 24, right: 24, alignItems: "center", gap: 6 },
  kicker: { marginTop: 10, color: colors.softGold, fontFamily: "CormorantGaramond_500Medium_Italic", fontSize: 20, letterSpacing: 0.4, textAlign: "center" },
  kickerCompact: { marginTop: 6, fontSize: 17 },
  brand: { color: colors.white, fontFamily: "Cinzel_700Bold", fontSize: 40, lineHeight: 46, letterSpacing: 6, textAlign: "center" },
  brandCompact: { fontSize: 33, lineHeight: 39, letterSpacing: 5 },
  ornament: { marginTop: 2 },
  tagline: { marginTop: 2, color: "rgba(255,255,255,0.84)", fontFamily: "Cinzel_600SemiBold", fontSize: 11, letterSpacing: 4, textAlign: "center" },
  progressWrap: { position: "absolute", left: 0, right: 0, bottom: 48, alignItems: "center" },
  progressTrack: { height: 2, borderRadius: 2, overflow: "hidden", backgroundColor: "rgba(255,255,255,0.16)" },
  progressFill: { height: "100%", overflow: "hidden" },
  progressGold: { flex: 1, borderWidth: 0 },
});
