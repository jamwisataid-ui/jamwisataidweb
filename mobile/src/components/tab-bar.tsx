import { Ionicons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "expo-router/js-tabs";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, glowGold, gradients } from "@/theme";
import { FadeInView } from "@/components/motion";

type IconName = keyof typeof Ionicons.glyphMap;

const icons: Record<string, IconName> = {
  index: "home",
  packages: "bag-handle",
  worship: "moon",
  notifications: "notifications",
  account: "person",
};

/** Floating navy pill with a gold border; the active tab is a glossy gold pill (icon above label). */
export function GoldPillTab({ icon, label }: { icon: IconName; label: string }) {
  return (
    <View style={styles.activePill}>
      <LinearGradient colors={["#FFF2BE", "#F4D372", "#E2B444", "#C9971F"]} locations={[0, 0.35, 0.7, 1]} start={{ x: 0.3, y: 0 }} end={{ x: 0.6, y: 1 }} style={[StyleSheet.absoluteFill, { borderRadius: 25 }]} />
      <View pointerEvents="none" style={styles.activeEdge} />
      <Ionicons name={icon} size={22} color="#0B1F3F" />
      <Text numberOfLines={1} style={styles.activeLabel}>{label}</Text>
    </View>
  );
}

export function TabBarShell({ children, bottom }: { children: React.ReactNode; bottom: number }) {
  return (
    <View style={[styles.frame, { paddingBottom: bottom + 8 }]}>
      <View role="tablist" style={styles.bar}>
        <LinearGradient pointerEvents="none" colors={gradients.tabBar} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={[StyleSheet.absoluteFill, { borderRadius: 32 }]} />
        {children}
      </View>
    </View>
  );
}

export function TabItem({ icon, label, onPress, onLongPress, badge, focused, width }: { icon: IconName; label: string; onPress: () => void; onLongPress?: () => void; badge?: string | number; focused: boolean; width?: number }) {
  return (
    <Pressable
      role="tab"
      accessibilityRole="tab"
      accessibilityState={{ selected: focused }}
      accessibilityLabel={badge ? `${label}, ${badge} belum dibaca` : label}
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => [focused ? [styles.itemFocused, width ? { flexBasis: width + 4 } : null] : styles.item, pressed && !focused && { opacity: 0.7 }]}
    >
      {focused ? (
        <FadeInView key={label} distance={0} duration={260}>
          <View style={width ? { width } : null}><GoldPillTab icon={icon} label={label} /></View>
        </FadeInView>
      ) : (
        <View style={styles.idle}>
          <View>
            <Ionicons name={`${icon}-outline` as IconName} size={24} color={colors.white} />
            {badge !== undefined ? <View style={styles.dot} /> : null}
          </View>
          <Text numberOfLines={1} style={styles.label}>{label}</Text>
        </View>
      )}
    </Pressable>
  );
}

export function LuxuryTabBar({ state, descriptors, emitter, navigateToTab, insets }: BottomTabBarProps) {
  return (
    <TabBarShell bottom={insets.bottom}>
      {state.routes.map((route, index) => {
        const focused = index === state.index;
        const { options } = descriptors[route.key];
        const label = typeof options.title === "string" ? options.title : route.name;
        const onPress = () => {
          const event = emitter.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
          if (!focused && !event.defaultPrevented) navigateToTab(route.key);
        };
        return (
          <TabItem
            key={route.key}
            icon={icons[route.name] ?? "ellipse"}
            label={label}
            focused={focused}
            badge={options.tabBarBadge}
            onPress={onPress}
            onLongPress={() => emitter.emit({ type: "tabLongPress", target: route.key })}
          />
        );
      })}
    </TabBarShell>
  );
}

const styles = StyleSheet.create({
  frame: { paddingHorizontal: 6, paddingTop: 6, backgroundColor: colors.ivory },
  bar: { height: 66, borderRadius: 34, paddingHorizontal: 6, flexDirection: "row", alignItems: "center", backgroundColor: "#0B2C58", borderWidth: 2, borderColor: "#E8C35A", ...glowGold, shadowOpacity: 0.6 },
  item: { flex: 1, height: 54, alignItems: "center", justifyContent: "center" },
  itemFocused: { flexBasis: 84, flexGrow: 0, flexShrink: 0, height: 54, alignItems: "center", justifyContent: "center" },
  idle: { alignItems: "center", gap: 3 },
  label: { color: colors.white, fontFamily: "Montserrat_500Medium", fontSize: 10, lineHeight: 12 },
  activePill: { width: "100%", minWidth: 80, height: 49, borderRadius: 25, alignItems: "center", justifyContent: "center", gap: 2, paddingHorizontal: 8, backgroundColor: "#E2B444", ...glowGold, shadowColor: "#F2CD64", shadowOpacity: 0.55, shadowRadius: 10, elevation: 0 },
  activeEdge: { position: "absolute", top: 1, left: 14, right: 14, height: 1, backgroundColor: "rgba(255,255,255,0.8)" },
  activeLabel: { color: "#0B1F3F", fontFamily: "Montserrat_700Bold", fontSize: 10, lineHeight: 12 },
  dot: { position: "absolute", top: -2, right: -3, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.notification, borderWidth: 1.5, borderColor: "#0F3463" },
});
