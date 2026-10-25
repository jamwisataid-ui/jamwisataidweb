import Constants, { ExecutionEnvironment } from "expo-constants";
import type { ComponentType } from "react";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors, typography } from "@/theme";

type Props = { serverUrl: string; token: string; onDisconnected: () => void };
type NativeRoom = ComponentType<Props>;

export function LiveRoom(props: Props) {
  const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
  const [NativeRoomComponent, setNativeRoomComponent] = useState<NativeRoom | null>(null);
  useEffect(() => {
    if (isExpoGo) return;
    let active = true;
    void import("./live-room.livekit.native").then(({ NativeLiveRoom }) => {
      if (active) setNativeRoomComponent(() => NativeLiveRoom);
    });
    return () => { active = false; };
  }, [isExpoGo]);

  if (isExpoGo) {
    return <View style={styles.notice}><Text style={styles.noticeTitle}>Preview Expo Go</Text><Text style={styles.noticeBody}>Audio LIVE MUTHOWIF tersedia pada build aplikasi native. Tampilan dan alur lainnya tetap dapat diuji.</Text></View>;
  }
  if (!NativeRoomComponent) return <View style={styles.status}><View style={styles.waitingDot} /><Text style={styles.label}>Menyiapkan audio...</Text></View>;
  return <NativeRoomComponent {...props} />;
}

const styles = StyleSheet.create({
  status: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  waitingDot: { width: 9, height: 9, borderRadius: 5, backgroundColor: colors.gold },
  label: { color: colors.white, fontFamily: typography.semibold, fontSize: 13 },
  notice: { borderWidth: 1, borderColor: "rgba(255,255,255,0.24)", borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, gap: 4 },
  noticeTitle: { color: colors.gold, fontFamily: typography.bold, fontSize: 14, textAlign: "center" },
  noticeBody: { color: colors.white, fontFamily: typography.body, fontSize: 12, lineHeight: 18, textAlign: "center" },
});
