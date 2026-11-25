import type { PropsWithChildren } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { gradients } from "@/theme";

/** Glossy vertical gold surface (client reference): light top, deep bottom, thin white highlight on the top edge. */
export function MetallicGold({ children, style }: PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) {
  return (
    <View style={[styles.surface, style]}>
      <LinearGradient colors={gradients.gold} locations={gradients.goldLocations} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={StyleSheet.absoluteFill} />
      <LinearGradient
        colors={gradients.goldHighlight}
        locations={gradients.goldHighlightLocations}
        pointerEvents="none"
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View pointerEvents="none" style={styles.edge} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  surface: { overflow: "hidden", borderColor: "rgba(170,120,15,0.35)", borderWidth: StyleSheet.hairlineWidth },
  edge: { position: "absolute", top: 0, left: 6, right: 6, height: 1, backgroundColor: "rgba(255,255,255,0.75)" },
});
