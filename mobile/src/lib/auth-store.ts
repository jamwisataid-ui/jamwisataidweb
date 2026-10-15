import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { create } from "zustand";
import { clearJourneyCache } from "./journey-cache";

export type Tokens = { accessToken: string; refreshToken: string; accessExpiresAt: string; refreshExpiresAt: string };
type User = { id: string; fullName: string; whatsapp: string; email?: string | null };
type AuthState = { ready: boolean; seenOnboarding: boolean; tokens: Tokens | null; user: User | null; hydrate: () => Promise<void>; completeOnboarding: () => Promise<void>; signIn: (tokens: Tokens, user?: User | null) => Promise<void>; setTokens: (tokens: Tokens) => Promise<void>; signOut: () => Promise<void>; setUser: (user: User | null) => void };
const KEY = "jamwisata_mobile_session";
const ONBOARDING_KEY = "jamwisata_mobile_onboarding_v2";

async function getStoredValue(key: string) {
  if (Platform.OS !== "web") return SecureStore.getItemAsync(key);
  if (typeof window === "undefined") return null;
  return window.sessionStorage.getItem(key) ?? window.localStorage.getItem(key);
}

async function setStoredValue(key: string, value: string, persistent = false) {
  if (Platform.OS !== "web") return SecureStore.setItemAsync(key, value);
  if (typeof window === "undefined") return;
  (persistent ? window.localStorage : window.sessionStorage).setItem(key, value);
}

async function deleteStoredValue(key: string) {
  if (Platform.OS !== "web") return SecureStore.deleteItemAsync(key);
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(key);
  window.localStorage.removeItem(key);
}

export const useAuthStore = create<AuthState>((set) => ({
  ready: false,
  seenOnboarding: false,
  tokens: null,
  user: null,
  hydrate: async () => {
    const [value, onboarding] = await Promise.all([getStoredValue(KEY), getStoredValue(ONBOARDING_KEY)]);
    set({ tokens: value ? JSON.parse(value) as Tokens : null, seenOnboarding: onboarding === "done", ready: true });
  },
  completeOnboarding: async () => { await setStoredValue(ONBOARDING_KEY, "done", true); set({ seenOnboarding: true }); },
  signIn: async (tokens, user = null) => { await setStoredValue(KEY, JSON.stringify(tokens)); set({ tokens, user }); },
  setTokens: async (tokens) => { await setStoredValue(KEY, JSON.stringify(tokens)); set({ tokens }); },
  signOut: async () => { await Promise.all([deleteStoredValue(KEY), clearJourneyCache()]); set({ tokens: null, user: null }); },
  setUser: (user) => set({ user }),
}));
