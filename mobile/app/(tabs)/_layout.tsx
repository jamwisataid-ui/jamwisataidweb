import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme";

const icons: Record<string, keyof typeof Ionicons.glyphMap> = { index: "home", packages: "bag-handle", worship: "moon", notifications: "notifications", account: "person" };

export default function TabLayout() {
  return <Tabs screenOptions={({ route }) => ({ headerShown: false, tabBarActiveTintColor: colors.gold, tabBarInactiveTintColor: "#7B8490", tabBarStyle: { height: 70, paddingTop: 8, paddingBottom: 9, backgroundColor: colors.white, borderTopColor: colors.line }, tabBarLabelStyle: { fontFamily: "DMSans_500Medium", fontSize: 11 }, tabBarIcon: ({ color, size }) => <Ionicons name={icons[route.name] || "ellipse"} color={color} size={size} /> })}><Tabs.Screen name="index" options={{ title: "Beranda" }} /><Tabs.Screen name="packages" options={{ title: "Paket" }} /><Tabs.Screen name="worship" options={{ title: "Ibadah" }} /><Tabs.Screen name="notifications" options={{ title: "Notifikasi" }} /><Tabs.Screen name="account" options={{ title: "Akun" }} /></Tabs>;
}
