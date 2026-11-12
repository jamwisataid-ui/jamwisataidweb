import type { PropsWithChildren, ReactNode } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { gradients } from "@/theme";

export type GlassVariant = "dark" | "gold" | "pearl" | "navyOrb" | "navyCard" | "navyBar";

export interface GlassSurfaceProps {
  variant?: GlassVariant;
  radius?: number;
  style?: StyleProp<ViewStyle>;
  glow?: boolean;
  baseGoldTint?: boolean;
  diagonalShine?: boolean;
  borderWidth?: number;
  borderColor?: string;
  insetHighlight?: boolean;
  children?: ReactNode;
}

const variantConfig: Record<
  GlassVariant,
  {
    baseColors: readonly [string, string, ...string[]];
    baseLocations?: readonly [number, number, ...number[]];
    baseStart?: { x: number; y: number };
    baseEnd?: { x: number; y: number };
    specularColors: readonly [string, string, ...string[]];
    specularLocations?: readonly [number, number, ...number[]];
    specularHeight: string;
    reflectionColors: readonly [string, string, ...string[]];
    reflectionHeight: string;
    insetHighlightColor: string;
    borderColor: string;
    borderWidth: number;
    shadowColor: string;
    shadowOpacity: number;
    shadowRadius: number;
    shadowOffset: { width: number; height: number };
    elevation: number;
    fallbackBg: string;
    defaultRadius: number;
  }
> = {
  dark: {
    baseColors: ["#244673", "#122E54", "#06152B"],
    baseLocations: [0, 0.45, 1],
    baseStart: { x: 0, y: 0 },
    baseEnd: { x: 0.8, y: 1 },
    specularColors: ["rgba(255,255,255,0.42)", "rgba(255,255,255,0.10)", "transparent"],
    specularLocations: [0, 0.35, 0.6],
    specularHeight: "52%",
    reflectionColors: ["transparent", "rgba(212,175,55,0.20)"],
    reflectionHeight: "36%",
    insetHighlightColor: "rgba(255,255,255,0.55)",
    borderColor: "rgba(245,217,122,0.75)",
    borderWidth: 1,
    shadowColor: "#D4AF37",
    shadowOpacity: 0.32,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    fallbackBg: "#06152B",
    defaultRadius: 20,
  },
  gold: {
    baseColors: gradients.gold,
    baseLocations: gradients.goldLocations,
    baseStart: { x: 0, y: 0 },
    baseEnd: { x: 1, y: 1 },
    specularColors: ["rgba(255,255,255,0.85)", "rgba(255,255,255,0.30)", "transparent"],
    specularLocations: [0, 0.35, 0.58],
    specularHeight: "52%",
    reflectionColors: ["transparent", "rgba(255,235,170,0.48)"],
    reflectionHeight: "36%",
    insetHighlightColor: "rgba(255,255,255,0.85)",
    borderColor: "rgba(255,240,190,0.85)",
    borderWidth: 1.2,
    shadowColor: "#D4AF37",
    shadowOpacity: 0.42,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    fallbackBg: "#8C6708",
    defaultRadius: 999,
  },
  pearl: {
    baseColors: ["#FFFFFF", "#FAF5EA", "#EFE5CF", "#DCCBA4"],
    baseLocations: [0, 0.3, 0.68, 1],
    baseStart: { x: 0.15, y: 0 },
    baseEnd: { x: 0.85, y: 1 },
    specularColors: ["rgba(255,255,255,0.95)", "rgba(255,255,255,0.32)", "transparent"],
    specularLocations: [0, 0.35, 0.55],
    specularHeight: "48%",
    reflectionColors: ["transparent", "rgba(212,175,55,0.25)"],
    reflectionHeight: "36%",
    insetHighlightColor: "rgba(255,255,255,0.92)",
    borderColor: "rgba(232,201,103,0.85)",
    borderWidth: 1,
    shadowColor: "#B8860B",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    fallbackBg: "#EFE5CF",
    defaultRadius: 999,
  },
  navyOrb: {
    baseColors: ["#4470A8", "#1E3A5F", "#0E2443", "#06152B"],
    baseLocations: [0, 0.32, 0.68, 1],
    baseStart: { x: 0.2, y: 0 },
    baseEnd: { x: 0.8, y: 1 },
    specularColors: ["rgba(255,255,255,0.80)", "rgba(255,255,255,0.22)", "transparent"],
    specularLocations: [0, 0.35, 0.6],
    specularHeight: "50%",
    reflectionColors: ["transparent", "rgba(126,179,224,0.45)"],
    reflectionHeight: "36%",
    insetHighlightColor: "rgba(255,255,255,0.7)",
    borderColor: "#F5D97A",
    borderWidth: 1.2,
    shadowColor: "#D4AF37",
    shadowOpacity: 0.45,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
    fallbackBg: "#06152B",
    defaultRadius: 999,
  },
  navyCard: {
    baseColors: ["#31588A", "#12305A", "#06152B"],
    baseLocations: [0, 0.52, 1],
    baseStart: { x: 0.1, y: 0 },
    baseEnd: { x: 0.85, y: 1 },
    specularColors: ["rgba(255,255,255,0.38)", "rgba(255,255,255,0.08)", "transparent"],
    specularLocations: [0, 0.35, 0.55],
    specularHeight: "48%",
    reflectionColors: ["transparent", "rgba(212,175,55,0.18)"],
    reflectionHeight: "35%",
    insetHighlightColor: "rgba(255,255,255,0.55)",
    borderColor: "rgba(245,217,122,0.85)",
    borderWidth: 1.2,
    shadowColor: "#D4AF37",
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
    fallbackBg: "#06152B",
    defaultRadius: 24,
  },
  navyBar: {
    baseColors: ["rgba(49,88,138,0.92)", "rgba(18,48,90,0.95)", "rgba(6,21,43,0.97)"],
    baseLocations: [0, 0.45, 1],
    baseStart: { x: 0, y: 0 },
    baseEnd: { x: 0, y: 1 },
    specularColors: ["rgba(255,255,255,0.4)", "rgba(255,255,255,0.08)", "transparent"],
    specularLocations: [0, 0.32, 0.55],
    specularHeight: "45%",
    reflectionColors: ["transparent", "rgba(212,175,55,0.15)"],
    reflectionHeight: "35%",
    insetHighlightColor: "rgba(255,255,255,0.5)",
    borderColor: "rgba(245,217,122,0.75)",
    borderWidth: 1.2,
    shadowColor: "#D4AF37",
    shadowOpacity: 0.35,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
    fallbackBg: "#06152B",
    defaultRadius: 999,
  },
};

