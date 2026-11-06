import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { QueryClientProvider } from "@tanstack/react-query";
import { useFonts as useMontserrat, Montserrat_400Regular, Montserrat_500Medium, Montserrat_600SemiBold, Montserrat_700Bold } from "@expo-google-fonts/montserrat";
import { useFonts as useCinzel, Cinzel_600SemiBold, Cinzel_700Bold } from "@expo-google-fonts/cinzel";
import { useFonts as useCormorant, CormorantGaramond_500Medium, CormorantGaramond_600SemiBold, CormorantGaramond_500Medium_Italic, CormorantGaramond_600SemiBold_Italic } from "@expo-google-fonts/cormorant-garamond";
import { useFonts as useQuranFont } from "expo-font";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as Updates from "expo-updates";
import * as Application from "expo-application";
import { Alert, Linking, Platform } from "react-native";
import { useAuthStore } from "@/lib/auth-store";
import { api } from "@/lib/api";
import type { Package } from "@/types";
import { BrandSplash } from "@/components/brand-splash";
import { fetchOnboardingSlides } from "@/lib/onboarding";
import { colors } from "@/theme";
import { useDeviceNotifications } from "@/lib/notifications";
import { queryClient } from "@/lib/query-client";
import { apkVersionUrl, isNewerAppVersion } from "@/lib/apk-updates";

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);
  const [bootstrapReady, setBootstrapReady] = useState(false);
  const [montserratLoaded, montserratError] = useMontserrat({ Montserrat_400Regular, Montserrat_500Medium, Montserrat_600SemiBold, Montserrat_700Bold });
  const [cinzelLoaded, cinzelError] = useCinzel({ Cinzel_600SemiBold, Cinzel_700Bold });
  const [cormorantLoaded, cormorantError] = useCormorant({ CormorantGaramond_500Medium, CormorantGaramond_600SemiBold, CormorantGaramond_500Medium_Italic, CormorantGaramond_600SemiBold_Italic });
  // Expo requires a static CommonJS asset reference so Metro can bundle the local font.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const [quranFontLoaded, quranFontError] = useQuranFont({ QPCUthmaniHafs: require("../assets/fonts/UthmanicHafs_V22.ttf") });
  const hydrate = useAuthStore((state) => state.hydrate);
  useDeviceNotifications();
  useEffect(() => { void SplashScreen.hideAsync(); }, []);
  useEffect(() => {
    if (!Updates.isEnabled) return;
    // This runs once on a cold launch, before a live audio session can start.
    void (async () => {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        }
      } catch (error) {
        console.warn("Unable to check for an OTA update", error);
      }
    })();
  }, []);
  useEffect(() => {
    const downloadUrl = process.env.EXPO_PUBLIC_ANDROID_APK_URL;
    const installedVersion = Application.nativeApplicationVersion;
    if (Platform.OS !== "android" || !downloadUrl || !installedVersion) return;
    const versionUrl = apkVersionUrl(downloadUrl);
    if (!versionUrl) return;
    let active = true;
    void (async () => {
      try {
        const response = await fetch(versionUrl, { cache: "no-store" });
        if (!response.ok) return;
        const { version } = await response.json() as { version?: string };
        if (active && version && isNewerAppVersion(version, installedVersion)) {
          Alert.alert("Update APK tersedia", `Versi ${version} tersedia. Unduh APK terbaru untuk mendapatkan fitur baru.`, [
            { text: "Nanti", style: "cancel" },
            { text: "Unduh APK", onPress: () => { void Linking.openURL(downloadUrl); } },
          ]);
        }
      } catch (error) {
        console.warn("Unable to check for a newer APK", error);
      }
    })();
    return () => { active = false; };
  }, []);
  useEffect(() => {
    let active = true;
    // Warm public data in the background. A slow network must never keep the
    // user on the splash screen; each destination already owns its loading UI.
    void queryClient.prefetchQuery({ queryKey: ["packages", "umrah"], queryFn: () => api<Package[]>("/packages?category=umrah") });
    void queryClient.prefetchQuery({ queryKey: ["onboarding"], queryFn: fetchOnboardingSlides });
    void Promise.allSettled([
      hydrate(),
      new Promise((resolve) => setTimeout(resolve, 500)),
    ]).then(() => { if (active) setBootstrapReady(true); });
    return () => { active = false; };
  }, [hydrate]);
  const fontsReady = (montserratLoaded || Boolean(montserratError)) && (cinzelLoaded || Boolean(cinzelError)) && (cormorantLoaded || Boolean(cormorantError)) && (quranFontLoaded || Boolean(quranFontError));
  const appReady = bootstrapReady && fontsReady;
  return <SafeAreaProvider><StatusBar style="dark" /><QueryClientProvider client={queryClient}>{showSplash ? <BrandSplash ready={appReady} onFinished={() => setShowSplash(false)} /> : <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.ivory } }}><Stack.Screen name="(tabs)" /><Stack.Screen name="login" /><Stack.Screen name="activate" /><Stack.Screen name="package/[slug]" /><Stack.Screen name="register/[departureId]" /><Stack.Screen name="payment/[registrationId]" /><Stack.Screen name="journey" /><Stack.Screen name="payments" /><Stack.Screen name="documents" /><Stack.Screen name="account/profile" /><Stack.Screen name="help" /><Stack.Screen name="search" /><Stack.Screen name="schedule" /><Stack.Screen name="prayer-times" /><Stack.Screen name="quran/index" /><Stack.Screen name="quran/[surah]" /><Stack.Screen name="duas/index" /><Stack.Screen name="duas/[collection]/index" /><Stack.Screen name="duas/[collection]/[item]" /><Stack.Screen name="asmaul-husna" /><Stack.Screen name="live-muthowif" /></Stack>}</QueryClientProvider></SafeAreaProvider>;
}
