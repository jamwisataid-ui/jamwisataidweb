import { useRef, useState } from "react";
import { FlatList, Image, Pressable, StyleSheet, Text, useWindowDimensions, View, type NativeScrollEvent, type NativeSyntheticEvent } from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useQuery } from "@tanstack/react-query";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuthStore } from "@/lib/auth-store";
import { defaultOnboardingSlides, fetchOnboardingSlides, type OnboardingSlide } from "@/lib/onboarding";
import { colors, shadow } from "@/theme";

function Slide({ item, width, height }: { item: OnboardingSlide; width: number; height: number }) {
  const compact = height < 720;
  const heroHeight = Math.min(Math.max(height * (compact ? 0.43 : 0.48), 300), 460);
  return <View style={[styles.slide, { width }]}><View style={[styles.hero, { height: heroHeight }]}><Image source={item.image} resizeMode="cover" style={StyleSheet.absoluteFill} /><LinearGradient colors={["transparent", "rgba(255,249,240,0.28)", "#FFF9F0"]} locations={[0.62, 0.82, 1]} style={StyleSheet.absoluteFill} /></View><View style={[styles.copy, compact && styles.copyCompact]}><Text style={[styles.title, compact && styles.titleCompact]}>{item.title}</Text><Text style={[styles.description, compact && styles.descriptionCompact]}>{item.description}</Text></View></View>;
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

  return <SafeAreaView style={styles.safe}><View style={[styles.container, { width }]}><FlatList ref={list} horizontal pagingEnabled bounces={false} showsHorizontalScrollIndicator={false} data={slides} keyExtractor={(item) => item.id} renderItem={({ item }) => <Slide item={item} width={width} height={height} />} onMomentumScrollEnd={onMomentumScrollEnd} getItemLayout={(_, itemIndex) => ({ length: width, offset: width * itemIndex, index: itemIndex })} /><Pressable accessibilityRole="button" onPress={() => void finish()} style={styles.skip}><Text style={styles.skipText}>Lewati</Text></Pressable><View style={styles.controls}><View accessibilityLabel={`Slide ${index + 1} dari ${slides.length}`} style={styles.dots}>{slides.map((slide, dotIndex) => <View key={slide.id} style={[styles.dot, dotIndex === index && styles.dotActive]} />)}</View><Pressable accessibilityRole="button" onPress={next} style={({ pressed }) => [styles.button, pressed && { opacity: 0.9 }]}><LinearGradient colors={["#F7C65A", "#DFAE36"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.buttonGradient}><Text style={styles.buttonText}>{index === slides.length - 1 ? "Mulai Sekarang →" : slides[index]?.ctaLabel || "Selanjutnya →"}</Text></LinearGradient></Pressable></View></View></SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, alignItems: "center", backgroundColor: "#FFF9F0" },
  container: { flex: 1, position: "relative", overflow: "hidden", backgroundColor: "#FFF9F0" },
  slide: { flex: 1 }, hero: { width: "100%", overflow: "hidden" },
  copy: { paddingHorizontal: 24, paddingTop: 12, gap: 13 }, copyCompact: { paddingTop: 7, gap: 8 },
  title: { color: colors.navy, fontFamily: "PlayfairDisplay_700Bold", fontSize: 32, lineHeight: 38 }, titleCompact: { fontSize: 27, lineHeight: 32 },
  description: { color: colors.muted, fontFamily: "DMSans_400Regular", fontSize: 16, lineHeight: 24 }, descriptionCompact: { fontSize: 14, lineHeight: 20 },
  skip: { position: "absolute", top: 12, right: 20, zIndex: 3, paddingHorizontal: 13, paddingVertical: 9, borderRadius: 18, backgroundColor: "rgba(255,249,240,0.82)" }, skipText: { color: colors.navy, fontFamily: "DMSans_700Bold", fontSize: 14 },
  controls: { position: "absolute", left: 20, right: 20, bottom: 18, gap: 17 }, dots: { height: 10, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9 },
  dot: { width: 8, height: 8, borderRadius: 8, backgroundColor: "#D7D1C7" }, dotActive: { width: 22, backgroundColor: colors.navy },
  button: { width: "100%", borderRadius: 24, overflow: "hidden", ...shadow }, buttonGradient: { minHeight: 56, alignItems: "center", justifyContent: "center", paddingHorizontal: 20 }, buttonText: { color: colors.navy, fontFamily: "DMSans_700Bold", fontSize: 16 },
});