export function GlassSurface({
  variant = "dark",
  radius,
  style,
  glow = true,
  baseGoldTint = false,
  diagonalShine,
  borderWidth,
  borderColor,
  insetHighlight = true,
  children,
}: PropsWithChildren<GlassSurfaceProps>) {
  const cfg = variantConfig[variant];
  const finalRadius = radius ?? cfg.defaultRadius;
  const finalBorderWidth = borderWidth ?? cfg.borderWidth;
  const finalBorderColor = borderColor ?? cfg.borderColor;

  const baseColors =
    variant === "dark" && baseGoldTint
      ? (["#2A476F", "#173456", "#08172D"] as const)
      : cfg.baseColors;

  const showDiagonal = diagonalShine ?? (variant === "navyCard");

  return (
    <View
      style={[
        styles.surface,
        {
          borderRadius: finalRadius,
          borderWidth: finalBorderWidth,
          borderColor: finalBorderColor,
          backgroundColor: cfg.fallbackBg,
        },
        glow && {
          shadowColor: cfg.shadowColor,
          shadowOpacity: cfg.shadowOpacity,
          shadowRadius: cfg.shadowRadius,
          shadowOffset: cfg.shadowOffset,
          elevation: cfg.elevation,
        },
        style,
      ]}
    >
      {/* 1. Base LinearGradient */}
      <LinearGradient
        colors={baseColors}
        locations={cfg.baseLocations}
        start={cfg.baseStart}
        end={cfg.baseEnd}
        style={StyleSheet.absoluteFill}
      />

      {/* Diagonal shine strip for cards */}
      {showDiagonal ? (
        <LinearGradient
          colors={["transparent", "rgba(255,255,255,0.20)", "transparent"]}
          locations={[0.42, 0.5, 0.58]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          pointerEvents="none"
          style={StyleSheet.absoluteFill}
        />
      ) : null}

      {/* Top-right corner gold glow for navy card */}
      {variant === "navyCard" ? (
        <LinearGradient
          colors={["rgba(245,217,122,0.22)", "transparent"]}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          pointerEvents="none"
          style={styles.cardCornerGlow}
        />
      ) : null}

      {/* Extra pearlescent spot highlight for pearl orb */}
      {variant === "pearl" ? (
        <View pointerEvents="none" style={styles.pearlGleam} />
      ) : null}

      {/* 2. Specular atas: kilap putih elips/gradasi di bagian atas */}
      <LinearGradient
        colors={cfg.specularColors}
        locations={cfg.specularLocations}
        pointerEvents="none"
        style={[styles.specular, { height: cfg.specularHeight as any }]}
      />

      {/* 3. Refleksi bawah: pendar lembut di bawah */}
      <LinearGradient
        colors={cfg.reflectionColors}
        pointerEvents="none"
        style={[styles.reflection, { height: cfg.reflectionHeight as any }]}
      />

      {/* 4. Rim: garis putih tipis 1–2px di tepi atas (inset highlight) */}
      {insetHighlight ? (
        <View
          pointerEvents="none"
          style={[
            styles.insetRim,
            {
              backgroundColor: cfg.insetHighlightColor,
              borderTopLeftRadius: finalRadius,
              borderTopRightRadius: finalRadius,
            },
          ]}
        />
      ) : null}

      {/* Children */}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  surface: {
    overflow: "hidden",
    position: "relative",
  },
  specular: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  reflection: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  insetRim: {
    position: "absolute",
    top: 0,
    left: 2,
    right: 2,
    height: 1.2,
    zIndex: 2,
  },
  cardCornerGlow: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 140,
    height: 140,
  },
  pearlGleam: {
    position: "absolute",
    top: 4,
    left: 10,
    width: 20,
    height: 12,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.75)",
  },
});
