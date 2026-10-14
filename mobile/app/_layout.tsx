import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts as useDmSans, DMSans_400Regular, DMSans_500Medium, DMSans_700Bold } from "@expo-google-fonts/dm-sans";
import { useFonts as usePlayfair, PlayfairDisplay_700Bold } from "@expo-google-fonts/playfair-display";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useAuthStore } from "@/lib/auth-store";
import { colors } from "@/theme";
import { useDeviceNotifications } from "@/lib/notifications";

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [client] = useState(() => new QueryClient({ defaultOptions: { queries: { staleTime: 60_000, retry: 1 } } }));
  const [dmLoaded] = useDmSans({ DMSans_400Regular, DMSans_500Medium, DMSans_700Bold });
  const [playfairLoaded] = usePlayfair({ PlayfairDisplay_700Bold });
  const hydrate = useAuthStore((state) => state.hydrate);
  const ready = useAuthStore((state) => state.ready);
  useDeviceNotifications();
  useEffect(() => { void hydrate(); }, [hydrate]);
  useEffect(() => { if (ready && dmLoaded && playfairLoaded) void SplashScreen.hideAsync(); }, [ready, dmLoaded, playfairLoaded]);
  if (!ready || !dmLoaded || !playfairLoaded) return null;
  return <SafeAreaProvider><QueryClientProvider client={client}><Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.ivory } }}><Stack.Screen name="(tabs)" /><Stack.Screen name="login" /><Stack.Screen name="activate" /><Stack.Screen name="package/[slug]" /><Stack.Screen name="register/[departureId]" /><Stack.Screen name="journey" /><Stack.Screen name="payments" /><Stack.Screen name="documents" /></Stack></QueryClientProvider></SafeAreaProvider>;
}
