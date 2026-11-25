import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import { FlatList, Image, Linking, StyleSheet, Text, View, type NativeScrollEvent, type NativeSyntheticEvent } from "react-native";

import fallbackImage from "../../../assets/home/v3/kartu-paket-contoh.jpg";
import overlay from "../../../assets/home/v3/kartu-overlay-gelombang.png";
import { MetallicGold } from "@/components/metallic-gold";
import { PressableScale } from "@/components/motion";
import { flattenPackageDepartures } from "@/lib/package-departures";
import { colors, glowGold, gradients, shadowDark } from "@/theme";
import type { Package } from "@/types";

const consultUrl = "https://wa.me/6281809627499?text=Assalamu%27alaikum%2C%20saya%20ingin%20konsultasi%20paket%20umroh%20JAM%20WISATA.";

export const HIGHLIGHT_HEIGHT = 199;

type Slide = { key: string; label: string; title: string; subtitle: string; image?: string; slug?: string };

function formatDate(isoDate: string) {
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jakarta" }).format(new Date(`${isoDate}T00:00:00+07:00`));
}

/** One slide per featured package: its nearest open departure, in date order. */
function buildSlides(packages?: Package[]): Slide[] {
  const today = new Date().toISOString().slice(0, 10);
  const seen = new Set<string>();
  const slides: Slide[] = [];
  for (const { packageItem, departure } of flattenPackageDepartures(packages)) {
    if (!departure.selectable || seen.has(packageItem.id)) continue;
    const iso = /^\d{4}-\d{2}-\d{2}$/.test(departure.departureDate) ? departure.departureDate : null;
    if (iso && iso < today) continue;
    seen.add(packageItem.id);
    slides.push({
      key: packageItem.id,
      label: slides.length === 0 ? "KEBERANGKATAN TERDEKAT" : "PAKET PILIHAN",
      title: (iso ? formatDate(iso) : departure.dateLabel).toLocaleUpperCase("id-ID"),
      subtitle: packageItem.name,
      image: packageItem.image || undefined,
      slug: packageItem.id,
    });
    if (slides.length === 4) break;
  }
  return slides.length ? slides : [{ key: "consult", label: "UMROH BERSAMA JAM WISATA", title: "SETIAP WAKTU BERNILAI IBADAH", subtitle: "Jadwal keberangkatan sedang diperbarui." }];
}

function SlideView({ slide, width }: { slide: Slide; width: number }) {
  return (
    <View style={{ width, height: HIGHLIGHT_HEIGHT }}>
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel={slide.slug ? `Lihat detail ${slide.subtitle}` : slide.title}
        disabled={!slide.slug}
        pressedScale={1}
        hoverLift={0}
        onPress={() => slide.slug && router.push({ pathname: "/package/[slug]", params: { slug: slide.slug } })}
        style={StyleSheet.absoluteFill}
      >
        <Image alt="" source={slide.image ? { uri: slide.image } : fallbackImage} resizeMode="cover" style={styles.photo} />
        <Image alt="" source={overlay} resizeMode="stretch" style={StyleSheet.absoluteFill} />
        <Ionicons name="calendar-outline" size={15} color="#EFCB66" style={styles.calendar} />
        <Text numberOfLines={1} style={styles.label}>{slide.label}</Text>
        <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.75} style={styles.title}>{slide.title}</Text>
        <Text numberOfLines={1} style={styles.subtitle}>{slide.subtitle}</Text>
      </PressableScale>
    </View>
  );
}

export function HighlightCarousel({ packages, width }: { packages?: Package[]; width: number }) {
  const slides = buildSlides(packages);
  const [page, setPage] = useState(0);
  const inner = width - 4; // 2pt gold border on each side
  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => setPage(Math.round(event.nativeEvent.contentOffset.x / inner));
  return (
    <View style={[styles.frame, { width }]}>
      <LinearGradient pointerEvents="none" colors={gradients.navyCard} locations={gradients.navyCardLocations} start={{ x: 0.3, y: 0 }} end={{ x: 0.7, y: 1 }} style={StyleSheet.absoluteFill} />
      <FlatList
        data={slides}
        keyExtractor={(item) => item.key}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScroll}
        onScroll={onScroll}
        scrollEventThrottle={64}
        renderItem={({ item }) => <SlideView slide={item} width={inner} />}
      />
      {slides.length > 1 ? (
        <View pointerEvents="none" style={styles.dots}>
          {slides.map((slide, index) => <View key={slide.key} style={index === page ? styles.dotActive : styles.dot} />)}
        </View>
      ) : null}
      <PressableScale accessibilityRole="button" onPress={() => router.push("/schedule")} containerStyle={styles.primaryWrap} style={styles.primary}>
        <MetallicGold style={styles.primaryFill}>
          <Ionicons name="calendar-outline" size={16} color="#0B1F3F" />
          <Text style={styles.primaryText}>LIHAT JADWAL</Text>
          <Ionicons name="arrow-forward" size={16} color="#0B1F3F" />
        </MetallicGold>
      </PressableScale>
      <PressableScale accessibilityRole="button" onPress={() => void Linking.openURL(consultUrl)} containerStyle={styles.secondaryWrap} style={styles.secondary}>
        <Ionicons name="logo-whatsapp" size={17} color={colors.white} />
        <Text style={styles.secondaryText}>Konsultasi</Text>
      </PressableScale>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { height: HIGHLIGHT_HEIGHT, borderRadius: 16, overflow: "hidden", borderWidth: 2, borderColor: colors.gold, backgroundColor: "#0A2850", ...shadowDark },
  photo: { position: "absolute", left: 0, right: 0, top: 53, height: 95 },
  calendar: { position: "absolute", left: 16, top: 10 },
  label: { position: "absolute", left: 41, right: 12, top: 11, color: "#EFCB66", fontFamily: "Cinzel_600SemiBold", fontSize: 9.5, letterSpacing: 3 },
  title: { position: "absolute", left: 15, right: 12, top: 25, color: colors.white, fontFamily: "Cinzel_700Bold", fontSize: 21.5, lineHeight: 27 },
  subtitle: { position: "absolute", left: 16, right: 12, top: 50, color: colors.white, fontFamily: "Montserrat_500Medium", fontSize: 14.3, lineHeight: 18 },
  dots: { position: "absolute", top: 136, left: 0, right: 0, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 4 },
  dot: { width: 5, height: 5, borderRadius: 3, backgroundColor: "rgba(255,255,255,0.75)" },
  dotActive: { width: 13, height: 5, borderRadius: 3, backgroundColor: "#F2C744" },
  primaryWrap: { position: "absolute", left: 11, top: 150, width: "52%" },
  primary: { height: 35, borderRadius: 10, backgroundColor: "#E2B640", ...glowGold, shadowOpacity: 0.45, shadowRadius: 10, elevation: 0 },
  primaryFill: { flex: 1, borderRadius: 10, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  primaryText: { color: "#0B1F3F", fontFamily: "Montserrat_700Bold", fontSize: 13, letterSpacing: 0.3 },
  secondaryWrap: { position: "absolute", right: 10, top: 150, width: "37.6%" },
  secondary: { height: 34, borderRadius: 10, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, borderWidth: 1.6, borderColor: colors.goldBorder, backgroundColor: "rgba(3,18,44,0.72)" },
  secondaryText: { color: colors.white, fontFamily: "Montserrat_500Medium", fontSize: 13 },
});
