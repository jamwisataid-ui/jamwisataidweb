import { PermissionsAndroid, Platform } from "react-native";

export async function requestBroadcastMicrophonePermission() {
  if (Platform.OS === "android") {
    const permission = PermissionsAndroid.PERMISSIONS.RECORD_AUDIO;
    if (await PermissionsAndroid.check(permission)) return true;
    const result = await PermissionsAndroid.request(permission, {
      title: "Izin Mikrofon",
      message: "Mikrofon diperlukan agar panduan muthowif dapat didengar jamaah selama siaran langsung.",
      buttonPositive: "Izinkan",
      buttonNegative: "Nanti",
    });
    return result === PermissionsAndroid.RESULTS.GRANTED;
  }
  if (Platform.OS !== "web") return true;
  if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) return false;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((track) => track.stop());
    return true;
  } catch {
    return false;
  }
}
