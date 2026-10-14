import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts as useDmSans, DMSans_400Regular, DMSans_500Medium, DMSans_700Bold } from "@expo-google-fonts/dm-sans";
import { useFonts as usePlayfair, PlayfairDisplay_700Bold } from "@expo-google-fonts/playfair-display";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useAuthStore } from "@/lib/auth-store";
import { api } from "@/lib/api";
import type { Package } from "@/types";
import { BrandSplash } from "@/components/brand-splash";
import { colors } from "@/theme";
import { useDeviceNotifications } from "@/lib/notifications";

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [client] = useState(() => new QueryClient({ defaultOptions: { queries: { staleTime: 60_000, retry: 1 } } }));
  const [showSplash, setShowSplash] = useState(true);
  const [bootstrapReady, setBootstrapReady] = useState(false);
  const [dmLoaded, dmError] = useDmSans({ DMSans_400Regular, DMSans_500Medium, DMSans_700Bold });
  const [playfairLoaded, playfairError] = usePlayfair({ PlayfairDisplay_700Bold });
  const hydrate = useAuthStore((state) => state.hydrate);
  useDeviceNotifications();
  useEffect(() => { void SplashScreen.hideAsync(); }, []);
  useEffect(() => {
    let active = true;
    void Promise.allSettled([
      hydrate(),
      client.prefetchQuery({ queryKey: ["packages"], queryFn: () => api<Package[]>("/packages") }),
      new Promise((resolve) => setTimeout(resolve, 1500)),
    ]).then(() => { if (active) setBootstrapReady(true); });
    return () => { active = false; };
  }, [client, hydrate]);
  const fontsReady = (dmLoaded || Boolean(dmError)) && (playfairLoaded || Boolean(playfairError));
  const appReady = bootstrapReady && fontsReady;
  return <SafeAreaProvider><QueryClientProvider client={client}>{showSplash ? <BrandSplash ready={appReady} onFinished={() => setShowSplash(false)} /> : <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.ivory } }}><Stack.Screen name="(tabs)" /><Stack.Screen name="login" /><Stack.Screen name="activate" /><Stack.Screen name="package/[slug]" /><Stack.Screen name="register/[departureId]" /><Stack.Screen name="journey" /><Stack.Screen name="payments" /><Stack.Screen name="documents" /></Stack>}</QueryClientProvider></SafeAreaProvider>;
}
