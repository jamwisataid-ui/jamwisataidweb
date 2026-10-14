import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

export type Tokens = { accessToken: string; refreshToken: string; accessExpiresAt: string; refreshExpiresAt: string };
type User = { id: string; fullName: string; whatsapp: string; email?: string | null };
type AuthState = { ready: boolean; seenOnboarding: boolean; tokens: Tokens | null; user: User | null; hydrate: () => Promise<void>; completeOnboarding: () => Promise<void>; signIn: (tokens: Tokens, user?: User | null) => Promise<void>; setTokens: (tokens: Tokens) => Promise<void>; signOut: () => Promise<void>; setUser: (user: User | null) => void };
const KEY = "jamwisata_mobile_session";
const ONBOARDING_KEY = "jamwisata_mobile_onboarding";

export const useAuthStore = create<AuthState>((set) => ({
  ready: false,
  seenOnboarding: false,
  tokens: null,
  user: null,
  hydrate: async () => {
    const [value, onboarding] = await Promise.all([SecureStore.getItemAsync(KEY), SecureStore.getItemAsync(ONBOARDING_KEY)]);
    set({ tokens: value ? JSON.parse(value) as Tokens : null, seenOnboarding: onboarding === "done", ready: true });
  },
  completeOnboarding: async () => { await SecureStore.setItemAsync(ONBOARDING_KEY, "done"); set({ seenOnboarding: true }); },
  signIn: async (tokens, user = null) => { await SecureStore.setItemAsync(KEY, JSON.stringify(tokens)); set({ tokens, user }); },
  setTokens: async (tokens) => { await SecureStore.setItemAsync(KEY, JSON.stringify(tokens)); set({ tokens }); },
  signOut: async () => { await SecureStore.deleteItemAsync(KEY); set({ tokens: null, user: null }); },
  setUser: (user) => set({ user }),
}));
