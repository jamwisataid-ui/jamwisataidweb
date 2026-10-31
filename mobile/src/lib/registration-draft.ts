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

const PREFIX = "jamwisata_registration_v2_";
const LEGACY_PREFIX = "jamwisata_registration_";
const INDEX_KEY = "jamwisata_registration_draft_keys_v2";
const key = (departureId: string, ownerId: string) => `${PREFIX}${encodeURIComponent(ownerId)}_${departureId}`;
const legacyKey = (departureId: string) => `${LEGACY_PREFIX}${departureId}`;
let draftGeneration = 0;

async function readValue(storageKey: string) {
  return Platform.OS === "web"
    ? (typeof window === "undefined" ? null : window.localStorage.getItem(storageKey))
    : SecureStore.getItemAsync(storageKey);
}

async function writeValue(storageKey: string, value: string) {
  if (Platform.OS === "web") {
    if (typeof window !== "undefined") window.localStorage.setItem(storageKey, value);
    return;
  }
  await SecureStore.setItemAsync(storageKey, value);
}

async function deleteValue(storageKey: string) {
  if (Platform.OS === "web") {
    if (typeof window !== "undefined") window.localStorage.removeItem(storageKey);
    return;
  }
  await SecureStore.deleteItemAsync(storageKey);
}

async function indexedKeys() {
  const value = await readValue(INDEX_KEY);
  if (!value) return [] as string[];
  try { return JSON.parse(value) as string[]; } catch { return [] as string[]; }
}

async function rememberKey(storageKey: string) {
  const keys = await indexedKeys();
  if (!keys.includes(storageKey)) await writeValue(INDEX_KEY, JSON.stringify([...keys, storageKey]));
}

async function forgetKey(storageKey: string) {
  const keys = (await indexedKeys()).filter((item) => item !== storageKey);
  if (keys.length) await writeValue(INDEX_KEY, JSON.stringify(keys));
  else await deleteValue(INDEX_KEY);
}

export async function loadRegistrationDraft(departureId: string, ownerId: string) {
  await deleteValue(legacyKey(departureId));
  const value = await readValue(key(departureId, ownerId));
  if (!value) return null;
  try { return JSON.parse(value) as Partial<RegistrationDraft>; } catch { return null; }
}

export async function saveRegistrationDraft(departureId: string, ownerId: string, draft: RegistrationDraft) {
  const storageKey = key(departureId, ownerId);
  const generation = draftGeneration;
  const value = JSON.stringify(draft);
  await writeValue(storageKey, value);
  if (generation !== draftGeneration) {
    await deleteValue(storageKey);
    return;
  }
  await rememberKey(storageKey);
  // The old departure-only key is deliberately retired because it leaks data
  // between accounts on a shared device.
  await deleteValue(legacyKey(departureId));
}

export async function clearRegistrationDraft(departureId: string, ownerId: string) {
  const storageKey = key(departureId, ownerId);
  await deleteValue(storageKey);
  await deleteValue(legacyKey(departureId));
  await forgetKey(storageKey);
}

export async function clearAllRegistrationDrafts() {
  draftGeneration += 1;
  const keys = await indexedKeys();
  await Promise.all(keys.map(deleteValue));
  await deleteValue(INDEX_KEY);
  if (Platform.OS === "web" && typeof window !== "undefined") {
    for (let index = window.localStorage.length - 1; index >= 0; index -= 1) {
      const storageKey = window.localStorage.key(index);
      if (storageKey?.startsWith(LEGACY_PREFIX)) window.localStorage.removeItem(storageKey);
    }
  }
}
