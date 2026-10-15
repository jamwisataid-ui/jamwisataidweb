import { Image, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import heroImage from "../../../assets/home/hero-makkah-cinematic.jpg";

export function HeroBanner() {
  return (
    <View style={styles.hero}>
      <Image alt="Ka'bah dan Masjidil Haram" source={heroImage} resizeMode="cover" style={styles.image} />
      <LinearGradient
        colors={["rgba(6,21,43,0.18)", "rgba(10,29,58,0.88)"]}
        start={{ x: 0.7, y: 0 }}
        end={{ x: 0.1, y: 1 }}
        style={styles.overlay}
      >
        <View style={styles.copy}>
          <Text style={styles.eyebrow}>UMROH BERSAMA</Text>
          <Text style={styles.brand}>JAM WISATA</Text>
          <Text style={styles.tagline}>Setiap Waktu Bernilai Ibadah</Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { width: "100%", aspectRatio: 3, borderRadius: 20, overflow: "hidden", backgroundColor: "#0A1D3A" },
  image: { width: "100%", aspectRatio: 3 },
  overlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    justifyContent: "flex-end",
    padding: 18,
  },
  copy: { gap: 2, maxWidth: "72%" },
  eyebrow: { color: "#D4AF37", fontFamily: "Montserrat_700Bold", fontSize: 10, letterSpacing: 1.8 },
  brand: { color: "#FFFFFF", fontFamily: "Cinzel_700Bold", fontSize: 26, lineHeight: 31 },
  tagline: { color: "rgba(255,255,255,0.86)", fontFamily: "CormorantGaramond_600SemiBold", fontSize: 16, lineHeight: 19 },
});
