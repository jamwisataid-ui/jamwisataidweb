import { useRef, useState } from "react";
import { FlatList, Image, Pressable, StyleSheet, Text, useWindowDimensions, View, type NativeScrollEvent, type NativeSyntheticEvent } from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useQuery } from "@tanstack/react-query";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuthStore } from "@/lib/auth-store";
import { defaultOnboardingSlides, fetchOnboardingSlides, type OnboardingSlide } from "@/lib/onboarding";
import { colors, gradients, shadow } from "@/theme";

function Slide({ item, width, height }: { item: OnboardingSlide; width: number; height: number }) {
  const compact = height < 720;
  const heroHeight = Math.min(Math.max(height * (compact ? 0.43 : 0.48), 300), 460);
  return <View style={[styles.slide, { width }]}><View style={[styles.hero, { height: heroHeight }]}><Image alt="" source={item.image} resizeMode="cover" style={StyleSheet.absoluteFill} /><LinearGradient colors={["transparent", "rgba(255,255,255,0.28)", "#FFFFFF"]} locations={[0.62, 0.82, 1]} style={StyleSheet.absoluteFill} /></View><View style={[styles.copy, compact && styles.copyCompact]}><Text style={[styles.title, compact && styles.titleCompact]}>{item.title}</Text><Text style={[styles.description, compact && styles.descriptionCompact]}>{item.description}</Text></View></View>;
}

export default function OnboardingScreen() {
  const { width: screenWidth, height } = useWindowDimensions();
  const width = Math.min(screenWidth, 480);
  const list = useRef<FlatList<OnboardingSlide>>(null);
  const [index, setIndex] = useState(0);
  const complete = useAuthStore((state) => state.completeOnboarding);
  const query = useQuery({ queryKey: ["onboarding"], queryFn: fetchOnboardingSlides, staleTime: 5 * 60_000 });
  const slides = query.data?.length ? query.data : defaultOnboardingSlides;
  const finish = async () => {
    await complete();
    router.replace("/(tabs)");
  };
  const next = () => { if (index >= slides.length - 1) { void finish(); return; } list.current?.scrollToIndex({ index: index + 1, animated: true }); setIndex(index + 1); };
  const onMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => setIndex(Math.round(event.nativeEvent.contentOffset.x / width));

  return <SafeAreaView style={styles.safe}><View style={[styles.container, { width }]}><FlatList ref={list} horizontal pagingEnabled bounces={false} showsHorizontalScrollIndicator={false} data={slides} keyExtractor={(item) => item.id} renderItem={({ item }) => <Slide item={item} width={width} height={height} />} onMomentumScrollEnd={onMomentumScrollEnd} getItemLayout={(_, itemIndex) => ({ length: width, offset: width * itemIndex, index: itemIndex })} /><Pressable accessibilityRole="button" onPress={() => void finish()} style={styles.skip}><Text style={styles.skipText}>Lewati</Text></Pressable><View style={styles.controls}><View accessibilityLabel={`Slide ${index + 1} dari ${slides.length}`} style={styles.dots}>{slides.map((slide, dotIndex) => <View key={slide.id} style={[styles.dot, dotIndex === index && styles.dotActive]} />)}</View><Pressable accessibilityRole="button" onPress={next} style={({ pressed }) => [styles.button, pressed && { opacity: 0.9 }]}><LinearGradient colors={gradients.gold} locations={gradients.goldLocations} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.buttonGradient}><LinearGradient colors={gradients.goldHighlight} locations={gradients.goldHighlightLocations} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} /><Text style={styles.buttonText}>{index === slides.length - 1 ? "MULAI JELAJAHI" : (slides[index]?.ctaLabel || "Selanjutnya →").replace(/\s*→$/, "").toLocaleUpperCase("id-ID")}</Text></LinearGradient></Pressable><Pressable accessibilityRole="link" hitSlop={8} onPress={() => { void complete().then(() => router.replace("/login")); }}><Text style={styles.loginLink}>Sudah punya akun? <Text style={styles.loginStrong}>Masuk</Text></Text></Pressable></View></View></SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, alignItems: "center", backgroundColor: "#FFFFFF" },
  container: { flex: 1, position: "relative", overflow: "hidden", backgroundColor: "#FFFFFF" },
  slide: { flex: 1 }, hero: { width: "100%", overflow: "hidden" },
  copy: { paddingHorizontal: 24, paddingTop: 12, gap: 13 }, copyCompact: { paddingTop: 7, gap: 8 },
  title: { color: colors.navy, fontFamily: "Cinzel_700Bold", fontSize: 32, lineHeight: 38 }, titleCompact: { fontSize: 27, lineHeight: 32 },
  description: { color: colors.muted, fontFamily: "Montserrat_400Regular", fontSize: 16, lineHeight: 24 }, descriptionCompact: { fontSize: 14, lineHeight: 20 },
  skip: { position: "absolute", top: 12, right: 20, zIndex: 3, paddingHorizontal: 16, paddingVertical: 9, borderRadius: 18, backgroundColor: "rgba(6,21,43,0.45)", borderWidth: 1, borderColor: "rgba(255,255,255,0.25)" }, skipText: { color: colors.white, fontFamily: "Montserrat_600SemiBold", fontSize: 13 },
  controls: { position: "absolute", left: 22, right: 22, bottom: 16, gap: 14 }, dots: { height: 10, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9 },
  dot: { width: 8, height: 3, borderRadius: 2, backgroundColor: "rgba(10,29,58,0.18)" }, dotActive: { width: 24, backgroundColor: colors.gold },
  button: { width: "100%", borderRadius: 12, ...shadow }, buttonGradient: { minHeight: 56, borderRadius: 12, alignItems: "center", justifyContent: "center", paddingHorizontal: 20 }, buttonText: { color: colors.navyDeep, fontFamily: "Montserrat_700Bold", fontSize: 14.5, letterSpacing: 1 },
  loginLink: { color: colors.muted, fontFamily: "Montserrat_400Regular", fontSize: 13, textAlign: "center" }, loginStrong: { color: colors.goldText, fontFamily: "Montserrat_700Bold" },
});
