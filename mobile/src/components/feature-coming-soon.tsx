import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { Button, Card, Screen, Title } from "@/components/ui";
import { colors } from "@/theme";

export function FeatureComingSoon({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <Screen>
      <Title subtitle="Fitur jamaah JAM WISATA">{title}</Title>
      <Card>
        <View style={styles.icon}><Ionicons name={icon} size={30} color={colors.gold} /></View>
        <Text style={styles.heading}>Sedang kami siapkan</Text>
        <Text style={styles.copy}>{description}</Text>
        <Button label="Kembali ke Beranda" onPress={() => router.replace("/(tabs)")} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  icon: { width: 60, height: 60, borderRadius: 20, alignItems: "center", justifyContent: "center", backgroundColor: "#FFF2D8" },
  heading: { color: colors.navy, fontFamily: "PlayfairDisplay_700Bold", fontSize: 22 },
  copy: { color: colors.muted, fontFamily: "DMSans_400Regular", fontSize: 15, lineHeight: 23 },
});
