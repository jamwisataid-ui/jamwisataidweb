import { Ionicons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "expo-router/js-tabs";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { GlassSurface } from "@/components/glass";
import { colors } from "@/theme";
import { FadeInView } from "@/components/motion";

type IconName = keyof typeof Ionicons.glyphMap;

const icons: Record<string, IconName> = {
  index: "home",
  packages: "bag-handle",
  worship: "moon",
  notifications: "notifications",
  account: "person",
};

/** Floating navy capsule tab bar with liquid glass styling and gold pill for active tab. */
export function LuxuryTabBar({ state, descriptors, emitter, navigateToTab, insets }: BottomTabBarProps) {
  return (
    <View style={[styles.frame, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <GlassSurface variant="navyBar" radius={999} style={styles.bar}>
        <View role="tablist" style={styles.barInner}>
          {state.routes.map((route, index) => {
            const focused = index === state.index;
            const { options } = descriptors[route.key];
            const label = typeof options.title === "string" ? options.title : route.name;
            const icon = icons[route.name] ?? "ellipse";
            const badge = options.tabBarBadge;
            const onPress = () => {
              const event = emitter.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
              if (!focused && !event.defaultPrevented) navigateToTab(route.key);
            };
            return (
              <Pressable
                key={route.key}
                role="tab"
                accessibilityRole="tab"
                accessibilityState={{ selected: focused }}
                accessibilityLabel={badge ? `${label}, ${badge} belum dibaca` : label}
                onPress={onPress}
                onLongPress={() => emitter.emit({ type: "tabLongPress", target: route.key })}
                style={({ pressed }) => [focused ? styles.itemFocused : styles.item, pressed && !focused && { opacity: 0.7 }]}
              >
                {focused ? (
                  <FadeInView key={route.key} distance={0} duration={260}>
                    <GlassSurface variant="gold" radius={999} style={styles.activePill}>
                      <View style={styles.activePillInner}>
                        <Ionicons name={icon} size={18} color={colors.navyDeep} />
                        <Text numberOfLines={1} style={styles.activeLabel}>{label}</Text>
                      </View>
                    </GlassSurface>
                  </FadeInView>
                ) : (
                  <View>
                    <Ionicons name={`${icon}-outline` as IconName} size={21} color="rgba(255,255,255,0.76)" />
                    {badge !== undefined ? <View style={styles.badge}><Text style={styles.badgeText}>{badge}</Text></View> : null}
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </GlassSurface>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { paddingHorizontal: 16, paddingTop: 8, backgroundColor: colors.ivory },
  bar: { height: 66, borderRadius: 999 },
  barInner: {
    height: 66,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  item: { width: 46, height: 46, alignItems: "center", justifyContent: "center" },
  itemFocused: { height: 46, flexShrink: 1, alignItems: "center", justifyContent: "center" },
  activePill: { height: 46, borderRadius: 999 },
  activePillInner: {
    height: 46,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  activeLabel: { color: colors.navyDeep, fontFamily: "Montserrat_700Bold", fontSize: 12 },
  badge: { position: "absolute", top: -6, right: -10, minWidth: 17, height: 17, paddingHorizontal: 4, borderRadius: 9, alignItems: "center", justifyContent: "center", backgroundColor: colors.gold, borderWidth: 2, borderColor: colors.navyDeep },
  badgeText: { color: colors.navyDeep, fontFamily: "Montserrat_700Bold", fontSize: 8.5, lineHeight: 10 },
});
