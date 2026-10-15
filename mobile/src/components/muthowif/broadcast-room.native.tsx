import { AudioSession, registerGlobals } from "@livekit/react-native";
import { ConnectionQuality, Room, RoomEvent } from "livekit-client";
import { useEffect, useRef } from "react";

import type { BroadcastState, ConnectionLevel } from "./live-overview";

registerGlobals();
type Props = { serverUrl: string; token: string; microphoneEnabled: boolean; onState: (state: BroadcastState) => void; onListeners: (count: number) => void; onQuality: (quality: ConnectionLevel) => void; onError: (message: string) => void };
const mapQuality = (quality: ConnectionQuality): ConnectionLevel => quality === ConnectionQuality.Poor || quality === ConnectionQuality.Lost ? "poor" : quality === ConnectionQuality.Unknown ? "medium" : "good";

export function BroadcastRoom({ serverUrl, token, microphoneEnabled, onState, onListeners, onQuality, onError }: Props) {
  const roomRef = useRef<Room | null>(null);
  const callbacksRef = useRef({ onState, onListeners, onQuality, onError });
  const microphoneRef = useRef(microphoneEnabled);
  useEffect(() => { callbacksRef.current = { onState, onListeners, onQuality, onError }; }, [onError, onListeners, onQuality, onState]);
  useEffect(() => {
    const room = new Room({ adaptiveStream: true, dynacast: true });
    roomRef.current = room;
    const listeners = () => callbacksRef.current.onListeners(room.remoteParticipants.size);
    room.on(RoomEvent.ParticipantConnected, listeners);
    room.on(RoomEvent.ParticipantDisconnected, listeners);
    room.on(RoomEvent.ConnectionQualityChanged, (quality, participant) => { if (participant.isLocal) callbacksRef.current.onQuality(mapQuality(quality)); });
    room.on(RoomEvent.Reconnecting, () => callbacksRef.current.onState("reconnecting"));
    room.on(RoomEvent.Reconnected, () => callbacksRef.current.onState(microphoneRef.current ? "live" : "muted"));
    room.on(RoomEvent.Disconnected, () => callbacksRef.current.onState("ended"));
    void (async () => {
      try {
        await AudioSession.startAudioSession();
        await room.connect(serverUrl, token);
        await room.localParticipant.setMicrophoneEnabled(true);
        listeners();
        callbacksRef.current.onQuality(mapQuality(room.localParticipant.connectionQuality));
        callbacksRef.current.onState("live");
      } catch (error) {
        callbacksRef.current.onError(error instanceof Error && /permission/i.test(error.message) ? "Izin mikrofon diperlukan untuk memulai siaran." : "Siaran belum dapat dihubungkan. Silakan coba kembali.");
        callbacksRef.current.onState("idle");
      }
    })();
    return () => { room.disconnect(); roomRef.current = null; void AudioSession.stopAudioSession(); };
  }, [serverUrl, token]);
  useEffect(() => { microphoneRef.current = microphoneEnabled; const room = roomRef.current; if (room?.state === "connected") void room.localParticipant.setMicrophoneEnabled(microphoneEnabled).then(() => callbacksRef.current.onState(microphoneEnabled ? "live" : "muted")).catch(() => callbacksRef.current.onError("Mikrofon belum dapat diubah.")); }, [microphoneEnabled]);
  return null;
}
