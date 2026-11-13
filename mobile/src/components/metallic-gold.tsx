import type { PropsWithChildren } from "react";
import { type StyleProp, type ViewStyle } from "react-native";
import { GlassSurface } from "@/components/glass";

export function MetallicGold({ children, style }: PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) {
  return <GlassSurface variant="gold" style={style}>{children}</GlassSurface>;
}
