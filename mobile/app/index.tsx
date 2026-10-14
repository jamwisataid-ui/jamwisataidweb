import { Redirect } from "expo-router";
import { useAuthStore } from "@/lib/auth-store";

export default function Index() {
  const { tokens, seenOnboarding } = useAuthStore();
  return <Redirect href={tokens ? "/(tabs)" : seenOnboarding ? "/login" : "/onboarding"} />;
}
