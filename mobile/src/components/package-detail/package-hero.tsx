import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Image, Pressable, Share, StyleSheet, View, useWindowDimensions } from "react-native";
import { router } from "expo-router";

import { colors } from "@/theme";
import type { Package } from "@/types";

function FloatingAction({ icon, label, onPress }: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void }) {
  return (
    <Pressable accessibilityLabel={label} accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.action, pressed && styles.pressed]}>
      <Ionicons name={icon} size={22} color={colors.white} />
    </Pressable>
  );
}

export function PackageHero({ item, favorite, onToggleFavorite }: { item: Package; favorite: boolean; onToggleFavorite: () => void }) {
  const { width } = useWindowDimensions();
  const height = Math.min(Math.max(width * 0.68, 260), 320);
  const share = () => void Share.share({
    title: item.name,
    message: `${item.name}\nHarga mulai ${item.priceFrom ? `Rp${new Intl.NumberFormat("id-ID").format(item.priceFrom)}/jamaah` : "hubungi JAM WISATA"}\nJAM WISATA\nhttps://jamwisata.id/paket-umroh/${item.slug}`,
  });

  return (
    <View style={[styles.hero, { height }]}>
      <Image alt={item.name} source={{ uri: item.image }} resizeMode="cover" style={styles.image} />
      <LinearGradient colors={["rgba(10,29,58,0.55)", "transparent", "rgba(10,29,58,0.32)"]} locations={[0, 0.42, 1]} style={StyleSheet.absoluteFill} />
      <View style={styles.controls}>
        <FloatingAction icon="arrow-back" label="Kembali" onPress={() => router.back()} />
        <View style={styles.rightControls}>
          <FloatingAction icon={favorite ? "heart" : "heart-outline"} label={favorite ? "Hapus dari favorit" : "Tambahkan ke favorit"} onPress={onToggleFavorite} />
          <FloatingAction icon="share-social-outline" label="Bagikan paket" onPress={share} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { width: "100%", position: "relative", overflow: "hidden", backgroundColor: "#D9E1E7" },
  image: { width: "100%", height: "100%" },
  controls: { position: "absolute", top: 12, left: 16, right: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  rightControls: { flexDirection: "row", gap: 9 },
  action: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,35,65,0.48)", borderWidth: 1, borderColor: "rgba(255,255,255,0.28)" },
  pressed: { opacity: 0.72, transform: [{ scale: 0.96 }] },
});
