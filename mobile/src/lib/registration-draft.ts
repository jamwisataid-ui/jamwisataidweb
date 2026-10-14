import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export type RegistrationDraft = {
  fullName: string;
  whatsapp: string;
  email: string;
  gender: "" | "Laki-laki" | "Perempuan";
  birthDate: string;
  nationality: string;
  passportNumber: string;
  passportExpiry: string;
  notes: string;
  roomType: "quad" | "triple" | "double";
  payerSameAsPilgrim: boolean;
  payerName: string;
  payerWhatsapp: string;
  payerEmail: string;
};

const key = (departureId: string) => `jamwisata_registration_${departureId}`;

export async function loadRegistrationDraft(departureId: string) {
  const value = Platform.OS === "web"
    ? (typeof window === "undefined" ? null : window.localStorage.getItem(key(departureId)))
    : await SecureStore.getItemAsync(key(departureId));
  if (!value) return null;
  try { return JSON.parse(value) as Partial<RegistrationDraft>; } catch { return null; }
}

export async function saveRegistrationDraft(departureId: string, draft: RegistrationDraft) {
  const value = JSON.stringify(draft);
  if (Platform.OS === "web") {
    if (typeof window !== "undefined") window.localStorage.setItem(key(departureId), value);
    return;
  }
  await SecureStore.setItemAsync(key(departureId), value);
}

export async function clearRegistrationDraft(departureId: string) {
  if (Platform.OS === "web") {
    if (typeof window !== "undefined") window.localStorage.removeItem(key(departureId));
    return;
  }
  await SecureStore.deleteItemAsync(key(departureId));
}
