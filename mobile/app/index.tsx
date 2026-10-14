import { Redirect } from "expo-router";
import { useAuthStore } from "@/lib/auth-store";

export default function Index() {
  const seenOnboarding = useAuthStore((state) => state.seenOnboarding);
  return <Redirect href={seenOnboarding ? "/(tabs)" : "/onboarding"} />;
}
