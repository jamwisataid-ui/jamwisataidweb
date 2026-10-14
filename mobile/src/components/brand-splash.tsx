import { useEffect, useRef } from "react";
import { Animated, Image, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

const pattern = require("../../assets/splash/islamic-pattern.jpg");
const kaaba = require("../../assets/splash/kaaba-masjidil-haram.jpg");
const emblem = require("../../assets/splash/logo-emblem.png");

export function BrandSplash({ ready, onFinished }: { ready: boolean; onFinished: () => void }) {
  const { width, height } = useWindowDimensions();
  const compact = height < 720;
  const progress = useRef(new Animated.Value(0.08)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(progress, { toValue: 0.86, duration: 1800, useNativeDriver: false }).start();
  }, [progress]);

  useEffect(() => {
    if (!ready) return;
    Animated.sequence([
      Animated.timing(progress, { toValue: 1, duration: 280, useNativeDriver: false }),
      Animated.delay(160),
      Animated.timing(opacity, { toValue: 0, duration: 320, useNativeDriver: true }),
    ]).start(({ finished }) => { if (finished) onFinished(); });
  }, [onFinished, opacity, progress, ready]);

  const logoWidth = Math.min(width * (compact ? 0.58 : 0.64), 310);
  const emblemSize = Math.min(width * (compact ? 0.22 : 0.27), compact ? 92 : 122);
  const progressWidth = Math.min(Math.max(width * 0.36, 124), 154);
  const kaabaHeight = height * (compact ? 0.7 : 0.68);

  return <Animated.View accessibilityLabel="Memuat aplikasi Jam Wisata" style={[styles.root, { opacity }]}>
    <StatusBar style="light" />
    <LinearGradient colors={["#003E73", "#00355F", "#002B50"]} locations={[0, 0.5, 1]} style={StyleSheet.absoluteFill} />
    <Image source={pattern} resizeMode="cover" style={[styles.pattern, { height: height * 0.57 }]} />
    <View style={[styles.kaabaLayer, { width, height: kaabaHeight }]}>
      <Image source={kaaba} resizeMode="cover" style={[styles.kaabaImage, { width, height: kaabaHeight }]} />
      <LinearGradient colors={["#00355F", "rgba(0,53,95,0.82)", "rgba(0,47,85,0.2)", "transparent"]} locations={[0, 0.22, 0.48, 0.7]} style={styles.imageBlend} />
      <LinearGradient colors={["transparent", "rgba(0,30,58,0.34)"]} style={StyleSheet.absoluteFill} />
    </View>
    <SafeAreaView pointerEvents="none" style={styles.safe}>
      <View style={[styles.logoArea, { top: compact ? "16%" : "20%", width: logoWidth }]}>
        <Image source={emblem} resizeMode="contain" style={{ width: emblemSize, height: emblemSize }} />
        <Text style={[styles.eyebrow, compact && styles.eyebrowCompact]}>JARIS AMMAR MADANI</Text>
        <Text adjustsFontSizeToFit numberOfLines={1} style={[styles.brand, compact && styles.brandCompact]}>JAM WISATA</Text>
        <View style={styles.taglineRow}>
          <View style={styles.goldLine} />
          <Text adjustsFontSizeToFit numberOfLines={1} style={styles.tagline}>“Setiap Waktu Bernilai Ibadah”</Text>
          <View style={styles.goldLine} />
        </View>
      </View>
      <View style={styles.progressWrap}>
        <View style={[styles.progressTrack, { width: progressWidth }]}>
          <Animated.View style={[styles.progressFill, { width: progress.interpolate({ inputRange: [0, 1], outputRange: [0, progressWidth] }) }]} />
        </View>
      </View>
    </SafeAreaView>
  </Animated.View>;
}

const styles = StyleSheet.create({
  root: { flex: 1, width: "100%", backgroundColor: "#00355F", overflow: "hidden" },
  safe: { flex: 1, width: "100%", alignItems: "center" },
  pattern: { position: "absolute", top: 0, left: 0, right: 0, width: "100%", opacity: 0.34 },
  kaabaLayer: { position: "absolute", left: 0, right: 0, bottom: 0, overflow: "hidden" },
  kaabaImage: { position: "absolute", left: 0, top: 0 },
  imageBlend: { position: "absolute", top: 0, left: 0, right: 0, height: "58%" },
  logoArea: { position: "absolute", alignItems: "center" },
  eyebrow: { marginTop: 8, color: "#FFFFFF", fontFamily: "DMSans_500Medium", fontSize: 12, letterSpacing: 2.2, textAlign: "center" },
  eyebrowCompact: { marginTop: 4, fontSize: 10 },
  brand: { marginTop: 1, color: "#FFFFFF", fontFamily: "PlayfairDisplay_700Bold", fontSize: 38, letterSpacing: 1, textAlign: "center" },
  brandCompact: { fontSize: 31 },
  taglineRow: { marginTop: 5, width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  tagline: { flexShrink: 1, color: "#F3B93F", fontFamily: "DMSans_500Medium", fontSize: 12, fontStyle: "italic", textAlign: "center" },
  goldLine: { width: 24, height: 1, backgroundColor: "#DFAE36" },
  progressWrap: { position: "absolute", left: 0, right: 0, bottom: 30, alignItems: "center" },
  progressTrack: { height: 5, borderRadius: 99, overflow: "hidden", backgroundColor: "rgba(151,193,220,0.3)" },
  progressFill: { height: "100%", borderRadius: 99, backgroundColor: "#F3B93F" },
});
