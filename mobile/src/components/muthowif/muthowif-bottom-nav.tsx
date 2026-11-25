import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { TabBarShell, TabItem } from "@/components/tab-bar";

type Tab = "home" | "live" | "jamaah" | "settings";
type IconName = keyof typeof Ionicons.glyphMap;
const items: Array<{ id: Tab; label: string; icon: IconName; href: string }> = [
  { id: "home", label: "Beranda", icon: "home", href: "/muthowif" },
  { id: "live", label: "Live", icon: "radio", href: "/muthowif/live" },
  { id: "jamaah", label: "Jamaah", icon: "people", href: "/muthowif/jamaah" },
  { id: "settings", label: "Pengaturan", icon: "settings", href: "/muthowif/settings" },
];

/** Same floating gold-bordered pill as the jamaah tab bar; the parent SafeAreaView already handles the bottom inset. */
export function MuthowifBottomNav({ active }: { active: Tab }) {
  return (
    <TabBarShell bottom={0}>
      {items.map((item) => (
        <TabItem key={item.id} icon={item.icon} label={item.label} focused={active === item.id} width={active === item.id ? 96 : undefined} onPress={() => router.replace(item.href as never)} />
      ))}
    </TabBarShell>
  );
}
