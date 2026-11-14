import type { PropsWithChildren } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { gradients } from "@/theme";

export function MetallicGold({ children, style }: PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) {
  return (
    <View style={[styles.surface, style]}>
      <LinearGradient
        colors={gradients.gold}
        locations={gradients.goldLocations}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={gradients.goldHighlight}
        locations={gradients.goldHighlightLocations}
        pointerEvents="none"
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  surface: {
    overflow: "hidden",
    borderColor: "rgba(140,103,8,0.42)",
    borderWidth: StyleSheet.hairlineWidth,
  },
});
