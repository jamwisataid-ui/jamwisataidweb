import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts as useMontserrat, Montserrat_400Regular, Montserrat_500Medium, Montserrat_600SemiBold, Montserrat_700Bold } from "@expo-google-fonts/montserrat";
import { useFonts as useCinzel, Cinzel_600SemiBold, Cinzel_700Bold } from "@expo-google-fonts/cinzel";
import { useFonts as useCormorant, CormorantGaramond_500Medium, CormorantGaramond_600SemiBold } from "@expo-google-fonts/cormorant-garamond";
import { useFonts as useQuranFont } from "expo-font";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useAuthStore } from "@/lib/auth-store";
import { api } from "@/lib/api";
import type { Package } from "@/types";
import { BrandSplash } from "@/components/brand-splash";
import { fetchOnboardingSlides } from "@/lib/onboarding";
import { colors } from "@/theme";
import { useDeviceNotifications } from "@/lib/notifications";

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [client] = useState(() => new QueryClient({ defaultOptions: { queries: { staleTime: 60_000, retry: 1 } } }));
  const [showSplash, setShowSplash] = useState(true);
  const [bootstrapReady, setBootstrapReady] = useState(false);
  const [montserratLoaded, montserratError] = useMontserrat({ Montserrat_400Regular, Montserrat_500Medium, Montserrat_600SemiBold, Montserrat_700Bold });
  const [cinzelLoaded, cinzelError] = useCinzel({ Cinzel_600SemiBold, Cinzel_700Bold });
  const [cormorantLoaded, cormorantError] = useCormorant({ CormorantGaramond_500Medium, CormorantGaramond_600SemiBold });
  // Expo requires a static CommonJS asset reference so Metro can bundle the local font.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const [quranFontLoaded, quranFontError] = useQuranFont({ QPCUthmaniHafs: require("../assets/fonts/UthmanicHafs_V22.ttf") });
  const hydrate = useAuthStore((state) => state.hydrate);
  useDeviceNotifications();
  useEffect(() => { void SplashScreen.hideAsync(); }, []);
  useEffect(() => {
    let active = true;
    void Promise.allSettled([
      hydrate(),
      client.prefetchQuery({ queryKey: ["packages", "umrah"], queryFn: () => api<Package[]>("/packages?category=umrah") }),
      client.prefetchQuery({ queryKey: ["onboarding"], queryFn: fetchOnboardingSlides }),
      new Promise((resolve) => setTimeout(resolve, 1500)),
    ]).then(() => { if (active) setBootstrapReady(true); });
    return () => { active = false; };
  }, [client, hydrate]);
  const fontsReady = (montserratLoaded || Boolean(montserratError)) && (cinzelLoaded || Boolean(cinzelError)) && (cormorantLoaded || Boolean(cormorantError)) && (quranFontLoaded || Boolean(quranFontError));
  const appReady = bootstrapReady && fontsReady;
  return <SafeAreaProvider><QueryClientProvider client={client}>{showSplash ? <BrandSplash ready={appReady} onFinished={() => setShowSplash(false)} /> : <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.ivory } }}><Stack.Screen name="(tabs)" /><Stack.Screen name="login" /><Stack.Screen name="activate" /><Stack.Screen name="package/[slug]" /><Stack.Screen name="register/[departureId]" /><Stack.Screen name="payment/[registrationId]" /><Stack.Screen name="journey" /><Stack.Screen name="payments" /><Stack.Screen name="documents" /><Stack.Screen name="account/profile" /><Stack.Screen name="help" /><Stack.Screen name="search" /><Stack.Screen name="schedule" /><Stack.Screen name="prayer-times" /><Stack.Screen name="quran/index" /><Stack.Screen name="quran/[surah]" /><Stack.Screen name="duas/index" /><Stack.Screen name="duas/[collection]/index" /><Stack.Screen name="duas/[collection]/[item]" /><Stack.Screen name="live-muthowif" /></Stack>}</QueryClientProvider></SafeAreaProvider>;
}
