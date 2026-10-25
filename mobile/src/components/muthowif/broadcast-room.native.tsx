import Constants, { ExecutionEnvironment } from "expo-constants";
import type { ComponentType } from "react";
import { useEffect, useState } from "react";

import type { BroadcastState, ConnectionLevel } from "./live-overview";

type Props = { serverUrl: string; token: string; microphoneEnabled: boolean; onState: (state: BroadcastState) => void; onListeners: (count: number) => void; onQuality: (quality: ConnectionLevel) => void; onError: (message: string) => void };
type NativeRoom = ComponentType<Props>;

export function BroadcastRoom(props: Props) {
  const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
  const [NativeRoomComponent, setNativeRoomComponent] = useState<NativeRoom | null>(null);
  useEffect(() => {
    if (isExpoGo) {
      props.onState("idle");
      props.onError("Audio LIVE MUTHOWIF hanya tersedia pada build aplikasi native. Mode Expo Go dapat digunakan untuk menguji tampilan dan alur.");
      return;
    }
    let active = true;
    void import("./broadcast-room.livekit.native").then(({ NativeBroadcastRoom }) => {
      if (active) setNativeRoomComponent(() => NativeBroadcastRoom);
    });
    return () => { active = false; };
  }, [isExpoGo]);
  return NativeRoomComponent ? <NativeRoomComponent {...props} /> : null;
}
