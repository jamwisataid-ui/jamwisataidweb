import { RoomServiceClient } from "livekit-server-sdk";

export function liveKitHttpUrl(value: string) {
  return value.replace(/^wss:/i, "https:").replace(/^ws:/i, "http:");
}

export function countJamaahParticipants(participants: Array<{ identity: string }>) {
  return participants.filter((participant) => participant.identity.startsWith("jamaah-")).length;
}

export async function readLiveListenerCount(roomName: string) {
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const serverUrl = process.env.LIVEKIT_WS_URL;
  if (!apiKey || !apiSecret || !serverUrl) return null;
  try {
    const service = new RoomServiceClient(liveKitHttpUrl(serverUrl), apiKey, apiSecret, { requestTimeout: 2_500 });
    return countJamaahParticipants(await service.listParticipants(roomName));
  } catch (error) {
    console.error("[livekit-room-count]", { roomName, error });
    return null;
  }
}
